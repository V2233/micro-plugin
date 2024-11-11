import iconvLite from 'iconv-lite';
import os from 'os';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';
import { resolve } from 'path';
import { Logger } from '../../../../adapter/index.js';
import { TermCfg } from './config.js';

const logger = await Logger();
class TerminalWs {
    clients;
    execPath;
    stream;
    constructor(ws) {
        this.clients = new Map();
        this.init(ws);
        this.execPath = process.cwd();
    }
    init(ws) {
        const ClientId = randomUUID();
        if (TermCfg.ssh.isOpen) {
            ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'ssh' }));
            this.ssh(ws, TermCfg.ssh);
        }
        else {
            ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'exec' }));
        }
        this.clients.set(ClientId, ws);
        ws.on('message', async (message) => {
            logger.info(logger.blue(`[micro-terminal]收到消息：${message}`));
            const data = JSON.parse(message);
            if (TermCfg.ssh.isOpen || data.params.type == 'ssh') {
                this.stream?.write(data.params.cmd + '\n');
                if (data.params.cmd == 'logout') {
                    TermCfg.ssh.isOpen = false;
                }
            }
            else {
                await this.exec(data.params.cmd, ws, data.params.path ? data.params.path : null);
            }
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
            try {
                const command = cmd.trim();
                const child = spawn(command, command.split(" ").slice(1), {
                    cwd: this.execPath,
                    shell: os.platform() === 'win32' ? 'powershell.exe' : true
                });
                child.stdout.on('data', (data) => {
                    sendStdout(iconvLite.decode(data, 'gbk'));
                });
                child.stderr.on('data', (data) => {
                    sendStdout(iconvLite.decode(data, 'gbk'));
                });
                child.on('error', (err) => {
                    sendStdout(err.message);
                });
                child.on('close', (code) => {
                    sendStdout(`Command finished with code ${code}`);
                });
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
            }
            catch (err) {
                if (err instanceof Error) {
                    sendStdout(`Error executing command: ${err.message}\nStderr: ${err.stderr || ''}`);
                }
                else {
                    sendStdout(`Unexpected error: ${err.toString()}`);
                }
            }
        }
        else {
            ws.close();
        }
    }
    async ssh(ws, account) {
        let Client;
        try {
            Client = (await import('ssh2')).Client;
        }
        catch (err) {
            logger.error('[Micro]未成功安装ssh2，无法使用ssh连接功能：' + err.message);
            return;
        }
        const sendStdout = (data) => {
            ws.send(JSON.stringify({ type: 'ssh', action: 'stdout', params: data }));
        };
        const conn = new Client();
        conn.on('ready', () => {
            console.log('Client :: ready');
            conn.shell((err, stream) => {
                this.stream = stream;
                if (err)
                    logger.error(err);
                stream.on('close', function () {
                    console.log('Stream :: close');
                    conn.end();
                }).on('data', function (data) {
                    console.log('STDOUT: ' + data);
                    sendStdout(data.toString());
                }).stderr.on('data', function (data) {
                    console.error('STDERR: ' + data);
                    sendStdout(data.toString());
                });
            });
        }).connect({
            host: account.host,
            port: account.port || 22,
            username: account.username,
            password: account.password
        });
        conn.on('error', (err) => {
            TermCfg.ssh.isOpen = false;
            console.error('SSH Connection :: error:', err.message);
            ws.send(JSON.stringify({ type: 'exec', action: 'stdout', params: '连接失败，请重连或检查主机密码是否正确：' + err.message }));
        });
    }
}

export { TerminalWs as default };
