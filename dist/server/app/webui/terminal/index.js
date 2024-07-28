import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { resolve } from 'path';
import iconvLite from 'iconv-lite';
import { Logger } from '../../../../adapter/index.js';

const logger = await Logger();
class TerminalWs {
    clients;
    execPath;
    constructor(ws) {
        this.clients = new Map();
        this.init(ws);
        this.execPath = process.cwd();
    }
    init(ws) {
        const ClientId = randomUUID();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'exec' }));
        this.clients.set(ClientId, ws);
        ws.on('message', async (message) => {
            logger.info(logger.blue(`[micro-terminal]收到消息：${message}`));
            const data = JSON.parse(message);
            await this.exec(data.params.cmd, ws, data.params.path ? data.params.path : null);
        });
        ws.on('close', () => {
            logger.info(logger.blue(`[micro-terminal]已断开连接`));
            this.clients.delete(ClientId);
        });
        ws.on('error', (err) => {
            logger.error('[micro-terminal]连接错误:', err);
            this.clients.delete(ClientId);
        });
    }
    async exec(cmd, ws, path) {
        const sendStdout = (data) => {
            ws.send(JSON.stringify({ type: 'exec', action: 'stdout', params: data }));
        };
        if (cmd.trim() !== 'exit') {
            exec(cmd, {
                encoding: 'buffer',
                cwd: this.execPath
            }, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`exec error: ${iconvLite.decode(Buffer.from(error.message), 'cp936')}`);
                    sendStdout(iconvLite.decode(Buffer.from(error.message), 'cp936'));
                    return;
                }
                if (stderr) {
                    logger.info(`stderr: ${iconvLite.decode(stderr, 'cp936')}`);
                    sendStdout(iconvLite.decode(stderr, 'cp936'));
                }
                logger.info(`stdout: ${iconvLite.decode(stdout, 'cp936')}`);
                sendStdout(iconvLite.decode(stdout, 'cp936'));
                if (cmd.startsWith('cd')) {
                    if (path) {
                        this.execPath = path;
                        sendStdout('UpdateCwd:' + this.execPath);
                    }
                    else {
                        this.execPath = resolve(this.execPath, (cmd.replace(/cd/, '')).trim());
                        sendStdout('UpdateCwd:' + this.execPath);
                    }
                }
            });
        }
        else {
            ws.close();
        }
    }
}

export { TerminalWs as default };
