import { randomUUID } from 'crypto';
import { FormData, fileFromSync } from 'node-fetch';
import '../../../../../utils/index.js';
import { MicroBus } from '../../common/global.js';
import Stdlog from '../../../../../utils/stdlog.js';

let api = {
    async get_msg(id, message_id) {
        const params = { message_id };
        return await this.SendApi(id, 'get_msg', params);
    },
    async delete_msg(id, message_id) {
        const params = { message_id };
        return await this.SendApi(id, 'delete_msg', params);
    },
    async get_login_info(id) {
        const params = {};
        return await this.SendApi(id, 'get_login_info', params);
    },
    async set_qq_profile(id, nickname, company, email, college, personal_note, age, birthday) {
        const params = { nickname, company, email, college, personal_note, age, birthday };
        return await this.SendApi(id, 'set_qq_profile', params);
    },
    async get_stranger_info(id, user_id, no_cache = false) {
        const params = { user_id, no_cache };
        return await this.SendApi(id, 'get_stranger_info', params);
    },
    async get_friend_list(id) {
        const params = {};
        return await this.SendApi(id, 'get_friend_list', params);
    },
    async get_unidirectional_friend_list(id) {
        const params = {};
        return await this.SendApi(id, 'get_unidirectional_friend_list', params);
    },
    async get_group_info(id, group_id, refresh = false) {
        const params = { group_id, refresh };
        return await this.SendApi(id, 'get_group_info', params);
    },
    async get_group_list(id) {
        const params = {};
        return await this.SendApi(id, 'get_group_list', params);
    },
    async get_group_member_info(id, group_id, user_id, refresh = false) {
        const params = { group_id, user_id, refresh };
        return await this.SendApi(id, 'get_group_member_info', params);
    },
    async get_group_member_list(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'get_group_member_list', params);
    },
    async get_group_honor_info(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'get_group_honor_info', params);
    },
    async get_group_system_msg(id) {
        const params = {};
        return await this.SendApi(id, 'get_group_system_msg', params);
    },
    async get_essence_msg_list(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'get_essence_msg_list', params);
    },
    async is_blacklist_uin(id, user_id) {
        const params = { user_id };
        return await this.SendApi(id, 'is_blacklist_uin', params);
    },
    async delete_friend(id, user_id) {
        const params = { user_id };
        return await this.SendApi(id, 'delete_friend', params);
    },
    async delete_unidirectional_friend(id, user_id) {
        const params = { user_id };
        return await this.SendApi(id, 'delete_unidirectional_friend', params);
    },
    async set_group_name(id, group_id, group_name) {
        const params = { group_id, group_name };
        return await this.SendApi(id, 'set_group_name', params);
    },
    async set_group_portrait(id, group_id, file, cache = 1) {
        const params = { group_id, file, cache };
        return await this.SendApi(id, 'set_group_portrait', params);
    },
    async set_group_admin(id, group_id, user_id, enable) {
        const params = { group_id, user_id, enable };
        return await this.SendApi(id, 'set_group_admin', params);
    },
    async set_group_card(id, group_id, user_id, card) {
        const params = { group_id, user_id, card };
        return await this.SendApi(id, 'set_group_card', params);
    },
    async set_group_special_title(id, group_id, user_id, special_title) {
        const params = { group_id, user_id, special_title };
        return await this.SendApi(id, 'set_group_special_title', params);
    },
    async set_group_ban(id, group_id, user_id, duration) {
        const params = { group_id, user_id, duration };
        return await this.SendApi(id, 'set_group_ban', params);
    },
    async set_group_whole_ban(id, group_id, enable) {
        const params = { group_id, enable };
        return await this.SendApi(id, 'set_group_whole_ban', params);
    },
    async set_essence_msg(id, message_id) {
        const params = { message_id };
        return await this.SendApi(id, 'set_essence_msg', params);
    },
    async delete_essence_msg(id, message_id) {
        const params = { message_id };
        return await this.SendApi(id, 'delete_essence_msg', params);
    },
    async send_group_sign(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'send_group_sign', params);
    },
    async send_group_notice(id, group_id, content, image) {
        const params = { group_id, content, image };
        return await this.SendApi(id, '_send_group_notice', params);
    },
    async get_group_notice(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, '_get_group_notice', params);
    },
    async set_group_kick(id, group_id, user_id, reject_add_request) {
        const params = { group_id, user_id, reject_add_request };
        return await this.SendApi(id, 'set_group_kick', params);
    },
    async set_group_leave(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'set_group_leave', params);
    },
    async group_touch(id, group_id, user_id) {
        const params = {
            group_id,
            message: [{ type: 'touch', data: { id: user_id } }]
        };
        return await this.SendApi(id, 'send_group_msg', params);
    },
    async upload_private_file(id, user_id, file, name) {
        const params = { user_id, file, name };
        return await this.SendApi(id, 'upload_private_file', params);
    },
    async upload_group_file(id, group_id, file, name) {
        const params = { group_id, file, name };
        return await this.SendApi(id, 'upload_group_file', params);
    },
    async delete_group_file(id, group_id, file_id, busid) {
        const params = { group_id, file_id, busid };
        return await this.SendApi(id, 'delete_group_file', params);
    },
    async create_group_file_folder(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'create_group_file_folder', params);
    },
    async delete_group_folder(id, group_id, folder_id) {
        const params = { group_id, folder_id };
        return await this.SendApi(id, 'delete_group_folder', params);
    },
    async get_group_file_system_info(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'get_group_file_system_info', params);
    },
    async get_group_root_files(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'get_group_root_files', params);
    },
    async get_group_files_by_folder(id, group_id, folder_id) {
        const params = { group_id, folder_id };
        return await this.SendApi(id, 'get_group_files_by_folder', params);
    },
    async get_group_file_url(id, group_id, file_id, busid) {
        const params = { group_id, file_id, busid };
        return await this.SendApi(id, 'get_group_file_url', params);
    },
    async send_like(id, user_id, times) {
        times = Number(times);
        times = times > 20 || times > 10 ? times = 20 : times = 10;
        const params = { user_id, times };
        return await this.SendApi(id, 'send_like', params);
    },
    async get_history_msg(id, message_type, user_id, group_id, count, message_id) {
        const params = { message_type, user_id, group_id, count, message_id };
        return await this.SendApi(id, 'get_history_msg', params);
    },
    async get_group_msg_history(id, group_id, count, message_id) {
        const params = { group_id, message_id, count };
        return await this.SendApi(id, 'get_group_msg_history', params);
    },
    async get_friend_msg_history(id, user_id, count, message_id) {
        const params = { user_id, message_id, count };
        return await this.SendApi(id, 'get_friend_msg_history', params);
    },
    async clear_msgs(id, message_type, TargetID) {
        let type = 'user_id';
        if (message_type == 'group')
            type = 'group_id';
        const params = { message_type, [type]: TargetID };
        return await this.SendApi(id, 'clear_msgs', params);
    },
    async get_cookies(id, domain = '') {
        const params = { domain };
        return await this.SendApi(id, 'get_cookies', params);
    },
    async get_csrf_token(id, domain = '') {
        const params = { domain };
        return await this.SendApi(id, 'get_csrf_token', params);
    },
    async set_friend_add_request(id, flag, approve, remark = '') {
        const params = { flag, approve, remark };
        return await this.SendApi(id, 'set_friend_add_request', params);
    },
    async set_group_add_request(id, flag, sub_type, approve, reason = '') {
        const params = { flag, sub_type, approve, reason };
        return await this.SendApi(id, 'set_group_add_request', params);
    },
    async get_weather_city_code(id, city) {
        const params = { city };
        return await this.SendApi(id, 'get_weather_city_code', params);
    },
    async upload_file(id, file) {
        let formData = new FormData();
        formData.append('file', fileFromSync(file));
        let data = await this.httpApi(id, 'upload_file', {}, formData);
        return data;
    },
    async download_file(id, file, thread_cnt, headers) {
        if (typeof file !== 'string')
            return;
        let type;
        if (/https?:\/\//.test(file)) {
            type = 'url';
        }
        else if (/base64:\/\//.test(file)) {
            type = 'base64';
            file = file.replace('base64://', '');
        }
        else {
            return Stdlog.error(id, `下载文件到缓存目录Api：未适配的格式，${file}`);
        }
        let params = { [type]: file };
        if (headers) {
            params.headers = headers;
        }
        if (thread_cnt) {
            params.thread_cnt = thread_cnt;
        }
        return await this.SendApi(id, 'download_file', params);
    },
    async get_forward_msg(id, msg_id) {
        const params = { msg_id };
        return await this.SendApi(id, 'get_forward_msg', params);
    },
    async send_group_forward_msg(id, group_id, messages) {
        const params = { group_id, messages };
        return await this.SendApi(id, 'send_group_forward_msg', params);
    },
    async send_private_forward_msg(id, user_id, messages) {
        const params = { user_id, messages };
        return await this.SendApi(id, 'send_private_forward_msg', params);
    },
    async get_prohibited_member_list(id, group_id) {
        const params = { group_id };
        return await this.SendApi(id, 'get_prohibited_member_list', params);
    },
    async send_private_msg(uin, user_id, message, raw_message, node) {
        let user_name;
        try {
            user_name = Bot[uin].fl.get(user_id)?.user_name;
            user_name = user_name ? `${user_name}(${user_id})` : user_id;
        }
        catch {
            user_name = user_id;
        }
        Stdlog.info(uin, `<发好友:${user_name}> => ${raw_message}`);
        let res;
        if (node) {
            const id = await this.SendApi(uin, 'send_private_forward_msg', { user_id, messages: message.map(i => i.data) });
            res = await this.SendApi(uin, 'send_private_msg', { user_id, message: { type: 'forward', data: { id } } });
        }
        else {
            const params = { user_id, message };
            res = await this.SendApi(uin, 'send_private_msg', params);
        }
        return {
            ...res,
            seq: res.message_id,
            rand: 1
        };
    },
    async send_group_msg(uin, group_id, message, raw_message, node) {
        let group_name;
        try {
            group_name = Bot[uin].gl.get(group_id)?.group_name;
            group_name = group_name ? `${group_name}(${group_id})` : group_id;
        }
        catch {
            group_name = group_id;
        }
        Stdlog.info(uin, `<发送群聊:${group_name}> => ${raw_message}`);
        let res;
        if (node) {
            const id = await this.SendApi(uin, 'send_group_forward_msg', { group_id, messages: message.map(i => i.data) });
            res = await this.SendApi(uin, 'send_group_msg', { group_id, message: { type: 'forward', data: { id } } });
        }
        else {
            const params = { group_id, message };
            res = await this.SendApi(uin, 'send_group_msg', params);
        }
        return {
            ...res,
            time: res.message_id,
            seq: res.message_id,
            rand: 1
        };
    },
    async SendApi(id, action, params) {
        const echo = randomUUID();
        const log = JSON.stringify({ echo, action, params });
        Stdlog.debug(id, '[ws] send -> ' + log);
        Bot[id].ws.send(log);
        for (let i = 0; i < 1200; i++) {
            const data = MicroBus.ws.echo[echo];
            if (data) {
                delete MicroBus.ws.echo[echo];
                if (data.status === 'ok')
                    return data.data;
                else
                    Stdlog.error(id, data);
                throw data;
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }
        throw new Error(JSON.stringify({ status: 'error', message: '请求超时' }));
    }
};

export { api as default };
