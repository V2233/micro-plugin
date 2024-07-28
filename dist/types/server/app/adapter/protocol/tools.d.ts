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
    fs: any;
    $emit(name?: string, data?: {}): void;
    sleep(time: any, promise?: any): any;
    fsStat(path: any, opts?: any): Promise<any>;
    mkdir(dir: any, opts?: any): Promise<boolean>;
    rm(file: any, opts?: any): Promise<boolean>;
    download(url: any, file: any, opts: any): Promise<{
        url: any;
        file: any;
        buffer: any;
    }>;
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
}
declare const _default: BotAPI;
export default _default;
