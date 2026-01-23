import { Logger } from '@/adapter';
import { Cfg } from '@/config';
import { pluginInfo } from '@/env';
import chalk from 'chalk';
import { startServer } from './server/index.js';

import * as apps from './apps.js';

export const startMicro = async () => {
  const logger = await Logger();
  const { PLUGIN_NAME, PLUGIN_AUTHOR, PLUGIN_DESC, PLUGIN_VERSION } = pluginInfo;
  const Port = Cfg.getConfig('server').server.port;
  logger.info(chalk.cyanBright('-------Welcome​~(∠・ω< )⌒☆​-------'));
  logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`);
  logger.info(`${PLUGIN_DESC}`);
  logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)');
  logger.info(`Created By ${PLUGIN_AUTHOR}`);
  logger.info(`感谢抖M天才威玩游戏提供的Micro Panel安卓APP`);
  logger.info(chalk.cyanBright('-----------------------------------'));
  startServer(Port);
  return apps;
};
