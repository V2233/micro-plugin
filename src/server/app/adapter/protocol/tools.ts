import { fileTypeFromBuffer, type FileTypeResult } from "file-type"
import { stat, mkdir, rm, writeFile, readFile } from "node:fs/promises"
import { randomUUID } from "crypto"
import { join, dirname, basename } from "path"
import { Stdlog, makeMd5 } from "#utils"
import { Cfg } from "#cfg"
import _ from 'lodash'

interface fileInfoType {
    name: string,
    url: string,
    buffer: Buffer,
    type: FileTypeResult,
    path: string,
    md5: string
}

class BotAPI {

    // constructor() {
    // const CopyBot = Bot
    //@ts-ignore
    // Bot = new Proxy({}, {
    //     get (target, prop, receiver) {
    //         if (prop in target) {
    //             if(typeof target[prop] === 'function') return target[prop].bind(this)
    //                 else return target[prop]
    //         }
    //         if (prop in this) {
    //             if(typeof this[prop] === 'function') return this[prop].bind(this)
    //                 else return this[prop]
    //         }
    //         return Reflect.get(CopyBot, prop, receiver)
    //     }
    // })

    // }

    fs = Object.create(null)

    stat = { start_time: Date.now() / 1000 }

    get uin() {
        return Bot.adapter ?? []
    }


    /**
     * 延时
     * @param time (ms)
     * @param promise 
     * @returns 
     */
    sleep(time: number, promise?) {
        if (promise) return Promise.race([promise, this.sleep(time)])
        return new Promise(resolve => setTimeout(resolve, time))
    }

    /**
     * 文件状态
     * @param path 
     * @param opts 
     * @returns 
     */
    async fsStat(path: string, opts?): Promise<any> {
        try {
            return await stat(path, opts)
        } catch (err) {
            Stdlog.trace("", "获取", path, "状态错误", err)
            return false
        }
    }

    /**
     * 
     * @param dir 
     * @param opts 
     * @returns 
     */
    async mkdir(dir: string, opts?) {
        try {
            await mkdir(dir, { recursive: true, ...opts })
            return true
        } catch (err) {
            Stdlog.error("", "创建", dir, "错误", err)
            return false
        }
    }

    /**
     * 
     * @param file 
     * @param opts 
     * @returns 
     */
    async rm(file: string, opts?) {
        try {
            await rm(file, { force: true, recursive: true, ...opts })
            return true
        } catch (err) {
            Stdlog.error("", "删除", file, "错误", err)
            return false
        }
    }

    /**
     * 
     * @param url 
     * @param file 
     * @param opts 
     * @returns 
     */
    async download(url: string, file: string, opts) {
        let buffer
        if (!file || (await this.fsStat(file))?.isDirectory?.()) {
            const type = await this.fileType(url, opts)
            file = file ? join(file, type.name) : type.name
            buffer = type.buffer
        } else {
            await this.mkdir(dirname(file))
            buffer = await this.Buffer(url, opts)
        }
        await writeFile(file, buffer)
        return { url, file, buffer }
    }

    /**
     * 发布
     * @param name 事件{post_type.message_type.sub_type}
     * @param data 
     */
    $emit(name = "", data = {}) {
        this.prepareEvent(data)
        while (true) {
            Bot.emit(name, data)
            const i = name.lastIndexOf(".")
            if (i === -1) break
            name = name.slice(0, i)
        }
    }

    /**
     * 发布前处理
     * @param data 
     * @returns 
     */
    prepareEvent(data) {
        if (!Bot[data.self_id]) return
        if (!data.bot)
            Object.defineProperty(data, "bot", {
                value: Bot[data.self_id],
            })
        if (!data.friend && data.user_id)
            Object.defineProperty(data, "friend", {
                value: data.bot.pickFriend(data.user_id),
            })
        if (!data.group && data.group_id)
            Object.defineProperty(data, "group", {
                value: data.bot.pickGroup(data.group_id),
            })
        if (!data.member && data.group && data.user_id)
            Object.defineProperty(data, "member", {
                value: data.group.pickMember(data.user_id),
            })

        if (data.bot.adapter?.id)
            data.adapter_id = data.bot.adapter.id
        if (data.bot.adapter?.name)
            data.adapter_name = data.bot.adapter.name

        for (const i of [data.friend, data.group, data.member]) {
            if (typeof i !== "object") continue
            i.sendFile ??= (file, name) => i.sendMsg({ type: "file", file, name })
            i.makeForwardMsg ??= this.makeForwardMsg
            i.sendForwardMsg ??= msg => this.sendForwardMsg(msg => i.sendMsg(msg), msg)
            i.getInfo ??= () => i.info || i
        }
    }

    /**
     * 
     * @param data 
     * @returns 
     */
    StringOrNull(data) {
        if (typeof data === "object" && typeof data.toString !== "function")
            return "[object null]"
        return String(data)
    }

    /**
     * 
     * @param data 
     * @param base64 
     * @returns 
     */
    StringOrBuffer(data, base64) {
        const string = String(data)
        return string.includes("\ufffd") ? (base64 ? `base64://${data.toString("base64")}` : data) : string
    }

    getCircularReplacer() {
        const _this_ = this, ancestors = []
        //@ts-ignore
        return function (key, value) {
            switch (typeof value) {
                case "function":
                    return String(value)
                case "object":
                    if (value === null)
                        return null
                    if (value instanceof Map || value instanceof Set)
                        return Array.from(value)
                    if (value instanceof Error)
                        return value.stack
                    if (value.type === "Buffer" && Array.isArray(value.data)) try {
                        return _this_.StringOrBuffer(Buffer.from(value), true)
                    } catch { }
                    break
                default:
                    return value
            }
            while (ancestors.length > 0 && ancestors.at(-1) !== this)
                ancestors.pop()
            if (ancestors.includes(value))
                return `[Circular ${_this_.StringOrNull(value)}]`
            ancestors.push(value)
            return value
        }
    }

    /**
     * 针对对象处理
     * @param data 
     * @param opts 
     * @returns 
     */
    String(data, opts = null) {
        switch (typeof data) {
            case "string":
                return data
            case "function":
                return String(data)
            case "object":
                if (data instanceof Error)
                    return data.stack
                if (Buffer.isBuffer(data))
                    return this.StringOrBuffer(data, true)
        }

        try {
            return JSON.stringify(data, this.getCircularReplacer(), opts) || this.StringOrNull(data)
        } catch (err) {
            return this.StringOrNull(data)
        }
    }

    /**
     * 
     * @param data 
     * @param opts 
     * @returns 
     */
    async Buffer(data, opts: any = {}) {
        if (Buffer.isBuffer(data)) return data
        data = this.String(data)

        if (data.startsWith("base64://"))
            return Buffer.from(data.replace("base64://", ""), "base64")
        else if (data.match(/^https?:\/\//))
            return opts.http ? data : Buffer.from(await (await fetch(data, opts)).arrayBuffer())
        else if (data.startsWith('file://')) {
            if (await this.fsStat(data.replace(/^file:\/\//, ""))) {
                //@ts-ignore
                return opts.file ? data : Buffer.from(await readFile(data.replace(/^file:\/\//, "")))
            }
        }

        return data
    }

    /**
     * 
     * @param data 
     * @param opts 
     * @returns 
     */
    async fileType(data, opts = {}) {

        const file: fileInfoType = {
            url: '',
            name: data.name,
            buffer: Buffer.alloc(0),
            type: {
                ext: 'jpg',
                mime: 'image/jpeg'
            },
            md5: '',
            path: ''
        }

        try {
            if (Buffer.isBuffer(data.file)) {
                file.url = "Buffer"
                file.buffer = data.file
            } else {
                // file.url = data.file.replace(/^base64:\/\/.*/, "base64://...")
                file.url = _.truncate(data, { length: 32 }) || "Buffer"
                file.buffer = await this.Buffer(data.file, opts)
            }
            if (Buffer.isBuffer(file.buffer)) {
                //@ts-ignore
                file.type = await fileTypeFromBuffer(file.buffer)
                file.md5 = makeMd5(file.buffer)
                file.name ??= `${Date.now().toString(36)}.${file.md5.slice(0, 8)}.${file.type.ext}`
            }
        } catch (err) {
            Stdlog.error("", "文件类型检测错误", file, err)
        }
        file.name ??= `${Date.now().toString(36)}-${basename(file.url)}`
        return file
    }

    /**
     * 
     * @param file 
     * @param opts 
     * @returns 
     */
    async fileToUrl(file, opts: any = {}) {
        const {
            name,
            time = 60000,
            times = 1,
        } = opts

        const { port } = Cfg.getConfig('server').server

        file = (typeof file === "object" && !Buffer.isBuffer(file) && { ...file }) ||
            await this.fileType({ file, name }, { http: true })
        if (!Buffer.isBuffer(file.buffer)) return file.buffer
        file.name = file.name ? encodeURIComponent(file.name) : randomUUID()

        if (typeof times === "number") file.times = times
        this.fs[file.name] = file
        if (time) setTimeout(() => this.fs[file.name] = this.fs.timeout, time)
        return `http://localhost:${port}/api/File/${file.name}`
    }

    /**
     * 
     * @param {IncomingMessage} req 
     */
    fileSend(req) {
        const url = req.url.replace(/^\//, "")
        let file = this.fs[url] || this.fs[404]

        if (typeof file.times === "number") {
            if (file.times > 0) file.times--
            else file = this.fs.timeout
        }

        if (file.type?.mime)
            req.res.setHeader("Content-Type", file.type.mime)

        Stdlog.mark("", `发送文件：${file.name}(${file.url} ${(file.buffer.length / 1024).toFixed(2)}KB)`, `${req.sid} => ${req.rid}`)
        req.res.send(file.buffer)
    }

    /**
     * 
     * @param msg 
     * @returns 
     */
    makeForwardMsg(msg) { return { type: "node", data: msg } }

    /**
     * 
     * @param send 
     * @param msg 
     * @returns 
     */
    async sendForwardMsg(send, msg) {
        const messages = []
        for (const { message } of Array.isArray(msg) ? msg : [msg])
            messages.push(await send(message))
        return messages
    }

    /**
     * 耗时统计
     * @param time1 
     * @param time2 
     * @returns 
     */
    getTimeDiff(time1 = this.stat.start_time * 1000, time2 = Date.now()) {
        const time = (time2 - time1) / 1000
        let ret = ""
        const day = Math.floor(time / 3600 / 24)
        if (day) ret += `${day}天`
        const hour = Math.floor((time / 3600) % 24)
        if (hour) ret += `${hour}时`
        const min = Math.floor((time / 60) % 60)
        if (min) ret += `${min}分`
        const sec = (time % 60).toFixed(3)
        if (sec) ret += `${sec}秒`
        return ret || "0秒"
    }

    /**------------对bots操作-------------- */

    getFriendArray() {
        const array = []
        for (const bot_id of this.uin)
            //@ts-ignore
            for (const [id, i] of Bot[bot_id].fl || [])
                array.push({ ...i, bot_id })
        return array
    }

    getFriendList() {
        const array = []
        for (const bot_id of this.uin)
            array.push(...(Bot[bot_id].fl?.keys() || []))
        return array
    }

    getFriendMap() {
        const map = new Map
        for (const bot_id of this.uin)
            for (const [id, i] of Bot[bot_id].fl || [])
                map.set(id, { ...i, bot_id })
        return map
    }

    get fl() { return this.getFriendMap() }

    getGroupArray() {
        const array = []
        for (const bot_id of this.uin)
            //@ts-ignore
            for (const [id, i] of Bot[bot_id].gl || [])
                array.push({ ...i, bot_id })
        return array
    }

    getGroupList() {
        const array = []
        for (const bot_id of this.uin)
            array.push(...(Bot[bot_id].gl?.keys() || []))
        return array
    }

    getGroupMap() {
        const map = new Map
        for (const bot_id of this.uin)
            for (const [id, i] of Bot[bot_id].gl || [])
                map.set(id, { ...i, bot_id })
        return map
    }
    get gl() { return this.getGroupMap() }
    get gml() {
        const map = new Map
        for (const bot_id of this.uin)
            for (const [id, i] of Bot[bot_id].gml || [])
                map.set(id, Object.assign(new Map(i), { bot_id }))
        return map
    }

    pickFriend(user_id, strict?) {
        user_id = Number(user_id) || user_id
        let user = this.fl.get(user_id)
        //@ts-ignore
        if (!user) for (const [id, ml] of this.gml) {
            user = ml.get(user_id)
            if (user) {
                user.bot_id = ml.bot_id
                break
            }
        }
        if (user) return Bot[user.bot_id].pickFriend(user_id)
        if (strict) return {}
    }
    get pickUser() { return this.pickFriend }

    pickGroup(group_id, strict?) {
        group_id = Number(group_id) || group_id
        const group = this.gl.get(group_id)
        if (group) return Bot[group.bot_id].pickGroup(group_id)
        if (strict) return {}
    }

    pickMember(group_id, user_id) {
        return this.pickGroup(group_id).pickMember(user_id)
    }

}

export default new BotAPI