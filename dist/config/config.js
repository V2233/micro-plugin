import YAML from 'yaml';
import chokidar from 'chokidar';
import { join } from 'node:path';
import { pluginInfo, botInfo } from '../env.js';
import { Bot, Logger } from '../adapter/index.js';
import YamlHandler from './yamlHandler.js';
import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';

const bot = await Bot();
const logger = await Logger();
const { ROOT_PATH } = pluginInfo;
const { WORK_PATH } = botInfo;
class Cfg {
    config = {};
    watcher = { config: {}, defSet: {} };
    get qq() {
        return Number(this.getBotConfig('qq').qq);
    }
    get pwd() {
        return this.getBotConfig('qq').pwd;
    }
    get bot() {
        const bot = this.getBotConfig('bot');
        const defbot = this.getBotdefSet('bot');
        const Config = { ...defbot, ...bot };
        Config.platform = this.getBotConfig('qq').platform;
        Config.data_dir = join(WORK_PATH, `/data/icqq/${this.qq}`);
        if (!Config.ffmpeg_path)
            delete Config.ffmpeg_path;
        if (!Config.ffprobe_path)
            delete Config.ffprobe_path;
        return Config;
    }
    get other() {
        return this.getBotConfig('other');
    }
    get redis() {
        return this.getBotConfig('redis');
    }
    get renderer() {
        return this.getBotConfig('renderer');
    }
    get notice() {
        return this.getBotConfig('notice');
    }
    get masterQQ() {
        const qqs = this.getBotConfig('other')?.masterQQ || [];
        if (Array.isArray(qqs)) {
            return qqs.map(qq => String(qq));
        }
        else {
            return [String(qqs)];
        }
    }
    _package = null;
    get package() {
        if (this._package)
            return this._package;
        try {
            const data = readFileSync('package.json', 'utf8');
            this._package = JSON.parse(data);
            return this._package;
        }
        catch {
            return {};
        }
    }
    getGroup(groupId = '') {
        const config = this.getBotConfig('group');
        const defCfg = this.getBotdefSet('group');
        if (config[groupId]) {
            return { ...defCfg.default, ...config.default, ...config[groupId] };
        }
        return { ...defCfg.default, ...config.default };
    }
    getOther() {
        const def = this.getBotdefSet('other');
        const config = this.getBotConfig('other');
        return { ...def, ...config };
    }
    getNotice() {
        const def = this.getBotdefSet('notice');
        const config = this.getBotConfig('notice');
        return { ...def, ...config };
    }
    getBg() {
        const def = this.getdefSet('backgroundset');
        const config = this.getConfig('backgroundset');
        return { ...def, ...config };
    }
    getdefSet(name) {
        return this.getYaml('default_config', name);
    }
    getBotdefSet(name) {
        return this.getYaml('default_config', name, WORK_PATH);
    }
    getConfig(name) {
        return this.getYaml('config', name);
    }
    getMergedConfig(name) {
        let config = this.getYaml('config', name);
        let def = this.getYaml('default_config', name);
        return { ...def, ...config };
    }
    getBotConfig(name) {
        return this.getYaml('config', name, WORK_PATH);
    }
    setConfig(data, parentKeys, name) {
        this.setYaml('config', name, data, parentKeys);
    }
    getYaml(type, name, path = ROOT_PATH) {
        const file = join(path, `config/${type}/${name}.yaml`);
        const key = `${type}.${name}`;
        if (this.config[key])
            return this.config[key];
        this.config[key] = YAML.parse(readFileSync(file, 'utf8'));
        this.watch(file, name, type);
        return this.config[key];
    }
    setYaml(type, name, data, parentKeys) {
        const file = join(ROOT_PATH, `config/${type}/${name}.yaml`);
        let doc = new YamlHandler(file);
        doc.setDataRecursion(data, parentKeys);
        doc.save();
        this.watch(file, name, type);
    }
    mergeYamlFile() {
        const path = join(ROOT_PATH, 'config', 'config');
        const pathDef = join(ROOT_PATH, 'config', 'default_config');
        const files = readdirSync(pathDef).filter(file => file.endsWith('.yaml'));
        if (!existsSync(path)) {
            mkdirSync(path, {
                recursive: true
            });
        }
        for (const file of files) {
            const cfgFile = join(path, file);
            const cfgFileDef = join(pathDef, file);
            if (!existsSync(cfgFile)) {
                copyFileSync(cfgFileDef, cfgFile);
            }
            else {
                const cfg = this.getConfig(file.replace('.yaml', ''));
                const doc = new YamlHandler(cfgFileDef);
                const defCfg = doc.jsonData;
                const cfgKeys = Object.keys(cfg);
                cfgKeys.forEach(key => {
                    if (!defCfg.hasOwnProperty(key)) {
                        delete cfg[key];
                    }
                });
                Object.entries(defCfg).forEach(([key, value]) => {
                    if (cfg[key]) {
                        if (value instanceof Object) {
                            doc.set(key, Object.assign(value, cfg[key]));
                        }
                        else {
                            doc.set(key, cfg[key]);
                        }
                        doc.yamlPath = cfgFile;
                        doc.save();
                    }
                });
            }
        }
    }
    watch(file, name, type = 'default_config') {
        const key = `${type}.${name}`;
        if (this.watcher[key])
            return;
        const watcher = chokidar.watch(file);
        watcher.on('change', () => {
            delete this.config[key];
            if (typeof bot == 'undefined')
                return;
            logger.mark(`[Micro][读取|修改配置文件][${type}][${name}]`);
            if (this[`change_${name}`]) {
                this[`change_${name}`]();
            }
        });
        this.watcher[key] = watcher;
    }
}
var Cfg$1 = new Cfg();

export { Cfg$1 as default };
