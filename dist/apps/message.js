import { existsSync, mkdirSync, readFileSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { copyDirectory } from '../server/controller/fs/tools.js';
import schedule from 'node-schedule';
import { join } from 'path';
import { pluginInfo, botInfo } from '../env.js';
import '../utils/index.js';
import { Plugin, Segment, Puppeteer, Bot, Redis, Logger } from '../adapter/index.js';
import Pager from '../utils/pager.js';

let plugin = await Plugin();
let segment = await Segment();
let puppeteer = await Puppeteer();
let bot = await Bot();
let redis = await Redis();
let logger = await Logger();
class RunPlugin extends plugin {
    pluginsPath;
    indexPath;
    cronTask;
    pluginReadMode;
    constructor() {
        super({
            name: "消息处理",
            event: "message"
        });
        this.priority = 4000;
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
        ];
        this.pluginsPath = join(pluginInfo.DATA_PATH, 'plugins');
        this.indexPath = join(pluginInfo.DATA_PATH, 'regs.json');
        this.pluginReadMode = 'redis';
        this.init();
    }
    async init() {
        if (!existsSync(this.pluginsPath)) {
            mkdirSync(this.pluginsPath, { recursive: true });
        }
        if (!existsSync(this.indexPath)) {
            let defaultRegsPath = join(pluginInfo.PUBLIC_PATH, 'help', 'regs.json');
            let defaultRegs = JSON.parse(readFileSync(defaultRegsPath, 'utf8'));
            await redis.set(this.pluginsKey, JSON.stringify(defaultRegs));
            copyFileSync(defaultRegsPath, this.indexPath);
            copyDirectory(join(pluginInfo.PUBLIC_PATH, 'help', 'micro-help'), join(this.pluginsPath, 'micro-help'));
        }
        let plugins = await this.pluginsList() || [];
        plugins.forEach((plugin) => {
            if (plugin && plugin?.cron) {
                this.cronTask[plugin.id].job = schedule.scheduleJob(plugin.cron, async () => {
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
        try {
            bot.on?.("message", async (e) => {
                this.e = e;
                await this.run();
            });
        }
        catch (err) {
        }
    }
    get pluginsKey() {
        return `Micro:Plugins`;
    }
    async pluginsList() {
        if (this.pluginReadMode == 'redis') {
            return JSON.parse(await redis.get(this.pluginsKey));
        }
        if (this.pluginReadMode == 'json') {
            return JSON.parse(readFileSync(this.indexPath, 'utf8'));
        }
    }
    checkAuth(plugin) {
        if (plugin.reg == '' && plugin.cron == '')
            return false;
        if (plugin.isGlobal) {
            if (plugin.groups.includes(String(this.e.group_id)))
                return false;
            if (plugin.friends.includes(String(this.e.user_id)))
                return false;
        }
        else {
            if (!plugin.groups.includes(String(this.e.group_id)))
                return false;
            if (!plugin.friends.includes(String(this.e.user_id)))
                return false;
        }
        return true;
    }
    checkoutReadMode() {
        if (this.pluginReadMode == 'redis') {
            this.pluginReadMode = 'json';
        }
        else {
            this.pluginReadMode = 'redis';
        }
        this.e.reply('切换成功，当前读取模式：' + this.pluginReadMode);
    }
    async setPluginsList(value) {
        writeFileSync(this.indexPath, JSON.stringify(value, null, 2), 'utf-8');
        await redis.set(this.pluginsKey, JSON.stringify(value));
    }
    async run(e = { taskId: '' }) {
        if (!this.e.message && !e.taskId)
            return false;
        if (e.taskId) {
            this.e = {};
        }
        let msgQueue = [];
        let pluginsList = await this.pluginsList();
        for (let plugin of pluginsList) {
            if (!this.checkAuth)
                continue;
            const regexp = new RegExp(plugin.reg, plugin.flag);
            const pluginPath = join(this.pluginsPath, plugin.id);
            if (e.taskId == plugin.id || regexp.test(this.e.msg)) {
                const { message } = plugin;
                let msgSegList = [];
                for (let item of message) {
                    switch (item.type) {
                        case 'text':
                            try {
                                let compileText = new Function('e', 'Bot', 'return ' + '`' + item.data + '`');
                                msgSegList.push(compileText(this.e, Bot));
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
                                    e: this.e,
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
                            msgSegList.push(segment.poke(Number(item.data)));
                            break;
                        case 'poke':
                            msgSegList.push(segment.poke(Number(item.data)));
                            break;
                        case 'markdown':
                            const mdPath = join(pluginPath, 'markdown.json');
                            if (existsSync(mdPath)) {
                                let mdContent = JSON.parse(readFileSync(mdPath, 'utf8'));
                                if (mdContent.content == '') {
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
                                msgSegList.push(segment.button(btnContent));
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
                    if (this.e.reply) {
                        await this.e.reply(msg.message, msg.isQuote, { at: msg.isAt });
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
                if (this.e.reply) {
                    await this.e.reply(msg.message, msg.isQuote, { at: msg.isAt });
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
    async viewPluginsList() {
        let pageNo = 1;
        if (!(/.*小微指令列表(\d+)/.test(this.e.msg))) {
            pageNo = 1;
        }
        else {
            pageNo = Number((/.*小微指令列表(\d+)/.exec(this.e.msg))[1]);
        }
        const pluginList = await this.pluginsList();
        const pagerInstance = new Pager(pluginList, pageNo, 10);
        if (pagerInstance.records.length == 0) {
            this.e.reply('超出页数啦！');
        }
        let orderList = [];
        pagerInstance.records.forEach((plugin, index) => {
            let preText = '';
            const msgType = plugin.message.map((msg) => {
                if (msg.type == 'text') {
                    preText += msg.data;
                }
                switch (msg.type) {
                    case 'text':
                        preText += msg.data;
                        break;
                    case 'image':
                        preText += `[img:${(msg.hash ? msg.hash : msg.url).slice(0, 8)}...]`;
                        break;
                    case 'record':
                        preText += `[record:${(msg.url ? msg.url.slice(0, 8) : '')}...]`;
                        break;
                    case 'record':
                        preText += `[video:${(msg.url ? msg.url.slice(0, 8) : '')}...]`;
                        break;
                    case 'face':
                        preText += `[face:id=${(msg.data)}]`;
                        break;
                    default:
                }
                return msg.type;
            });
            const order = {
                id: index,
                reg: plugin.reg,
                msgType: '[' + msgType.join(',') + ']',
                preText: preText
            };
            orderList.push(order);
        });
        const img = await puppeteer.screenshot('micro-plugin/orders', {
            saveId: 'order',
            tplFile: join(pluginInfo.PUBLIC_PATH, 'html', 'orders.html'),
            pluginInfo,
            botInfo,
            orderList: orderList.slice().reverse()
        });
        this.e.reply(img);
    }
    async deletePlugin() {
        if (!(/.*小微删除指令(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效指令id！');
        }
        const pluginList = await this.pluginsList();
        const pluginId = Number((/.*小微删除指令(\d+)/.exec(this.e.msg))[1]) || 0;
        if (pluginId >= pluginList.length) {
            this.e.reply('不存在该序号，当前共' + pluginList.length + '条指令！');
            return;
        }
        const pluginPath = join(this.pluginsPath, pluginList[pluginId].id);
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true });
        }
        pluginList.splice(pluginId - 1, 1);
        this.setPluginsList(pluginList);
        this.e.reply('删除成功！');
    }
}

export { RunPlugin };
