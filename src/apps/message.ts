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
import { Segment, Puppeteer, Plugin, Bot, Logger, Loader } from '#bot';
import { copyDirectory } from '../server/controller/fs/tools.js';

import type { messageType, pluginType } from '../server/controller/plugin/pluginType.js'

const plugin = await Plugin();
const segment = await Segment();
const puppeteer = await Puppeteer();
const bot = await Bot()
const logger = await Logger();
const loader = await Loader()

const indexPath = join(pluginInfo.DATA_PATH, 'regs.json');
const pluginsPath = join(pluginInfo.DATA_PATH, 'plugins');

let pluginsList:pluginType[] = [];
let cronTask = {};

init()

class RunPlugin extends plugin {
    constructor() {
        super({
            name: "消息处理",
            event: "message"
        });
        this.priority = 4000;
        this.rule = [
            {
                reg: /小微指令列表(.*)/,
                fnc: "viewPluginsList",
            },
            {
                reg: /小微删除指令(.*)/,
                fnc: "deletePlugin",
            },
        ];
        
    }
   
    /**
     * 存储插件列表
     * @param value 插件对象
     * @returns
     */
    async setPluginsList(value: pluginType[]) {
        writeFileSync(indexPath, JSON.stringify(value, null, 2), 'utf-8')
    }

    /**
     * 查看指令列表
     * @returns
     */
    async viewPluginsList() {
        let pageNo = 1
        if (!(/小微指令列表(\d+)/.test(this.e.msg))) {
            pageNo = 1
        } else {
            pageNo = Number((/.*小微指令列表(\d+)/.exec(this.e.msg))[1])
        }
        
        const pluginList = JSON.parse(JSON.stringify(pluginsList))

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
     * 删除指令
     * @returns
     */
    async deletePlugin() {
        if (!(/.*小微删除指令(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效指令id！')
            return
        }
        const pluginId = Number((/.*小微删除指令(\d+)/.exec(this.e.msg))[1]) || 0
        if (pluginId >= pluginsList.length) {
            this.e.reply('不存在该序号，当前共' + pluginsList.length + '条指令！')
            return
        }
        const pluginPath = join(pluginsPath, pluginsList[pluginId].id)
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true })
        }
        pluginsList.splice(pluginId, 1)
        this.setPluginsList(pluginsList)
        this.e.reply('删除成功！')

    }
}

export { RunPlugin };


/**
 * id转时间
 * @param timeStr 
 * @returns 
 */
function formatTime(timeStr) {
    const pattern = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/;
    const match = timeStr.match(pattern);
    if (match) {
        //@ts-ignore
        const [fullMatch, year, month, day, hour, minute, second] = match;
        const formattedTime = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')} ${hour}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
        return formattedTime;
    }
    else {
        return timeStr;
    }
}

/**
 * 获取插件列表
 * @returns 
 */
function getPluginsList() {
    return JSON.parse(readFileSync(indexPath, 'utf8'));
}

/**
 * 消息发送核心
 * @param e 
 * @returns 
 */
async function sendMessage(e:any = { taskId: '' }) {
    if (!e.message && !e.taskId) return false

    if (e.taskId) {
        //@ts-ignore
        e = {}
    }

    // 待发送消息队列
    let msgQueue = []
    const pluginList = JSON.parse(JSON.stringify(pluginsList))
    // 匹配插件正则
    for (let plugin of pluginList) {
        // 鉴权
        if (!checkAuth(plugin,e)) continue

        // 匹配消息
        const regexp = new RegExp(plugin.reg, plugin.flag)

        // 插件资源路径
        const pluginPath = join(pluginsPath, plugin.id)

        // 制作消息段
        if (e.taskId == plugin.id || regexp.test(e.msg)) {
            const { message } = plugin
            let msgSegList = []
            for (let item of message) {
                switch (item.type) {
                    case 'code':
                        const codeString = readFileSync(join(pluginPath, item.hash + '.code.js'),'utf-8')
                        const asyncCodeString = `
                            return (async () => { 
                                try {    
                                    ${codeString}       
                                } catch (error) {    
                                    throw error;    
                                }    
                            })()
                        `; 
                        const dynamicAsyncFunction = new Function('e', 'Bot', 'segment', 'puppeteer', 'logger', 'loader', asyncCodeString);

                        // 调用动态创建的异步函数，并处理 Promise  
                        try {
                            const startTime = Date.now()
                            await dynamicAsyncFunction(e,Bot,segment, puppeteer, logger, loader)
                            const endTime = Date.now()
                            logger.info(`[micro]执行[${plugin.id}]代码成功，耗时${endTime - startTime}ms!`) 
                        } catch(err) {
                            logger.error(`[micro]执行[${plugin.id}]代码出错：`);  
                            logger.error(err);  
                        }
                        return
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
                        msgSegList.push(segment.dice(Number(item.data)))
                        break
                    // 猜拳
                    case 'rps':
                        msgSegList.push(segment.rps(Number(item.data)))
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
                            if (mdContent.content != '') {
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
                            msgSegList.push({type: 'button', content: btnContent})
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
                    const res = await e.reply(msg.message, msg.isQuote, { at: msg.isAt })
                    if(!res) {
                        if(e.group_id) {
                            await bot[e.self_id].pickGroup(e.group_id).sendMsg(msg.message)
                        } else {
                            await bot[e.self_id].pickFriend(e.user_id).sendMsg(msg.message)
                        }
                    }
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
                const res = await e.reply(msg.message, msg.isQuote, { at: msg.isAt })
                if(!res) {
                    if(e.group_id) {
                        await bot[e.self_id].pickGroup(e.group_id).sendMsg(msg.message)
                    } else {
                        await bot[e.self_id].pickFriend(e.user_id).sendMsg(msg.message)
                    }
                }

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
 * 鉴权
 * @param plugin 
 * @param e 
 * @returns 
 */
function checkAuth(plugin:pluginType, e:any) {
    if (plugin.reg == '' && plugin.cron == '')
        return false;
    if (plugin.isGlobal) {
        if(e.group_id) {
            if (plugin.groups.includes(String(e.group_id))) return false;
        }
        if (plugin.friends.includes(String(e.user_id)))return false;
    }
    else {
        if(e.group_id) {
        if (!plugin.groups.includes(String(e.group_id))) return false;
        }
        if (!plugin.friends.includes(String(e.user_id))) return false;
    }
    return true;
}


/**
 * 初始化
 * @returns
 */
async function init() {
    // 初始化帮助和插件索引
    if (!existsSync(pluginsPath)) {
        mkdirSync(pluginsPath, { recursive: true })
    }
    if (!existsSync(indexPath)) {
        let defaultRegsPath = join(pluginInfo.PUBLIC_PATH, 'help', 'regs.json')
        copyFileSync(defaultRegsPath, indexPath)
        copyDirectory(join(pluginInfo.PUBLIC_PATH, 'help', 'micro-help'), join(pluginsPath, 'micro-help'))
    }
    // 获取插件列表
    pluginsList = getPluginsList() || []

    bot.on?.("message", async (e) => {
        await sendMessage(e);
    });

    // 定时任务
    pluginsList.forEach((plugin: pluginType) => {
        if (plugin && plugin?.cron) {
            cronTask[plugin.id].job = schedule.scheduleJob(plugin.cron, async () => {
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

    // 监听索引列表更改
    const watcher = chokidar.watch(indexPath)
    watcher.on('change', () => {
        pluginsList = getPluginsList()
        logger.mark(`[Micro][更改指令列表][当前${pluginsList.length}条指令]`)
        // 清理旧的定时任务
        Object.keys(cronTask).forEach((key:string) => {
            cronTask[key].cancel()
            delete cronTask[key]
        });
        pluginsList.forEach((plugin: pluginType) => {
            
            if (plugin && plugin?.cron) {
                cronTask[plugin.id] = schedule.scheduleJob(plugin.cron, async () => {
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