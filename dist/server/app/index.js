import { join } from 'path';
import { pluginInfo } from '../../env.js';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import { koaBody } from 'koa-body';
import http from 'node:http';
import router from '../router/index.js';

const app = new Koa();
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: join(pluginInfo.PUBLIC_PATH, 'upload'),
        multiples: true,
        keepExtensions: true,
        maxFieldsSize: 4 * 1024 * 1024 * 1024
    }
}));
app.use(router.routes()).use(router.allowedMethods());
app.use(KoaStatic(join(pluginInfo.PUBLIC_PATH, 'static')));
const server = http.createServer(app.callback());

export { server as default };
