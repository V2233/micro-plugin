import { randomUUID } from "crypto"
import { WebSocket } from 'ws';  
// import { Bot } from '#bot';
// const bot = await Bot()

class Screenchat {
    clients: Map<string, WebSocket>
    private plugins: any[]
    constructor(ws:WebSocket) {
        this.clients = new Map()
        this.plugins = []
        this.init(ws)
    }

    use(plugin: any) {
        this.plugins.push(plugin)
    }

    init(ws:WebSocket) {
        const ClientId = randomUUID();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'message' }))

        try {
            Bot?.on?.("message", async(e) => { 
                await this.listen(e)
            })
        } catch (err) {
            
        }

        this.clients.set(ClientId, ws)
        ws.on('message', async (message) => {
            logger.info(logger.blue(`[micro-webui]收到消息：${message}`))
            const data = JSON.parse(message);
            for (let plugin of this.plugins) {
                await plugin(data, {
                    sendMsg: (params: any, action: string, type = 'message') => {
                        ws.send(JSON.stringify({ type, params, action }))
                    }
                })
            }
        });
        ws.on('close', () => {
            logger.info(logger.blue(`[micro-webui]已断开连接`))
            this.clients.delete(ClientId)
        });
        ws.on('error', (err) => {
            logger.error('[micro-webui]连接错误:', err);
            this.clients.delete(ClientId)
        });
    }

    async listen(e) {
        let { msg, message, group_name, group_id, sender } = e
        if (!sender.user_id) {
          sender.user_id = e.user_id
        }
        this.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info')
        return true
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

export default Screenchat