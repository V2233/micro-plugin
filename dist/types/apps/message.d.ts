import type { pluginType } from '../server/controller/plugin/pluginType.js';
declare const plugin: any;
declare class RunPlugin extends plugin {
    constructor();
    accept(e: any): Promise<void>;
    setPluginsList(value: pluginType[]): Promise<void>;
    viewPluginsList(): Promise<void>;
    deletePlugin(): Promise<void>;
}
export { RunPlugin };
