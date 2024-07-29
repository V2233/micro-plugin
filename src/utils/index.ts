import child_process from "child_process"
import { createHash } from "node:crypto"
import { botInfo } from "#env"

import formatDuration from './formatDuration.js'
import common from './common.js'
import logger from './logger.js'
import Pager from './pager.js'
import Stdlog from './stdlog.js'

import { getAllWebAddress } from './ipAddress.js'


/**
 * 路径转URI
 * @param path 文件路径
 * @returns URI
 */
function path2URI(path = botInfo.WORK_PATH): string {
  return `file://${path}/`
}

/**
 * 休眠函数
 * @param ms 毫秒
 */
function sleep(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Promise执行exec
 * @param {string} cmd
 * @returns {*}
 */
async function execSync(cmd: string) {
  return new Promise((resolve) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr })
    })
  })
}

/**
 * 获取md5
 * @param data 
 * @returns 
 */
function makeMd5(data:string | Buffer) {
  return createHash("md5").update(data).digest("hex")
}


export {
  Pager,
  logger,
  common,
  Stdlog,
  path2URI,
  formatDuration,
  sleep,
  makeMd5,
  execSync,
  getAllWebAddress
}
