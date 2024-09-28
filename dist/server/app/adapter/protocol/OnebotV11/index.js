import path from 'node:path';
import { randomUUID } from 'crypto';
import '../../../../../utils/index.js';
import { botInfo } from '../../../../../env.js';
import { pokeMap, faceMap } from '../../common/face.js';
import BotAPI from '../tools.js';
import Stdlog from '../../../../../utils/stdlog.js';

class OnebotV11 {
    bot;
    id;
    name;
    path;
    echo;
    timeout;
    constructor(bot, req) {
        this.bot = bot;
        this.id = "114514";
        if (req)
            this.id = req.headers['x-self-id'] ?? '';
        this.name = "OneBotv11";
        this.path = this.name;
        this.echo = {};
        this.timeout = 60000;
        bot.on('message', async (data) => {
            await this.message(data, bot);
        });
        bot.on('error', async (error) => Stdlog.error('', error));
        bot.on('close', () => Stdlog.info('Onebotv11', `${this.id} 连接已断开!`));
        Stdlog.info('Onebotv11', '载入成功！');
    }
    makeLog(msg) {
        return BotAPI.String(msg).replace(/base64:\/\/.*?(,|]|")/g, "base64://...$1");
    }
    sendApi(data, ws, action, params = {}) {
        const echo = randomUUID();
        const request = { action, params, echo };
        ws.send(JSON.stringify(request));
        return new Promise((resolve, reject) => this.echo[echo] = {
            request, resolve, reject,
            timeout: setTimeout(() => {
                reject(Object.assign(request, { timeout: this.timeout }));
                delete this.echo[echo];
                Stdlog.error(data.self_id, "请求超时", request);
                ws.terminate();
            }, this.timeout),
        });
    }
    async getReceivedMsg(message_id) {
        const msg = (await Bot[this.id].sendApi("get_msg", { message_id })).data;
        return msg;
    }
    async getMsg(data, message_id) {
        const msg = (await data.bot.sendApi("get_msg", { message_id })).data;
        if (msg?.message)
            msg.message = (await this.parseMsg(msg.message, data)).message;
        return msg;
    }
    async source(i, data) {
        const msg_id = i.data.id;
        if (!msg_id)
            return false;
        let source;
        try {
            let retryCount = 0;
            while (retryCount < 2) {
                source = await this.getReceivedMsg(msg_id);
                if (typeof source === 'string') {
                    Stdlog.error(this.id, `获取引用消息内容失败，正在重试：第 ${retryCount} 次`);
                    retryCount++;
                }
                else {
                    break;
                }
            }
            if (typeof source === 'string') {
                Stdlog.error(this.id, '获取引用消息内容失败，重试次数上限，已终止');
                return false;
            }
            Stdlog.debug('', source);
            let { message, raw_message } = await this.parseMsg(source.message, data, false);
            source = {
                ...source,
                time: source.message_id,
                seq: source.message_id,
                user_id: source.sender.user_id,
                message: message,
                raw_message
            };
            return source;
        }
        catch (error) {
            Stdlog.error('', error);
            return false;
        }
    }
    async makeFile(file) {
        file = await BotAPI.Buffer(file, { http: true });
        if (Buffer.isBuffer(file))
            file = `base64://${file.toString("base64")}`;
        return file;
    }
    async makeMsg(msg) {
        if (!Array.isArray(msg))
            msg = [msg];
        const msgs = [];
        const forward = [];
        for (let i of msg) {
            if (typeof i !== "object") {
                i = { type: "text", data: { text: i } };
            }
            else if (!i.data) {
                i = { type: i.type, data: { ...i, type: undefined } };
            }
            switch (i.type) {
                case "at":
                    i.data.qq = String(i.data.qq);
                    break;
                case "face":
                    i.data.id = String(i.data.id);
                    break;
                case "poke":
                    i.data.id = String(i.data.id ? i.data.id : i.data.qq);
                    break;
                case "dice":
                    i.data.id = String(i.data.id);
                    break;
                case 'new_dice':
                    i.data.id = String(i.data.id);
                    break;
                case "rps":
                    i.data.id = String(i.data.id);
                    break;
                case "reply":
                    i.data.id = String(i.data.id);
                    break;
                case "button":
                    console.log(i);
                    break;
                case "node":
                    forward.push(...i.data);
                    continue;
                case "raw":
                    i = i.data;
                    break;
            }
            if (i.data.file)
                i.data.file = await this.makeFile(i.data.file);
            msgs.push(i);
        }
        return [msgs, forward];
    }
    async sendMsg(msg, send, sendForwardMsg) {
        const [message, forward] = await this.makeMsg(msg);
        const ret = [];
        if (forward.length) {
            const data = await sendForwardMsg(forward);
            if (Array.isArray(data))
                ret.push(...data);
            else
                ret.push(data);
        }
        if (message.length)
            ret.push(await send(message));
        if (ret.length === 1)
            return ret[0];
        const message_id = [];
        for (const i of ret)
            if (i?.message_id)
                message_id.push(i.message_id);
        return { data: ret, message_id };
    }
    sendFriendMsg(data, msg) {
        return this.sendMsg(msg, message => {
            Stdlog.info(`${data.self_id} => ${data.user_id}`, `发送好友消息：${this.makeLog(message)}`);
            data.bot.sendApi("send_msg", {
                user_id: data.user_id,
                message,
            });
        }, msg => this.sendFriendForwardMsg(data, msg));
    }
    sendGroupMsg(data, msg) {
        return this.sendMsg(msg, message => {
            Stdlog.info(`${data.self_id} => ${data.group_id}`, `发送群消息：${this.makeLog(message)}`);
            return data.bot.sendApi("send_msg", {
                group_id: data.group_id,
                message,
            });
        }, msg => this.sendGroupForwardMsg(data, msg));
    }
    sendGuildMsg(data, msg) {
        return this.sendMsg(msg, message => {
            Stdlog.info(`${data.self_id}] => ${data.guild_id}-${data.channel_id}`, `发送频道消息：${this.makeLog(message)}`);
            return data.bot.sendApi("send_guild_channel_msg", {
                guild_id: data.guild_id,
                channel_id: data.channel_id,
                message,
            });
        }, msg => Bot.sendForwardMsg ? Bot.sendForwardMsg(msg => this.sendGuildMsg(data, msg), msg) : BotAPI.sendForwardMsg(msg => this.sendGuildMsg(data, msg), msg));
    }
    async recallMsg(data, message_id) {
        Stdlog.info(data.self_id, `撤回消息：${message_id}`);
        if (!Array.isArray(message_id))
            message_id = [message_id];
        const msgs = [];
        for (const i of message_id)
            msgs.push(await data.bot.sendApi("delete_msg", { message_id: i }));
        return msgs;
    }
    async parseMsg(msg, data, parseReply = true) {
        let file;
        let source;
        let message = [];
        let ToString_arr = [];
        let log_message_arr = [];
        let raw_message_arr = [];
        for (let i of Array.isArray(msg) ? msg : [msg]) {
            switch (i.type) {
                case 'at':
                    message.push({ type: 'at', ...i.data });
                    try {
                        let qq = i.data.qq;
                        ToString_arr.push(`{at:${qq}}`);
                        let groupMemberList = data.group_id ? (Bot[this.id].gml.get(data.group_id)?.get(qq)) : (Bot[this.id].gl.get(data.user_id)?.get(qq));
                        let at = groupMemberList?.nickname || groupMemberList?.card || qq;
                        raw_message_arr.push(`@${at}`);
                        log_message_arr.push(at == qq ? `@${qq}` : `<@${at}:${qq}>`);
                    }
                    catch (err) {
                        raw_message_arr.push(`@${i.data.qq}`);
                        log_message_arr.push(`@${i.data.qq}`);
                    }
                    break;
                case 'text':
                    message.push({ type: 'text', text: i.data.text });
                    raw_message_arr.push(i.data.text);
                    log_message_arr.push(i.data.text);
                    ToString_arr.push(i.data.text);
                    break;
                case 'face':
                    message.push({ type: 'face', ...i.data });
                    raw_message_arr.push(`[${faceMap[Number(i.data.id)] || '动画表情'}]`);
                    log_message_arr.push(`<${faceMap[Number(i.data.id)] || `动画表情:${i.data.id}`}>`);
                    ToString_arr.push(`{face:${i.data.id}}`);
                    break;
                case 'reply':
                    if (parseReply)
                        source = await this.source(i, data);
                    if (source && data.group_id) {
                        let qq = Number(source.sender.user_id);
                        let text = source.sender.nickname;
                        message.unshift({ type: 'at', qq, text });
                        raw_message_arr.unshift(`@${text}`);
                        log_message_arr.unshift(`<回复:${text}(${qq})>`);
                    }
                    break;
                case 'image':
                    message.push({ ...i.data, type: 'image' });
                    raw_message_arr.push('[图片]');
                    log_message_arr.push(`<图片:${i.data?.url || i.data.file}>`);
                    ToString_arr.push(`{image:${i.data.file}}`);
                    break;
                case 'record':
                    message.push({ type: 'record', ...i.data });
                    raw_message_arr.push('[语音]');
                    log_message_arr.push(`<语音:${i.data?.url || i.data.file}>`);
                    ToString_arr.push(`{record:${i.data.file}}`);
                    break;
                case 'video':
                    message.push({ type: 'video', ...i.data });
                    raw_message_arr.push('[视频]');
                    log_message_arr.push(`<视频:${i.data?.url || i.data.file}>`);
                    ToString_arr.push(`{video:${i.data.file}}`);
                    break;
                case 'file':
                    file = { ...i.data, fid: i.data.id };
                    message.push({ type: 'file', ...i.data, fid: i.data.id });
                    raw_message_arr.push('[文件]');
                    log_message_arr.push(`<视频:${i.data?.url || i.data.file}>`);
                    ToString_arr.push(`{file:${i.data.id}}`);
                    redis.set(i.data.id, JSON.stringify(i.data));
                    break;
                case 'forward':
                    message.push({ type: 'node', ...i.data });
                    raw_message_arr.push('[转发消息]');
                    log_message_arr.push(`<转发消息:${JSON.stringify(i.data)}>`);
                    ToString_arr.push(`{forward:${i.data.id}}`);
                    break;
                case 'json':
                    message.push({ type: 'json', ...i.data });
                    raw_message_arr.push('[json消息]');
                    log_message_arr.push(`<json消息:${i.data.data}>`);
                    ToString_arr.push(i.data.data);
                    break;
                case 'xml':
                    message.push({ type: 'xml', ...i.data });
                    raw_message_arr.push('[xml消息]');
                    log_message_arr.push(`<xml消息:${i.data}>`);
                    ToString_arr.push(i.data.data);
                    break;
                case 'basketball':
                    message.push({ type: 'basketball', ...i.data });
                    raw_message_arr.push('[篮球]');
                    log_message_arr.push(`<篮球:${i.data.id}>`);
                    ToString_arr.push(`{basketball:${i.data.id}}`);
                    break;
                case 'new_rps':
                    message.push({ type: 'new_rps', ...i.data });
                    raw_message_arr.push('[猜拳]');
                    log_message_arr.push(`<猜拳:${i.data.id}>`);
                    ToString_arr.push(`{new_rps:${i.data.id}}`);
                    break;
                case 'new_dice':
                    message.push({ type: 'new_dice', ...i.data });
                    raw_message_arr.push('[骰子]');
                    log_message_arr.push(`<骰子:${i.data.id}>`);
                    ToString_arr.push(`{new_dice:${i.data.id}}`);
                    break;
                case 'dice':
                    message.push({ type: 'dice', ...i.data });
                    raw_message_arr.push('[骰子]');
                    log_message_arr.push(`<骰子:${i.data.id}>`);
                    ToString_arr.push(`{dice:${i.data}}`);
                    break;
                case 'rps':
                    message.push({ type: 'rps', ...i.data });
                    raw_message_arr.push('[剪刀石头布]');
                    log_message_arr.push(`<剪刀石头布:${i.data.id}>`);
                    ToString_arr.push(`{rps:${i.data}}`);
                    break;
                case 'poke':
                    message.push({ type: 'poke', ...i.data });
                    raw_message_arr.push(`[${pokeMap[Number(i.data.id)]}]`);
                    log_message_arr.push(`<${pokeMap[Number(i.data.id)]}>`);
                    ToString_arr.push(`{poke:${i.data.id}}`);
                    break;
                case 'touch':
                    message.push({ type: 'touch', ...i.data });
                    raw_message_arr.push('[双击头像]');
                    log_message_arr.push(`<<双击头像:${i.data.id}>`);
                    ToString_arr.push(`{touch:${i.data.id}}`);
                    break;
                case 'music':
                    message.push({ type: 'music', ...i.data });
                    raw_message_arr.push('[音乐]');
                    log_message_arr.push(`<音乐:${i.data.id}>`);
                    ToString_arr.push(`{music:${i.data.id}}`);
                    break;
                case 'custom':
                    message.push({ type: 'custom', ...i.data });
                    raw_message_arr.push('[自定义音乐]');
                    log_message_arr.push(`<自定义音乐:${i.data.url}>`);
                    ToString_arr.push(`{custom:${i.data.url}}`);
                    break;
                case 'weather':
                    message.push({ type: 'weather', ...i.data });
                    raw_message_arr.push('[天气]');
                    log_message_arr.push(`<天气:${i.data.city}>`);
                    ToString_arr.push(`{weather:${i.data.city}}`);
                    break;
                case 'location':
                    message.push({ type: 'location', ...i.data });
                    raw_message_arr.push('[位置分享]');
                    log_message_arr.push(`<位置分享:${i.data.lat}-${i.data.lon}>`);
                    ToString_arr.push(`{location:${i.data.lat}-${i.data.lon}}`);
                    break;
                case 'share':
                    message.push({ type: 'share', ...i.data });
                    raw_message_arr.push('[链接分享]');
                    log_message_arr.push(`<<链接分享:${i.data.url}>`);
                    ToString_arr.push(`{share:${i.data.url}}`);
                    break;
                case 'gift':
                    message.push({ type: 'gift', ...i.data });
                    raw_message_arr.push('[礼物]');
                    log_message_arr.push(`<礼物:${i.data.id}>`);
                    ToString_arr.push(`{gift:${i.data.id}}`);
                    break;
                case 'markdown':
                    message.push({ type: 'markdown', ...i.data });
                    raw_message_arr.push('[markdown]');
                    log_message_arr.push(`<markdown:${i.data}>`);
                    ToString_arr.push(`{markdown:${i.data}}`);
                    break;
                case 'button':
                    message.push({ type: 'button', ...i.data });
                    raw_message_arr.push('[button]');
                    log_message_arr.push(`<button:${i.data}>`);
                    ToString_arr.push(`{button:${i.data}}`);
                    break;
                case 'keyboard':
                    message.push({ type: 'keyboard', ...i.data });
                    raw_message_arr.push('[keyboard]');
                    log_message_arr.push(`<keyboard:${i.data}>`);
                    ToString_arr.push(`{keyboard:${i.data}}`);
                    break;
                default:
                    message.push({ type: i.type, ...i.data });
                    i = JSON.stringify(i);
                    raw_message_arr.push(i);
                    log_message_arr.push(i);
                    ToString_arr.push(i);
                    break;
            }
        }
        const ToString = ToString_arr.join('').trim();
        const raw_message = raw_message_arr.join('').trim();
        const log_message = log_message_arr.join(' ').trim();
        return { message, ToString, raw_message, log_message, source, file };
    }
    async getGroupMsgHistory(data, message_seq, count) {
        const msgs = (await data.bot.sendApi("get_group_msg_history", {
            group_id: data.group_id,
            message_seq,
            message_id: message_seq,
            count,
        })).data?.messages;
        for (const i of Array.isArray(msgs) ? msgs : [msgs]) {
            if (i?.message)
                i.message = (await this.parseMsg(i.message, data, false)).message;
            if (!i?.group_name)
                i.group_name = data?.group_name || data?.group_id;
        }
        return msgs;
    }
    async getFriendMsgHistory(data, message_seq, count) {
        const msgs = (await data.bot.sendApi("get_group_msg_history", {
            user_id: data.user_id,
            message_seq,
            message_id: message_seq,
            count,
        })).data?.messages;
        for (const i of Array.isArray(msgs) ? msgs : [msgs]) {
            if (i?.message)
                i.message = (await this.parseMsg(i.message, data, false)).message;
        }
        return msgs;
    }
    async getForwardMsg(data, message_id) {
        const msgs = (await data.bot.sendApi("get_forward_msg", {
            message_id,
            id: message_id
        })).data?.messages;
        for (const i of Array.isArray(msgs) ? msgs : [msgs])
            if (i?.message)
                i.message = (await this.parseMsg(i.message || i.content, data)).message;
        return msgs;
    }
    async makeForwardMsg(msg) {
        const msgs = [];
        for (const i of msg) {
            const [content, forward] = await this.makeMsg(i.message);
            if (forward.length)
                msgs.push(...await this.makeForwardMsg(forward));
            if (content.length)
                msgs.push({
                    type: "node", data: {
                        name: i.nickname || "匿名消息",
                        uin: String(Number(i.user_id) || 80000000),
                        content,
                        time: i.time,
                    }
                });
        }
        return msgs;
    }
    async sendFriendForwardMsg(data, msg) {
        Stdlog.info(`${data.self_id} => ${data.user_id}`, `发送好友转发消息：${this.makeLog(msg)}`);
        return data.bot.sendApi("send_private_forward_msg", {
            user_id: data.user_id,
            messages: await this.makeForwardMsg(msg),
        });
    }
    async sendGroupForwardMsg(data, msg) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `发送群转发消息：${this.makeLog(msg)}`);
        return data.bot.sendApi("send_group_forward_msg", {
            group_id: data.group_id,
            messages: await this.makeForwardMsg(msg),
        });
    }
    async getFriendArray(data) {
        return (await data.bot.sendApi("get_friend_list")).data || [];
    }
    async getFriendList(data) {
        const array = [];
        for (const { user_id } of await this.getFriendArray(data))
            array.push(user_id);
        return array;
    }
    async getFriendMap(data) {
        const map = new Map;
        for (const i of await this.getFriendArray(data))
            map.set(i.user_id, i);
        data.bot.fl = map;
        return map;
    }
    getFriendInfo(data) {
        return data.bot.sendApi("get_stranger_info", {
            user_id: data.user_id,
        });
    }
    async getGroupArray(data) {
        const array = (await data.bot.sendApi("get_group_list")).data;
        try {
            for (const guild of await this.getGuildArray(data))
                for (const channel of await this.getGuildChannelArray({
                    ...data,
                    guild_id: guild.guild_id,
                }))
                    array.push({
                        guild,
                        channel,
                        group_id: `${guild.guild_id}-${channel.channel_id}`,
                        group_name: `${guild.guild_name}-${channel.channel_name}`,
                    });
        }
        catch (err) {
        }
        return array;
    }
    async getGroupList(data) {
        const array = [];
        for (const { group_id } of await this.getGroupArray(data))
            array.push(group_id);
        return array;
    }
    async getGroupMap(data) {
        const map = new Map;
        for (const i of await this.getGroupArray(data))
            map.set(i.group_id, i);
        data.bot.gl = map;
        return map;
    }
    getGroupInfo(data) {
        return data.bot.sendApi("get_group_info", {
            group_id: data.group_id
        });
    }
    async getMemberArray(data) {
        return (await data.bot.sendApi("get_group_member_list", {
            group_id: data.group_id,
        })).data || [];
    }
    async getMemberList(data) {
        const array = [];
        for (const { user_id } of await this.getMemberArray(data))
            array.push(user_id);
        return array;
    }
    async getMemberMap(data) {
        const map = new Map;
        for (const i of await this.getMemberArray(data))
            map.set(i.user_id, i);
        data.bot.gml.set(data.group_id, map);
        return map;
    }
    async getGroupMemberMap(data) {
        for (const [group_id, group] of await this.getGroupMap(data)) {
            if (group.guild)
                continue;
            await this.getMemberMap({ ...data, group_id });
        }
    }
    getMemberInfo(data) {
        return data.bot.sendApi("get_group_member_info", {
            group_id: data.group_id,
            user_id: data.user_id,
        });
    }
    async getGuildArray(data) {
        return (await data.bot.sendApi("get_guild_list")).data || [];
    }
    getGuildInfo(data) {
        return data.bot.sendApi("get_guild_meta_by_guest", {
            guild_id: data.guild_id,
        });
    }
    async getGuildChannelArray(data) {
        return (await data.bot.sendApi("get_guild_channel_list", {
            guild_id: data.guild_id,
        })).data || [];
    }
    async getGuildChannelMap(data) {
        const map = new Map;
        for (const i of await this.getGuildChannelArray(data))
            map.set(i.channel_id, i);
        return map;
    }
    async getGuildMemberArray(data) {
        const array = [];
        let next_token = "";
        while (true) {
            const list = (await data.bot.sendApi("get_guild_member_list", {
                guild_id: data.guild_id,
                next_token,
            })).data;
            if (!list)
                break;
            for (const i of list.members)
                array.push({
                    ...i,
                    user_id: i.tiny_id,
                });
            if (list.finished)
                break;
            next_token = list.next_token;
        }
        return array;
    }
    async getGuildMemberList(data) {
        const array = [];
        for (const { user_id } of await this.getGuildMemberArray(data))
            array.push(user_id);
        return array.push;
    }
    async getGuildMemberMap(data) {
        const map = new Map;
        for (const i of await this.getGuildMemberArray(data))
            map.set(i.user_id, i);
        data.bot.gml.set(data.group_id, map);
        return map;
    }
    getGuildMemberInfo(data) {
        return data.bot.sendApi("get_guild_member_profile", {
            guild_id: data.guild_id,
            user_id: data.user_id,
        });
    }
    setProfile(data, profile) {
        Stdlog.info(data.self_id, `设置资料：${BotAPI.String(profile)}`);
        return data.bot.sendApi("set_qq_profile", profile);
    }
    async setAvatar(data, file) {
        Stdlog.info(data.self_id, `设置头像：${file}`);
        return data.bot.sendApi("set_qq_avatar", {
            file: await this.makeFile(file),
        });
    }
    sendLike(data, times) {
        Stdlog.info(`${data.self_id} => ${data.user_id}`, `点赞：${times}次`);
        return data.bot.sendApi("send_like", {
            user_id: data.user_id,
            times,
        });
    }
    setGroupName(data, group_name) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `设置群名：${group_name}`);
        return data.bot.sendApi("set_group_name", {
            group_id: data.group_id,
            group_name,
        });
    }
    async setGroupAvatar(data, file) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `设置群头像：${file}`);
        return data.bot.sendApi("set_group_portrait", {
            group_id: data.group_id,
            file: await this.makeFile(file),
        });
    }
    setGroupAdmin(data, user_id, enable) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `${enable ? "设置" : "取消"}群管理员：${user_id}`);
        return data.bot.sendApi("set_group_admin", {
            group_id: data.group_id,
            user_id,
            enable,
        });
    }
    setGroupCard(data, user_id, card) {
        Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `设置群名片：${card}`);
        return data.bot.sendApi("set_group_card", {
            group_id: data.group_id,
            user_id,
            card,
        });
    }
    setGroupTitle(data, user_id, special_title, duration) {
        Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `设置群头衔：${special_title} ${duration}`);
        return data.bot.sendApi("set_group_special_title", {
            group_id: data.group_id,
            user_id,
            special_title,
            duration,
        });
    }
    sendGroupSign(data) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, "群打卡");
        return data.bot.sendApi("send_group_sign", {
            group_id: data.group_id,
        });
    }
    setGroupBan(data, user_id, duration) {
        Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `禁言群成员：${duration}秒`);
        return data.bot.sendApi("set_group_ban", {
            group_id: data.group_id,
            user_id,
            duration,
        });
    }
    setGroupWholeKick(data, enable) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `${enable ? "开启" : "关闭"}全员禁言`);
        return data.bot.sendApi("set_group_whole_ban", {
            group_id: data.group_id,
            enable,
        });
    }
    setGroupKick(data, user_id, reject_add_request) {
        Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `踢出群成员${reject_add_request ? "拒绝再次加群" : ""}`);
        return data.bot.sendApi("set_group_kick", {
            group_id: data.group_id,
            user_id,
            reject_add_request,
        });
    }
    setGroupLeave(data, is_dismiss) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, is_dismiss ? "解散" : "退群");
        return data.bot.sendApi("set_group_leave", {
            group_id: data.group_id,
            is_dismiss,
        });
    }
    downloadFile(data, url, thread_count, headers) {
        return data.bot.sendApi("download_file", {
            url,
            thread_count,
            headers,
        });
    }
    async sendFriendFile(data, file, name = path.basename(file.slice(0, 16))) {
        Stdlog.info(`${data.self_id} => ${data.user_id}`, `发送好友文件：${name}(${file})`);
        return data.bot.sendApi("upload_private_file", {
            user_id: data.user_id,
            file: await this.makeFile(file),
            name,
        });
    }
    async sendGroupFile(data, file, folder, name = path.basename(file.slice(0, 16))) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `发送群文件：${folder || ""}/${name}(${file})`);
        return data.bot.sendApi("upload_group_file", {
            group_id: data.group_id,
            folder,
            file: await this.makeFile(file),
            name,
        });
    }
    deleteGroupFile(data, file_id, busid) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `删除群文件：${file_id}(${busid})`);
        return data.bot.sendApi("delete_group_file", {
            group_id: data.group_id,
            file_id,
            busid,
        });
    }
    createGroupFileFolder(data, name) {
        Stdlog.info(`${data.self_id} => ${data.group_id}`, `创建群文件夹：${name}`);
        return data.bot.sendApi("create_group_file_folder", {
            group_id: data.group_id,
            name,
        });
    }
    getGroupFileSystemInfo(data) {
        return data.bot.sendApi("get_group_file_system_info", {
            group_id: data.group_id,
        });
    }
    getGroupFiles(data, folder_id) {
        if (folder_id)
            return data.bot.sendApi("get_group_files_by_folder", {
                group_id: data.group_id,
                folder_id,
            });
        return data.bot.sendApi("get_group_root_files", {
            group_id: data.group_id,
        });
    }
    getGroupFileUrl(data, file_id, busid) {
        return data.bot.sendApi("get_group_file_url", {
            group_id: data.group_id,
            file_id,
            busid,
        });
    }
    getGroupFs(data) {
        return {
            upload: (file, folder, name) => this.sendGroupFile(data, file, folder, name),
            rm: (file_id, busid) => this.deleteGroupFile(data, file_id, busid),
            mkdir: name => this.createGroupFileFolder(data, name),
            df: () => this.getGroupFileSystemInfo(data),
            ls: folder_id => this.getGroupFiles(data, folder_id),
            download: (file_id, busid) => this.getGroupFileUrl(data, file_id, busid),
        };
    }
    setFriendAddRequest(data, flag, approve, remark) {
        return data.bot.sendApi("set_friend_add_request", {
            flag,
            approve,
            remark,
        });
    }
    setGroupAddRequest(data, flag, sub_type, approve, reason) {
        return data.bot.sendApi("set_group_add_request", {
            flag,
            sub_type,
            approve,
            reason,
        });
    }
    pickFriend(data, user_id) {
        const i = {
            ...data.bot.fl.get(user_id),
            ...data,
            user_id,
        };
        return {
            ...i,
            sendMsg: msg => this.sendFriendMsg(i, msg),
            getMsg: message_id => this.getMsg(i, message_id),
            recallMsg: message_id => this.recallMsg(i, message_id),
            getForwardMsg: message_id => this.getForwardMsg(i, message_id),
            getChatHistory: (seq, cnt) => this.getFriendMsgHistory(i, seq, cnt),
            sendForwardMsg: msg => this.sendFriendForwardMsg(i, msg),
            sendFile: (file, name) => this.sendFriendFile(i, file, name),
            getInfo: () => this.getFriendInfo(i),
            getAvatarUrl: () => i.avatar || `https://q.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
            thumbUp: times => this.sendLike(i, times),
        };
    }
    pickMember(data, group_id, user_id) {
        if (typeof group_id === "string" && group_id.match("-")) {
            const guild_id = group_id.split("-");
            const i = {
                ...data,
                guild_id: guild_id[0],
                channel_id: guild_id[1],
                user_id,
            };
            return {
                ...this.pickGroup(i, group_id),
                ...i,
                getInfo: () => this.getGuildMemberInfo(i),
                getAvatarUrl: async () => (await this.getGuildMemberInfo(i)).avatar_url,
            };
        }
        const i = {
            ...data.bot.fl.get(user_id),
            ...data.bot.gml.get(group_id)?.get(user_id),
            ...data,
            group_id,
            user_id,
        };
        return {
            ...this.pickFriend(i, user_id),
            ...i,
            getInfo: () => this.getMemberInfo(i),
            getAvatarUrl: () => i.avatar || `https://q.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
            poke: () => this.sendGroupMsg(i, { type: "poke", qq: user_id, id: String(user_id) }),
            mute: duration => this.setGroupBan(i, i.user_id, duration),
            kick: reject_add_request => this.setGroupKick(i, i.user_id, reject_add_request),
            get is_friend() { return data.bot.fl.has(user_id); },
            get is_owner() { return i.role === "owner"; },
            get is_admin() { return i.role === "admin"; },
        };
    }
    pickGroup(data, group_id) {
        if (typeof group_id === "string" && group_id.match("-")) {
            const guild_id = group_id.split("-");
            const i = {
                ...data.bot.gl.get(group_id),
                ...data,
                guild_id: guild_id[0],
                channel_id: guild_id[1],
            };
            return {
                ...i,
                sendMsg: msg => this.sendGuildMsg(i, msg),
                getMsg: message_id => this.getMsg(i, message_id),
                recallMsg: message_id => this.recallMsg(i, message_id),
                getForwardMsg: message_id => this.getForwardMsg(i, message_id),
                getInfo: () => this.getGuildInfo(i),
                getChannelArray: () => this.getGuildChannelArray(i),
                getChannelList: () => this.getGuildChannelMap(i),
                getChannelMap: () => this.getGuildChannelMap(i),
                getMemberArray: () => this.getGuildMemberArray(i),
                getMemberList: () => this.getGuildMemberList(i),
                getMemberMap: () => this.getGuildMemberMap(i),
                pickMember: user_id => this.pickMember(i, group_id, user_id),
            };
        }
        const i = {
            ...data.bot.gl.get(group_id),
            ...data,
            group_id,
        };
        return {
            ...i,
            sendMsg: msg => this.sendGroupMsg(i, msg),
            getMsg: message_id => this.getMsg(i, message_id),
            recallMsg: message_id => this.recallMsg(i, message_id),
            getForwardMsg: message_id => this.getForwardMsg(i, message_id),
            sendForwardMsg: msg => this.sendGroupForwardMsg(i, msg),
            sendFile: (file, name) => this.sendGroupFile(i, file, undefined, name),
            getInfo: () => this.getGroupInfo(i),
            getAvatarUrl: () => i.avatar || `https://p.qlogo.cn/gh/${group_id}/${group_id}/0`,
            getChatHistory: (seq, cnt) => this.getGroupMsgHistory(i, seq, cnt),
            getMemberArray: () => this.getMemberArray(i),
            getMemberList: () => this.getMemberList(i),
            getMemberMap: () => this.getMemberMap(i),
            pickMember: user_id => this.pickMember(i, group_id, user_id),
            pokeMember: qq => this.sendGroupMsg(i, { type: "poke", qq }),
            setName: group_name => this.setGroupName(i, group_name),
            setAvatar: file => this.setGroupAvatar(i, file),
            setAdmin: (user_id, enable) => this.setGroupAdmin(i, user_id, enable),
            setCard: (user_id, card) => this.setGroupCard(i, user_id, card),
            setTitle: (user_id, special_title, duration) => this.setGroupTitle(i, user_id, special_title, duration),
            sign: () => this.sendGroupSign(i),
            muteMember: (user_id, duration) => this.setGroupBan(i, user_id, duration),
            muteAll: enable => this.setGroupWholeKick(i, enable),
            kickMember: (user_id, reject_add_request) => this.setGroupKick(i, user_id, reject_add_request),
            quit: is_dismiss => this.setGroupLeave(i, is_dismiss),
            fs: this.getGroupFs(i),
            get is_owner() { return data.bot.gml.get(group_id)?.get(data.self_id)?.role === "owner"; },
            get is_admin() { return data.bot.gml.get(group_id)?.get(data.self_id)?.role === "admin"; },
        };
    }
    async connect(data, ws) {
        if (!data.self_id)
            Stdlog.warn('Onebotv11', '未找到self_id!');
        Bot[data.self_id] = {
            adapter: this.name,
            ws: ws,
            sendApi: (action, params) => this.sendApi(data, ws, action, params),
            stat: {
                start_time: data.time,
                stat: {},
                get lost_pkt_cnt() { return this.stat.packet_lost; },
                get lost_times() { return this.stat.lost_times; },
                get recv_msg_cnt() { return this.stat.message_received; },
                get recv_pkt_cnt() { return this.stat.packet_received; },
                get sent_msg_cnt() { return this.stat.message_sent; },
                get sent_pkt_cnt() { return this.stat.packet_sent; },
            },
            model: botInfo.BOT_NAME,
            info: {
                user_id: data.self_id,
                nickname: data.nickname
            },
            self_id: data.self_id,
            uin: data.self_id,
            get nickname() { return this.info.nickname ?? data.self_id; },
            get avatar() { return `https://q.qlogo.cn/g?b=qq&s=0&nk=${this.uin}`; },
            setProfile: profile => this.setProfile(data, profile),
            setNickname: nickname => this.setProfile(data, { nickname }),
            setAvatar: file => this.setAvatar(data, file),
            pickFriend: user_id => this.pickFriend(data, user_id),
            sendPrivateMsg: (user_id, msg) => this.pickFriend(data, user_id).sendMsg(msg),
            get pickUser() { return this.pickFriend; },
            getFriendArray: () => this.getFriendArray(data),
            getFriendList: () => this.getFriendList(data),
            getFriendMap: () => this.getFriendMap(data),
            fl: new Map,
            pickMember: (group_id, user_id) => this.pickMember(data, group_id, user_id),
            pickGroup: group_id => this.pickGroup(data, group_id),
            sendGroupMsg: (group_id, msg) => this.pickGroup(data, group_id).sendMsg(msg),
            getGroupArray: () => this.getGroupArray(data),
            getGroupList: () => this.getGroupList(data),
            getGroupMap: () => this.getGroupMap(data),
            getGroupMemberMap: () => this.getGroupMemberMap(data),
            gl: new Map,
            gml: new Map,
            request_list: [],
            getSystemMsg: () => data.bot.request_list,
            makeForwardMsg: msg => this.makeForwardMsg(msg),
            setFriendAddRequest: (flag, approve, remark) => this.setFriendAddRequest(data, flag, approve, remark),
            setGroupAddRequest: (flag, sub_type, approve, reason) => this.setGroupAddRequest(data, flag, sub_type, approve, reason),
        };
        data.bot = Bot[data.self_id];
        if (!Bot.adapter?.includes(data.self_id))
            Bot.adapter.push(data.self_id);
        data.bot.sendApi("_set_model_show", {
            model: data.bot.model,
            model_show: data.bot.model,
        }).catch(() => { });
        data.bot.info = (await data.bot.sendApi("get_login_info").catch(i => i.error)).data;
        data.bot.guild_info = (await data.bot.sendApi("get_guild_service_profile").catch(i => i.error)).data;
        data.bot.clients = (await data.bot.sendApi("get_online_clients").catch(i => i.error)).clients;
        data.bot.version = {
            ...(await data.bot.sendApi("get_version_info").catch(i => i.error)).data,
            id: this.id,
            name: this.name,
            get version() {
                return this.app_full_name || `${this.app_name} v${this.app_version}`;
            },
        };
        data.bot.getFriendMap();
        data.bot.getGroupMemberMap();
        Stdlog.mark(data.self_id, `${this.name}(${this.id}) ${data.bot.version.version} 连接成功，协议通过，执行消息处理...`);
        BotAPI.$emit(`connect.${data.self_id}`, data);
        BotAPI.$emit("system.online", data.bot);
    }
    async sendReplyMsg(data, msg, quote, option) {
        if (typeof msg == 'string') {
            msg = [{ type: 'text', data: { text: msg } }];
        }
        if (option?.at) {
            msg.unshift({ type: 'at', data: { qq: String(data.user_id) } });
        }
        if (quote) {
            msg.unshift({ type: 'reply', data: { id: String(data.message_id) } });
        }
        if (data.group_id)
            return await data.bot.sendGroupMsg(data.group_id, msg);
        return await data.bot.sendPrivateMsg(data.user_id, msg);
    }
    async makeMessage(data) {
        const { message, ToString, log_message, source, file } = await this.parseMsg(data.message, data);
        data.message = message;
        data.uin = this.id;
        data.log_message = log_message;
        data.toString = () => ToString;
        if (!data.reply)
            data.reply = async (msg, quote, option) => await this.sendReplyMsg(data, msg, quote, option);
        if (!data.getAvatarUrl)
            data.getAvatarUrl = (size = 0) => data.avatar || `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${data.user_id}`;
        if (!data.recall)
            data.recall = async () => await this.recallMsg(data, data.message_id);
        if (file)
            data.file = file;
        if (source)
            data.source = source;
        switch (data.message_type) {
            case "private": {
                const name = data.sender?.card || data.sender?.nickname || data.bot.fl.get(data.user_id)?.nickname;
                Stdlog.info(`${data.self_id} <= ${data.user_id}`, `好友消息：${name ? `[${name}] ` : ""}${log_message}`);
                break;
            }
            case "group": {
                if (!data.group_name)
                    data.group_name = data.bot.gl.get(data.group_id)?.group_name;
                const group_name = data.group_name;
                let user_name = data.sender?.card || data.sender?.nickname;
                if (!user_name) {
                    const user = data.bot.gml.get(data.group_id)?.get(data.user_id) || data.bot.fl.get(data.user_id);
                    if (user)
                        user_name = user?.card || user?.nickname;
                }
                Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群消息：${user_name ? (group_name ? '[群：' + group_name + '][成员：' + user_name + ']' : '') : ''}${log_message}`);
                break;
            }
            case "guild":
                data.message_type = "group";
                data.group_id = `${data.guild_id}-${data.channel_id}`;
                Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `频道消息：[${data.sender.nickname}] ${log_message}`);
                Object.defineProperty(data, "friend", { get() { return this.member || {}; } });
                break;
            default:
                Stdlog.warn(data.self_id, `未知消息：${data.raw}`);
        }
        BotAPI.$emit(`${data.post_type}.${data.message_type}.${data.sub_type}`, data);
    }
    async makeNotice(data) {
        switch (data.notice_type) {
            case "friend_recall":
                Stdlog.info(`${data.self_id} <= ${data.user_id}`, `好友消息撤回：${data.message_id}`);
                break;
            case "group_recall":
                Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群消息撤回：${data.operator_id} => ${data.user_id} ${data.message_id}`);
                break;
            case "group_increase":
                Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群成员增加：${data.operator_id} => ${data.user_id} ${data.sub_type}`);
                if (data.user_id === data.self_id)
                    data.bot.getGroupMemberMap();
                else
                    data.bot.pickGroup(data.group_id).getMemberMap();
                break;
            case "group_decrease":
                Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群成员减少：${data.operator_id} => ${data.user_id} ${data.sub_type}`);
                if (data.user_id === data.self_id)
                    data.bot.getGroupMemberMap();
                else
                    data.bot.pickGroup(data.group_id).getMemberMap();
                break;
            case "group_admin":
                Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群管理员变动：${data.sub_type}`);
                data.set = data.sub_type === "set";
                break;
            case "group_upload":
                Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群文件上传：${BotAPI.String(data.file)}`);
                break;
            case "group_ban":
                Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群禁言：${data.operator_id} => ${data.user_id} ${data.sub_type} ${data.duration}秒`);
                break;
            case "friend_add":
                Stdlog.info(`${data.self_id} <= ${data.user_id}`, "好友添加");
                data.bot.getFriendMap();
                break;
            case "notify":
                if (data.group_id)
                    data.notice_type = "group";
                else
                    data.notice_type = "friend";
                switch (data.sub_type) {
                    case "poke":
                        data.operator_id = data.user_id;
                        if (data.group_id)
                            Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群戳一戳：${data.operator_id} => ${data.target_id}`);
                        else
                            Stdlog.info(data.self_id, `好友戳一戳：${data.operator_id} => ${data.target_id}`);
                        break;
                    case "honor":
                        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群荣誉：${data.honor_type}`);
                        break;
                    case "title":
                        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群头衔：${data.title}`);
                        break;
                    default:
                        Stdlog.warn(data.self_id, `未知通知：${data.raw}`);
                }
                break;
            case "group_card":
                Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群名片更新：${data.card_old} => ${data.card_new}`);
                break;
            case "offline_file":
                Stdlog.info(`${data.self_id} <= ${data.user_id}`, `离线文件：${BotAPI.String(data.file)}`);
                break;
            case "client_status":
                Stdlog.info(data.self_id, `客户端${data.online ? "上线" : "下线"}：${BotAPI.String(data.client)}`);
                data.clients = (await data.bot.sendApi("get_online_clients")).clients;
                data.bot.clients = data.clients;
                break;
            case "essence":
                data.notice_type = "group_essence";
                Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群精华消息：${data.operator_id} => ${data.sender_id} ${data.sub_type} ${data.message_id}`);
                break;
            case "guild_channel_recall":
                Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}`, `频道消息撤回：${data.operator_id} => ${data.user_id} ${data.message_id}`);
                break;
            case "message_reactions_updated":
                data.notice_type = "guild_message_reactions_updated";
                Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `频道消息表情贴：${data.message_id} ${BotAPI.String(data.current_reactions)}`);
                break;
            case "channel_updated":
                data.notice_type = "guild_channel_updated";
                Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `子频道更新：${BotAPI.String(data.old_info)} => ${BotAPI.String(data.new_info)}`);
                break;
            case "channel_created":
                data.notice_type = "guild_channel_created";
                Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `子频道创建：${BotAPI.String(data.channel_info)}`);
                data.bot.getGroupMap();
                break;
            case "channel_destroyed":
                data.notice_type = "guild_channel_destroyed";
                Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `子频道删除：${BotAPI.String(data.channel_info)}`);
                data.bot.getGroupMap();
                break;
            default:
                Stdlog.warn(data.self_id, `未知通知：${data.raw}`);
        }
        let notice = data.notice_type.split("_");
        data.notice_type = notice.shift();
        notice = notice.join("_");
        if (notice)
            data.sub_type = notice;
        if (data.guild_id && data.channel_id) {
            data.group_id = `${data.guild_id}-${data.channel_id}`;
            Object.defineProperty(data, "friend", { get() { return this.member || {}; } });
        }
        BotAPI.$emit(`${data.post_type}.${data.notice_type}.${data.sub_type}`, data);
    }
    makeRequest(data) {
        switch (data.request_type) {
            case "friend":
                Stdlog.info(`${data.self_id} <= ${data.user_id}`, `加好友请求：${data.comment}(${data.flag})`);
                data.sub_type = "add";
                data.approve = approve => data.bot.setFriendAddRequest(data.flag, approve);
                break;
            case "group":
                Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `加群请求：${data.sub_type} ${data.comment}(${data.flag})`);
                data.approve = approve => data.bot.setGroupAddRequest(data.flag, data.sub_type, approve);
                break;
            default:
                Stdlog.warn(data.self_id, `未知请求：${data.raw}`);
        }
        data.bot.request_list.push(data);
        BotAPI.$emit(`${data.post_type}.${data.request_type}.${data.sub_type}`, data);
    }
    heartbeat(data) {
        Stdlog.debug(data.self_id, `收到心跳：${data.status}`);
        if (data.status)
            Object.assign(data.bot.stat, data.status);
    }
    makeMeta(data, ws) {
        switch (data.meta_event_type) {
            case "heartbeat":
                this.heartbeat(data);
                break;
            case "lifecycle":
                this.id = data.self_id;
                this.connect(data, ws);
                break;
            default:
                Stdlog.warn(data.self_id, `未知消息：${data.raw}`);
        }
    }
    async message(data, ws) {
        try {
            data = {
                ...JSON.parse(data),
                raw: BotAPI.String(data),
            };
        }
        catch (err) {
            return Stdlog.error(data.self_id, "解析数据失败", data, err);
        }
        if (data.post_type) {
            if (data.meta_event_type !== "lifecycle" && !Bot[data.self_id]) {
                Stdlog.warn(data.self_id, `找不到对应Bot，忽略消息：${data.raw}`);
                return false;
            }
            data.bot = Bot[data.self_id];
            switch (data.post_type) {
                case "meta_event":
                    this.makeMeta(data, ws);
                    break;
                case "message":
                    await this.makeMessage(data);
                    break;
                case "notice":
                    this.makeNotice(data);
                    break;
                case "request":
                    this.makeRequest(data);
                    break;
                case "message_sent":
                    data.post_type = "message";
                    await this.makeMessage(data);
                    break;
                default:
                    Stdlog.warn(data.self_id, `未知消息：${data.raw}`);
            }
        }
        else if (data.echo && this.echo[data.echo]) {
            if (![0, 1].includes(data.retcode))
                this.echo[data.echo].reject(Object.assign(this.echo[data.echo].request, { error: data }));
            else
                this.echo[data.echo].resolve(data.data ? new Proxy(data, {
                    get: (target, prop) => target.data[prop] ?? target[prop],
                }) : data);
            clearTimeout(this.echo[data.echo].timeout);
            delete this.echo[data.echo];
        }
        else {
            Stdlog.info(data.self_id, `未知消息：${data.raw}`);
        }
    }
}

export { OnebotV11 as default };
