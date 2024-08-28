import { applicationOptions } from 'yunzai';
import * as apps from './apps.js';
import chalk from 'chalk';
import { pluginInfo } from './env.js';
import './config/index.js';
import { Logger } from './adapter/index.js';
import { startServer } from './server/index.js';
import Cfg from './config/config.js';

const logger = await Logger();
const { PLUGIN_NAME, PLUGIN_AUTHOR, PLUGIN_DESC, PLUGIN_VERSION } = pluginInfo;
var index = () => {
    const rules = [];
    return applicationOptions({
        async create() {
            for (const key in apps) {
                const app = new apps[key]();
                for (const rule of app.rule) {
                    rules.push({
                        reg: rule.reg,
                        key: key
                    });
                }
            }
            const Port = Cfg.getConfig('server').server.port;
            logger.info(chalk.cyanBright('-------Welcome​~(∠・ω< )⌒☆​-------'));
            logger.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} 初始化...`);
            logger.info(`${PLUGIN_DESC}`);
            logger.info('bug积累中...呜呜出错删掉不要骂我(˵¯͒〰¯͒˵)');
            logger.info(`Created By ${PLUGIN_AUTHOR}`);
            logger.info(chalk.cyanBright('-----------------------------------'));
            startServer(Port);
        },
        mounted(e) {
            const data = [];
            const cache = {};
            if (e['msg']) {
                for (const item of rules) {
                    if (new RegExp(item.reg).test(e['msg']) &&
                        apps[item.key] &&
                        !cache[item.key]) {
                        cache[item.key] = true;
                        data.push(new apps[item.key]());
                    }
                }
            }
            return data;
        }
    });
};

export { index as default };
