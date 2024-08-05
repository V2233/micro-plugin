declare class ConfigController {
    getBotConfig(ctx: any): Promise<void>;
    setBotConfig(ctx: any): Promise<void>;
    getUserConfig(ctx: any): Promise<void>;
    setUserConfig(ctx: any): Promise<void>;
    getProtocolConfig(ctx: any): Promise<void>;
    setProtocolConfig(ctx: any): Promise<void>;
    getPluginsInfoList(ctx: any): Promise<void>;
    getPluginConfig(ctx: any): Promise<void>;
    setPluginConfig(ctx: any): Promise<void>;
}
declare const _default: ConfigController;
export default _default;
