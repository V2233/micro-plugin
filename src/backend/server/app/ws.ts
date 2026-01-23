import { Cfg } from '@/config';
import { botInfo } from '@/env';
import { Stdlog } from '@/utils';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { WebSocket } from 'ws';
import BotAPI from './adapter/protocol/tools.js';
import { handleReplyMsg } from './webui/plugins/msgHandler.js';
// import Stdin from './adapter/protocol/Stdin/index.js';
import OnebotV11 from './adapter/protocol/OnebotV11/index.js';
import Screenchat from './webui/chat/index.js';
import StdoutWs from './webui/stdout/index.js';
import TerminalWs from './webui/terminal/index.js';

export default class MicroWs {
  cfg: any;
  constructor() {
    this.cfg = Cfg.getConfig('protocol');
    // 标准输入输出
    this.openStdin();
    this.openForwardWs();
  }

  async openStdin() {
    if (this.cfg.stdin.disabled == false && !/trss|Trss|TRSS/.test(botInfo.BOT_NAME)) {
      const Stdin = (await import('./adapter/protocol/Stdin/index.js')).default;
      Stdin();
    }
  }

  onOpen(ws: WebSocket, req: IncomingMessage) {
    if (req.url.startsWith('/micro/webui/chat')) {
      const screenchat = new Screenchat(ws);
      screenchat.use(handleReplyMsg);
    } else if (req.url.startsWith('/micro/webui/term')) {
      new TerminalWs(ws, req.url);
    } else if (req.url.startsWith('/micro/webui/stdout')) {
      new StdoutWs(ws);
    } else if (req.url.startsWith(this.cfg.onebotv11.url)) {
      if (this.cfg.onebotv11.disabled == true) return logger.warn('该协议已禁用，请在配置中打开！');
      new OnebotV11(ws);
    } else {
      logger.warn(`不支持该连接(${req.url})！请协议端检查ws路径是否正确！`);
      ws.close();
    }
  }

  onUpgrade(ws: WebSocket, req: IncomingMessage, socket: Duplex, head: Buffer) {
    ws.handleUpgrade(req, socket, head, conn => {
      conn.rid = `${req.socket.remoteAddress}:${req.socket.remotePort}-${req.headers['sec-websocket-key']}`;
      conn.sid = `ws://${req.headers['x-forwarded-host'] || req.headers.host || `${req.socket.localAddress}:${req.socket.localPort}`}${req.url}`;
      Stdlog.mark(`${conn.sid} <=> ${conn.rid}`, '建立连接', req.headers);
      conn.on('error', (...args) => Stdlog.error(`${conn.sid} <=> ${conn.rid}`, args));
      conn.on('close', () => Stdlog.mark(`${conn.sid} <≠> ${conn.rid}`, '断开连接'));
      // conn.on("message", msg => Stdlog.debug(`${conn.sid} <= ${conn.rid}`, "消息", BotAPI.String(msg)))
      conn.sendMsg = msg => {
        if (!Buffer.isBuffer(msg)) msg = BotAPI.String(msg);
        Stdlog.debug(`${conn.sid} => ${conn.rid}`, '消息', msg);
        return conn.send(msg);
      };
    });
  }

  async openForwardWs() {
    // 正向连接
    // const forwardWs = new Map()
    if (this.cfg.onebotv11.disabled == false && this.cfg.onebotv11.address?.length > 0) {
      this.cfg.onebotv11.address.forEach((path: string) => {
        const v11Ws = new WebSocket(path);
        v11Ws.on('open', () => {
          new OnebotV11(v11Ws);
        });
        // forwardWs.set(`onebotv11-${index}`, v11Ws)
      });
    }
  }
}
