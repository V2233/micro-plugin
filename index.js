/** V3和V4(main分支)版本入口文件，npm版本为dist/index/.ts */
import chalk from 'chalk'
import { join } from 'path'
import { readdirSync } from 'node:fs'
import { pluginInfo } from '#env'
import { Cfg } from '#cfg'
import { Logger } from '#bot'
import { startServer } from './server/index.js'

const logger = await Logger()

const {
    ROOT_PATH,
    PLUGIN_NAME,
    PLUGIN_AUTHOR,
    PLUGIN_DESC,
    PLUGIN_VERSION
} = pluginInfo

Cfg.mergeYamlFile()
const Port = Cfg.getConfig('server').server.port

let useDir = "dist"

const files = readdirSync(join(ROOT_PATH, useDir,'apps')).filter(file => (/(\.js)$/.test(file)))

let ret = []

logger.info(chalk.green('-------Welcome​~(∠・ω< )⌒☆​-------'))
logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`)
logger.info(`${PLUGIN_DESC}`)
logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)')
logger.info(`Created By ${PLUGIN_AUTHOR}`)
logger.info(chalk.green('-----------------------------------'))

files.forEach((file) => {
  ret.push(import(`./src/apps/${file}`))
})
ret = await Promise.allSettled(ret)
await startServer(Port)

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

export { apps }
