import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

interface pluginType {
    name?: string,
    version?: string,
    author?: string,
    description?: string
}

const _dirname = fileURLToPath(import.meta.url)

// 插件根目录
const ROOT_PATH = join(_dirname, '../../')

// 插件包名
const ROOT_NAME = basename(ROOT_PATH)

const pluginPackageObj = JSON.parse(
    readFileSync(join(ROOT_PATH, 'package.json'), 'utf8')
) as pluginType

/**
 * @property { string } ROOT_PATH 插件根路径
 * @property { string } ROOT_NAME 插件包目录名用于路径拼接
 * @property { string } PLUGIN_NAME 插件包名
 * @property { string } PLUGIN_VERSION 插件版本
 * @property { string } PLUGIN_DESC 插件描述
 * @property { string } PLUGIN_AUTHOR 插件作者
 */
export const pluginInfo = {
    ROOT_PATH,
    // 用于路径
    ROOT_NAME,
    PLUGIN_NAME: pluginPackageObj.name,
    PLUGIN_VERSION: pluginPackageObj.version,
    PLUGIN_DESC: pluginPackageObj.description,
    PLUGIN_AUTHOR: pluginPackageObj.author
}

/** 获取工作目录 */
const WORK_PATH = process.cwd().replace(/\\/g, '/');

interface botType {
    name?: string,
    version?: string,
    author?: string,
    description?: string
}

const botPackageObj = JSON.parse(
    readFileSync(join(WORK_PATH, 'package.json'),'utf8')
) as botType

/**
 * @property { string } WORK_PATH 机器人工作目录
 * @property { string } BOT_NAME 机器人名称
 * @property { string } BOT_VERSION 机器人版本
 * @property { string } BOT_AUTHOR 机器人作者
 * @property { string } BOT_DESC 机器人描述
 */
export const botInfo =  {
    WORK_PATH,
    BOT_NAME: botPackageObj.name,
    BOT_VERSION: botPackageObj.version,
    BOT_DESC: botPackageObj.description,
    BOT_AUTHOR: botPackageObj.author
}