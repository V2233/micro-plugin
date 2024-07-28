/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import http from "node:http";
export default class Yunzai extends EventEmitter {
    stat: {
        start_time: number;
    };
    bot: this;
    bots: {};
    uin: any[] & {
        toJSON(): any;
        toString(raw: any, ...args: any[]): any;
        includes(value: any): any;
    };
    adapter: any[];
    express: import("express-serve-static-core").Express & {
        quiet: any[];
    };
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    wss: any;
    wsf: any;
    fs: any;
    constructor();
    wsConnect(req: any, socket: any, head: any): void;
    serverEADDRINUSE(err: any): Promise<void>;
    serverLoad(): Promise<void>;
    run(): Promise<void>;
    sleep(time: any, promise: any): any;
    fsStat(path: any, opts: any): Promise<false | import("fs").Stats>;
    mkdir(dir: any, opts: any): Promise<boolean>;
    rm(file: any, opts: any): Promise<boolean>;
    glob(path: any, opts?: {}): Promise<any[]>;
    download(url: any, file: any, opts: any): Promise<{
        url: any;
        file: any;
        buffer: any;
    }>;
    makeMap(parent_map: any, parent_key: any, map: any): any;
    setMap(map: any, set: any, key: any, value: any): Promise<any>;
    delMap(map: any, del: any, key: any): Promise<boolean>;
    importMap(dir: any, map: any): Promise<any>;
    getMap(dir: any): Promise<Map<any, any>>;
    StringOrNull(data: any): string;
    StringOrBuffer(data: any, base64: any): any;
    getCircularReplacer(): (key: any, value: any) => any;
    String(data: any, opts: any): any;
    Loging(data: any, opts?: any): any;
    Buffer(data: any, opts?: {}): Promise<any>;
    fileType(data: any, opts?: {}): Promise<{
        name: any;
    }>;
    fileToUrl(file: any, opts?: {}): Promise<any>;
    fileSend(req: any): void;
    exec(cmd: any, opts?: {}): Promise<unknown>;
    cmdPath(cmd: any, opts?: {}): Promise<any>;
    makeLog(level: any, msg: any, id: any): void;
    prepareEvent(data: any): void;
    em(name?: string, data?: {}): void;
    getFriendArray(): any[];
    getFriendList(): any[];
    getFriendMap(): Map<any, any>;
    get fl(): Map<any, any>;
    getGroupArray(): any[];
    getGroupList(): any[];
    getGroupMap(): Map<any, any>;
    get gl(): Map<any, any>;
    get gml(): Map<any, any>;
    pickFriend(user_id: any, strict: any): any;
    get pickUser(): (user_id: any, strict: any) => any;
    pickGroup(group_id: any, strict: any): any;
    pickMember(group_id: any, user_id: any): any;
    sendFriendMsg(bot_id: any, user_id: any, ...args: any[]): any;
    sendGroupMsg(bot_id: any, group_id: any, ...args: any[]): any;
    getTextMsg(fnc?: () => boolean): Promise<unknown>;
    getMasterMsg(): Promise<unknown>;
    sendMasterMsg(msg: any, bot_array?: string[], sleep?: number): Promise<{}>;
    makeForwardMsg(msg: any): {
        type: string;
        data: any;
    };
    makeForwardArray(msg?: any[], node?: {}): {
        type: string;
        data: any;
    };
    sendForwardMsg(send: any, msg: any): Promise<any[]>;
    getTimeDiff(time1?: number, time2?: number): string;
}
