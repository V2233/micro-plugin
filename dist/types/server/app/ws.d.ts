import { WebSocket } from 'ws';
import { Duplex } from 'stream';
import { IncomingMessage } from 'http';
export default class MicroWs {
    cfg: any;
    constructor();
    openStdin(): Promise<void>;
    onOpen(ws: WebSocket, req: IncomingMessage): any;
    onUpgrade(ws: WebSocket, req: IncomingMessage, socket: Duplex, head: Buffer): void;
    openForwardWs(): Promise<void>;
}
