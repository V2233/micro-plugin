
import { randomUUID } from "crypto"
import { WebSocket } from 'ws'
import { exec } from "child_process"
import { resolve as resolvePath } from 'path'
import iconvLite from 'iconv-lite'
import { Logger } from '#bot'

const logger = await Logger()

class TerminalWs {
    clients: Map<string, WebSocket>
    execPath: string
    constructor(ws: WebSocket) {
        this.clients = new Map()
        this.init(ws)
        this.execPath = process.cwd()
    }

    init(ws: WebSocket) {
        const ClientId = randomUUID();
        ws.send(JSON.stringify({ params: ClientId, action: 'meta', type: 'exec' }))

        this.clients.set(ClientId, ws)
        ws.on('message', async (message) => {
            logger.info(logger.blue(`[micro-terminal]收到消息：${message}`))
            const data = JSON.parse(message);
         
            await this.exec(data.params.cmd,ws,data.params.path?data.params.path:null)
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

            exec(cmd, { 
                encoding: 'buffer',
                cwd: this.execPath
                }, (error, stdout, stderr) => {  
                if (error) {  
                    // logger.error(`exec error: ${iconvLite.decode(Buffer.from(error.message), 'cp936')}`);  
                    logger.error(error.message);  
                    sendStdout(error.message);
                    return;  
                }  
                if (stderr) {  
                    logger.info(`stderr: ${iconvLite.decode(stderr, 'cp936')}`);  
                    sendStdout(iconvLite.decode(stderr, 'cp936'));
                }  

                logger.info(`stdout: ${iconvLite.decode(stdout, 'cp936')}`);  
                sendStdout(iconvLite.decode(stdout, 'cp936'));
                if(cmd.startsWith('cd')) {
                    if(path) {
                        this.execPath = path
                        sendStdout('UpdateCwd:' + this.execPath);
                    } else {
                        this.execPath = resolvePath(this.execPath,(cmd.replace(/cd/,'')).trim())
                        sendStdout('UpdateCwd:' + this.execPath);
                    }
                    
                }
               
            });

            
            // 找不到环境变量 deprecated
            // try {
            //     // 假设 message 是要执行的命令  
            //     const command = cmd.trim();
            //     const child = spawn(command,[],{env:{...process.env, PATH:process.env.PATH}});

            //     // 将标准输出推送到前端  
            //     child.stdout.on('data', (data) => {
            //         sendStdout(iconvLite.decode(data, 'cp936'));
            //     });

            //     // 将标准错误推送到前端（可选，但通常很有用）  
            //     child.stderr.on('data', (data) => {
            //         sendStdout(iconvLite.decode(data, 'cp936'));
            //     });

            //     child.on('error', (err) => {
            //         sendStdout(err.message);
            //     });

            //     // 当命令执行完成时，可以发送一个特定的消息来通知前端  
            //     child.on('close', (code) => {
            //         sendStdout(`Command finished with code ${code}`);
            //     });
            // } catch(err) {
            //     if (err instanceof Error) {  
            //         // 这里假设 zx 抛出的错误对象可能包含 stderr  
            //         sendStdout(`Error executing command: ${err.message}\nStderr: ${(err as any).stderr || ''}`) 
            //     } else {  
            //         sendStdout(`Unexpected error: ${err.toString()}`);  
            //     }  
            // }

        } else {
            ws.close();
        }
    }

}

export default TerminalWs