import child_process from "child_process"
import { createHash } from "node:crypto"
import { botInfo } from "#env"

import formatDuration from './formatDuration.js'
import common from './common.js'
import Pager from './pager.js'
import Stdlog from './stdlog.js'

import { autowired } from './injection.js'
import { getAllWebAddress } from './ipAddress.js'
import { getLoader } from "./getLoader.js"


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
function makeMd5(data: string | Buffer) {
  return createHash("md5").update(data).digest("hex")
}

/**
 * 判断是否为私有地址
 * @param ip 
 * @returns 
 */
function isPrivateIP(ip) {

  const parts = ip.split('.').map(Number);

  // 检查IP地址是否属于私有地址范围  
  if (parts[0] === 10) {
    // 10.0.0.0 - 10.255.255.255  
    return true;
  } else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    // 172.16.0.0 - 172.31.255.255  
    return true;
  } else if (parts[0] === 192 && parts[1] === 168) {
    // 192.168.0.0 - 192.168.255.255  
    return true;
  } else if (parts[0] === 169 && parts[1] === 254) {
    // 169.254.0.0 - 169.254.255.255 (APIPA/自动私有IP寻址)  
    return true;
  }
  return false;
}


export {
  Pager,
  common,
  Stdlog,
  path2URI,
  isPrivateIP,
  formatDuration,
  sleep,
  makeMd5,
  getLoader,
  execSync,
  autowired,
  getAllWebAddress
}
