/// <reference types="node" />
import { IncomingMessage } from 'http';
declare class OnebotV11 {
    bot: typeof Bot.prototype;
    id: string;
    name: string;
    path: string;
    echo: any;
    timeout: number;
    constructor(bot: typeof Bot.prototype, req?: IncomingMessage);
    makeLog(msg: any): any;
    sendApi(data: any, ws: any, action: any, params?: {}): Promise<unknown>;
    makeFile(file: any): Promise<any>;
    makeMsg(msg: any): Promise<any[][]>;
    sendMsg(msg: any, send: any, sendForwardMsg: any): Promise<any>;
    sendFriendMsg(data: any, msg: any): Promise<any>;
    sendGroupMsg(data: any, msg: any): Promise<any>;
    sendGuildMsg(data: any, msg: any): Promise<any>;
    recallMsg(data: any, message_id: any): Promise<any[]>;
    parseMsg(msg: any): any[];
    getMsg(data: any, message_id: any): Promise<any>;
    getGroupMsgHistory(data: any, message_seq: any, count: any): Promise<any>;
    getForwardMsg(data: any, message_id: any): Promise<any>;
    makeForwardMsg(msg: any): Promise<any[]>;
    sendFriendForwardMsg(data: any, msg: any): Promise<any>;
    sendPrivateForwardMsg(data: any, msg: any): Promise<any>;
    sendGroupForwardMsg(data: any, msg: any): Promise<any>;
    getFriendArray(data: any): Promise<any>;
    getFriendList(data: any): Promise<any[]>;
    getFriendMap(data: any): Promise<Map<any, any>>;
    getFriendInfo(data: any): any;
    getGroupArray(data: any): Promise<any>;
    getGroupList(data: any): Promise<any[]>;
    getGroupMap(data: any): Promise<Map<any, any>>;
    getGroupInfo(data: any): any;
    getMemberArray(data: any): Promise<any>;
    getMemberList(data: any): Promise<any[]>;
    getMemberMap(data: any): Promise<Map<any, any>>;
    getGroupMemberMap(data: any): Promise<void>;
    getMemberInfo(data: any): any;
    getGuildArray(data: any): Promise<any>;
    getGuildInfo(data: any): any;
    getGuildChannelArray(data: any): Promise<any>;
    getGuildChannelMap(data: any): Promise<Map<any, any>>;
    getGuildMemberArray(data: any): Promise<any[]>;
    getGuildMemberList(data: any): Promise<(...items: any[]) => number>;
    getGuildMemberMap(data: any): Promise<Map<any, any>>;
    getGuildMemberInfo(data: any): any;
    setProfile(data: any, profile: any): any;
    setAvatar(data: any, file: any): Promise<any>;
    sendLike(data: any, times: any): any;
    setGroupName(data: any, group_name: any): any;
    setGroupAvatar(data: any, file: any): Promise<any>;
    setGroupAdmin(data: any, user_id: any, enable: any): any;
    setGroupCard(data: any, user_id: any, card: any): any;
    setGroupTitle(data: any, user_id: any, special_title: any, duration: any): any;
    sendGroupSign(data: any): any;
    setGroupBan(data: any, user_id: any, duration: any): any;
    setGroupWholeKick(data: any, enable: any): any;
    setGroupKick(data: any, user_id: any, reject_add_request: any): any;
    setGroupLeave(data: any, is_dismiss: any): any;
    downloadFile(data: any, url: any, thread_count: any, headers: any): any;
    sendFriendFile(data: any, file: any, name?: string): Promise<any>;
    sendGroupFile(data: any, file: any, folder: any, name?: string): Promise<any>;
    deleteGroupFile(data: any, file_id: any, busid: any): any;
    createGroupFileFolder(data: any, name: any): any;
    getGroupFileSystemInfo(data: any): any;
    getGroupFiles(data: any, folder_id: any): any;
    getGroupFileUrl(data: any, file_id: any, busid: any): any;
    getGroupFs(data: any): {
        upload: (file: any, folder: any, name: any) => Promise<any>;
        rm: (file_id: any, busid: any) => any;
        mkdir: (name: any) => any;
        df: () => any;
        ls: (folder_id: any) => any;
        download: (file_id: any, busid: any) => any;
    };
    setFriendAddRequest(data: any, flag: any, approve: any, remark: any): any;
    setGroupAddRequest(data: any, flag: any, sub_type: any, approve: any, reason: any): any;
    pickFriend(data: any, user_id: any): any;
    pickMember(data: any, group_id: any, user_id: any): any;
    pickGroup(data: any, group_id: any): any;
    connect(data: any, ws: any): Promise<void>;
    makeMessage(data: any): void;
    makeNotice(data: any): Promise<void>;
    makeRequest(data: any): void;
    heartbeat(data: any): void;
    makeMeta(data: any, ws: any): void;
    message(data: any, ws: any): false | void;
}
export default OnebotV11;
