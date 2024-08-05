import { applicationOptions } from 'yunzai'

import chalk from 'chalk'
import { pluginInfo } from '#env'
import { Cfg } from '#cfg'
import { Logger } from '#bot'
import { RunPlugin } from './apps/message.js'
import { Settings } from './apps/settings.js'
import { startServer } from './server/index.js'

const logger = await Logger()

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
        const Port = Cfg.getConfig('server').server.port
        Data = [
            new RunPlugin(),
            new Settings()
        ]
        logger.info(chalk.cyanBright('-------Welcome​~(∠・ω< )⌒☆​-------'))
        logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`)
        logger.info(`${PLUGIN_DESC}`)
        logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)')
        logger.info(`Created By ${PLUGIN_AUTHOR}`)
        logger.info(chalk.cyanBright('-----------------------------------'))
        await startServer(Port)
    },
    mounted() {
      return Data
    }
  })
}