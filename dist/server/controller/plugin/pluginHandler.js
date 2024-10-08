import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'path';
import { pluginInfo } from '../../../env.js';

class PluginHandler {
    curPlugin;
    pluginsPath;
    indexPath;
    pluginsArr;
    constructor(curPlugin) {
        this.curPlugin = curPlugin;
        this.indexPath = join(pluginInfo.DATA_PATH, 'regs.json');
        this.pluginsPath = join(pluginInfo.DATA_PATH, 'plugins');
        this.curPlugin = curPlugin;
        this.pluginsArr = [];
    }
    get pluginsList() {
        return JSON.parse(readFileSync(this.indexPath, 'utf-8'));
    }
    set pluginsList(value) {
        writeFileSync(this.indexPath, JSON.stringify(value, null, 2), 'utf-8');
    }
    get plugins() {
        return JSON.stringify(this.pluginsArr, null, 2);
    }
    setCurPlugin(value) {
        this.curPlugin = value;
    }
    async setPluginsList(value) {
        writeFileSync(this.indexPath, JSON.stringify(value, null, 2), 'utf-8');
    }
    async addPlugin(value = null, id = "") {
        if (id !== "") {
            this.curPlugin = value;
        }
        this.pluginsArr = this.pluginsList;
        const pluginPath = join(this.pluginsPath, this.curPlugin.id);
        const { message } = this.curPlugin;
        let newMessage = message.map((item) => {
            switch (item.type) {
                case 'code':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    writeFileSync(join(pluginPath, item.hash + '.code.js'), item.data, 'utf-8');
                    item.data = '';
                    break;
                case 'text':
                    break;
                case 'image':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    if (!item.url && item.hash && item.data) {
                        item.data = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8" /><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title>${item.hash}</title></head>${item.data}</html>`;
                        writeFileSync(join(pluginPath, item.hash + '.html'), item.data, 'utf-8');
                        item.data = '';
                        if (item.json) {
                            writeFileSync(join(pluginPath, item.hash + '.json'), item.json, 'utf-8');
                            item.json = '';
                        }
                    }
                    break;
                case 'record':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    break;
                case 'video':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    break;
                case 'face':
                    break;
                case 'poke':
                    break;
                case 'dice':
                    break;
                case 'rps':
                    break;
                case 'markdown':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    if (item.content) {
                        writeFileSync(join(pluginPath, 'markdown.json'), JSON.stringify(item.content), 'utf-8');
                        item.content = {};
                    }
                    break;
                case 'button':
                    if (!existsSync(pluginPath)) {
                        mkdirSync(pluginPath, { recursive: true });
                    }
                    if (item.content) {
                        writeFileSync(join(pluginPath, 'button.json'), JSON.stringify(item.content), 'utf-8');
                        item.content = {};
                    }
                    break;
                default:
                    Promise.reject(new Error('不支持该类型'));
            }
            return item;
        });
        if (id !== "") {
            let index = this.pluginsArr.findIndex((item) => item.id == id);
            this.pluginsArr[index] = Object.assign(this.curPlugin, { message: newMessage });
        }
        else {
            this.pluginsArr.unshift(Object.assign(this.curPlugin, { message: newMessage }));
        }
        this.setPluginsList(this.pluginsArr);
        return true;
    }
    async deletePlugin(index) {
        this.pluginsArr = this.pluginsList;
        const pluginPath = join(this.pluginsPath, this.pluginsArr[index].id);
        if (existsSync(pluginPath)) {
            rmSync(pluginPath, { recursive: true, force: true });
        }
        this.pluginsArr.splice(index, 1);
        this.setPluginsList(this.pluginsArr);
        return true;
    }
    async editorPlugin(id, value) {
        this.addPlugin(value, id);
        return true;
    }
}

export { PluginHandler as default };
