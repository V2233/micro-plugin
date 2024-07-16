import { execSync } from "#utils"
import { pluginInfo } from '#env'
import { Logger } from '#bot';

const logger = await Logger()

/**
 * 获取FastFetch
 * @param e
 */
export default async function getFastFetch() {
  if (!isFeatureVisible()) return ""
  let ret: any = await execSync(`bash ${pluginInfo.ROOT_PATH}/src/server/controller/fetch.sh`)
  if (ret.error) {
    logger.error(`[状态]Error FastFetch 请检查是否使用git bash启动bot，错误信息：${ret.stderr}`)
    return ""
  }
  return ret.stdout.trim()
}

function isFeatureVisible() {
  if (!isPlatformWin()) return true
  return false
}

function isPlatformWin() {
  return process.platform === "win32"
}
