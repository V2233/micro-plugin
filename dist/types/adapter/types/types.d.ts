import { Sendable, type GroupMessage } from 'icqq';
import { Client } from 'icqq';
import { EventMap, PrivateMessageEvent, DiscussMessageEvent } from 'icqq';
type OmitKeys<T, K extends keyof T> = {
    [Key in keyof T as Key extends K ? never : Key]: T[Key];
};
type PersonWithoutEmail = OmitKeys<EventMap, 'message.group' | 'message'>;
export interface EventEmun extends PersonWithoutEmail {
    'message.group': (event: EventType) => void;
    'message': (event: EventType) => void | PrivateMessageEvent | DiscussMessageEvent;
}
export type PluginSuperType = {
    name?: string;
    dsc?: string;
    namespace?: any;
    handler?: any;
    task?: any;
    priority?: number;
    event?: keyof EventEmun;
    rule?: RuleType;
};
export type RuleType = {
    reg?: RegExp | string;
    fnc?: string;
    event?: keyof EventEmun;
    log?: boolean;
    permission?: 'master' | 'owner' | 'admin' | 'all';
}[];
export interface EventType extends GroupMessage {
    [key: string]: any;
    message_type: any;
    isMaster: boolean;
    isGroup: boolean;
    isPrivate: boolean;
    isGuild: boolean;
    user_id: number;
    user_name: string;
    user_avatar: string;
    msg: string;
    img: string[];
    group_id: number;
    group_name: string;
    group_avatar: string;
    at?: any;
    atBot: any;
    file: any;
    logText: string;
    logFnc: string;
    reply: (msg: Sendable, quote?: boolean, data?: {
        recallMsg?: number;
        at?: any;
    }) => Promise<any>;
    replyNew?: any;
    notice_type: any;
    group: {
        is_owner: any;
        recallMsg: (...arg: any[]) => any;
        getMemberMap: any;
        quit: any;
        mute_left: any;
        pickMember: any;
        sendMsg: any;
        name: any;
        makeForwardMsg: any;
    };
    bot: typeof Client.prototype;
    approve: any;
    member: any;
    self_id?: any;
    detail_type?: any;
    hasAlias?: any;
    friend?: any;
}
export {};
