import { WebSocket } from 'ws';
declare class TerminalWs {
    clients: Map<string, WebSocket>;
    execPath: string;
    constructor(ws: WebSocket);
    init(ws: WebSocket): void;
    exec(cmd: string, ws: WebSocket, path: string | null): Promise<void>;
}
export default TerminalWs;
