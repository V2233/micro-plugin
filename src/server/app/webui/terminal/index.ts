import iconvLite from 'iconv-lite'
import os from 'os'
import { randomUUID } from "crypto"
import { WebSocket } from 'ws'
import { spawn } from "child_process"
import { resolve as resolvePath } from 'path'
import { Logger } from '#bot'
import { TermCfg } from './config'

const logger = await Logger()

class TerminalWs {
    clients: Map<string, WebSocket>
    execPath: string
    stream: any
    constructor(ws: WebSocket) {
        this.clients = new Map()
        this.init(ws)
        this.execPath = process.cwd()
    }

    init(ws: WebSocket) {
        const ClientId = randomUUID();
        // 连接ssh
        if(TermCfg.ssh.isOpen) {
            ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'ssh' }))
            this.ssh(ws,TermCfg.ssh)
        } else {
            ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'exec' }))
        }
        
        this.clients.set(ClientId, ws)
        ws.on('message', async (message) => {
            logger.info(logger.blue(`[micro-terminal]收到消息：${message}`))
            const data = JSON.parse(message);
            if(TermCfg.ssh.isOpen || data.params.type == 'ssh') {
                this.stream?.write(data.params.cmd + '\n');  
                if(data.params.cmd == 'logout') {
                    TermCfg.ssh.isOpen = false
                }
            } else {
                await this.exec(data.params.cmd,ws,data.params.path?data.params.path:null)
            }
            
        });
        ws.on('close', () => {
            logger.info(logger.blue(`[micro-terminal]已断开连接`))
            this.clients.delete(ClientId)
        });
        ws.on('error', (err) => {
            logger.error('[micro-terminal]连接错误:', err);
            this.clients.delete(ClientId)
        });
    }

    async exec(cmd:string,ws:WebSocket,path:string | null) {

        const sendStdout = (data:string) => {
            ws.send(JSON.stringify({ type: 'exec', action: 'stdout', params: data }))
        }

        if (cmd.trim() !== 'exit') { 

            // exec(cmd, { 
            //     encoding: 'buffer',
            //     cwd: this.execPath
            // }, (error, stdout, stderr) => {  
            //     if (error) {  
            //         // logger.error(`exec error: ${iconvLite.decode(Buffer.from(error.message), 'cp936')}`);  
            //         logger.error(error.message);  
            //         sendStdout(error.message);
            //         return;  
            //     }  

            //     if (stderr) {  
            //         logger.info(`stderr: ${iconvLite.decode(stderr, 'cp936')}`);  
            //         sendStdout(iconvLite.decode(stderr, 'cp936'));
            //     }  

            //     logger.info(`stdout: ${iconvLite.decode(stdout, 'cp936')}`);  
            //     sendStdout(iconvLite.decode(stdout, 'cp936'));

            //     if(cmd.startsWith('cd')) {
            //         if(path) {
            //             this.execPath = path
            //             sendStdout('UpdateCwd:' + this.execPath);
            //         } else {
            //             this.execPath = resolvePath(this.execPath,(cmd.replace(/cd/,'')).trim())
            //             sendStdout('UpdateCwd:' + this.execPath);
            //         }
                    
            //     }
               
            // });
            
            // 找不到环境变量 deprecated
            try {
                // 假设 message 是要执行的命令  
                const command = cmd.trim();

                const child = spawn(command, command.split(" ").slice(1), {
                    cwd: this.execPath,
                    shell: os.platform() === 'win32'? 'powershell.exe' : true
                });
                // 将标准输出推送到前端  
                child.stdout.on('data', (data) => {
                    sendStdout(iconvLite.decode(data, 'gbk'));
                });

                // 将标准错误推送到前端（可选，但通常很有用）  
                child.stderr.on('data', (data) => {
                    sendStdout(iconvLite.decode(data, 'gbk'));
                });

                child.on('error', (err) => {
                    sendStdout(err.message);
                });

                // 当命令执行完成时，可以发送一个特定的消息来通知前端  
                child.on('close', (code) => {
                    sendStdout(`Command finished with code ${code}`);
                });

                if(cmd.startsWith('cd')) {
                    if(path) {
                        this.execPath = path
                        sendStdout('UpdateCwd:' + this.execPath);
                    } else {
                        this.execPath = resolvePath(this.execPath,(cmd.replace(/cd/,'')).trim())
                        sendStdout('UpdateCwd:' + this.execPath);
                    }
                    
                }
            } catch(err) {
                if (err instanceof Error) {  
                    // 这里假设 zx 抛出的错误对象可能包含 stderr  
                    sendStdout(`Error executing command: ${err.message}\nStderr: ${(err as any).stderr || ''}`) 
                } else {  
                    sendStdout(`Unexpected error: ${err.toString()}`);  
                }  
            }

        } else {
            ws.close();
        }
    }

    async ssh(ws:WebSocket,account:{
        host: string,
        port?:string,
        username: string,
        password: string
    }) {

        let Client:any
        try {
            Client = (await import('ssh2')).Client
        } catch(err) {
            logger.error('[Micro]未成功安装ssh2，无法使用ssh连接功能：' + err.message)
            return
        }
        
        const sendStdout = (data:string) => {
            ws.send(JSON.stringify({ type: 'ssh', action: 'stdout', params: data }))
        }

        const conn = new Client();  
        conn.on('ready', () => {  
            console.log('Client :: ready');  
            conn.shell((err, stream) => {  
                this.stream = stream
                if (err) logger.error(err);  
                stream.on('close', function() {  
                    console.log('Stream :: close');  
                    conn.end();  
                }).on('data', function(data) {  
                    console.log('STDOUT: ' + data);  
                    sendStdout(data.toString()); // 发送SSH输出到WebSocket  
                }).stderr.on('data', function(data) {  
                    console.error('STDERR: ' + data);  
                    sendStdout(data.toString()); // 也可以发送错误输出  
                });  
        
            });  
        }).connect({  
            host: account.host,  
            port: account.port || 22,  
            username: account.username,  
            password: account.password // 或者使用privateKey  
        });  

        conn.on('error', (err) => {  
            TermCfg.ssh.isOpen = false
            console.error('SSH Connection :: error:', err.message);  
            ws.send(JSON.stringify({ type: 'exec', action: 'stdout', params: '连接失败，请重连或检查主机密码是否正确：' + err.message }))
        }); 
    }

}

export default TerminalWs