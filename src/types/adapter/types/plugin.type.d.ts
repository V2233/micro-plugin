import { type EventMap } from 'icqq';
import { PluginSuperType, RuleType, EventType } from './types.js';
declare class BasePlugin {
    rule: RuleType;
    priority: number;
    event: keyof EventMap;
    e: EventType;
    reply(msg?: any[] | string, quote?: boolean, data?: {}): false | Promise<any>;
    conKey(isGroup?: boolean): string;
    setContext(type: string, isGroup?: boolean, time?: number, timeout?: string): any;
    getContext(type?: string, isGroup?: boolean): any;
    finish(type: string, isGroup?: boolean): void;
}
export declare class Plugin extends BasePlugin {
    name: PluginSuperType['name'];
    dsc: PluginSuperType['dsc'];
    task: PluginSuperType['task'];
    namespace: PluginSuperType['namespace'];
    handler: PluginSuperType['handler'];
    group_id: number;
    groupId: number;
    user_id: number;
    userId: number;
    constructor(init?: PluginSuperType);
    awaitContext(...args: any[]): Promise<unknown>;
    resolveContext(context: any): void;
}
export declare const plugin: typeof Plugin;
export {};
