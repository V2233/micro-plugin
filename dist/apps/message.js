import { writeFileSync, existsSync, rmSync, readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import chokidar from 'chokidar';
import schedule from 'node-schedule';
import { join } from 'path';
import { pluginInfo, botInfo } from '../env.js';
import '../utils/index.js';
import { Plugin, Segment, Puppeteer, Bot, Loader } from '../adapter/index.js';
import { copyDirectory } from '../server/controller/fs/tools.js';
import Pager from '../utils/pager.js';

const plugin = await Plugin();
const segment = await Segment();
const puppeteer = await Puppeteer();
const bot = await Bot();
const loader = await Loader();
const indexPath = join(pluginInfo.DATA_PATH, 'regs.json');
const pluginsPath = join(pluginInfo.DATA_PATH, 'plugins');
let pluginsList = [];
let cronTask = {};
init();
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
    async setPluginsList(value) {
        writeFileSync(indexPath, JSON.stringify(value, null, 2), 'utf-8');
    }
    async viewPluginsList() {
        let pageNo = 1;
        if (!(/小微指令列表(\d+)/.test(this.e.msg))) {
            pageNo = 1;
        }
        else {
            pageNo = Number((/.*小微指令列表(\d+)/.exec(this.e.msg))[1]);
        }
        const pluginList = JSON.parse(JSON.stringify(pluginsList));
        const pagerInstance = new Pager(pluginList, pageNo, 40);
        if (pagerInstance.records.length == 0) {
            this.e.reply('超出页数啦！');
        }
        let orderList = [];
        pagerInstance.records.forEach((plugin, index) => {
            const msgType = plugin.message.map((msg) => msg.type);
            const order = {
                id: index,
                reg: plugin.reg,
                msgType: '[' + msgType.join(',') + ']',
                createTime: formatTime(plugin.id)
            };
            orderList.push(order);
        });
        const img = await puppeteer.screenshot('micro-plugin/orders', {
            saveId: 'order',
            tplFile: join(pluginInfo.PUBLIC_PATH, 'html', 'orders.html'),
            pluginInfo,
            botInfo,
            orderList: orderList
        });
        this.e.reply(img);
    }
    async deletePlugin() {
        if (!(/.*小微删除指令(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效指令id！');
            return;
        }
        const pluginId = Number((/.*小微删除指令(\d+)/.exec(this.e.msg))[1]) || 0;
        if (pluginId >= pluginsList.length) {
            this.e.reply('不存在该序号，当前共' + pluginsList.length + '条指令！');
            return;
        }
        const pluginPath = join(pluginsPath, pluginsList[pluginId].id);
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true });
        }
        pluginsList.splice(pluginId, 1);
        this.setPluginsList(pluginsList);
        this.e.reply('删除成功！');
    }
}
function formatTime(timeStr) {
    const pattern = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/;
    const match = timeStr.match(pattern);
    if (match) {
        const [fullMatch, year, month, day, hour, minute, second] = match;
        const formattedTime = `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')} ${hour}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
        return formattedTime;
    }
    else {
        return timeStr;
    }
}
function getPluginsList() {
    return JSON.parse(readFileSync(indexPath, 'utf8'));
}
async function sendMessage(e = { taskId: '' }) {
    if (!e.message && !e.taskId)
        return false;
    if (e.taskId) {
        e = {};
    }
    let msg = '1145145141314521';
    if (e.message) {
        if (!e.msg) {
            msg = e.message.reduce((prev, next) => {
                if (next.type === 'text') {
                    return prev + next.text;
                }
            }, '');
        }
    }
    let msgQueue = [];
    const pluginList = JSON.parse(JSON.stringify(pluginsList));
    for (let plugin of pluginList) {
        if (!checkAuth(plugin, e))
            continue;
        const regexp = new RegExp(plugin.reg, plugin.flag);
        const pluginPath = join(pluginsPath, plugin.id);
        if (e.taskId == plugin.id || regexp.test(e.msg ? e.msg : msg)) {
            const { message } = plugin;
            let msgSegList = [];
            for (let item of message) {
                switch (item.type) {
                    case 'code':
                        const codeString = readFileSync(join(pluginPath, item.hash + '.code.js'), 'utf-8');
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
                        try {
                            const startTime = Date.now();
                            await dynamicAsyncFunction(e, Bot, segment, puppeteer, logger, loader);
                            const endTime = Date.now();
                            logger.info(`[micro]执行[${plugin.id}]代码成功，耗时${endTime - startTime}ms!`);
                        }
                        catch (err) {
                            logger.error(`[micro]执行[${plugin.id}]代码出错：`);
                            logger.error(err);
                        }
                        return;
                    case 'text':
                        try {
                            let compileText = new Function('e', 'Bot', 'return ' + '`' + item.data + '`');
                            msgSegList.push(compileText(e, Bot));
                        }
                        catch (err) {
                            logger.error(err);
                        }
                        break;
                    case 'image':
                        if (item.url) {
                            msgSegList.push(segment.image(item.url));
                        }
                        else {
                            const img = await puppeteer.screenshot('micro-plugin/plugins', {
                                saveId: item.hash,
                                tplFile: join(pluginPath, item.hash + '.html'),
                                e: e,
                                Bot: Bot
                            });
                            msgSegList.push(img);
                        }
                        break;
                    case 'record':
                        if (item.url) {
                            msgSegList.push(segment.record(item.url));
                        }
                        break;
                    case 'video':
                        if (item.url) {
                            msgSegList.push(segment.video(item.url));
                        }
                        break;
                    case 'face':
                        msgSegList.push(segment.face(Number(item.data)));
                        break;
                    case 'dice':
                        msgSegList.push(segment.dice(Number(item.data)));
                        break;
                    case 'rps':
                        msgSegList.push(segment.rps(Number(item.data)));
                        break;
                    case 'poke':
                        msgSegList.push(segment.poke(Number(item.data)));
                        break;
                    case 'markdown':
                        const mdPath = join(pluginPath, 'markdown.json');
                        if (existsSync(mdPath)) {
                            let mdContent = JSON.parse(readFileSync(mdPath, 'utf8'));
                            if (mdContent.content != '') {
                                delete mdContent.params;
                                msgSegList.push({ type: 'markdown', content: mdContent });
                            }
                            else {
                                delete mdContent.content;
                                mdContent = mdContent.map((item) => {
                                    delete item.tempString;
                                    return item;
                                });
                                msgSegList.push({ type: 'markdown', content: mdContent });
                            }
                        }
                        break;
                    case 'button':
                        if (existsSync(join(pluginPath, 'button.json'))) {
                            let btnContent = JSON.parse(readFileSync(join(pluginPath, 'button.json'), 'utf8'));
                            msgSegList.push({ type: 'button', content: btnContent });
                        }
                        break;
                    default:
                        logger.warn('暂不支持该消息类型！');
                }
            }
            msgQueue.push(Object.assign(plugin, { message: msgSegList }));
        }
    }
    ;
    if (msgQueue.length == 0)
        return false;
    for (let msg of msgQueue) {
        if (msg.delayTime) {
            if (typeof msg.delayTime != 'number') {
                msg.delayTime = Number(msg.delayTime);
            }
            setTimeout(async () => {
                if (e.reply) {
                    await e.reply(msg.message, msg.isQuote, { at: msg.isAt });
                }
                else {
                    if (e.taskId) {
                        if (msg.isGlobal === false) {
                            msg.groups.forEach(async (group_id) => {
                                await bot.sendGroupMsg(group_id, msg.message);
                            });
                            msg.friends.forEach(async (user_id) => {
                                await bot.sendPrivateMsg(user_id, msg.message);
                            });
                        }
                    }
                }
            }, msg.delayTime);
        }
        else {
            if (e.reply) {
                await e.reply(msg.message, msg.isQuote, { at: msg.isAt });
            }
            else {
                if (e.taskId) {
                    if (msg.isGlobal === false) {
                        msg.groups.forEach(async (group_id) => {
                            await bot.sendGroupMsg(group_id, msg.message);
                        });
                        msg.friends.forEach(async (user_id) => {
                            await bot.sendPrivateMsg(user_id, msg.message);
                        });
                    }
                }
            }
        }
    }
    return true;
}
function checkAuth(plugin, e) {
    if (plugin.reg == '' && plugin.cron == '')
        return false;
    if (plugin.isGlobal) {
        if (e.group_id) {
            if (plugin.groups.includes(String(e.group_id)))
                return false;
        }
        if (plugin.friends.includes(String(e.user_id)))
            return false;
    }
    else {
        if (e.group_id) {
            if (!plugin.groups.includes(String(e.group_id)))
                return false;
        }
        if (!plugin.friends.includes(String(e.user_id)))
            return false;
    }
    return true;
}
async function init() {
    if (!existsSync(pluginsPath)) {
        mkdirSync(pluginsPath, { recursive: true });
    }
    if (!existsSync(indexPath)) {
        let defaultRegsPath = join(pluginInfo.PUBLIC_PATH, 'help', 'regs.json');
        copyFileSync(defaultRegsPath, indexPath);
        copyDirectory(join(pluginInfo.PUBLIC_PATH, 'help', 'micro-help'), join(pluginsPath, 'micro-help'));
    }
    pluginsList = getPluginsList() || [];
    bot.on?.("message", async (e) => {
        await sendMessage(e);
    });
    pluginsList.forEach((plugin) => {
        if (plugin && plugin?.cron) {
            cronTask[plugin.id].job = schedule.scheduleJob(plugin.cron, async () => {
                try {
                    logger.mark(`执行定时任务：${plugin.id}`);
                    await this.run({ taskId: plugin.id });
                }
                catch (error) {
                    logger.error(`定时任务报错：${plugin.id}`);
                    logger.error(error);
                }
            });
        }
    });
    const watcher = chokidar.watch(indexPath);
    watcher.on('change', () => {
        pluginsList = getPluginsList();
        logger.mark(`[Micro][更改指令列表][当前${pluginsList.length}条指令]`);
        Object.keys(cronTask).forEach((key) => {
            cronTask[key].cancel();
            delete cronTask[key];
        });
        pluginsList.forEach((plugin) => {
            if (plugin && plugin?.cron) {
                cronTask[plugin.id] = schedule.scheduleJob(plugin.cron, async () => {
                    try {
                        logger.mark(`执行定时任务：${plugin.id}`);
                        await this.run({ taskId: plugin.id });
                    }
                    catch (error) {
                        logger.error(`定时任务报错：${plugin.id}`);
                        logger.error(error);
                    }
                });
            }
        });
    });
}

export { RunPlugin };
