import { join } from 'path'
import { readFileSync } from 'fs'


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

