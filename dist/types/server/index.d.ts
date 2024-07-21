import MicroWs from './app/ws.js';
declare let microWs: MicroWs;
declare const startServer: (port: number) => Promise<"ok" | void>;
declare const stopServer: () => Promise<any>;
declare const restartServer: (port: number) => Promise<any>;
export default microWs;
export { startServer, stopServer, restartServer };
