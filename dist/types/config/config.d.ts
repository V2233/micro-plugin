declare class Cfg {
    config: {};
    watcher: {
        config: {};
        defSet: {};
    };
    constructor();
    get qq(): number;
    get pwd(): any;
    get bot(): any;
    get other(): any;
    get redis(): any;
    get renderer(): any;
    get notice(): any;
    get masterQQ(): string[];
    _package: any;
    get package(): any;
    getGroup(groupId?: string): any;
    getOther(): any;
    getNotice(): any;
    getBg(): any;
    getdefSet(name: string): any;
    getBotdefSet(name: string): any;
    getConfig(name: string): any;
    getMergedConfig(name: string): any;
    getBotConfig(name: string): any;
    setConfig(data: any, parentKeys: any[], name: string): void;
    getYaml(type: string, name: string, path?: string): any;
    setYaml(type: string, name: string, data: any, parentKeys: any[]): void;
    mergeYamlFile(): void;
    watch(file: string, name: string, type?: string): void;
}
declare const _default: Cfg;
export default _default;
