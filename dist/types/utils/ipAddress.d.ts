export declare function getAllWebAddress(): Promise<{
    custom: any[];
    local: string[];
    remote: any;
}>;
export declare function getWebAddress(allIp?: boolean): any[];
export declare function getLocalIps(port: any): any[];
export declare function getRemoteIps(): Promise<any>;
