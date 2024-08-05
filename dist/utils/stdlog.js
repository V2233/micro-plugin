import { Logger, Bot } from '../adapter/index.js';
import chalk from 'chalk';

const logger = await Logger();
const bot = await Bot();
class Stdlog {
    nickname(id) {
        let symbol = "";
        if (String(id).includes(':')) {
            const arg = String(id).split(':');
            symbol = arg[1];
            id = arg[0];
        }
        else {
            symbol = ">";
        }
        return chalk.hex('#00FFFF')(bot?.[id]?.nickname ? `<${bot?.[id]?.nickname}:${id}${symbol}` : (id ? `<Bot:${id}${symbol}` : ''));
    }
    info(id, ...log) {
        logger.info(this.nickname(id) || '', ...log);
    }
    mark(id, ...log) {
        logger.mark(this.nickname(id) || '', ...log);
    }
    error(id, ...log) {
        logger.error(this.nickname(id) || '', ...log);
    }
    warn(id, ...log) {
        logger.warn(this.nickname(id) || '', ...log);
    }
    debug(id, ...log) {
        logger.debug(this.nickname(id) || '', ...log);
    }
    trace(id, ...log) {
        logger.trace(this.nickname(id) || '', ...log);
    }
    fatal(id, ...log) {
        logger.fatal(this.nickname(id) || '', ...log);
    }
}
var Stdlog$1 = new Stdlog;

export { Stdlog$1 as default };
