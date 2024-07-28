import { randomUUID } from 'crypto';

class Screenchat {
    clients;
    plugins;
    constructor(ws) {
        this.clients = new Map();
        this.plugins = [];
        this.init(ws);
    }
    use(plugin) {
        this.plugins.push(plugin);
    }
    init(ws) {
        const ClientId = randomUUID();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'message' }));
        try {
            Bot?.on?.("message", async (e) => {
                await this.listen(e);
            });
        }
        catch (err) {
        }
        this.clients.set(ClientId, ws);
        ws.on('message', async (message) => {
            logger.info(logger.blue(`[micro-webui]收到消息：${message}`));
            const data = JSON.parse(message);
            for (let plugin of this.plugins) {
                await plugin(data, {
                    sendMsg: (params, action, type = 'message') => {
                        ws.send(JSON.stringify({ type, params, action }));
                    }
                });
            }
        });
        ws.on('close', () => {
            logger.info(logger.blue(`[micro-webui]已断开连接`));
            this.clients.delete(ClientId);
        });
        ws.on('error', (err) => {
            logger.error('[micro-webui]连接错误:', err);
            this.clients.delete(ClientId);
        });
    }
    async listen(e) {
        const { msg, message, group_name, group_id, sender } = e;
        if (!sender.user_id) {
            sender.user_id = e.user_id;
        }
        this.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info');
        return true;
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

export { Screenchat as default };
