import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
const _dirname = fileURLToPath(import.meta.url);
const ROOT_PATH = join(_dirname, '../../../../');
const ROOT_NAME = basename(ROOT_PATH);
const pluginPackageObj = JSON.parse(readFileSync(join(ROOT_PATH, 'package.json'), 'utf8'));
export const pluginInfo = {
    ROOT_PATH,
    ROOT_NAME,
    PLUGIN_NAME: pluginPackageObj.name,
    PLUGIN_VERSION: pluginPackageObj.version,
    PLUGIN_DESC: pluginPackageObj.description,
    PLUGIN_AUTHOR: pluginPackageObj.author
};
