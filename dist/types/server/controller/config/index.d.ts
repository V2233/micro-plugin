declare class ConfigController {
    getBotConfig(ctx: any): Promise<void>;
    setBotConfig(ctx: any): Promise<void>;
    getUserConfig(ctx: any): Promise<void>;
    setUserConfig(ctx: any): Promise<void>;
}
declare const _default: ConfigController;
export default _default;
