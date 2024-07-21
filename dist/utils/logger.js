import log4js from 'log4js';
import chalk from 'chalk';
import { existsSync, mkdirSync } from 'node:fs';

function createLog() {
    log4js.configure({
        appenders: {
            console: {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: '%[[MYZ-V4][%d{hh:mm:ss.SSS}][%4.4p]%] %m'
                }
            },
            command: {
                type: 'dateFile',
                filename: 'logs/command',
                pattern: 'yyyy-MM-dd.log',
                numBackups: 15,
                alwaysIncludePattern: true,
                layout: {
                    type: 'pattern',
                    pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m'
                }
            },
            error: {
                type: 'file',
                filename: 'logs/error.log',
                alwaysIncludePattern: true,
                layout: {
                    type: 'pattern',
                    pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m'
                }
            }
        },
        categories: {
            default: { appenders: ['console'], level: 'trace' },
            command: { appenders: ['console', 'command'], level: 'warn' },
            error: { appenders: ['console', 'command', 'error'], level: 'error' }
        }
    });
    const defaultLogger = log4js.getLogger('message');
    const commandLogger = log4js.getLogger('command');
    const errorLogger = log4js.getLogger('error');
    const logger = {
        trace() {
            defaultLogger.trace.call(defaultLogger, ...arguments);
        },
        debug() {
            defaultLogger.debug.call(defaultLogger, ...arguments);
        },
        info() {
            defaultLogger.info.call(defaultLogger, ...arguments);
        },
        warn() {
            commandLogger.warn.call(defaultLogger, ...arguments);
        },
        error() {
            errorLogger.error.call(errorLogger, ...arguments);
        },
        fatal() {
            errorLogger.fatal.call(errorLogger, ...arguments);
        },
        mark() {
            errorLogger.mark.call(commandLogger, ...arguments);
        }
    };
    return logger;
}
const basePath = './logs';
if (!existsSync(basePath)) {
    mkdirSync(basePath, {
        recursive: true
    });
}
let logger = createLog();
logger.chalk = chalk;
logger.red = chalk.red;
logger.green = chalk.green;
logger.yellow = chalk.yellow;
logger.blue = chalk.blue;
logger.magenta = chalk.magenta;
logger.cyan = chalk.cyan;

export { logger as default };
