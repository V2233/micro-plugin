import type { pluginType } from './pluginType.js';
export default class PluginHandler {
    curPlugin?: pluginType;
    pluginsPath: string;
    indexPath: string;
    pluginsArr: pluginType[];
    constructor(curPlugin?: pluginType);
    get pluginsKey(): string;
    get pluginsList(): any;
    set pluginsList(value: any);
    get plugins(): string;
    setCurPlugin(value: pluginType): void;
    setPluginsList(value: pluginType[]): Promise<void>;
    addPlugin(value?: any, id?: string): Promise<boolean>;
    deletePlugin(index: number): Promise<boolean>;
    editorPlugin(id: string, value: pluginType): Promise<boolean>;
}
