import { v4 as uuidv4 } from 'uuid';
import { Logger } from '#bot';

const logger = await Logger()

export default class MicroWs {
    clients: Map<string, WebSocket>
    private plugins: any[]
    constructor() {
        this.clients = new Map()
        this.plugins = []
    }

    use(plugin: any) {
        this.plugins.push(plugin)
    }

    onOpen(ws: any) {
        logger.info(logger.blue(`【micro-ws】已连接`))

        const ClientId = uuidv4();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'message' }))

        this.clients.set(ClientId, ws)
        ws.on('message', async (message) => {
            logger.info(logger.blue(`【micro-ws】收到消息：${message}`))
            const data = JSON.parse(message);
            for (let plugin of this.plugins) {
                await plugin(data, {
                    sendMsg: this.sendMsg.bind(this)
                })
            }
        });
        ws.on('close', () => {
            logger.info(logger.blue(`【micro-ws】已断开连接`))
            this.clients.delete(ClientId)
        });
        ws.on('error', (err) => {
            logger.error('【micro-ws】连接错误:', err);
            this.clients.delete(ClientId)
        });

    }

    sendMsg(params: any, action: string, type = 'message', clientId = null) {
        if (clientId) {
            try {
                this.clients.get(clientId).send(JSON.stringify({ type, params, action }));
            } catch (error) {
                console.error(`Error sending message to client ${clientId}`, error);
                this.clients.delete(clientId);
            }
            return
        }
        for (const [key, ws] of this.clients.entries()) {
            // 确保WebSocket已经打开（readyState === 1）  
            // if (ws.readyState === WebSocket.OPEN) {  
            try {
                ws.send(JSON.stringify({ params, action, type }));
            } catch (error) {
                console.error(`Error sending message to client ${key}`, error);
                this.clients.delete(key);
            }
            // }  
        }
    }
}





