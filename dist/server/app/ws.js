import { Logger } from '../../adapter/index.js';
import '../../config/index.js';
import '../../utils/index.js';
import { WebSocket } from 'ws';
import { handleReplyMsg } from './webui/plugins/msgHandler.js';
import BotAPI from './adapter/protocol/tools.js';
import Stdin from './adapter/protocol/Stdin/index.js';
import OnebotV11 from './adapter/protocol/OnebotV11/index.js';
import TerminalWs from './webui/terminal/index.js';
import Screenchat from './webui/chat/index.js';
import Cfg from '../../config/config.js';
import Stdlog from '../../utils/stdlog.js';

const logger = await Logger();
class MicroWs {
    cfg;
    constructor() {
        this.cfg = Cfg.getConfig('protocol');
        if (this.cfg.stdin.disabled == false)
            Stdin();
        this.openForwardWs();
    }
    onOpen(ws, req) {
        switch (req.url) {
            case '/micro/webui/chat':
                const screenchat = new Screenchat(ws);
                screenchat.use(handleReplyMsg);
                break;
            case '/micro/webui/term':
                new TerminalWs(ws);
                break;
            case this.cfg.onebotv11.url:
                if (this.cfg.onebotv11.disabled == true)
                    return logger.warn('该协议已禁用，请在配置中打开！');
                new OnebotV11(ws);
                break;
            default:
                logger.warn('不支持该连接反向连接！请协议端检查ws路径是否正确！');
                ws.close();
        }
    }
    onUpgrade(ws, req, socket, head) {
        ws.handleUpgrade(req, socket, head, (conn) => {
            conn.rid = `${req.socket.remoteAddress}:${req.socket.remotePort}-${req.headers["sec-websocket-key"]}`;
            conn.sid = `ws://${req.headers["x-forwarded-host"] || req.headers.host || `${req.socket.localAddress}:${req.socket.localPort}`}${req.url}`;
            Stdlog.mark(`${conn.sid} <=> ${conn.rid}`, "建立连接", req.headers);
            conn.on("error", (...args) => Stdlog.error(`${conn.sid} <=> ${conn.rid}`, args));
            conn.on("close", () => Stdlog.mark(`${conn.sid} <≠> ${conn.rid}`, "断开连接"));
            conn.sendMsg = msg => {
                if (!Buffer.isBuffer(msg))
                    msg = BotAPI.String(msg);
                Stdlog.debug(`${conn.sid} => ${conn.rid}`, "消息", msg);
                return conn.send(msg);
            };
        });
    }
    async openForwardWs() {
        if (this.cfg.onebotv11.disabled == false && this.cfg.onebotv11.address?.length > 0) {
            this.cfg.onebotv11.address.forEach((path) => {
                const v11Ws = new WebSocket(path);
                v11Ws.on('open', () => {
                    new OnebotV11(v11Ws);
                });
            });
        }
    }
}

export { MicroWs as default };
