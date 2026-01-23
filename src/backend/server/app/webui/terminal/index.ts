import { Logger } from '@/adapter';
import Chalk from 'chalk';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import iconvLite from 'iconv-lite';
import os from 'os';
import querystring from 'querystring';
import { WebSocket } from 'ws';

const logger = await Logger();

class TerminalSession extends EventEmitter {
  private process: ReturnType<typeof spawn> | null = null;
  private currentPath: string = process.cwd();
  private isWindows: boolean = os.platform() === 'win32';
  private clientId: string;
  private shellType: 'powershell' | 'bash' | 'cmd';

  constructor(clientId: string, initialPath?: string) {
    super();
    this.clientId = clientId;
    this.currentPath = initialPath || process.cwd();
    this.shellType = this.isWindows ? 'powershell' : 'bash';
    this.initShell();
  }

  private initShell() {
    // 根据平台创建合适的shell
    const shell = this.isWindows ? 'powershell.exe' : 'bash';
    const args = this.isWindows ? [] : ['-i']; // -i 进入交互模式

    this.process = spawn(shell, args, {
      cwd: this.currentPath,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        LANG: this.isWindows ? 'chcp 65001' : 'zh_CN.UTF-8',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // 设置编码处理
    const stdoutHandler = (data: Buffer) => {
      const decoded = this.isWindows ? iconvLite.decode(data, 'gbk') : data.toString();
      this.emit('data', decoded);
    };

    const stderrHandler = (data: Buffer) => {
      const decoded = this.isWindows ? iconvLite.decode(data, 'gbk') : data.toString();
      this.emit('data', decoded);
    };

    this.process.stdout!.on('data', stdoutHandler);
    this.process.stderr!.on('data', stderrHandler);

    this.process.on('close', code => {
      this.emit('close', `Process exited with code ${code}`);
      this.process = null;
    });

    this.process.on('error', err => {
      this.emit('error', err.message);
    });

    // 初始化shell环境
    setTimeout(() => {
      if (!this.isWindows) {
        this.write('export PS1="\\u@\\h:\\w$ "\n');
      }
    }, 100);
  }

  write(command: string) {
    if (!this.process || this.process.killed) {
      this.initShell();
      setTimeout(() => this.write(command), 200);
      return;
    }

    // 处理特殊命令
    if (command.trim().toLowerCase() === 'exit') {
      this.close();
      return;
    }

    // 发送命令到shell进程
    this.process.stdin!.write(command + '\n');
  }

  changeDirectory(path: string) {
    this.currentPath = path;
    if (this.process && !this.process.killed) {
      const cdCommand = this.isWindows ? `cd "${path}"` : `cd "${path}" && pwd`;
      this.process.stdin!.write(cdCommand + '\n');
    }
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  close() {
    if (this.process && !this.process.killed) {
      this.process.kill('SIGTERM');
    }
    this.removeAllListeners();
  }

  resize(cols: number, rows: number) {
    if (this.process && !this.process.killed) {
      this.process.stdout!.on('resize', () => {
        // 处理终端大小调整
      });
    }
  }
}

class TerminalWs {
  static clients: Map<string, { ws: WebSocket; session: TerminalSession }> = null;

  private sshStream: import('ssh2').ClientChannel;

  name = '[micro-terminal]';

  mode: 'ssh' | 'exec' | 'spawn' = 'spawn';

  sshConfig: {
    isOpen: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
  };

  sshClient: import('ssh2').Client;

  constructor(
    ws: WebSocket,
    public url: string
  ) {
    if (!TerminalWs.clients) TerminalWs.clients = new Map();
    this.init(ws);
  }

  private init(ws: WebSocket) {
    const clientId = randomUUID();

    if (this.url.includes('ssh')) {
      const params = querystring.parse(this.url.split('?')[1]);
      if (!params) return;
      this.mode = 'ssh';
      const { host, port, username, password } = params;
      this.sshConfig = {
        isOpen: true,
        host: host as string,
        port: Number(port),
        username: username as string,
        password: password as string,
      };
      ws.send(
        JSON.stringify({
          params: clientId,
          action: 'meta',
          type: 'ssh',
        })
      );
      this.ssh(ws);
    } else {
      this.mode = 'spawn';
      ws.send(
        JSON.stringify({
          params: clientId,
          action: 'meta',
          type: 'exec',
        })
      );

      // 为每个客户端创建持久化终端会话
      const session = new TerminalSession(clientId);
      TerminalWs.clients.set(clientId, { ws, session });

      // 处理终端输出
      session.on('data', (data: string) => {
        ws.send(
          JSON.stringify({
            type: 'exec',
            action: 'stdout',
            params: data,
          })
        );
      });

      session.on('close', (message: string) => {
        ws.send(
          JSON.stringify({
            type: 'exec',
            action: 'stdout',
            params: message,
          })
        );
      });

      session.on('error', (error: string) => {
        ws.send(
          JSON.stringify({
            type: 'exec',
            action: 'stderr',
            params: error,
          })
        );
      });
    }

    ws.on('message', async message => {
      const data = JSON.parse(message.toString());

      if (data?.type === 'ssh') {
        this.sshStream?.write(data.params?.cmd?.trim() + '\n');
        // if (data.params?.cmd === 'logout') {
        //   this.sshClient?.end()?.destroy();
        // }
      } else {
        const client = TerminalWs.clients.get(clientId);
        if (!client) return;

        const { session } = client;

        session.write(data.params?.cmd);
      }
    });

    ws.on('close', () => {
      const client = TerminalWs.clients.get(clientId);
      if (client) {
        client.session.close();
        TerminalWs.clients.delete(clientId);
      }
      if (this.mode == 'ssh') {
        this.sshClient?.end()?.destroy();
      }
      logger.info(logger.blue(`${this.name}客户端断开连接`));
    });

    ws.on('error', err => {
      logger.error(`${this.name}连接错误:`, err);
      const client = TerminalWs.clients.get(clientId);
      if (client) {
        client.session.close();
        TerminalWs.clients.delete(clientId);
      }
      if (this.mode == 'ssh') {
        this.sshClient?.end()?.destroy();
      }
    });

    logger.info(logger.blue(`${this.name}客户端已连接！`));
  }

  async ssh(ws: WebSocket) {
    let Client: typeof import('ssh2').Client;
    try {
      Client = (await import('ssh2')).Client;
    } catch (err) {
      logger.error('[Micro]未成功安装ssh2，无法使用ssh连接功能：' + err.message);
      return;
    }

    if (!this.sshConfig) return new Error('[Micro]SSH未配置！');

    const sendStdout = (data: string) => {
      ws.send(JSON.stringify({ type: 'ssh', action: 'stdout', params: data }));
    };

    this.sshClient = new Client();
    this.sshClient
      .on('ready', () => {
        console.log('SSH Connection :: ready');
        sendStdout(Chalk.blueBright('SSH Connection :: ready') + '\n');
        this.sshClient.shell((err, stream) => {
          this.sshStream = stream;
          if (err) logger.error(err);
          stream
            .on('close', () => {
              console.log('SSH Stream :: close');
              sendStdout(Chalk.yellow('SSH Stream :: close') + '\n');
              this.sshClient.end();
            })
            .on('data', function (data) {
              console.log('SSH Stream :: STDOUT: ' + data);
              sendStdout(data.toString()); // 发送SSH输出到WebSocket
            })
            .on('exit', code => {
              sendStdout('SSH Shell 退出事件，退出码：' + Chalk.red(code) + '\n');
            })
            .stderr.on('data', function (data) {
              console.error('SSH Stream :: STDERR: ' + data);
              sendStdout(Chalk.red('SSH Stream :: STDERR: ') + '\n' + data.toString());
            });
        });
      })
      .on('error', err => {
        console.error('SSH Connection :: error:', err.message);
        sendStdout('连接失败，请重连或检查主机密码是否正确：\n' + err.stack || err.message + '\n');
      })
      .on('close', () => {
        console.error('SSH Connection :: close:\n');
        sendStdout('SSH 会话被关闭~');
      })
      .connect({
        host: this.sshConfig.host,
        port: this.sshConfig.port || 22,
        username: this.sshConfig.username,
        password: this.sshConfig.password, // 或者使用privateKey
      });
  }
}

export default TerminalWs;
