declare let plugin: typeof import("yunzai").Plugin;
export declare class Service extends plugin {
    constructor();
    listen(): Promise<boolean>;
}
export {};
