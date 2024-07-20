import { applicationOptions } from 'yunzai'

import chalk from 'chalk'
import { pluginInfo } from '#env'
import {Cfg} from '#cfg'
import {Logger} from '#bot'
import { startServer } from './server/index.js'

const logger = await Logger()

import {RunPlugin} from './apps/message.js'
import {Service} from './apps/service.js'
import {Settings} from './apps/settings.js'

const {
  PLUGIN_NAME,
  PLUGIN_AUTHOR,
  PLUGIN_DESC,
  PLUGIN_VERSION
} = pluginInfo

let Data:any[] = []
export default () => {
  return applicationOptions({
    async create() {
        await Cfg.mergeYamlFile()
        const Port = Cfg.getConfig('server').server.port
        Data = [
            new RunPlugin(),
            new Service(),
            new Settings()
        ]
        logger.info(chalk.green('-------Welcome​~(∠・ω< )⌒☆​-------'))
        logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`)
        logger.info(`${PLUGIN_DESC}`)
        logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)')
        logger.info(`Created By ${PLUGIN_AUTHOR}`)
        logger.info(chalk.green('-----------------------------------'))
        await startServer(Port)
    },
    mounted() {
      // console.log(e)
      // logger.info('[Micro​]执行')
      return Data
    }
  })
}