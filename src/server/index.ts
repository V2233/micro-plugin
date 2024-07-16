import chalk from 'chalk'
import server from './app/index.js'
import MicroWs from './app/ws.js'
import { handleReplyMsg } from './middleware/wsMsgHandler.js';
import { WebSocketServer } from 'ws';
import { getAllWebAddress } from '#utils'
import { Cfg } from '#cfg'
import { Logger, Bot } from '#bot';

const logger = await Logger()
const bot = await Bot()

let wss = new WebSocketServer({ server });
let microWs = new MicroWs()
microWs.use(handleReplyMsg)
const Port = Cfg.getConfig('server').server.port

/**
 * 启动ws
 * @returns 
 */
wss.on('connection', microWs.onOpen.bind(microWs));

/**
 * 启动server
 * @returns 
 */
server.listen(Port, async () => {
  const { local, remote } = await getAllWebAddress()
  logger.info(chalk.blue('----------Micro---------'))
  logger.info(chalk.blue(`微代码开发服务器启动成功！您可在以下地址进行开发管理：`))
  logger.info(chalk.blue(`公网地址：${remote[0]}`))
  logger.info(chalk.blue(`内网地址：${local[0]}`))
  logger.info(chalk.blue('------------------------'))
  try {
    await bot.sendPrivateMsg(Number(Cfg.masterQQ[0]), `微代码开发服务器启动成功，您可打开浏览器进入以下地址开发管理：\n` +
      `公网地址：${remote[0]}\n` +
      `内网地址：${local[0]}`
    )
  } catch (err) {

  }

})

/**
 * 启动接口
 * @param port 
 */
const startServer = async (port: number): Promise<any> => {

  wss = new WebSocketServer({ server });
  wss.on('connection', microWs.onOpen.bind(microWs));

  await new Promise((resolve, reject) => {
    server.listen(port, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
}

/**
 * 关闭接口
 * @returns 
 */
const stopServer = (): Promise<any> => {
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
        } else {
          resolve('ok');
        }
      });
    } else {
      resolve('ok');
    }
  });
}

/**
 * 重启接口
 * @param port 
 */
const restartServer = async (port: number): Promise<any> => {
  await stopServer();
  await startServer(port);
}

export default microWs

export { startServer, stopServer, restartServer };