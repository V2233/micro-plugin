import { applicationOptions } from 'yunzai';
import chalk from 'chalk';
import { pluginInfo } from './env.js';
import Cfg from './config/config.js';
import 'fs';
import 'yaml';
import 'lodash';
import 'chokidar';
import { Logger } from './adapter/index.js';
import { startServer } from './server/index.js';
import { RunPlugin } from './apps/message.js';
import { Service } from './apps/service.js';
import { Settings } from './apps/settings.js';

const logger = await Logger();
const { PLUGIN_NAME, PLUGIN_AUTHOR, PLUGIN_DESC, PLUGIN_VERSION } = pluginInfo;
let Data = [];
var index = () => {
    return applicationOptions({
        async create() {
            await Cfg.mergeYamlFile();
            const Port = Cfg.getConfig('server').server.port;
            Data = [
                new RunPlugin(),
                new Service(),
                new Settings()
            ];
            logger.info(chalk.green('-------Welcome​~(∠・ω< )⌒☆​-------'));
            logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`);
            logger.info(`${PLUGIN_DESC}`);
            logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)');
            logger.info(`Created By ${PLUGIN_AUTHOR}`);
            logger.info(chalk.green('-----------------------------------'));
            await startServer(Port);
        },
        mounted() {
            return Data;
        }
    });
};

export { index as default };
