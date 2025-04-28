import { Application, applicationOptions } from 'yunzaijs'

import * as apps from './apps.js'
import chalk from 'chalk'
import { pluginInfo } from '#env'
import { Cfg } from '#cfg'
import { Logger } from '#bot'
import { startServer } from './server/index.js'

const logger = await Logger()

const {
  PLUGIN_NAME,
  PLUGIN_AUTHOR,
  PLUGIN_DESC,
  PLUGIN_VERSION
} = pluginInfo

export default () => {
  const rules: {
    reg: RegExp | string
    key: string
  }[] = []
  return applicationOptions({
    async create() {
        
        for (const key in apps) {
          // 连接
          const app: typeof Application.prototype = new apps[key]()
          // 用  reg 和 key 连接起来。
          for (const rule of app.rule) {
            rules.push({
              reg: rule.reg,
              key: key
            })
          }
        }
        const Port = Cfg.getConfig('server').server.port
        logger.info(chalk.cyanBright('-------Welcome​~(∠・ω< )⌒☆​-------'))
        logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`)
        logger.info(`${PLUGIN_DESC}`)
        logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)')
        logger.info(`Created By ${PLUGIN_AUTHOR}`)
        logger.info(`感谢抖M天才威玩游戏提供的Micro Panel安卓APP`)
        logger.info(chalk.cyanBright('-----------------------------------'))
        startServer(Port)
    },
    mounted(e) {
      // 存储
      const data = []
      // 如果key不存在
      const cache = {}
      // 使用event以确保得到正常类型
      if (e['msg']) {
        for (const item of rules) {
          // 匹配正则
          // 存在key
          // 第一次new
          if (
            new RegExp(item.reg).test(e['msg']) &&
            apps[item.key] &&
            !cache[item.key]
          ) {
            cache[item.key] = true
            data.push(new apps[item.key]())
          }
        }
      }
      // back
      return data
    }
  })
}
