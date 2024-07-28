
import { Logger } from '#bot';
import { Cfg } from '#cfg';
import { WebSocket } from 'ws';  
import { IncomingMessage } from 'http'; 
import { handleReplyMsg } from './webui/plugins/msgHandler.js';
import OnebotV11 from './adapter/protocol/OnebotV11/index.js';
import TerminalWs from './webui/terminal/index.js';
import Screenchat from './webui/chat/index.js';

const logger = await Logger()

export default class MicroWs {

    onOpen(ws:WebSocket, req: IncomingMessage) {
        const { onebotv11 } = Cfg.getConfig('protocol')
        switch(req.url) {
            case '/micro/webui/chat':
                const screenchat = new Screenchat(ws)
                screenchat.use(handleReplyMsg)
                break;
            case '/micro/webui/term':
                new TerminalWs(ws)
                break;
            case onebotv11.url:
                new OnebotV11(ws)
                break;
            default:
                // Promise.reject(new Error('不支持该连接'))
                logger.warn('不支持该连接！请检查ws路径是否正确！')
        }

    }

}





