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

// src目录或dist目录，对于fs模块等路径填充此变量不可忽视
const DIST_PATH = join(_dirname, '../')

// 静态资源目录
const PUBLIC_PATH = join(ROOT_PATH, 'public')

// 插件目录名
const ROOT_NAME = basename(ROOT_PATH)

const pluginPackageObj = JSON.parse(
    readFileSync(join(ROOT_PATH, 'package.json'), 'utf8')
) as pluginType



/** 获取工作目录 */
const WORK_PATH = process.cwd().replace(/\\/g, '/');

// data输出目录
const DATA_PATH = join(WORK_PATH, 'data', 'micro-plugin')

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
 * @property { string } DIST_PATH 插件编译输出目录或src目录
 * @property { string } DATA_PATH 插件data输出目录
 * @property { string } ROOT_PATH 插件根路径
 * @property { string } ROOT_NAME 插件包目录名用于路径拼接
 * @property { string } PUBLIC_PATH 插件静态资源目录
 * @property { string } PLUGIN_NAME 插件包名
 * @property { string } PLUGIN_VERSION 插件版本
 * @property { string } PLUGIN_DESC 插件描述
 * @property { string } PLUGIN_AUTHOR 插件作者
 */
export const pluginInfo = {
    DIST_PATH,
    DATA_PATH,
    ROOT_PATH,
    ROOT_NAME,
    PUBLIC_PATH,
    PLUGIN_NAME: pluginPackageObj.name,
    PLUGIN_VERSION: pluginPackageObj.version,
    PLUGIN_DESC: pluginPackageObj.description,
    PLUGIN_AUTHOR: pluginPackageObj.author
}

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