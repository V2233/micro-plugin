import { Logger } from '../../adapter/index.js';
import '../../config/index.js';
import { handleReplyMsg } from './webui/plugins/msgHandler.js';
import OnebotV11 from './adapter/protocol/OnebotV11/index.js';
import TerminalWs from './webui/terminal/index.js';
import Screenchat from './webui/chat/index.js';
import Cfg from '../../config/config.js';

const logger = await Logger();
class MicroWs {
    onOpen(ws, req) {
        const { onebotv11 } = Cfg.getConfig('protocol');
        switch (req.url) {
            case '/micro/webui/chat':
                const screenchat = new Screenchat(ws);
                screenchat.use(handleReplyMsg);
                break;
            case '/micro/webui/term':
                new TerminalWs(ws);
                break;
            case onebotv11.url:
                new OnebotV11(ws);
                break;
            default:
                logger.warn('不支持该连接！请检查ws路径是否正确！');
        }
    }
}

export { MicroWs as default };
