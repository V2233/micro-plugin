import http from 'node:http';
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export default server;
