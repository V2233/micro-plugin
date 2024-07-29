import type { pluginType } from '../server/controller/plugin/pluginType.js';
declare const plugin: any;
export declare class RunPlugin extends plugin {
    pluginsPath: string;
    indexPath: string;
    cronTask: {};
    pluginsList: pluginType[];
    constructor();
    init(): Promise<void>;
    getPluginsList(): any;
    checkAuth(plugin: pluginType): boolean;
    setPluginsList(value: pluginType[]): Promise<void>;
    run(e?: (typeof this.e | {
        taskId?: string;
    })): Promise<boolean>;
    viewPluginsList(): Promise<void>;
    deletePlugin(): Promise<void>;
}
export {};
