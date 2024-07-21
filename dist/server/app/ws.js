import { v4 } from 'uuid';
import { Logger } from '../../adapter/index.js';

const logger = await Logger();
class MicroWs {
    clients;
    plugins;
    constructor() {
        this.clients = new Map();
        this.plugins = [];
    }
    use(plugin) {
        this.plugins.push(plugin);
    }
    onOpen(ws) {
        logger.info(logger.blue(`【micro-ws】已连接`));
        const ClientId = v4();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'message' }));
        this.clients.set(ClientId, ws);
        ws.on('message', async (message) => {
            logger.info(logger.blue(`【micro-ws】收到消息：${message}`));
            const data = JSON.parse(message);
            for (let plugin of this.plugins) {
                await plugin(data, {
                    sendMsg: this.sendMsg.bind(this)
                });
            }
        });
        ws.on('close', () => {
            logger.info(logger.blue(`【micro-ws】已断开连接`));
            this.clients.delete(ClientId);
        });
        ws.on('error', (err) => {
            logger.error('【micro-ws】连接错误:', err);
            this.clients.delete(ClientId);
        });
    }
    sendMsg(params, action, type = 'message', clientId = null) {
        if (clientId) {
            try {
                this.clients.get(clientId).send(JSON.stringify({ type, params, action }));
            }
            catch (error) {
                console.error(`Error sending message to client ${clientId}`, error);
                this.clients.delete(clientId);
            }
            return;
        }
        for (const [key, ws] of this.clients.entries()) {
            try {
                ws.send(JSON.stringify({ params, action, type }));
            }
            catch (error) {
                console.error(`Error sending message to client ${key}`, error);
                this.clients.delete(key);
            }
        }
    }
}

export { MicroWs as default };
