declare class PluginController {
    getPluginList(ctx: any): Promise<void>;
    setPlugin(ctx: any): Promise<void>;
    deletePlugin(ctx: any): Promise<void>;
    editorPlugin(ctx: any): Promise<void>;
    getImageJson(ctx: any): Promise<void>;
    getSegResources(ctx: any): Promise<void>;
}
declare const _default: PluginController;
export default _default;
