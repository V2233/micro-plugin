import fs from "fs"
import _ from "lodash"
import os from "os"
import { join } from "path"
import { formatDuration } from "#utils"
import { Loader } from "#bot"
import { botInfo } from "#env"
import { osInfo, si } from "./utils.js"

const loader = await Loader()

export default async function getOtherInfo(e = { isPro: false }) {
  let otherInfo = []
  // 其他信息
  // 插件数量
  otherInfo.push({
    first: "插件",
    tail: getPluginNum(e)
  })

  otherInfo.push({
    first: "系统",
    tail: osInfo?.distro
  })

  otherInfo.push({
    first: "系统运行",
    tail: getSystime()
  })

  otherInfo.push({
    first: "环境版本",
    tail: await getEnvVersion()
  })

  return _.compact(otherInfo)
}

function getSystime() {
  return formatDuration(os.uptime(), "dd天hh小时mm分", false)
}

function getPluginNum(e = { isPro: false }) {
  // 获取插件数量插件包目录包含package.json才被视为一个插件包
  const dir = botInfo.WORK_PATH + "/plugins"
  const dirArr = fs.readdirSync(dir, { withFileTypes: true })
  const exc = ["example"]
  const plugin = dirArr.filter(i =>
    i.isDirectory() &&
    fs.existsSync(join(dir, i.name, "package.json")) &&
    !exc.includes(i.name)
  )
  const plugins = plugin?.length
  // 获取js插件数量，以.js结尾的文件视为一个插件
  const jsDir = join(dir, "example")
  let js = 0
  try {
    js = fs.readdirSync(jsDir)
      ?.filter(item => item.endsWith(".js"))
      ?.length
  } catch (error) {
    // logger.debug(error)
  }

  const pluginsStr = `${plugins ?? 0} plugins | example ${js ?? 0} js`
  if (loader && e.isPro) {
    const { priority, task } = loader
    const loaderStr = `${priority?.length} fnc | ${task?.length} task`
    return `${pluginsStr} | ${loaderStr}`
  }
  return pluginsStr
}

export async function getEnvVersion() {
  // 环境版本
  const { node, git } = await si.versions("node,git")
  return { node, git }
}
