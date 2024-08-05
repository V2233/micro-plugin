declare function sleep(ms: any): Promise<unknown>;
declare function init(key?: string): Promise<void>;
declare function array(data: any): any;
declare function makeForwardMsg(data: any, node?: boolean, e?: any): Promise<{
    type: string;
    data?: any;
    text?: any[];
}>;
declare function base64(path: any): Promise<string>;
declare function uploadQQ(file: any, uin?: number): Promise<string>;
declare function getUrls(url: any, exclude?: any[]): any[];
declare function message_id(): string;
declare function mkdirs(dirname: any): boolean;
declare function downloadFile(url: any, destPath: any, headers?: {}, absolute?: boolean): Promise<any>;
declare function getFile(i: any): {
    type: string;
    file: any;
};
declare function recvMsg(id: any, adapter: any, read?: boolean): Promise<string | 0>;
declare function MsgTotal(id: any, adapter: any, type?: string, read?: boolean): Promise<string | 0>;
declare function limitString(str: any, maxLength: any, addDots?: boolean): any;
declare const _default: {
    sleep: typeof sleep;
    array: typeof array;
    makeForwardMsg: typeof makeForwardMsg;
    base64: typeof base64;
    uploadQQ: typeof uploadQQ;
    getUrls: typeof getUrls;
    init: typeof init;
    message_id: typeof message_id;
    downloadFile: typeof downloadFile;
    mkdirs: typeof mkdirs;
    getFile: typeof getFile;
    recvMsg: typeof recvMsg;
    MsgTotal: typeof MsgTotal;
    limitString: typeof limitString;
};
export default _default;
