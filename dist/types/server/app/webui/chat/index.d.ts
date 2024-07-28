import { WebSocket } from 'ws';
declare class Screenchat {
    clients: Map<string, WebSocket>;
    private plugins;
    constructor(ws: WebSocket);
    use(plugin: any): void;
    init(ws: WebSocket): void;
    listen(e: any): Promise<boolean>;
    sendMsg(params: any, action: string, type?: string, clientId?: any): void;
}
export default Screenchat;
