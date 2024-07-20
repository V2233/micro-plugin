import type { pluginType } from '../server/controller/plugin/pluginType.js';
declare let plugin: typeof import("yunzai").Plugin;
export declare class RunPlugin extends plugin {
    pluginsPath: string;
    indexPath: string;
    cronTask: {};
    pluginReadMode: string;
    constructor();
    init(): Promise<void>;
    get pluginsKey(): string;
    pluginsList(): Promise<any>;
    checkAuth(plugin: pluginType): boolean;
    checkoutReadMode(): void;
    setPluginsList(value: pluginType[]): Promise<void>;
    run(e?: {
        taskId: string;
    }): Promise<boolean>;
    viewPluginsList(): Promise<void>;
    deletePlugin(): Promise<void>;
}
export {};
