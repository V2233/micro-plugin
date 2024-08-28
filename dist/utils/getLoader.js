import { pathToFileURL } from 'url';
import { join } from 'path';
import { botInfo } from '../env.js';
import { Loader } from '../adapter/index.js';
import { readFile } from 'fs';
import _ from 'lodash';

async function getLoader() {
    const loader = await Loader();
    let packages = [];
    for (let plugin of loader.priority) {
        if (/\.js$/.test(plugin.key)) {
            plugin.key = 'example';
        }
        else if (/^system/.test(plugin.key)) {
            plugin.key = 'system';
        }
        else if (/^other/.test(plugin.key)) {
            plugin.key = 'other';
        }
        let object = packages.find(data => data.packName == plugin.key);
        if (!object) {
            packages.push({ packName: plugin.key, packPlugins: [] });
            object = packages.find(data => data.packName == plugin.key);
        }
        let objectIndex = packages.indexOf(object);
        let p = new plugin.class();
        let msg = {
            pluginTitle: `插件名：${plugin.name}`,
            pluginFuns: []
        };
        if (_.isEmpty(p.rule)) {
            msg.pluginFuns.push(`无命令正则`);
            packages[objectIndex].packPlugins.push(msg);
            continue;
        }
        for (let v in p.rule) {
            msg.pluginFuns.push(`【${Number(v) + 1}】：${p.rule[v].reg}`);
        }
        packages[objectIndex].packPlugins.push(msg);
    }
    try {
        const modules = await getReflectNpm('./yunzai.config.js');
        const configPath = join(botInfo.WORK_PATH, 'yunzai.config.js');
        const configModule = await import(pathToFileURL(configPath).toString());
        const defineConfig = configModule.default;
        const npmPlugins = defineConfig.applications;
        for (const [index, npmPlugin] of npmPlugins.entries()) {
            const npmObj = {
                packName: (modules[index] ? modules[index] : '暂无法匹配包名'),
                packPlugins: [],
                isNpm: true
            };
            let npmPluginFuncs = [];
            if (typeof npmPlugin === 'string') {
                npmPluginFuncs = await (await import(npmPlugin)).default().mounted();
            }
            else {
                npmPluginFuncs = await npmPlugin.mounted();
            }
            for (const pluginInstance of npmPluginFuncs) {
                let msg = {
                    pluginTitle: `插件名：${pluginInstance.name}`,
                    pluginFuns: []
                };
                if (_.isEmpty(pluginInstance.rule)) {
                    msg.pluginFuns.push(`无命令正则`);
                    npmObj.packPlugins.push(msg);
                    continue;
                }
                for (let v in pluginInstance.rule) {
                    msg.pluginFuns.push(`【${Number(v) + 1}】：${pluginInstance.rule[v].reg}`);
                }
                npmObj.packPlugins.push(msg);
            }
            packages.push(npmObj);
        }
    }
    catch (err) {
        console.log(err);
    }
    return packages;
}
async function getReflectNpm(filePath) {
    try {
        const data = await new Promise((resolve, reject) => {
            readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
        const applicationsMatch = data.match(/applications:\s*\[([^\]]+)\]/);
        if (applicationsMatch && applicationsMatch[1]) {
            const applicationsRaw = applicationsMatch[1].replace(/\s*,\s*/g, ',').split(',');
            const applications = applicationsRaw.map(dep => dep.trim());
            return applications;
        }
        else {
            return [];
        }
    }
    catch (error) {
        throw new Error(`Error processing file: ${error.message}`);
    }
}

export { getLoader };
