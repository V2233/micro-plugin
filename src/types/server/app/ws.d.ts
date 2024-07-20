export default class MicroWs {
    clients: Map<string, WebSocket>;
    private plugins;
    constructor();
    use(plugin: any): void;
    onOpen(ws: any): void;
    sendMsg(params: any, action: string, type?: string, clientId?: any): void;
}
