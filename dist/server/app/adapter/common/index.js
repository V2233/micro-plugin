import crypto from 'crypto';
import fs from 'fs';
import get_urls from 'get-urls';
import fetch from 'node-fetch';
import { join, dirname } from 'path';
import '../../../../utils/index.js';
import { pluginInfo } from '../../../../env.js';
import Stdlog from '../../../../utils/stdlog.js';

if (!Bot?.adapter) {
    Bot.adapter = Bot.uin ? [Bot.uin] : [];
}
else {
    if (!Bot.adapter.includes(Bot.uin)) {
        Bot.adapter.push(Bot.uin);
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function init(key = 'micro:restart') {
    let restart = await redis.get(key);
    if (!restart)
        return;
    redis.del(key);
    restart = JSON.parse(restart);
    const uin = restart?.uin || Bot.uin;
    const time = (Date.now() - (restart.time || Date.now())) / 1000;
    const msgId = restart?.msg_id || false;
    let restartMsg = `重启成功：耗时${time.toFixed(2)}秒`;
    let msg;
    if (restart?.adapter === 'QQBot' && msgId)
        msg = [{ type: 'reply', id: msgId }, restartMsg];
    try {
        if (restart.isGroup) {
            Bot[uin].pickGroup(restart.id, msgId).sendMsg(msg);
        }
        else {
            Bot[uin].pickUser(restart.id).sendMsg(msg);
        }
    }
    catch (error) { }
}
function array(data) {
    let msg = [];
    if (typeof data === 'object' && data?.test && data?.data?.type === 'test')
        return data.message;
    if (data?.[0]?.data?.type === 'test' || data?.[1]?.data?.type === 'test') {
        msg.push(...(data?.[0].msg || data?.[1].msg));
    }
    else if (data?.data?.type === 'test') {
        msg.push(...data.msg);
    }
    else if (Array.isArray(data)) {
        msg = [].concat(...data.map(i => (typeof i === 'string'
            ? [{ type: 'text', text: i }]
            : Array.isArray(i)
                ? [].concat(...i.map(format => (typeof format === 'string'
                    ? [{ type: 'text', text: format }]
                    : typeof format === 'object' && format !== null ? [format] : [])))
                : typeof i === 'object' && i !== null ? [i] : [])));
    }
    else if (data instanceof fs.ReadStream) {
        if (fs.existsSync(data.file.path)) {
            msg.push({ type: 'image', file: `file://${data.file.path}` });
        }
        else {
            msg.push({ type: 'image', file: `file://./${data.file.path}` });
        }
    }
    else if (data instanceof Uint8Array) {
        msg.push({ type: 'image', file: data });
    }
    else if (typeof data === 'object') {
        msg.push(data);
    }
    else {
        msg.push({ type: 'text', text: data });
    }
    return msg;
}
async function makeForwardMsg(data, node = false, e = {}) {
    const message = { type: 'forward' };
    let allMsg = [];
    if (!Array.isArray(data))
        data = [data];
    for (let i = 0; i < data.length; i++) {
        let msg = data[i].message;
        if (typeof msg === 'object' && (msg?.data?.type === 'test' || msg?.type === 'xml')) {
            data.splice(i, 1, ...msg.msg);
            i--;
        }
    }
    for (let msg in data) {
        msg = data[msg]?.message || data[msg];
        if (!msg && msg?.type)
            continue;
        if (Array.isArray(msg)) {
            msg.forEach(i => {
                if (typeof i === 'string') {
                    allMsg.push('\n' + i.trim());
                }
                else {
                    allMsg.push(i);
                }
            });
        }
        else if (typeof msg === 'object' && /^#.*日志$/.test(e?.msg?.content)) {
            if (msg) {
                const splitMsg = msg.split('\n').map(i => {
                    if (!i || i.trim() === '')
                        return {};
                    return '\n' + i.substring(0, 500).trim();
                });
                allMsg.push(...splitMsg.slice(0, 50));
            }
        }
        else if (typeof msg === 'object') {
            allMsg.push(msg);
        }
        else if (typeof msg === 'string') {
            allMsg.push('\n' + msg);
        }
        else {
            Stdlog.warn('', '未兼容的字段：', msg);
        }
    }
    if (node)
        allMsg.forEach(i => { i.node = true; });
    message.text = Array.from(new Set(allMsg.map((item) => JSON.stringify(item)))).map(item => JSON.parse(item));
    message.data = { type: 'forward', text: 'text', app: 'com.tencent.multimsg', meta: { detail: { news: [{ text: '1' }] }, resid: '', uniseq: '', summary: '' } };
    return message;
}
async function base64(path) {
    let file = path;
    try {
        if (!fs.existsSync(file)) {
            file = file.replace(/^file:\/\//, '');
            if (!fs.existsSync(file)) {
                file = path.replace(/^file:\/\/\//, '');
                if (!fs.existsSync(file))
                    return;
            }
        }
        return fs.readFileSync(file, { encoding: 'base64' });
    }
    catch (err) {
    }
}
async function uploadQQ(file, uin = Bot.uin) {
    let base64;
    if (Buffer.isBuffer(file)) {
        base64 = file.toString('base64');
    }
    else if (file.startsWith('file://')) {
        base64 = fs.readFileSync(file.slice(7)).toString('base64');
    }
    else if (!file.startsWith('base64://') && fs.existsSync(file)) {
        base64 = fs.readFileSync(file).toString('base64');
    }
    else if (file.startsWith('base64://')) {
        base64 = file.slice(9);
    }
    else {
        throw new Error('上传失败，未知格式的文件');
    }
    try {
        const { message_id } = await Bot[uin].pickUser(uin).sendMsg([segment.image(`base64://${base64}`)]);
        await Bot[uin].pickUser(uin).recallMsg(message_id);
    }
    catch { }
    const md5 = crypto.createHash('md5').update(Buffer.from(base64, 'base64')).digest('hex');
    return `https://gchat.qpic.cn/gchatpic_new/0/0-0-${md5.toUpperCase()}/0?term=2&is_origin=0`;
}
function getUrls(url, exclude = []) {
    let urls = [];
    url = url.replace(/[\u4e00-\u9fa5]/g, '|');
    try {
        urls = [...get_urls(url, {
                exclude,
                stripWWW: false,
                normalizeProtocol: false,
                removeQueryParameters: false,
                removeSingleSlash: false,
                sortQueryParameters: false,
                stripAuthentication: false,
                stripTextFragment: false,
                removeTrailingSlash: false
            })];
    }
    catch {
        Stdlog.info('Micro-plugin', '没有安装 get-urls 模块，建议执行pnpm install');
        const urlRegex = /(https?:\/\/)?(([0-9a-z.-]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_#]*)?(\?[0-9a-z=&%_\-.]*)?(\\#[0-9a-z=&%_\\-]*)?/ig;
        urls = url.match(urlRegex);
        if (!urls)
            urls = [];
        return urls;
    }
    return urls;
}
function message_id() {
    return Buffer.from(Date.now().toString()).toString('base64');
}
function mkdirs(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirs(dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
async function downloadFile(url, destPath, headers = {}, absolute = false) {
    let response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`download file http error: status: ${response.status}`);
    }
    let dest = destPath;
    if (!absolute) {
        dest = join(pluginInfo.DATA_PATH, dest);
        const lastLevelDirPath = dirname(dest);
        mkdirs(lastLevelDirPath);
    }
    const fileStream = fs.createWriteStream(dest);
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', err => {
            reject(err);
        });
        fileStream.on('finish', function () {
            resolve('ok');
        });
    });
    Stdlog.info('', `File downloaded successfully! URL: ${url}, Destination: ${dest}`);
    return dest;
}
function getFile(i) {
    if (i?.url) {
        if (i?.url?.includes('gchat.qpic.cn') && !i?.url?.startsWith('https://')) {
            i = 'https://' + i.url;
        }
        else {
            i = i.url;
        }
    }
    else if (typeof i === 'object') {
        i = i.file;
    }
    let file;
    let type = 'file';
    if (i?.type === 'Buffer') {
        type = 'buffer';
        file = Buffer.from(i?.data);
    }
    else if (i?.type === 'Buffer' || i instanceof Uint8Array || Buffer.isBuffer(i?.data || i)) {
        type = 'buffer';
        file = i?.data || i;
    }
    else if (i instanceof fs.ReadStream || i?.path) {
        if (fs.existsSync(i.path)) {
            file = `file://${i.path}`;
        }
        else {
            file = `file://./${i.path}`;
        }
    }
    else if (typeof i === 'string') {
        if (fs.existsSync(i.replace(/^file:\/\//, ''))) {
            file = i;
        }
        else if (fs.existsSync(i.replace(/^file:\/\/\//, ''))) {
            file = i.replace(/^file:\/\/\//, 'file://');
        }
        else if (fs.existsSync(i)) {
            file = `file://${i}`;
        }
        else if (/^base64:\/\//.test(i)) {
            type = 'base64';
            file = i;
        }
        else if (/^http(s)?:\/\//.test(i)) {
            type = 'http';
            file = i;
        }
        else {
            Stdlog.info('Micro-ws', '未知格式，无法处理：', i);
            type = 'error';
            file = i;
        }
    }
    else {
        Stdlog.info('Micro-ws', '未知格式，无法处理：', i);
        type = 'error';
        file = i;
    }
    return { type, file };
}
async function recvMsg(id, adapter, read = false) {
    const key = `micro:recvMsg:${adapter}:${id}`;
    if (read) {
        const msg = await redis.get(key);
        return msg || 0;
    }
    await redis.incr(key);
}
async function MsgTotal(id, adapter, type = 'text', read = false) {
    const key = `micro:sendMsg:${adapter}:${id}:${type === 'text' ? 'text' : 'image'}`;
    if (read) {
        const msg = await redis.get(key);
        return msg || 0;
    }
    await redis.incr(key);
}
function limitString(str, maxLength, addDots = true) {
    if (str.length <= maxLength) {
        return str;
    }
    else {
        if (addDots) {
            return str.slice(0, maxLength) + '...';
        }
        else {
            return str.slice(0, maxLength);
        }
    }
}
var common = {
    sleep,
    array,
    makeForwardMsg,
    base64,
    uploadQQ,
    getUrls,
    init,
    message_id,
    downloadFile,
    mkdirs,
    getFile,
    recvMsg,
    MsgTotal,
    limitString
};

export { common as default };
