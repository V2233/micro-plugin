import chalk from 'chalk';
import server from './app/index.js';
import MicroWs from './app/ws.js';
import { WebSocketServer } from 'ws';
import '../utils/index.js';
import '../config/index.js';
import { Logger, Bot } from '../adapter/index.js';
import { getAllWebAddress } from '../utils/ipAddress.js';
import Cfg from '../config/config.js';

const logger = await Logger();
const bot = await Bot();
let wss;
let microWs = new MicroWs();
const startServer = async (port) => {
    wss = new WebSocketServer({ server });
    wss.on('connection', (ws, req) => {
        microWs.onOpen(ws, req);
    });
    await new Promise((resolve, reject) => {
        server.listen(port, async (err) => {
            if (err) {
                reject(err);
            }
            else {
                const { local, remote } = await getAllWebAddress();
                logger.info(chalk.cyanBright('----------Micro---------'));
                logger.info(chalk.cyanBright(`微代码开发服务器启动成功！您可在以下地址进行开发管理：`));
                logger.info(chalk.cyanBright(`公网地址：${remote[0]}`));
                logger.info(chalk.cyanBright(`内网地址：${local[0]}`));
                logger.info(chalk.cyanBright('------------------------'));
                if (!Cfg.masterQQ || Cfg.masterQQ.length == 0) {
                    logger.mark('[Micro]未找到主人QQ，请确定是否已配置');
                }
                try {
                    await bot.pickFriend(Number(Cfg.masterQQ[0])).sendMsg(`开发服务器启动成功，您可打开浏览器进入以下地址开发管理：\n` +
                        `公网地址：${remote[0]}\n` +
                        `内网地址：${local[0]}`);
                }
                catch (error) {
                    logger.mark('[Micro]Bot实例不存在或未配置主人QQ，部分功能可能失效' + error);
                }
                resolve('ok');
            }
        });
    });
};
const stopServer = () => {
    return new Promise((resolve, reject) => {
        if (wss) {
            wss.close((err) => {
                if (err) {
                    reject(err);
                }
                if (server) {
                    server.close((err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve('ok');
                    });
                }
                else {
                    resolve('ok');
                }
            });
        }
        else {
            resolve('ok');
        }
    });
};
const restartServer = async (port) => {
    await stopServer();
    await startServer(port);
};

export { microWs as default, restartServer, startServer, stopServer };
