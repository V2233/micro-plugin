/// <reference types="node" />
import { type FileTypeResult } from "file-type";
interface fileInfoType {
    name: string;
    url: string;
    buffer: Buffer;
    type: FileTypeResult;
    path: string;
    md5: string;
}
declare class BotAPI {
    constructor();
    fs: any;
    stat: {
        start_time: number;
    };
    get uin(): number[];
    sleep(time: number, promise?: any): any;
    fsStat(path: string, opts?: any): Promise<any>;
    mkdir(dir: string, opts?: any): Promise<boolean>;
    rm(file: string, opts?: any): Promise<boolean>;
    download(url: string, file: string, opts: any): Promise<{
        url: string;
        file: string;
        buffer: any;
    }>;
    $emit(name?: string, data?: {}): void;
    prepareEvent(data: any): void;
    StringOrNull(data: any): string;
    StringOrBuffer(data: any, base64: any): any;
    getCircularReplacer(): (key: any, value: any) => any;
    String(data: any, opts?: any): any;
    Buffer(data: any, opts?: any): Promise<any>;
    fileType(data: any, opts?: {}): Promise<fileInfoType>;
    fileToUrl(file: any, opts?: any): Promise<any>;
    fileSend(req: any): void;
    makeForwardMsg(msg: any): {
        type: string;
        data: any;
    };
    sendForwardMsg(send: any, msg: any): Promise<any[]>;
    getTimeDiff(time1?: number, time2?: number): string;
    getFriendArray(): any[];
    getFriendList(): any[];
    getFriendMap(): Map<any, any>;
    get fl(): Map<any, any>;
    getGroupArray(): any[];
    getGroupList(): any[];
    getGroupMap(): Map<any, any>;
    get gl(): Map<any, any>;
    get gml(): Map<any, any>;
    pickFriend(user_id: any, strict?: any): any;
    get pickUser(): (user_id: any, strict?: any) => any;
    pickGroup(group_id: any, strict?: any): any;
    pickMember(group_id: any, user_id: any): any;
}
declare const _default: BotAPI;
export default _default;
