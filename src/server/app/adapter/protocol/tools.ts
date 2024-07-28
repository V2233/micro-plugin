import { fileTypeFromBuffer, type FileTypeResult } from "file-type"
import {stat,mkdir,rm,writeFile,readFile} from "node:fs/promises"
import { randomUUID } from "crypto"
import { join,dirname,basename } from "path"
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

    fs = Object.create(null)

    $emit(name = "", data = {}) {
        this.prepareEvent(data)
        while (true) {
            Bot.emit(name, data)
            const i = name.lastIndexOf(".")
            if (i === -1) break
            name = name.slice(0, i)
        }
    }

    sleep(time, promise?) {
        if (promise) return Promise.race([promise, this.sleep(time)])
        return new Promise(resolve => setTimeout(resolve, time))
    }

    async fsStat(path, opts?):Promise<any> {
        try {
            return await stat(path, opts)
        } catch (err) {
            Stdlog.trace("", "获取", path, "状态错误", err)
            return false
        }
    }

    async mkdir(dir, opts?) {
        try {
            await mkdir(dir, { recursive: true, ...opts })
            return true
        } catch (err) {
            Stdlog.error("", "创建", dir, "错误", err)
            return false
        }
    }

    async rm(file, opts?) {
        try {
            await rm(file, { force: true, recursive: true, ...opts })
            return true
        } catch (err) {
            Stdlog.error("", "删除", file, "错误", err)
            return false
        }
    }

    async download(url, file, opts) {
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

    StringOrNull(data) {
        if (typeof data === "object" && typeof data.toString !== "function")
            return "[object null]"
        return String(data)
    }

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

    async Buffer(data, opts:any = {}) {
        if (Buffer.isBuffer(data)) return data
        data = this.String(data)

        if (data.startsWith("base64://"))
            return Buffer.from(data.replace("base64://", ""), "base64")
        else if (data.match(/^https?:\/\//))
            return opts.http ? data : Buffer.from(await (await fetch(data, opts)).arrayBuffer())
        else if (data.startsWith('file://')) {
            if(await this.fsStat(data.replace(/^file:\/\//, ""))) {
                return opts.file ? data : Buffer.from(await readFile(data.replace(/^file:\/\//, "")))
            }
        }
            
        return data
    }

    async fileType(data, opts = {}) {
        

        const file:fileInfoType = {
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

    async fileToUrl(file, opts:any = {}) {
        const {
            name,
            time = 60000,
            times = 1,
        } = opts

        const {port} = Cfg.getConfig('server').server

        file = (typeof file === "object" && !Buffer.isBuffer(file) && { ...file }) ||
            await this.fileType({ file, name }, { http: true })
        if (!Buffer.isBuffer(file.buffer)) return file.buffer
        file.name = file.name ? encodeURIComponent(file.name) : randomUUID()

        if (typeof times === "number") file.times = times
        this.fs[file.name] = file
        if (time) setTimeout(() => this.fs[file.name] = this.fs.timeout, time)
        return `http://localhost:${port}/File/${file.name}`
    }

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

    makeForwardMsg(msg) { return { type: "node", data: msg } }

    async sendForwardMsg(send, msg) {
        const messages = []
        for (const { message } of Array.isArray(msg) ? msg : [msg])
            messages.push(await send(message))
        return messages
    }
}

export default new BotAPI