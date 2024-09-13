import { Loader } from '../adapter/index.js';
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
    return packages;
}

export { getLoader };
