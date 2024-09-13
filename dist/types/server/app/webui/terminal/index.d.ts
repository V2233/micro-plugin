import { WebSocket } from 'ws';
declare class TerminalWs {
    clients: Map<string, WebSocket>;
    execPath: string;
    stream: any;
    constructor(ws: WebSocket);
    init(ws: WebSocket): void;
    exec(cmd: string, ws: WebSocket, path: string | null): Promise<void>;
    ssh(ws: WebSocket, account: {
        host: string;
        port?: string;
        username: string;
        password: string;
    }): Promise<void>;
}
export default TerminalWs;
