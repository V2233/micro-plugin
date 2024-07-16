import {
    mkdirSync,
    rmSync,
    existsSync,
    readFileSync,
    writeFileSync,
} from 'node:fs'
import { join } from 'path'
import { botInfo } from '#env';
import { Redis } from '#bot'
import type { messageType, pluginType } from './pluginType.js'

const redis = await Redis()

/**
 * 匹配插件指令
 */
export default class PluginHandler {
    pluginsPath: string
    indexPath: string
    pluginsArr: pluginType[]

    constructor(public curPlugin?: pluginType) {
        this.indexPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'regs.json')
        this.pluginsPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins')

        this.curPlugin = curPlugin
        this.pluginsArr = []
    }

    /**
     *
     */
    get pluginsKey() {
        return `Micro:Plugins`
    }

    /**
     *  获取插件列表
     */
    get pluginsList() {
        return JSON.parse(readFileSync(this.indexPath, 'utf-8'))
    }

    /**
     *  写入插件列表
     */
    set pluginsList(value) {
        writeFileSync(this.indexPath, JSON.stringify(value, null, 2), 'utf-8')
    }

    /**
     * 处理后的插件列表
     */
    get plugins() {
        return JSON.stringify(this.pluginsArr, null, 2)
    }

    /**
     * 设置当前插件对象
     * @param value 插件对象
     * @returns
     */
    setCurPlugin(value: pluginType) {
        this.curPlugin = value
    }

    /**
     * 存储插件列表
     * @param value 插件对象
     * @returns
     */
    async setPluginsList(value: pluginType[]) {
        writeFileSync(this.indexPath, JSON.stringify(value, null, 2), 'utf-8')
        await redis.set(this.pluginsKey, JSON.stringify(value))
    }

    /**
     * 新增插件
     * @returns
     */
    async addPlugin(value = null, id = "") {
        if (id !== "") {
            // 修改模式
            this.curPlugin = value
        }

        this.pluginsArr = this.pluginsList as pluginType[]
        const pluginPath = join(this.pluginsPath, this.curPlugin.id)

        const { message } = this.curPlugin
        let newMessage = message.map((item: messageType) => {
            switch (item.type) {
                case 'text':
                    break
                case 'image':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true })
                    }
                    if (!item.url && item.hash && item.data) {
                        item.data = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8" /><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title>${item.hash}</title></head>${item.data}</html>`
                        writeFileSync(join(pluginPath, item.hash + '.html'), item.data, 'utf-8')
                        item.data = ''
                        if (item.json) {
                            writeFileSync(join(pluginPath, item.hash + '.json'), item.json, 'utf-8')
                            item.json = ''
                        }
                    }
                    break
                case 'record':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true })
                    }
                    break
                case 'video':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true })
                    }
                    break
                case 'face':
                    break
                case 'poke':
                    break
                default:
                    Promise.reject(new Error('不支持该类型'))
            }
            return item
        })

        if (id !== "") {
            let index = this.pluginsArr.findIndex((item: pluginType) => item.id == id)
            this.pluginsArr[index] = Object.assign(this.curPlugin, { message: newMessage })
        } else {
            this.pluginsArr.unshift(Object.assign(this.curPlugin, { message: newMessage }))
        }

        this.setPluginsList(this.pluginsArr)

        return true
    }

    /**
     * 删除插件
     * @returns
     */
    async deletePlugin(index: number) {
        this.pluginsArr = this.pluginsList
        const pluginPath = join(this.pluginsPath, this.pluginsArr[index].id)
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true })
        }
        this.pluginsArr.splice(index, 1)
        this.setPluginsList(this.pluginsArr)
        return true
    }

    /**
     * 修改某个插件
     * @returns
     */
    async editorPlugin(id: string, value: pluginType) {

        this.addPlugin(value, id)
        return true
    }

}