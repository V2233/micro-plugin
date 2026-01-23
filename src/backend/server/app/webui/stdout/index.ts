import { Logger } from '@/adapter';
import { Cfg } from '@/config';
import { addStdoutListener } from '@/utils';
import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';

const { uin } = Cfg.getConfig('protocol').stdin;

const logger = await Logger();

class StdoutWs {
  static clients: Map<string, WebSocket> = new Map();
  name = '[micro-stdout]';
  disposeListener = () => {};
  clientID: string;
  constructor(ws: WebSocket) {
    this.clientID = randomUUID();
    StdoutWs.clients.set(this.clientID, ws);
    this.init(ws);
  }

  init(ws: WebSocket) {
    const success = logger.blue(`${this.name}客户端连接！`);
    logger.info(success);
    ws.send(JSON.stringify({ type: 'log', data: success }));

    this.disposeListener = addStdoutListener(buf => {
      ws.send(JSON.stringify({ type: 'log', data: buf.toString() }));
    });

    ws.on('message', message => {
      const msg = JSON.parse(message.toString());
      if (msg.type === 'cmd') {
        if (Bot['stdin'] && Bot['stdin']?.adapter) {
          // trss
          Bot['stdin'].adapter.message(msg.data);
        } else if (uin && Bot[uin]) {
          // micro
          Bot[uin].mockTextMsgEvent?.(msg.data);
        }
      }
    });

    ws.on('close', () => {
      logger.info(logger.blue(`${this.name}已断开连接`));
      this.close();
      this.disposeListener();
    });
    ws.on('error', err => {
      logger.error(`${this.name}连接错误:`, err);
      this.close();
      this.disposeListener();
    });
  }

  close() {
    StdoutWs.clients.delete(this.clientID);
    this.disposeListener();
  }
}

export default StdoutWs;
