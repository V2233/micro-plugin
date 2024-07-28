import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import common from '../../common/index.js';
import { MicroBus } from '../../common/global.js';
import { pokeMap, faceMap } from '../../common/face.js';
import api from './api.js';
import '../../../../../utils/index.js';
import Stdlog from '../../../../../utils/stdlog.js';

class LagrangeCore {
    bot;
    id;
    nickname;
    version;
    QQVersion;
    constructor(bot, request) {
        this.bot = bot;
        this.id = 114514;
        this.bot = bot;
        this.bot.on('message', (data) => this.event(data));
        this.bot.on('error', async (error) => logger.error(error));
        bot.on('close', () => logger.warn(`[Micro] [Lagrange.OneBot] QQ ${this.id} 连接已断开`));
        Stdlog.info('LagrangeCore', '载入成功！');
    }
    async event(data) {
        data = JSON.parse(data);
        Stdlog.debug(this.id, '<ws> received ->', JSON.stringify(data));
        if (data?.echo) {
            MicroBus.ws.echo[data.echo] = data;
            return true;
        }
        try {
            this[data?.post_type](data);
        }
        catch (error) {
            logger.error('[LagrangeCore]事件处理错误', error);
            logger.mark('[LagrangeCore]事件处理错误', data);
        }
    }
    async meta_event(data) {
        switch (data.meta_event_type) {
            case 'lifecycle':
                if (data.self_id) {
                    this.id = data.self_id;
                }
                this.LoadBot();
                Stdlog.info('Micro', `<Lagrange.OneBot> QQ ${this.id} 连接成功，协议通过，执行消息处理...`);
                break;
            case 'heartbeat':
                Stdlog.debug('Micro', `<Lagrange.OneBot> QQ ${this.id} 收到心跳：${JSON.stringify(data.status, null, 2)}`);
                break;
            default:
                logger.error(`[LagrangeCore][未知事件] ${JSON.stringify(data)}`);
                break;
        }
    }
    async message(data) {
        await Bot.emit('message', await this.ICQQEvent(data));
    }
    async message_sent(data) {
        data.post_type = 'message';
        await common.sleep(1500);
        if (await redis.get(`LagrangeCore:${this.id}:${data.message_id}`))
            return;
        await Bot.emit('message', await this.ICQQEvent(data));
    }
    async notice(data) {
        data.post_type = 'notice';
        (async () => {
            if (['group_increase', 'group_decrease', 'group_admin'].includes(data.notice_type)) {
                let group = await api.get_group_info(this.id, data.group_id, true);
                if (group?.group_id) {
                    Bot.gl.set(data.group_id, group);
                    Bot[this.id].gl.set(data.group_id, group);
                    this.loadGroupMemberList(data.group_id);
                }
            }
        })().catch(err => Stdlog.error(this.id, err));
        switch (data.notice_type) {
            case 'group_recall':
                data.sub_type = 'recall';
                data.notice_type = 'group';
                try {
                    let gl = Bot[this.id].gl.get(data.group_id);
                    data = { ...data, ...gl };
                }
                catch { }
                if (data.operator_id === data.user_id) {
                    Stdlog.info(this.id, `群消息撤回：<${data.group_id}，${data.user_id}> ${data.message_id}`);
                }
                else {
                    Stdlog.info(this.id, `群消息撤回：<${data.group_id}>${data.operator_id} 撤回 ${data.user_id}的消息 ${data.message_id}`);
                }
                return await Bot.emit('notice', await this.ICQQEvent(data));
            case 'group_increase': {
                data.notice_type = 'group';
                let subType = data.sub_type;
                data.sub_type = 'increase';
                data.user_id = data.target_id;
                if (this.id === data.user_id) {
                    Stdlog.info(this.id, `机器人加入群聊：<${data.group_id}}>`);
                }
                else {
                    switch (subType) {
                        case 'invite': {
                            Stdlog.info(this.id, `<${data.operator_id}>邀请<${data.user_id}>加入了群聊<${data.group_id}>`);
                            break;
                        }
                        default: {
                            Stdlog.info(this.id, `新人${data.user_id}加入群聊<${data.group_id}>`);
                        }
                    }
                }
                return await Bot.emit('notice', await this.ICQQEvent(data));
            }
            case 'group_decrease': {
                data.notice_type = 'group';
                data.sub_type = 'decrease';
                data.user_id = data.target_id;
                if (this.id === data.user_id) {
                    Stdlog.info(this.id, data.operator_id
                        ? `机器人被<${data.operator_id}>踢出群聊：<${data.group_id}>`
                        : `机器人退出群聊：<${data.group_id}>`);
                    Bot.gl.delete(data.group_id);
                    Bot[this.id].gl.delete(data.group_id);
                    Bot[this.id].gml.delete(data.group_id);
                }
                else {
                    Stdlog.info(this.id, data.operator_id
                        ? `成员<${data.user_id}>被<${data.operator_id}>踢出群聊：<${data.group_id}>`
                        : `成员<${data.user_id}>退出群聊<${data.group_id}>`);
                }
                return await Bot.emit('notice', await this.ICQQEvent(data));
            }
            case 'group_admin': {
                data.notice_type = 'group';
                data.set = data.sub_type === 'set';
                data.sub_type = 'admin';
                data.user_id = data.target_id;
                if (this.id === data.user_id) {
                    let gml = await Bot[this.id].gml.get(data.group_id);
                    gml[this.id] = { ...gml.get(this.id) };
                    if (data.set) {
                        gml[this.id].role = 'admin';
                        Stdlog.info(this.id, `机器人<${this.id}>在群<${data.group_id}>被设置为管理员`);
                    }
                    else {
                        gml[this.id].role = 'member';
                        Stdlog.info(this.id, `机器人<${this.id}>在群<${data.group_id}>被取消管理员`);
                    }
                    Bot[this.id].gml.set(data.group_id, { ...gml });
                }
                else {
                    let gml = await Bot[this.id].gml.get(data.group_id);
                    gml[data.target_id] = { ...gml.get(data.target_id) };
                    if (data.set) {
                        gml[data.target_id].role = 'admin';
                        Stdlog.info(this.id, `成员<${data.target_id}>在群<${data.group_id}>被设置为管理员`);
                    }
                    else {
                        gml[data.target_id].role = 'member';
                        Stdlog.info(this.id, `成员<${data.target_id}>在群<${data.group_id}>被取消管理员`);
                    }
                    Bot[this.id].gml.set(data.group_id, { ...gml });
                }
                return await Bot.emit('notice', await this.ICQQEvent(data));
            }
            case 'group_ban': {
                data.notice_type = 'group';
                if (data.sub_type === 'lift_ban') {
                    data.sub_type = 'ban';
                    data.duration = 0;
                }
                else {
                    data.sub_type = 'ban';
                }
                if (this.id === data.target_id) {
                    Stdlog.info(this.id, data.duration === 0
                        ? `机器人<${this.id}>在群<${data.group_id}>被解除禁言`
                        : `机器人<${this.id}>在群<${data.group_id}>被禁言${data.duration}秒`);
                }
                else {
                    Stdlog.info(this.id, data.duration === 0
                        ? `成员<${data.target_id}>在群<${data.group_id}>被解除禁言`
                        : `成员<${data.target_id}>在群<${data.group_id}>被禁言${data.duration}秒`);
                }
                this.loadGroupMemberList(data.group_id);
                return await Bot.emit('notice', await this.ICQQEvent(data));
            }
            case 'poke':
                if (!data.group_id) {
                    Stdlog.info(this.id, `好友<${data.user_id}>戳了戳<${data.target_id}>`);
                    data.notice_type = 'friend';
                    data.operator_id = data.user_id;
                    return await Bot.emit('notice', await this.ICQQEvent(data));
                }
                else {
                    Stdlog.info(this.id, `群<${data.group_id}>成员<${data.user_id}>戳了戳<${data.target_id}>`);
                    data.notice_type = 'group';
                    data.operator_id = data.user_id;
                    data.user_id = data.target_id;
                    return await Bot.emit('notice', await this.ICQQEvent(data));
                }
            case 'notify':
                switch (data.sub_type) {
                    case 'poke': {
                        let action = data.poke_detail?.action || '戳了戳';
                        let suffix = data.poke_detail?.suffix || '';
                        Stdlog.info(this.id, `<${data.operator_id}>${action}<${data.target_id}>${suffix}`);
                        break;
                    }
                    case 'title': {
                        Stdlog.info(this.id, `群<${data.group_id}>成员<${data.user_id}>获得头衔<${data.title}>`);
                        let gml = Bot[this.id].gml.get(data.group_id);
                        let user = gml.get(data.user_id);
                        user.title = data.title;
                        gml[data.user_id] = user;
                        Bot[this.id].gml.set(data.group_id, gml);
                        break;
                    }
                    default:
                }
                break;
            case 'friend_add': {
                Stdlog.info(this.id, `好友请求<${data.user_id}>`);
                break;
            }
            case 'essence': {
                Stdlog.info(this.id, `群<${data.group_id}>成员<${data.sender_id}>的消息<${data.message_id}>被<${data.operator_id}>${data.sub_type === 'add' ? '设为' : '移除'}精华`);
                break;
            }
            case 'group_card': {
                Stdlog.info(this.id, `群<${data.group_id}>成员<${data.user_id}>群名片变成为${data.card_new}`);
                let gml = Bot[this.id].gml.get(data.group_id);
                let user = gml.get(data.user_id);
                user.card = data.card_new;
                gml[data.user_id] = user;
                Bot[this.id].gml.set(data.group_id, gml);
                return await Bot.emit('notice', await this.ICQQEvent(data));
            }
            case 'friend_recall':
                data.sub_type = 'recall';
                data.notice_type = 'friend';
                try {
                    let fl = Bot[this.id].fl.get(data.user_id);
                    data = { ...data, ...fl };
                }
                catch { }
                Stdlog.info(this.id, `好友消息撤回：<${data.user_name}(${data.user_id})> ${data.message_id}`);
                return await Bot.emit('notice', await this.ICQQEvent(data));
            default:
        }
        return await Bot.emit('notice', await this.ICQQEvent(data));
    }
    async request(data) {
        data.post_type = 'request';
        switch (data.request_type) {
            case 'group': {
                data.tips = data.comment;
                try {
                    let gl = Bot[this.id].gl.get(data.group_id);
                    let fl = await Bot[this.id].api.get_stranger_info(Number(data.user_id));
                    data = { ...data, ...gl, ...fl };
                    data.group_id = Number(data.group_id);
                    data.user_id = Number(data.user_id);
                }
                catch { }
                if (data.sub_type === 'add') {
                    Stdlog.info(this.id, `<${data.user_id}>申请入群<${data.group_id}>: ${data.tips}`);
                }
                else {
                    Stdlog.info(this.id, `<${data.user_id}>邀请机器人入群<${data.group_id}>: ${data.tips}`);
                }
                break;
            }
            case 'friend': {
                data.sub_type = 'add';
                Stdlog.info(this.id, `[${data.user_id}]申请加机器人<${this.id}>好友: ${data.comment}`);
                break;
            }
        }
        data.post_type = 'request';
        switch (data.request_type) {
            case 'group': {
                data.tips = data.comment;
                try {
                    let gl = Bot[this.id].gl.get(data.group_id);
                    let fl = await Bot[this.id].api.get_stranger_info(Number(data.user_id));
                    data = { ...data, ...gl, ...fl };
                    data.group_id = Number(data.group_id);
                    data.user_id = Number(data.user_id);
                }
                catch { }
                if (data.sub_type === 'add') {
                    Stdlog.info(this.id, `<${data.user_id}>申请入群<${data.group_id}>: ${data.tips}`);
                }
                else {
                    Stdlog.info(this.id, `<${data.user_id}>邀请机器人入群<${data.group_id}>: ${data.tips}`);
                }
                break;
            }
            case 'friend': {
                data.sub_type = 'add';
                try {
                    let fl = await Bot[this.id].api.get_stranger_info(Number(data.user_id));
                    data = { ...data, ...fl };
                    data.user_id = Number(data.user_id);
                }
                catch { }
                Stdlog.info(this.id, `<${data.user_id}>申请加机器人<${this.id}>好友: ${data.comment}`);
                break;
            }
        }
        return await Bot.emit('request', await this.ICQQEvent(data));
    }
    async LoadBot() {
        Bot[this.id] = {
            ws: this.bot,
            bkn: 0,
            fl: new Map(),
            gl: new Map(),
            tl: new Map(),
            gml: new Map(),
            guilds: new Map(),
            adapter: 'LagrangeCore',
            uin: this.id,
            tiny_id: String(this.id),
            avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${this.id}`,
            sendApi: async (action, params) => await this.sendApi(action, params),
            pickMember: (group_id, user_id) => this.pickMember(group_id, user_id),
            pickUser: (user_id) => this.pickFriend(Number(user_id)),
            pickFriend: (user_id) => this.pickFriend(Number(user_id)),
            pickGroup: (group_id) => this.pickGroup(Number(group_id)),
            setEssenceMessage: async (msg_id) => await this.setEssenceMessage(msg_id),
            sendPrivateMsg: async (user_id, msg) => await this.sendFriendMsg(Number(user_id), msg),
            getGroupMemberInfo: async (group_id, user_id, no_cache) => await this.getGroupMemberInfo(Number(group_id), Number(user_id), no_cache),
            removeEssenceMessage: async (msg_id) => await this.removeEssenceMessage(msg_id),
            makeForwardMsg: async (message) => await this.makeForwardMsg(message),
            getMsg: (msg_id) => '',
            quit: (group_id) => this.quit(group_id),
            getFriendMap: () => Bot[this.id].fl,
            getGroupList: () => Bot[this.id].gl,
            getGuildList: () => Bot[this.id].tl,
            getMuteList: async (group_id) => await this.getMuteList(group_id),
            getChannelList: async (guild_id) => this.getChannelList(guild_id),
            _loadGroup: this.loadGroup,
            _loadGroupMemberList: this.loadGroupMemberList,
            _loadFriendList: this.loadFriendList,
            _loadAll: this.LoadAll,
            readMsg: async () => common.recvMsg(this.id, 'LagrangeCore', true),
            MsgTotal: async (type) => common.MsgTotal(this.id, 'LagrangeCore', type, true),
            api: new Proxy(api, {
                get: (target, prop) => {
                    try {
                        if (typeof target[prop] === 'function') {
                            return (...args) => target[prop](this.id, ...args);
                        }
                        else {
                            return target[prop];
                        }
                    }
                    catch (error) {
                        logger.error(error);
                    }
                }
            })
        };
        const version_info = await api.SendApi(this.id, 'get_version_info', {});
        this.version = version_info;
        this.QQVersion = version_info.nt_protocol;
        const apk = version_info.nt_protocol.split('|');
        Bot[this.id].stat = { start_time: Date.now() / 1000, recv_msg_cnt: 0 };
        Bot[this.id].apk = { display: apk[0].trim(), version: apk[1].trim() };
        Bot[this.id].version = { id: 'QQ', name: version_info.app_name, version: version_info.app_version };
        await common.init('Lain:restart:LagrangeCore');
        if (!Bot.adapter.includes(this.id))
            Bot.adapter.push(this.id);
        this.LoadAll();
    }
    async LoadAll() {
        const info = await api.get_login_info(this.id);
        Bot[this.id].nickname = info?.nickname || '';
        this.nickname = info?.nickname || '';
        let _this = this;
        await Promise.all([
            (async () => {
                let groupList = await _this.loadGroup();
                await Promise.all(groupList.map(async (group, index) => {
                    await common.sleep(50 * Math.floor(index / 10));
                    await _this.loadGroupMemberList(group.group_id);
                }));
            })(),
            _this.loadFriendList()
        ]);
        Bot[this.id].cookies = {};
        const log = `LagrangeCore加载资源成功：加载了${Bot[this.id].fl.size}个好友，${Bot[this.id].gl.size}个群。`;
        Stdlog.info(this.id, log);
        return log;
    }
    async loadGroup(id = this.id) {
        let groupList;
        for (let retries = 0; retries < 5; retries++) {
            groupList = await api.get_group_list(id);
            if (!(groupList && Array.isArray(groupList))) {
                Stdlog.error(this.id, `LagrangeCore群列表获取失败，正在重试：${retries + 1}`);
            }
            await common.sleep(50);
        }
        if (groupList && typeof groupList === 'object') {
            for (const i of groupList) {
                i.uin = this.id;
                Bot.gl.set(i.group_id, i);
                Bot[id].gl.set(i.group_id, i);
            }
        }
        Stdlog.debug(id, '加载群列表完成');
        return groupList;
    }
    async loadGroupMemberList(groupId, id = this.id) {
        try {
            let gml = new Map();
            let memberList = await api.get_group_member_list(id, groupId);
            for (const user of memberList) {
                user.card = user.nickname;
                user.uin = this.id;
                gml.set(user.user_id, user);
            }
            Bot.gml.set(groupId, gml);
            Bot[id].gml.set(groupId, gml);
            Stdlog.debug(id, `加载<${groupId}>群成员完成`);
        }
        catch (error) { }
    }
    async loadFriendList(id = this.id) {
        let friendList;
        for (let retries = 0; retries < 5; retries++) {
            friendList = await api.get_friend_list(id);
            if (!(friendList && Array.isArray(friendList))) {
                Stdlog.error(this.id, `LagrangeCore好友列表获取失败，正在重试：${retries + 1}`);
            }
            await common.sleep(50);
        }
        if (!friendList || !(typeof friendList === 'object')) {
            Stdlog.error(this.id, 'LagrangeCore好友列表获取失败次数过多，已停止重试');
        }
        if (friendList && typeof friendList === 'object') {
            for (let i of friendList) {
                i.nickname = i.user_name || i.user_displayname || i.user_remark;
                i.uin = this.id;
                Bot.fl.set(i.user_id, i);
                Bot[id].fl.set(i.user_id, i);
            }
        }
        Stdlog.debug(id, '加载好友列表完成');
    }
    pickGroup(group_id) {
        const name = Bot[this.id].gl.get(group_id)?.group_name || group_id;
        const is_admin = Bot[this.id].gml.get(group_id)?.get(this.id)?.role === 'admin';
        const is_owner = Bot[this.id].gml.get(group_id)?.get(this.id)?.role === 'owner';
        return {
            name,
            is_admin: is_owner || is_admin,
            is_owner,
            sendMsg: async (msg) => await this.sendGroupMsg(group_id, msg),
            recallMsg: async (msg_id) => await this.recallMsg(msg_id),
            makeForwardMsg: async (message) => await this.makeForwardMsg(message),
            pokeMember: async (operator_id) => await api.group_touch(this.id, group_id, operator_id),
            muteMember: async (user_id, time) => await api.set_group_ban(this.id, group_id, Number(user_id), Number(time)),
            muteAll: async (type) => await api.set_group_whole_ban(this.id, group_id, type),
            setName: async (name) => await api.set_group_name(this.id, group_id, name),
            quit: async () => await api.set_group_leave(this.id, group_id),
            setAdmin: async (qq, type) => await api.set_group_admin(this.id, group_id, qq, type),
            kickMember: async (qq, reject_add_request = false) => { await api.set_group_kick(this.id, group_id, qq, reject_add_request); return true; },
            setTitle: async (qq, title, duration) => { await api.set_group_special_title(this.id, group_id, qq, title); return true; },
            setCard: async (qq, card) => await api.set_group_card(this.id, group_id, qq, card),
            pickMember: (id) => this.pickMember(group_id, id),
            getMemberMap: async () => await this.getMemberMap(group_id),
            setEssenceMessage: async (msg_id) => await this.setEssenceMessage(msg_id),
            removeEssenceMessage: async (msg_id) => await this.removeEssenceMessage(msg_id),
            sendFile: async (filePath) => await this.upload_group_file(group_id, filePath),
            sign: async () => await api.send_group_sign(this.id, group_id),
            shareMusic: async (platform, id) => await this.shareMusic(group_id, platform, id),
            getFileUrl: async (fid) => await this.getFileUrl(fid),
            getChatHistory: async (msg_id, num, reply) => {
                let { messages } = await api.get_group_msg_history(this.id, group_id, num, msg_id);
                if (!messages) {
                    logger.warn('获取历史消息失败');
                    return [];
                }
                let group = Bot[this.id].gl.get(group_id);
                messages = messages.map(async (m) => {
                    m.group_name = group?.group_name || group_id;
                    m.atme = !!m.message.find(msg => msg.type === 'at' && msg.data?.qq == this.id);
                    let result = await this.getMessage(m.message, null, reply);
                    m = Object.assign(m, result);
                    return m;
                });
                return Promise.all(messages);
            }
        };
    }
    pickFriend(user_id) {
        return {
            sendMsg: async (msg) => await this.sendFriendMsg(user_id, msg),
            recallMsg: async (msg_id) => await this.recallMsg(msg_id),
            makeForwardMsg: async (message) => await this.makeForwardMsg(message),
            getAvatarUrl: (size = 0) => `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${user_id}`,
            sendFile: async (filePath) => await this.upload_private_file(user_id, filePath),
            getFileUrl: async (fid) => await this.getFileUrl(fid),
            getChatHistory: async (msg_id, num, reply) => {
                msg_id = Number(msg_id);
                let { messages } = await api.get_friend_msg_history(this.id, user_id, num, msg_id);
                messages = messages.map(async (m) => {
                    let result = await this.getMessage(m.message, null, reply);
                    m = Object.assign(m, result);
                    return m;
                });
                return Promise.all(messages);
            }
        };
    }
    pickMember(group_id, user_id, refresh = false, cb = (res) => { (typeof res == 'function') ? res() : console.log(typeof res); }) {
        if (!refresh) {
            let member = Bot[this.id].gml.get(group_id)?.get(user_id) || {};
            member.info = { ...member };
            member.getAvatarUrl = (size = 0) => `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${user_id}`;
            return member;
        }
        else {
            api.get_group_member_info(this.id, group_id, user_id, true).then(res => {
                if (typeof cb === 'function') {
                    cb(res);
                }
            });
            return {};
        }
    }
    async getMemberMap(group_id) {
        let group_Member = Bot[this.id].gml.get(group_id);
        if (group_Member && Object.keys(group_Member).length > 0)
            return group_Member;
        group_Member = new Map();
        let member_list = await api.get_group_member_list(this.id, group_id);
        member_list.forEach(user => {
            group_Member.set(user.user_id, user);
        });
        return group_Member;
    }
    getChannelList(guild_id) {
        return {
            channel_id: 'string',
            channel_name: 'string',
            channel_type: 'ChannelType',
            guild_id: 'string'
        };
    }
    async upload_group_file(group_id, file) {
        if (!fs.existsSync(file))
            return true;
        const name = path.basename(file) || Date.now() + path.extname(file);
        return await api.upload_group_file(this.id, group_id, file, name);
    }
    async upload_private_file(user_id, file) {
        if (!fs.existsSync(file))
            return true;
        const name = path.basename(file) || Date.now() + path.extname(file);
        return await api.upload_private_file(this.id, user_id, file, name);
    }
    async getFileUrl(fid) {
        return logger.warn('暂未实现，请先使用 [e.file], fid' + fid);
    }
    async shareMusic(group_id, platform, id) {
        if (!['qq', '163'].includes(platform)) {
            return 'platform not supported yet';
        }
        return await this.sendGroupMsg(group_id, { type: 'music', data: { type: platform, id } });
    }
    async setEssenceMessage(msg_id) {
        let res = await api.set_essence_msg(this.id, msg_id);
        return res?.message === '成功' ? '加精成功' : res?.message;
    }
    async removeEssenceMessage(msg_id) {
        let res = await api.delete_essence_msg(this.id, msg_id);
        return res?.message === '成功' ? '加精成功' : res?.message;
    }
    async getGroupMemberInfo(group_id, user_id, refresh) {
        if (user_id == '88888' || user_id == 'stdin')
            user_id = this.id;
        try {
            let member = await api.get_group_member_info(this.id, group_id, user_id, refresh);
            member.card = member.nickname;
            return member;
        }
        catch {
            return {
                group_id,
                user_id,
                nickname: 'LagrangeCore',
                card: 'LagrangeCore',
                sex: 'female',
                age: 6,
                join_time: '',
                last_sent_time: '',
                level: 1,
                role: 'member',
                title: '',
                title_expire_time: '',
                shutup_time: 0,
                update_time: '',
                area: '南极洲',
                rank: '潜水'
            };
        }
    }
    async quit(group_id) {
        return await api.set_group_leave(this.id, group_id);
    }
    async makeForwardMsg(data) {
        if (!Array.isArray(data))
            data = [data];
        let makeForwardMsg = {
            test: true,
            message: [],
            data: { type: 'test', text: 'forward', app: 'com.tencent.multimsg', meta: { detail: { news: [{ text: '1' }] }, resid: '', uniseq: '', summary: '' } }
        };
        let msg = [];
        for (let i in data) {
            if (typeof data[i] === 'object' && (data[i]?.test || data[i]?.message?.test)) {
                if (data[i]?.message?.test) {
                    makeForwardMsg.message.push(...data[i].message.message);
                }
                else {
                    makeForwardMsg.message.push(...data[i].message);
                }
            }
            else {
                if (!data[i]?.message)
                    continue;
                msg.push(data[i]);
            }
        }
        if (msg.length) {
            for (let i of msg) {
                try {
                    const { message: content } = await this.getLagrangeCore(i.message);
                    makeForwardMsg.message.push({ type: 'node', data: { type: 'node', data: { name: (i.nickname == Bot.nickname) ? (this.nickname || 'LagrangeCore') : i.nickname, uin: String((i.user_id == Bot.uin) ? this.id : i.user_id), content } } });
                }
                catch (err) {
                    Stdlog.error(this.id, err);
                }
            }
        }
        return makeForwardMsg;
    }
    async recallMsg(msg_id) {
        return await api.delete_msg(this.id, msg_id);
    }
    async getMuteList(group_id) {
        return await api.get_prohibited_member_list(this.id, group_id);
    }
    async ICQQEvent(data) {
        const { post_type, group_id, user_id, message_type, message_id, sender } = data;
        let e = data;
        const messagePostType = async function () {
            const { message, ToString, raw_message, log_message, source, file } = await this.getMessage(data.message, group_id);
            e.uin = this.id;
            e.message = message;
            e.raw_message = raw_message;
            e.log_message = log_message;
            e.toString = () => ToString;
            if (file)
                e.file = file;
            if (source)
                e.source = source;
            if (message_type === 'group') {
                let group_name;
                try {
                    group_name = Bot[this.id].gl.get(group_id).group_name;
                    group_name = group_name ? `${group_name}(${group_id})` : group_id;
                }
                catch {
                    group_name = group_id;
                }
                e.log_message && Stdlog.info(this.id, `<群:${group_name || group_id}><用户:${sender?.card || sender?.nickname}(${user_id})> -> ${e.log_message}`);
                e.member = {
                    info: {
                        group_id,
                        user_id,
                        nickname: sender?.card,
                        last_sent_time: data?.time
                    },
                    card: sender?.card,
                    nickname: sender?.nickname,
                    group_id,
                    is_admin: sender?.role === 'admin' || false,
                    is_owner: sender?.role === 'owner' || false,
                    getAvatarUrl: (size = 0) => `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${user_id}`,
                    mute: async (time) => await api.set_group_ban(this.id, group_id, user_id, time)
                };
                e.group = { ...this.pickGroup(group_id) };
            }
            else {
                e.log_message && Stdlog.info(this.id, `<好友:${sender?.card || sender?.nickname}(${user_id})> -> ${e.log_message}`);
                e.friend = { ...this.pickFriend(user_id) };
            }
        };
        const noticePostType = async function () {
            if (e.sub_type === 'poke') {
                e.action = e.poke_detail.action;
                e.raw_message = `${e.operator_id} ${e.action} ${e.user_id}`;
            }
            if (e.group_id) {
                e.notice_type = 'group';
                e.group = { ...this.pickGroup(group_id) };
                let fl = await Bot[this.id].api.get_stranger_info(Number(e.user_id));
                e.member = {
                    ...fl,
                    card: fl?.nickname,
                    nickname: fl?.nickname
                };
            }
            else {
                e.notice_type = 'friend';
                e.friend = { ...this.pickFriend(user_id) };
            }
        };
        const requestPostType = async function () {
            switch (e.request_type) {
                case 'friend': {
                    e.approve = async (approve = true) => {
                        if (e.flag) {
                            return await api.set_friend_add_request(this.id, e.flag, approve);
                        }
                        else {
                            Stdlog.error(this.id, '处理好友申请失败：缺少flag参数');
                            return false;
                        }
                    };
                    break;
                }
                case 'group': {
                    try {
                        let gl = Bot[this.id].gl.get(e.group_id);
                        let fl = await Bot[this.id].api.get_stranger_info(Number(e.user_id));
                        e = { ...e, ...gl, ...fl };
                        e.group_id = Number(data.group_id);
                        e.user_id = Number(data.user_id);
                    }
                    catch { }
                    e.approve = async (approve = true) => {
                        if (e.flag)
                            return await api.set_group_add_request(this.id, e.flag, e.sub_type, approve);
                        if (e.sub_type === 'add') {
                            Stdlog.error(this.id, '处理入群申请失败：缺少flag参数');
                        }
                        else {
                            Stdlog.error(this.id, '处理邀请机器人入群失败：缺少flag参数');
                        }
                        return false;
                    };
                    break;
                }
                default:
            }
        };
        switch (post_type) {
            case 'message':
                await messagePostType.call(this);
                break;
            case 'notice':
                await noticePostType.call(this);
                break;
            case 'request':
                await requestPostType.call(this);
                break;
        }
        e.recall = async () => await api.delete_msg(this.id, message_id);
        e.reply = async (msg, quote) => await this.sendReplyMsg(e, group_id, user_id, msg, quote);
        e.getAvatarUrl = (size = 0) => `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${user_id}`;
        e.adapter = 'LagrangeCore';
        e.bot = Bot[this.id];
        try {
            common.recvMsg(this.id, e.adapter);
        }
        catch { }
        return e;
    }
    async getMessage(msg, group_id, reply = true) {
        let file;
        let source;
        let message = [];
        let ToString_arr = [];
        let log_message_arr = [];
        let raw_message_arr = [];
        for (let i of msg) {
            switch (i.type) {
                case 'at':
                    message.push({ type: 'at', qq: Number(i.data.qq) });
                    try {
                        let qq = i.data.qq;
                        ToString_arr.push(`{at:${qq}}`);
                        let groupMemberList = Bot[this.id].gml.get(group_id)?.get(qq);
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
                    if (reply) {
                        source = await this.source(i, group_id);
                        if (source && group_id) {
                            let qq = Number(source.sender.user_id);
                            let text = source.sender.nickname;
                            message.unshift({ type: 'at', qq, text });
                            raw_message_arr.unshift(`@${text}`);
                            log_message_arr.unshift(`<回复:${text}(${qq})>`);
                        }
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
                default:
                    message.push({ type: 'text', ...i.data });
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
    async source(i, group_id) {
        const msg_id = i.data.id;
        if (!msg_id)
            return false;
        let source;
        try {
            let retryCount = 0;
            while (retryCount < 2) {
                source = await api.get_msg(this.id, msg_id);
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
            let { raw_message } = await this.getMessage(source.message, group_id, false);
            source = {
                ...source,
                time: source.message_id,
                seq: source.message_id,
                user_id: source.sender.user_id,
                message: raw_message,
                raw_message
            };
            return source;
        }
        catch (error) {
            logger.error(error);
            return false;
        }
    }
    async sendReplyMsg(e, group_id, user_id, msg, quote) {
        let { message, raw_message, node } = await this.getLagrangeCore(msg);
        if (quote) {
            message.unshift({ type: 'reply', data: { id: String(e.message_id) } });
            raw_message = '[回复]' + raw_message;
        }
        if (group_id)
            return await api.send_group_msg(this.id, group_id, message, raw_message, node);
        return await api.send_private_msg(this.id, user_id, message, raw_message, node);
    }
    async sendFriendMsg(user_id, msg) {
        const { message, raw_message, node } = await this.getLagrangeCore(msg);
        return await api.send_private_msg(this.id, user_id, message, raw_message, node);
    }
    async sendGroupMsg(group_id, msg) {
        const { message, raw_message, node } = await this.getLagrangeCore(msg);
        return await api.send_group_msg(this.id, group_id, message, raw_message, node);
    }
    async getLagrangeCore(data) {
        let node = data?.test || false;
        data = common.array(data);
        let message = [];
        let raw_message_arr = [];
        if (data?.[0]?.type === 'xml')
            data = data?.[0].msg;
        for (let i of data) {
            switch (i.type) {
                case 'at':
                    message.push({ type: 'at', data: { qq: String(i.qq) } });
                    raw_message_arr.push(`<@${i.qq}>`);
                    break;
                case 'face':
                    message.push({ type: 'face', data: { id: i.id + '' } });
                    raw_message_arr.push(`<${faceMap[Number(i.id)]}>`);
                    break;
                case 'text':
                    if (i.text && typeof i.text !== 'number' && !i.text.trim())
                        break;
                    message.push({ type: 'text', data: { text: i.text } });
                    raw_message_arr.push(i.text);
                    break;
                case 'file':
                    break;
                case 'record':
                    try {
                        let file = await Bot.FormatFile(i.file);
                        if (!/^http(s)?:\/\/|^file:\/\//.test(file)) {
                            file = 'base64://' + await Bot.Base64(file);
                            raw_message_arr.push('<语音:base64://...>');
                        }
                        else {
                            raw_message_arr.push(`<语音:${file}>`);
                        }
                        message.push({ type: 'record', data: { file } });
                    }
                    catch (err) {
                        Stdlog.error(this.id, '语音上传失败:', err);
                        message.push({ type: 'text', data: { text: JSON.stringify(err) } });
                        raw_message_arr.push(JSON.stringify(err));
                    }
                    break;
                case 'video':
                    try {
                        if (i?.url)
                            i.file = i.url;
                        let file = await Bot.FormatFile(i.file);
                        if (!/^http(s)?:\/\/|^file:\/\//.test(file)) {
                            file = 'base64://' + await Bot.Base64(file);
                            raw_message_arr.push('<视频:base64://...>');
                        }
                        else {
                            raw_message_arr.push(`<视频:${file}>`);
                        }
                        message.push({ type: 'video', data: { file } });
                    }
                    catch (err) {
                        Stdlog.error(this.id, '视频上传失败:', err);
                        message.push({ type: 'text', data: { text: JSON.stringify(err) } });
                        raw_message_arr.push(JSON.stringify(err));
                    }
                    break;
                case 'image':
                    try {
                        if (i?.url)
                            i.file = i.url;
                        let file = await Bot.FormatFile(i.file);
                        if (!/^http(s)?:\/\/|^file:\/\//.test(file)) {
                            file = 'base64://' + await Bot.Base64(file);
                            raw_message_arr.push('<图片:base64://...>');
                        }
                        else {
                            raw_message_arr.push(`<图片:${file}>`);
                        }
                        message.push({ type: 'image', data: { file } });
                    }
                    catch (err) {
                        message.push({ type: 'text', data: { text: JSON.stringify(err) } });
                        raw_message_arr.push(JSON.stringify(err));
                    }
                    break;
                case 'poke':
                    message.push({ type: 'poke', data: { type: i.id, id: 0, strength: i?.strength || 0 } });
                    raw_message_arr.push(`<${pokeMap[Number(i.id)]}>` || `<戳一戳:${i.id}>`);
                    break;
                case 'touch':
                    message.push({ type: 'touch', data: { id: i.id } });
                    raw_message_arr.push(`<拍一拍:${i.id}>`);
                    break;
                case 'weather':
                    message.push({ type: 'weather', data: { code: i.code, city: i.city } });
                    raw_message_arr.push(`<天气:${i?.city || i?.code}>`);
                    break;
                case 'json':
                    try {
                        let json = i.data;
                        if (typeof i.data !== 'string')
                            json = JSON.stringify(i.data);
                        message.push({ type: 'json', data: { data: json } });
                        raw_message_arr.push(`<json:${json}>`);
                    }
                    catch (err) {
                        message.push({ type: 'text', data: { text: JSON.stringify(err) } });
                        raw_message_arr.push(JSON.stringify(err));
                    }
                    break;
                case 'music':
                    message.push({ type: 'music', data: i.data });
                    raw_message_arr.push(`<音乐:${i.data.type},id:${i.data.id}>`);
                    break;
                case 'location':
                    try {
                        const { lat, lng: lon } = data;
                        message.push({ type: 'location', data: { lat, lon } });
                        raw_message_arr.push(`<位置:纬度=${lat},经度=${lon}>`);
                    }
                    catch (err) {
                        message.push({ type: 'text', data: { text: JSON.stringify(err) } });
                        raw_message_arr.push(JSON.stringify(err));
                    }
                    break;
                case 'share':
                    try {
                        const { url, title, image, content } = data;
                        message.push({ type: 'share', data: { url, title, content, image } });
                        raw_message_arr.push(`<链接分享:${url},标题=${title},图片链接=${image},内容=${content}>`);
                    }
                    catch (err) {
                        message.push({ type: 'text', data: { text: JSON.stringify(err) } });
                        raw_message_arr.push(JSON.stringify(err));
                    }
                    break;
                case 'forward':
                    message.push(i);
                    raw_message_arr.push(`<转发消息:${i.id}>`);
                    break;
                case 'node':
                default:
                    message.push({ type: i.type, data: { ...i.data } });
                    raw_message_arr.push(`<${i.type}:${JSON.stringify(i.data)}>`);
                    break;
            }
        }
        const raw_message = raw_message_arr.join('');
        return { message, raw_message, node };
    }
    async sendApi(action, params) {
        const echo = randomUUID();
        const log = JSON.stringify({ echo, action, params });
        Stdlog.debug(this.id, '<ws> send -> ' + log);
        this.bot.send(log);
        for (let i = 0; i < 1200; i++) {
            const data = MicroBus.ws.echo[echo];
            if (data) {
                delete MicroBus.ws.echo[echo];
                if (data.status === 'ok')
                    return data.data;
                else
                    Stdlog.error(this.id, data);
                throw data;
            }
            else {
                await common.sleep(50);
            }
        }
        throw new Error(JSON.stringify({ status: 'error', message: '请求超时' }));
    }
}

export { LagrangeCore as default };
