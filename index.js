/** V3和V4(main分支)版本入口文件，npm版本为dist/index/.ts */
import chalk from 'chalk'
import { join } from 'path'
import { readdirSync } from 'node:fs'
import { pluginInfo } from './dist/env.js'
import { Cfg } from './dist/config/index.js'
import { Logger } from './dist/adapter/index.js'
import { startServer } from './dist/server/index.js'

const logger = await Logger()

const {
    ROOT_PATH,
    PLUGIN_NAME,
    PLUGIN_AUTHOR,
    PLUGIN_DESC,
    PLUGIN_VERSION
} = pluginInfo

const Port = Cfg.getConfig('server').server.port

let useDir = "dist"

const files = readdirSync(join(ROOT_PATH, useDir,'apps')).filter(file => (/(\.js)$/.test(file)))

let ret = []

logger.info(chalk.cyanBright('-------Welcome​~(∠・ω< )⌒☆​-------'))
logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`)
logger.info(`${PLUGIN_DESC}`)
logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)')
logger.info(`Created By ${PLUGIN_AUTHOR}`)
logger.info(chalk.cyanBright('-----------------------------------'))

files.forEach((file) => {
  ret.push(import(`./dist/apps/${file}`))
})
ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace(/(\.js|\.ts)$/, '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

// 不想开机自启动可注释掉
await startServer(Port)

export { apps }
