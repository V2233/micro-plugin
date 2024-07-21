import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const _dirname = fileURLToPath(import.meta.url);
const ROOT_PATH = join(_dirname, '../../');
const DIST_PATH = join(_dirname, '../');
const PUBLIC_PATH = join(ROOT_PATH, 'public');
const ROOT_NAME = basename(ROOT_PATH);
const pluginPackageObj = JSON.parse(readFileSync(join(ROOT_PATH, 'package.json'), 'utf8'));
const WORK_PATH = process.cwd().replace(/\\/g, '/');
const DATA_PATH = join(WORK_PATH, 'data', 'micro-plugin');
const botPackageObj = JSON.parse(readFileSync(join(WORK_PATH, 'package.json'), 'utf8'));
const pluginInfo = {
    DIST_PATH,
    DATA_PATH,
    ROOT_PATH,
    ROOT_NAME,
    PUBLIC_PATH,
    PLUGIN_NAME: pluginPackageObj.name,
    PLUGIN_VERSION: pluginPackageObj.version,
    PLUGIN_DESC: pluginPackageObj.description,
    PLUGIN_AUTHOR: pluginPackageObj.author
};
const botInfo = {
    WORK_PATH,
    BOT_NAME: botPackageObj.name,
    BOT_VERSION: botPackageObj.version,
    BOT_DESC: botPackageObj.description,
    BOT_AUTHOR: botPackageObj.author
};

export { botInfo, pluginInfo };
