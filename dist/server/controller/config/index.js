import { readdirSync, statSync, existsSync } from 'fs';
import '../../../config/index.js';
import { botInfo, pluginInfo } from '../../../env.js';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { getNestedProperty } from './tools.js';
import { Result } from '../../utils/result.js';
import { bot, notice, other, puppeteer, qq, redis, renderer, group } from './botCfgMap.js';
import { stdin, onebotv11 } from './protocolCfgMap.js';
import { userInfo } from './plugins/microCfgMap.js';
import Cfg from '../../../config/config.js';
import YamlHandler from '../../../config/yamlHandler.js';

class ConfigController {
    async getBotConfig(ctx) {
        const { name } = ctx.request.query;
        const botCfg = await Cfg.getBotConfig(name);
        const defCfg = {
            bot,
            notice,
            other,
            puppeteer,
            qq,
            redis,
            renderer
        };
        let res;
        if (name == 'group') {
            for (const groupKey in botCfg) {
                if (!group[groupKey]) {
                    group[groupKey] = group.default;
                }
                for (const key in botCfg[groupKey]) {
                    if (group[groupKey].hasOwnProperty(key)) {
                        group[groupKey][key].value = botCfg[groupKey][key];
                    }
                }
                res = group;
            }
        }
        else {
            for (const key in botCfg) {
                if (defCfg[name] && defCfg[name].hasOwnProperty(key)) {
                    defCfg[name][key].value = botCfg[key];
                }
            }
            res = defCfg[name];
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        };
    }
    async setBotConfig(ctx) {
        const { name } = ctx.request.query;
        const data = ctx.request.body;
        const botCfg = new YamlHandler(join(botInfo.WORK_PATH, 'config', 'config', name + '.yaml'));
        const cfgJson = botCfg.jsonData;
        if (name == 'group') {
            for (const groupKey in data) {
                if (!cfgJson[groupKey]) {
                    cfgJson[groupKey] = cfgJson.default;
                }
                for (const key in data[groupKey]) {
                    botCfg.document.setIn([isNaN(Number(groupKey)) ? groupKey : Number(groupKey), key], data[groupKey][key].value);
                }
                botCfg.save();
            }
        }
        else {
            for (const key in data) {
                if (cfgJson.hasOwnProperty(key)) {
                    if (data[key].value === "") {
                        data[key].value = null;
                    }
                    botCfg.set(key, data[key].value);
                }
            }
            botCfg.save();
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: 'ok'
        };
    }
    async getUserConfig(ctx) {
        const userCfg = (await Cfg.getConfig('server')).userInfo;
        const defCfg = userInfo;
        let res = [];
        for (const user of userCfg) {
            for (const key in user) {
                if (defCfg.hasOwnProperty(key)) {
                    defCfg[key].value = user[key];
                }
            }
            res.push(JSON.parse(JSON.stringify(defCfg)));
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        };
    }
    async setUserConfig(ctx) {
        const data = ctx.request.body;
        const serverCfg = new YamlHandler(join(pluginInfo.ROOT_PATH, 'config', 'config', 'server.yaml'));
        const originalUserInfo = (serverCfg.jsonData).userInfo;
        let userList = data.map((item) => item.username.value);
        originalUserInfo.forEach((user, index) => {
            if (!userList.includes(user.username)) {
                serverCfg.document.deleteIn(['userInfo', index]);
            }
        });
        data.forEach((user, index) => {
            for (const key in user) {
                serverCfg.document.setIn(['userInfo', index, key], user[key].value);
            }
        });
        serverCfg.save();
        ctx.body = {
            code: 200,
            message: 'success',
            data: 'ok'
        };
    }
    async getProtocolConfig(ctx) {
        const protocolCfg = Cfg.getConfig('protocol');
        const defCfg = {
            stdin,
            onebotv11
        };
        for (const groupKey in protocolCfg) {
            for (const key in protocolCfg[groupKey]) {
                if (defCfg[groupKey].hasOwnProperty(key)) {
                    defCfg[groupKey][key].value = protocolCfg[groupKey][key];
                }
            }
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: defCfg
        };
    }
    async setProtocolConfig(ctx) {
        const data = ctx.request.body;
        const protocolCfg = new YamlHandler(join(pluginInfo.ROOT_PATH, 'config', 'config', 'protocol.yaml'));
        for (const groupKey in data) {
            for (const key in data[groupKey]) {
                protocolCfg.document.setIn([groupKey, key], data[groupKey][key].value);
            }
        }
        protocolCfg.save();
        ctx.body = {
            code: 200,
            message: 'success',
            data: protocolCfg
        };
    }
    async getPluginsInfoList(ctx) {
        const { source } = ctx.request.query;
        const pluginInfoArr = [];
        if (source == 'guoba') {
            const pluginsPath = join(botInfo.WORK_PATH, 'plugins');
            const packages = readdirSync(pluginsPath);
            for (let pkg of packages) {
                const pkgPath = join(pluginsPath, pkg);
                if (statSync(pkgPath).isDirectory()) {
                    const guobaSupportPath = join(pkgPath, 'guoba.support.js');
                    if (existsSync(guobaSupportPath)) {
                        const guobaCfg = await import(pathToFileURL(guobaSupportPath).toString());
                        const pkgCfg = await guobaCfg.supportGuoba();
                        pluginInfoArr.push(Object.assign(pkgCfg.pluginInfo, { pluginName: pkg }));
                    }
                }
            }
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInfoArr
        };
    }
    async getPluginConfig(ctx) {
        const { pluginName, source } = ctx.request.query;
        let pluginCfg = {
            pluginInfo: {},
            configInfo: {
                schemas: [{
                        field: 'nana',
                        label: '呐呐~',
                        bottomHelpMessage: '咪',
                        component: 'InputTextArea'
                    }],
                getConfigData: () => { },
                setConfigData: (data, { Result }) => { console.log(data, Result); }
            },
        };
        let res = [];
        if (source == 'guoba') {
            const guobaSupportPath = join(botInfo.WORK_PATH, 'plugins', pluginName, 'guoba.support.js');
            const { supportGuoba } = await import(pathToFileURL(guobaSupportPath).toString());
            pluginCfg = await supportGuoba();
            const cfgSets = await pluginCfg.configInfo.getConfigData();
            res = pluginCfg.configInfo.schemas.map((cfg) => {
                if (cfg.field) {
                    const NestedProperty = getNestedProperty(cfgSets, cfg.field);
                    if (NestedProperty.isTrue) {
                        return Object.assign(cfg, { value: NestedProperty.value });
                    }
                    else {
                        return cfg;
                    }
                }
                else {
                    return cfg;
                }
            });
        }
        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        };
    }
    async setPluginConfig(ctx) {
        const { pluginName, source } = ctx.request.query;
        const data = ctx.request.body;
        let pluginCfg = {
            pluginInfo: {},
            configInfo: {
                schemas: [{
                        field: 'nana',
                        label: '呐呐~',
                        bottomHelpMessage: '咪',
                        component: 'InputTextArea'
                    }],
                getConfigData: () => { },
                setConfigData: (data, { Result }) => { console.log(data, Result); }
            },
        };
        const dataParams = {};
        data.forEach(cfg => {
            if (('value' in cfg) && cfg.field) {
                dataParams[cfg.field] = cfg.value;
            }
        });
        let res;
        if (source == 'guoba') {
            const guobaSupportPath = join(botInfo.WORK_PATH, 'plugins', pluginName, 'guoba.support.js');
            const { supportGuoba } = await import(pathToFileURL(guobaSupportPath).toString());
            pluginCfg = await supportGuoba();
            res = await pluginCfg.configInfo.setConfigData(dataParams, { Result });
        }
        ctx.body = {
            code: 200,
            message: res.message,
            data: res.httpStatus
        };
    }
}
var ConfigController$1 = new ConfigController();

export { ConfigController$1 as default };
