import PluginHandler from './pluginHandler.js';
import { readFileSync } from 'fs';
import { botInfo } from '#env';
import { join } from 'path';
class PluginController {
    async getPluginList(ctx) {
        const pluginInstance = new PluginHandler();
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsList
        };
    }
    async setPlugin(ctx) {
        const pluginInstance = new PluginHandler(ctx.request.body);
        pluginInstance.addPlugin();
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        };
    }
    async deletePlugin(ctx) {
        const { index } = ctx.request.query;
        const pluginInstance = new PluginHandler();
        pluginInstance.deletePlugin(index);
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        };
    }
    async editorPlugin(ctx) {
        const { index } = ctx.request.query;
        const pluginInstance = new PluginHandler();
        pluginInstance.editorPlugin(index, ctx.request.body);
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        };
    }
    async getImageJson(ctx) {
        const { id, hash } = ctx.request.query;
        const htmlPath = join(botInfo.WORK_PATH, 'data', 'micro-plugin', 'plugins', id, hash + '.json');
        const imageData = readFileSync(htmlPath, 'utf8');
        ctx.body = {
            code: 200,
            message: 'success',
            data: imageData
        };
    }
}
export default new PluginController();
