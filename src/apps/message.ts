import {
    existsSync,
    mkdirSync,
    rmSync,
    readFileSync,
    writeFileSync,
    copyFileSync,
} from 'node:fs'
import { copyDirectory } from '../server/controller/fs/tools.js';
import schedule from 'node-schedule'
import { join } from 'path'
import { botInfo, pluginInfo } from '#env';
import { Pager } from '#utils';
import { Segment, Puppeteer, Plugin, Bot, Redis, Logger } from '#bot';
import type { pluginType } from '../server/controller/plugin/pluginType.js'
import type { RuleType, EventType } from '../adapter/types/types.js'

let plugin = await Plugin()
let segment = await Segment()
let puppeteer = await Puppeteer()
let bot = await Bot()
let redis = await Redis()
let logger = await Logger()

/**
 * 匹配插件指令
 */
export class RunPlugin extends plugin {
    priority: number
    rule: RuleType
    e: EventType
    pluginsPath: string
    indexPath: string
    cronTask: {}
    // htmlPath:string
    // recordPath:string
    // videoPath:string
    // picPath:string

    pluginReadMode: string

    constructor() {
        super({
            name: "消息处理",
            event: "message"
        })
        this.priority = 4000
        this.rule = [
            {
                reg: /小微切换读取模式/,
                fnc: "checkoutReadMode",
            },
            {
                reg: /小微指令列表(.*)/,
                fnc: "viewPluginsList",
            },
            {
                reg: /小微删除指令(.*)/,
                fnc: "deletePlugin",
            },

        ]

        this.pluginsPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins')
        this.indexPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'regs.json')
        // json|redis
        this.pluginReadMode = 'redis'

        this.init()

    }

    /**
     * 初始化
     * @returns
     */
    async init() {
        // 初始化帮助和插件索引
        if (!existsSync(this.pluginsPath)) {
            mkdirSync(this.pluginsPath, { recursive: true })
        }
        if (!existsSync(this.indexPath)) {
            // writeFileSync(this.indexPath, JSON.stringify([]), 'utf-8')
            let defaultRegsPath = join(pluginInfo.ROOT_PATH, 'src', 'apps', 'help', 'regs.json')
            let defaultRegs = JSON.parse(readFileSync(defaultRegsPath, 'utf8'))
            await redis.set(this.pluginsKey, JSON.stringify(defaultRegs))
            copyFileSync(defaultRegsPath, this.indexPath)
            copyDirectory(join(pluginInfo.ROOT_PATH, 'src', 'apps', 'help', 'micro-help'), join(this.pluginsPath, 'micro-help'))
        }

        // 定时任务
        let plugins = await this.pluginsList() || []
        plugins.forEach((plugin: pluginType) => {
            if (plugin.cron) {
                this.cronTask[plugin.id].job = schedule.scheduleJob(plugin.cron, async () => {
                    // 指令
                    try {
                        logger.mark(`执行定时任务：${plugin.id}`)
                        await this.accept({ taskId: plugin.id })
                    } catch (error) {
                        logger.error(`定时任务报错：${plugin.id}`)
                        logger.error(error)
                    }
                })
            }
        });

        // 其它事件
        // try {
        //     bot.on?.("notice.group.poke", () => { })
        // } catch (err) {

        // }

    }

    /**
     * 获取redisKey
     * @returns
     */
    get pluginsKey() {
        return `Micro:Plugins`
    }

    /**
     * 获取插件列表
     * @returns
     */
    async pluginsList() {
        if (this.pluginReadMode == 'redis') {
            return JSON.parse(await redis.get(this.pluginsKey)) as pluginType[]
        }
        if (this.pluginReadMode == 'json') {
            return JSON.parse(readFileSync(this.indexPath, 'utf8'))
        }

    }

    /**
     * 鉴权
     * @returns
     */
    checkAuth(plugin: pluginType) {
        // 防止响应所有消息，可按需开启
        if (plugin.reg == '' && plugin.cron == '') return false
        if (plugin.isGlobal) {
            if (plugin.groups.includes(String(this.e.group_id))) return false
            if (plugin.friends.includes(String(this.e.user_id))) return false
        } else {
            if (!plugin.groups.includes(String(this.e.group_id))) return false
            if (!plugin.friends.includes(String(this.e.user_id))) return false
        }

        return true
    }

    /**
     * 切换读取模式
     * @returns
     */
    checkoutReadMode() {
        if (this.pluginReadMode == 'redis') {
            this.pluginReadMode = 'json'
        } else {
            this.pluginReadMode = 'redis'
        }
        this.e.reply('切换成功，当前读取模式：' + this.pluginReadMode)
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
     * 匹配消息核心
     * @returns
     */
    async accept(e = { taskId: '' }) {
        if (!this.e.message && !e.taskId) return false

        if (e.taskId) {
            //@ts-ignore
            this.e = {}
        }

        // 待发送消息队列
        let msgQueue = []

        // 获取插件列表
        let pluginsList = await this.pluginsList()

        // 匹配插件正则
        for (let plugin of pluginsList) {
            // 鉴权
            if (!this.checkAuth) continue

            // 匹配消息
            const regexp = new RegExp(plugin.reg, plugin.flag)

            // 插件资源路径
            const pluginPath = join(this.pluginsPath, plugin.id)

            // 制作消息段
            if (e.taskId == plugin.id || regexp.test(this.e.msg)) {
                const { message } = plugin
                let msgSegList = []
                for (let item of message) {
                    switch (item.type) {
                        // 文本
                        case 'text':
                            try {
                                let compileText = new Function('e', 'Bot', 'return ' + '`' + item.data + '`')
                                msgSegList.push(compileText(this.e, Bot))
                            } catch (err) {
                                logger.error(err)
                            }

                            break
                        // 图片
                        case 'image':
                            if (item.url) {
                                msgSegList.push(segment.image(item.url))
                            } else {
                                const img = await puppeteer.screenshot('micro-plugin/plugins', {
                                    saveId: item.hash,
                                    tplFile: join(pluginPath, item.hash + '.html'),
                                    e: this.e,
                                    Bot: Bot
                                })
                                msgSegList.push(img)
                            }
                            break
                        // 音频
                        case 'record':
                            if (item.url) {
                                msgSegList.push(segment.record(item.url))
                            }
                            break
                        // 视频
                        case 'video':
                            if (item.url) {
                                msgSegList.push(segment.video(item.url))
                            }
                            break
                        // 表情
                        case 'face':
                            msgSegList.push(segment.face(Number(item.data)))
                            break
                        // 骰子
                        case 'dice':
                            msgSegList.push(segment.poke(Number(item.data)))
                            break
                        // 戳一戳(窗口抖动)
                        case 'poke':
                            msgSegList.push(segment.poke(Number(item.data)))
                            break
                        // md
                        case 'markdown':
                            msgSegList.push(segment.markdown(item.data))
                            break
                        // 按钮
                        case 'button':
                            if (existsSync(join(pluginPath, 'button.json'))) {
                                let btnContent = JSON.parse(readFileSync(join(pluginPath, 'button.json'), 'utf8'))
                                msgSegList.push(segment.button(btnContent))
                            }

                            break
                        default:
                            logger.warn('暂不支持该消息类型！')
                    }
                }
                msgQueue.push(Object.assign(plugin, { message: msgSegList }))
            }
        };

        if (msgQueue.length == 0) return false

        // 处理发送
        for (let msg of msgQueue) {
            if (msg.delayTime) {
                if (typeof msg.delayTime != 'number') {
                    msg.delayTime = Number(msg.delayTime)
                }
                setTimeout(async () => {
                    if (this.e.reply) {
                        await this.e.reply(msg.message, msg.isQuote, { at: msg.isAt })
                    } else {
                        if (e.taskId) {
                            if (msg.isGlobal === false) {
                                // 对白名单推送
                                msg.groups.forEach(async (group_id: number) => {
                                    await bot.sendGroupMsg(group_id, msg.message)
                                });
                                msg.friends.forEach(async (user_id: number) => {
                                    await bot.sendPrivateMsg(user_id, msg.message)
                                });
                            }
                        }
                    }

                }, msg.delayTime)

            } else {
                if (this.e.reply) {
                    await this.e.reply(msg.message, msg.isQuote, { at: msg.isAt })
                } else {
                    if (e.taskId) {
                        if (msg.isGlobal === false) {
                            msg.groups.forEach(async (group_id: number) => {
                                await bot.sendGroupMsg(group_id, msg.message)
                            });
                            msg.friends.forEach(async (user_id: number) => {
                                await bot.sendPrivateMsg(user_id, msg.message)
                            });
                        }
                    }
                }
            }
        }

        return true
    }

    /**
     *
     * @returns
     */
    async viewPluginsList() {
        if (!(/.*小微指令列表(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效页码！')
        }
        const pageNo = Number((/.*小微指令列表(\d+)/.exec(this.e.msg))[1]) || 1
        const pluginList = await this.pluginsList()

        const pagerInstance = new Pager(pluginList, pageNo, 10)
        if (pagerInstance.records.length == 0) {
            this.e.reply('超出页数啦！')
        }
        this.e.reply(JSON.stringify(pagerInstance.records, null, 2))

    }

    /**
     * 
     * @returns
     */
    async deletePlugin() {
        if (!(/.*小微删除指令(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效指令id！')
        }
        const pluginList = await this.pluginsList()
        const pluginId = Number((/.*小微删除指令(\d+)/.exec(this.e.msg))[1]) || 0
        if (pluginId >= pluginList.length) {
            this.e.reply('不存在该序号，当前共' + pluginList.length + '条指令！')
            return
        }
        const pluginPath = join(this.pluginsPath, pluginList[pluginId].id)
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true })
        }
        pluginList.splice(pluginId - 1, 1)
        this.setPluginsList(pluginList)
        this.e.reply('删除成功！')

    }
}