import {
    existsSync,
    mkdirSync,
    rmSync,
    readFileSync,
    writeFileSync,
    copyFileSync,
} from 'node:fs'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
import { join } from 'path'
import { botInfo, pluginInfo } from '#env';
import { Pager } from '#utils';
import { Segment, Puppeteer, Plugin, Bot, Logger } from '#bot';
import { copyDirectory } from '../server/controller/fs/tools.js';

import type { messageType, pluginType } from '../server/controller/plugin/pluginType.js'
import type { EventType } from '../adapter/types/types.js'

const plugin = await Plugin()
const segment = await Segment()
const puppeteer = await Puppeteer()
const bot = await Bot()
const logger = await Logger()

/**
 * 匹配插件指令
 */
export class RunPlugin extends plugin {
    pluginsPath: string
    indexPath: string
    cronTask: {}
    pluginsList: pluginType[]

    constructor() {
        super({
            name: "消息处理",
            event: "message"
        })
        this.priority = 4000
        this.rule = [
            {
                reg: /小微指令列表(.*)/,
                fnc: "viewPluginsList",
            },
            {
                reg: /小微删除指令(.*)/,
                fnc: "deletePlugin",
            },

        ]
        this.pluginsList = []
        this.cronTask = {}
        this.pluginsPath = join(pluginInfo.DATA_PATH, 'plugins')
        this.indexPath = join(pluginInfo.DATA_PATH, 'regs.json')
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
            let defaultRegsPath = join(pluginInfo.PUBLIC_PATH, 'help', 'regs.json')
            copyFileSync(defaultRegsPath, this.indexPath)
            copyDirectory(join(pluginInfo.PUBLIC_PATH, 'help', 'micro-help'), join(this.pluginsPath, 'micro-help'))
        }
        // 获取插件列表
        this.pluginsList = this.getPluginsList() || []
        // 定时任务
        this.pluginsList.forEach((plugin: pluginType) => {
            if (plugin && plugin?.cron) {
                this.cronTask[plugin.id].job = schedule.scheduleJob(plugin.cron, async () => {
                    // 指令
                    try {
                        logger.mark(`执行定时任务：${plugin.id}`)
                        await this.run({ taskId: plugin.id })
                    } catch (error) {
                        logger.error(`定时任务报错：${plugin.id}`)
                        logger.error(error)
                    }
                })
            }
        });

        // 事件
        try {
            bot.on?.("message", async(e:EventType) => { 
                // console.log(e)
                
                await this.run(e)
            })
        } catch (err) {

        }

        // 监听索引列表更改
        const watcher = chokidar.watch(this.indexPath)
        watcher.on('change', () => {
            this.pluginsList = this.getPluginsList()
            logger.mark(`[Micro][更改指令列表][当前${this.pluginsList.length}条指令]`)
            // 清理旧的定时任务
            Object.keys(this.cronTask).forEach((key:string) => {
                this.cronTask[key].cancel()
                delete this.cronTask[key]
            });
            this.pluginsList.forEach((plugin: pluginType) => {
                
                if (plugin && plugin?.cron) {
                    this.cronTask[plugin.id] = schedule.scheduleJob(plugin.cron, async () => {
                        // 指令
                        try {
                            logger.mark(`执行定时任务：${plugin.id}`)
                            await this.run({ taskId: plugin.id })
                        } catch (error) {
                            logger.error(`定时任务报错：${plugin.id}`)
                            logger.error(error)
                        }
                    })
                }
            });
        })


    }

    /**
     * 获取插件列表
     * @returns
     */
    getPluginsList() {
        return JSON.parse(readFileSync(this.indexPath, 'utf8'))
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
     * 存储插件列表
     * @param value 插件对象
     * @returns
     */
    async setPluginsList(value: pluginType[]) {
        writeFileSync(this.indexPath, JSON.stringify(value, null, 2), 'utf-8')
    }

    /**
     * 匹配消息核心
     * @returns
     */
    async run(e:(typeof this.e | {taskId?:string}) = { taskId: '' }) {
        if (!e.message && !e.taskId) return false

        if (e.taskId) {
            //@ts-ignore
            e = {}
        }

        // 待发送消息队列
        let msgQueue = []
        const pluginList = JSON.parse(JSON.stringify(this.pluginsList))
        // 匹配插件正则
        for (let plugin of pluginList) {
            // 鉴权
            if (!this.checkAuth) continue

            // 匹配消息
            const regexp = new RegExp(plugin.reg, plugin.flag)

            // 插件资源路径
            const pluginPath = join(this.pluginsPath, plugin.id)

            // 制作消息段
            if (e.taskId == plugin.id || regexp.test(e.msg)) {
                const { message } = plugin
                let msgSegList = []
                for (let item of message) {
                    switch (item.type) {
                        // 文本
                        case 'text':
                            try {
                                let compileText = new Function('e', 'Bot', 'return ' + '`' + item.data + '`')
                                msgSegList.push(compileText(e, Bot))
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
                                    e: e,
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
                            const mdPath = join(pluginPath, 'markdown.json')
                            if (existsSync(mdPath)) {
                                let mdContent = JSON.parse(readFileSync(mdPath, 'utf8'))
                                if (mdContent.content == '') {
                                    delete mdContent.params
                                    msgSegList.push({ type: 'markdown', content: mdContent })
                                } else {
                                    delete mdContent.content
                                    mdContent = mdContent.map((item) => {
                                        delete item.tempString
                                        return item
                                    })
                                    msgSegList.push({ type: 'markdown', content: mdContent })
                                }
                            }
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
            // console.log(msg)
            if (msg.delayTime) {
                if (typeof msg.delayTime != 'number') {
                    msg.delayTime = Number(msg.delayTime)
                }
                setTimeout(async () => {
                    if (e.reply) {
                        await e.reply(msg.message, msg.isQuote, { at: msg.isAt })
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
                if (e.reply) {
                    await e.reply(msg.message, msg.isQuote, { at: msg.isAt })
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
        let pageNo = 1
        if (!(/小微指令列表(\d+)/.test(this.e.msg))) {
            pageNo = 1
        } else {
            pageNo = Number((/.*小微指令列表(\d+)/.exec(this.e.msg))[1])
        }
        
        const pluginList = JSON.parse(JSON.stringify(this.pluginsList))

        const pagerInstance = new Pager(pluginList, pageNo, 40)
        if (pagerInstance.records.length == 0) {
            this.e.reply('超出页数啦！')
        }

        let orderList = []
        
        pagerInstance.records.forEach((plugin:pluginType,index) => {

            const msgType = plugin.message.map((msg:messageType) => msg.type)
            
            const order = {
                id: index,
                reg: plugin.reg,
                msgType: '[' + msgType.join(',') + ']',
                createTime: formatTime(plugin.id)
            }
            orderList.push(order)
        })

        const img = await puppeteer.screenshot('micro-plugin/orders', {
            saveId: 'order',
            tplFile: join(pluginInfo.PUBLIC_PATH, 'html', 'orders.html'),
            pluginInfo,
            botInfo,
            orderList: orderList
        })

        this.e.reply(img)
    }

    /**
     * 
     * @returns
     */
    async deletePlugin() {
        if (!(/.*小微删除指令(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效指令id！')
            return
        }
        const pluginId = Number((/.*小微删除指令(\d+)/.exec(this.e.msg))[1]) || 0
        if (pluginId >= this.pluginsList.length) {
            this.e.reply('不存在该序号，当前共' + this.pluginsList.length + '条指令！')
            return
        }
        const pluginPath = join(this.pluginsPath, this.pluginsList[pluginId].id)
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true })
        }
        this.pluginsList.splice(pluginId, 1)
        this.setPluginsList(this.pluginsList)
        this.e.reply('删除成功！')

    }
}

function formatTime(timeStr) {  
    const pattern = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/;  
    const match = timeStr.match(pattern);  
      
    // 如果找到匹配项，则替换时间格式  
    if (match) {  
      // 分解匹配到的部分  
      //@ts-ignore
      const [fullMatch, year, month, day, hour, minute, second] = match;  
      const formattedTime = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')} ${hour}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;  
      return formattedTime;  
    } else {  
      return timeStr;  
    }  
}  