/// <reference types="node" />
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
export default class MicroWs {
    onOpen(ws: WebSocket, req: IncomingMessage): void;
}
