declare class DatabaseController {
    getKeys(ctx: any): Promise<void>;
    getKey(ctx: any): Promise<void>;
    setKey(ctx: any): Promise<void>;
    delKey(ctx: any): Promise<void>;
    delKeys(ctx: any): Promise<void>;
}
declare const _default: DatabaseController;
export default _default;
