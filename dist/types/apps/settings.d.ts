declare let plugin: any;
export declare class Settings extends plugin {
    constructor();
    setWebPort(): Promise<void>;
    startWeb(): Promise<void>;
    reStartWeb(): Promise<void>;
    closeWeb(): Promise<void>;
}
export {};