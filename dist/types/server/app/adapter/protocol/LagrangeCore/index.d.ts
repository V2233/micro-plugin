/// <reference types="node" />
import { IncomingMessage } from 'http';
declare class LagrangeCore {
    bot: typeof Bot.prototype;
    id: number;
    nickname: string;
    version: string;
    QQVersion: string;
    constructor(bot: typeof Bot.prototype, request?: IncomingMessage);
    event(data: any): Promise<boolean>;
    meta_event(data: any): Promise<void>;
    message(data: any): Promise<void>;
    message_sent(data: any): Promise<void>;
    notice(data: any): Promise<any>;
    request(data: any): Promise<any>;
    LoadBot(): Promise<void>;
    LoadAll(): Promise<string>;
    loadGroup(id?: number): Promise<any>;
    loadGroupMemberList(groupId: any, id?: number): Promise<void>;
    loadFriendList(id?: number): Promise<void>;
    pickGroup(group_id: any): {
        name: any;
        is_admin: boolean;
        is_owner: boolean;
        sendMsg: (msg: any) => Promise<any>;
        recallMsg: (msg_id: any) => Promise<any>;
        makeForwardMsg: (message: any) => Promise<{
            test: boolean;
            message: any[];
            data: {
                type: string;
                text: string;
                app: string;
                meta: {
                    detail: {
                        news: {
                            text: string;
                        }[];
                    };
                    resid: string;
                    uniseq: string;
                    summary: string;
                };
            };
        }>;
        pokeMember: (operator_id: any) => Promise<any>;
        muteMember: (user_id: any, time: any) => Promise<any>;
        muteAll: (type: any) => Promise<any>;
        setName: (name: any) => Promise<any>;
        quit: () => Promise<any>;
        setAdmin: (qq: any, type: any) => Promise<any>;
        kickMember: (qq: any, reject_add_request?: boolean) => Promise<boolean>;
        setTitle: (qq: any, title: any, duration: any) => Promise<boolean>;
        setCard: (qq: any, card: any) => Promise<any>;
        pickMember: (id: any) => any;
        getMemberMap: () => Promise<any>;
        setEssenceMessage: (msg_id: any) => Promise<any>;
        removeEssenceMessage: (msg_id: any) => Promise<any>;
        sendFile: (filePath: any) => Promise<any>;
        sign: () => Promise<any>;
        shareMusic: (platform: any, id: any) => Promise<any>;
        getFileUrl: (fid: any) => Promise<any>;
        getChatHistory: (msg_id: any, num: any, reply: any) => Promise<any[]>;
    };
    pickFriend(user_id: any): {
        sendMsg: (msg: any) => Promise<any>;
        recallMsg: (msg_id: any) => Promise<any>;
        makeForwardMsg: (message: any) => Promise<{
            test: boolean;
            message: any[];
            data: {
                type: string;
                text: string;
                app: string;
                meta: {
                    detail: {
                        news: {
                            text: string;
                        }[];
                    };
                    resid: string;
                    uniseq: string;
                    summary: string;
                };
            };
        }>;
        getAvatarUrl: (size?: number) => string;
        sendFile: (filePath: any) => Promise<any>;
        getFileUrl: (fid: any) => Promise<any>;
        getChatHistory: (msg_id: any, num: any, reply: any) => Promise<any[]>;
    };
    pickMember(group_id: any, user_id: any, refresh?: boolean, cb?: (res: any) => void): any;
    getMemberMap(group_id: any): Promise<any>;
    getChannelList(guild_id: any): {
        channel_id: string;
        channel_name: string;
        channel_type: string;
        guild_id: string;
    };
    upload_group_file(group_id: any, file: any): Promise<any>;
    upload_private_file(user_id: any, file: any): Promise<any>;
    getFileUrl(fid: string): Promise<any>;
    shareMusic(group_id: any, platform: any, id: any): Promise<any>;
    setEssenceMessage(msg_id: any): Promise<any>;
    removeEssenceMessage(msg_id: any): Promise<any>;
    getGroupMemberInfo(group_id: any, user_id: any, refresh: any): Promise<any>;
    quit(group_id: any): Promise<any>;
    makeForwardMsg(data: any): Promise<{
        test: boolean;
        message: any[];
        data: {
            type: string;
            text: string;
            app: string;
            meta: {
                detail: {
                    news: {
                        text: string;
                    }[];
                };
                resid: string;
                uniseq: string;
                summary: string;
            };
        };
    }>;
    recallMsg(msg_id: any): Promise<any>;
    getMuteList(group_id: any): Promise<any>;
    ICQQEvent(data: any): Promise<any>;
    getMessage(msg: any, group_id: any, reply?: boolean): Promise<{
        message: any[];
        ToString: string;
        raw_message: string;
        log_message: string;
        source: any;
        file: any;
    }>;
    source(i: any, group_id: any): Promise<any>;
    sendReplyMsg(e: any, group_id: any, user_id: any, msg: any, quote: any): Promise<any>;
    sendFriendMsg(user_id: any, msg: any): Promise<any>;
    sendGroupMsg(group_id: any, msg: any): Promise<any>;
    getLagrangeCore(data: any): Promise<{
        message: any[];
        raw_message: string;
        node: any;
    }>;
    sendApi(action: any, params: any): Promise<any>;
}
export default LagrangeCore;
