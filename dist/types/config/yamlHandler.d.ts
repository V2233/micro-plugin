export default class YamlHandler {
    yamlPath: string;
    private isWatch;
    document: any;
    watcher: any;
    isSave: boolean;
    constructor(yamlPath: string, isWatch?: boolean);
    initYaml(): void;
    get jsonData(): any;
    has(keyPath: string): any;
    get(keyPath: string): any;
    set(keyPath: string, value: any): void;
    delete(keyPath: string): void;
    addIn(keyPath: string, value: any): void;
    setData(data: any): void;
    setDataRecursion(data: any, parentKeys: any): void;
    mapParentKeys(parentKeys: any): any;
    deleteKey(keyPath: any): void;
    save(path?: string): void;
}
