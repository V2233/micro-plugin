import common from '../../common/index.js';
import _ from 'lodash';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'readline';
import { join, basename } from 'path';
import { fileTypeFromBuffer } from 'file-type';
import '../../../../../config/index.js';
import { pluginInfo } from '../../../../../env.js';
import '../../../../../utils/index.js';
import Stdlog from '../../../../../utils/stdlog.js';
import Cfg from '../../../../../config/config.js';

const { uin, user_id, avatar, name } = Cfg.getConfig('protocol').stdin;
const path = join(pluginInfo.DATA_PATH, 'stdin');
if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
}
async function Stdin() {
    const version = '0.0.1';
    Bot[uin] = {
        adapter: 'stdin',
        fl: new Map(),
        gl: new Map(),
        gml: new Map(),
        tl: new Map(),
        guilds: new Map(),
        id: uin,
        uin,
        name: name,
        nickname: name,
        avatar,
        stat: { start_time: Math.round(Date.now() / 1000), recv_msg_cnt: 0 },
        version: {
            app_name: name,
            app_version: version,
            protocol_version: 'v1',
            nt_protocol: 'Terminal',
            id: uin,
            name: name,
            version: 'v' + version
        },
        apk: {
            display: name,
            version: version
        },
        makeForwardMsg: (msg) => { return { type: 'node', data: msg }; },
        pickUser: () => {
            return {
                user_id,
                nickname: name,
                sendMsg: msg => sendMsg(msg),
                recallMsg: msg_id => Stdlog.info(uin, `撤回消息：${msg_id}`),
                makeForwardMsg: (msg) => { return { type: 'node', data: msg }; },
                sendForwardMsg,
                sendFile: (file, name) => sendFile(file, name)
            };
        },
        pickFriend: () => {
            return {
                user_id,
                nickname: name,
                sendMsg: msg => sendMsg(msg),
                recallMsg: msg_id => Stdlog.info(uin, `撤回消息：${msg_id}`),
                makeForwardMsg: (msg) => { return { type: 'node', data: msg }; },
                sendForwardMsg,
                sendFile: (file, name) => sendFile(file, name)
            };
        },
        pickGroup: () => {
            return {
                user_id,
                nickname: name,
                sendMsg: msg => sendMsg(msg),
                recallMsg: msg_id => Stdlog.info(uin, `撤回消息：${msg_id}`),
                makeForwardMsg: (msg) => { return { type: 'node', data: msg }; },
                sendForwardMsg,
                sendFile: (file, name) => sendFile(file, name)
            };
        }
    };
    if (!Bot.adapter.includes(uin))
        Bot.adapter.unshift(uin);
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => { rl.close(); process.exit(); });
    rl.on('close', () => process.exit());
    rl.on('line', async (input) => {
        input = input.trim();
        Stdlog.info(`${uin}: <=`, `${input}`);
        if (!input)
            return false;
        const data = msg(input);
        Bot[uin].stat.recv_msg_cnt++;
        Bot.emit('message', data);
    });
}
async function makeBuffer(file) {
    if (Buffer.isBuffer(file))
        return file;
    if (file.match(/^base64:\/\//)) {
        return Buffer.from(file.replace(/^base64:\/\//, ''), 'base64');
    }
    else if (file.match(/^https?:\/\//)) {
        return Buffer.from(await (await fetch(file)).arrayBuffer());
    }
    else if (existsSync(file)) {
        return Buffer.from(readFileSync(file));
    }
    return file;
}
async function fileType(data) {
    let file = {
        url: '',
        buffer: Buffer.alloc(0),
        type: {
            ext: 'jpg',
            mime: 'image/jpeg'
        },
        path: ''
    };
    try {
        if (Buffer.isBuffer(data)) {
            file.url = "Buffer";
            file.buffer = data;
        }
        else {
            file.url = _.truncate(data, { length: 100 }) || "Buffer";
            file.buffer = await makeBuffer(data);
        }
        file.type = await fileTypeFromBuffer(file.buffer);
        file.path = join(path, `${Date.now()}.${file.type.ext}`);
    }
    catch (err) {
        Stdlog.error(uin, `文件类型检测错误：${logger.red(err)}`);
    }
    return file;
}
function msg(msg) {
    const time = Math.round(Date.now() / 1000);
    let e = {
        adapter: 'stdin',
        bot: Bot[uin],
        message_id: common.message_id(),
        message_type: 'private',
        post_type: 'message',
        self_id: uin,
        seq: 888,
        time,
        uin,
        user_id,
        message: [{ type: 'text', text: msg }],
        raw_message: msg,
        isMaster: true,
        toString: () => msg
    };
    e.sender = {
        sub_id: user_id,
        age: 1,
        sex: 'unknown',
        level: 100,
        area: '喵咪喵',
        card: name,
        nickname: name,
        user_id,
        title: '',
        role: 'member'
    };
    const member = {
        info: {
            user_id,
            nickname: name,
            last_sent_time: time
        },
        getAvatarUrl: () => Bot[uin].avatar
    };
    e.member = member;
    e.friend = {
        user_id,
        nickname: name,
        sendMsg: msg => sendMsg(msg),
        recallMsg: msg_id => Stdlog.info(uin, `撤回消息：${msg_id}`),
        makeForwardMsg: (msg) => { return { type: 'node', data: msg }; },
        sendForwardMsg,
        sendFile: (file, name) => sendFile(file, name)
    };
    e.recall = async (msg_id) => {
        return Stdlog.info(uin, `撤回消息：${msg_id}`);
    };
    e.reply = async (reply) => {
        return await sendMsg(reply);
    };
    try {
        common.recvMsg(e.self_id, e.adapter);
    }
    catch { }
    return e;
}
async function sendMsg(msg) {
    if (!Array.isArray(msg))
        msg = [msg];
    for (let i of msg) {
        if (typeof i != 'object') {
            i = { type: 'text', data: { text: i } };
        }
        else if (!i.data) {
            i = { type: i.type, data: { ...i, type: undefined } };
        }
        let file;
        if (i.data.file) {
            file = await fileType(i.data.file);
        }
        const symbol = uin + ': =>';
        switch (i.type) {
            case 'text':
                i.data.text = String(i.data.text).trim();
                if (!i.data.text)
                    break;
                if (i.data.text.match('\n')) {
                    i.data.text = `\n${i.data.text}`;
                }
                Stdlog.info(symbol + ' text>', `${i.data.text}`);
                break;
            case 'image':
                Stdlog.info(symbol + ' image>', `${file.url}\n文件已保存到：${logger.cyan(file.path)}`);
                writeFileSync(file.path, file.buffer);
                break;
            case 'record':
                Stdlog.info(symbol + ' record>', `${file.url}\n文件已保存到：${logger.cyan(file.path)}`);
                writeFileSync(file.path, file.buffer);
                break;
            case 'video':
                Stdlog.info(symbol + ' video>', `${file.url}\n文件已保存到：${logger.cyan(file.path)}`);
                writeFileSync(file.path, file.buffer);
                break;
            case 'reply':
                break;
            case 'at':
                break;
            case 'node':
                sendForwardMsg(i.data);
                break;
            default:
                if (!Array.isArray(i?.data) || Object.keys(i.data).length === 0)
                    break;
                i = JSON.stringify(i);
                if (i.match('\n'))
                    i = `\n${i}`;
                Stdlog.info(symbol, `${i}`);
        }
    }
    try {
        await common.MsgTotal(this.id, 'stdin');
    }
    catch { }
    return { message_id: common.message_id() };
}
async function sendFile(file, name = basename(file)) {
    const buffer = await makeBuffer(file);
    if (!Buffer.isBuffer(buffer)) {
        Stdlog.error(uin, `发送文件错误：找不到文件 ${logger.red(file)}`);
        return false;
    }
    const files = `${path}${Date.now()}-${name}`;
    Stdlog.info(uin, `发送文件：${file}\n文件已保存到：${logger.cyan(files)}`);
    return writeFileSync(files, buffer);
}
function sendForwardMsg(msg) {
    const messages = [];
    for (const { message } of msg) {
        messages.push(sendMsg(message));
    }
    return { data: messages };
}
Stdlog.info('Micro-Std', '标准输入输出加载完毕，如需关闭此项，请输入【小微关闭std】后重启');

export { Stdin as default };
