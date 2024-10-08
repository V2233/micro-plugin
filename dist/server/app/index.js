import { join } from 'path';
import { existsSync, mkdirSync, createReadStream } from 'fs';
import { pluginInfo, botInfo } from '../../env.js';
import mime from 'mime';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import { koaBody } from 'koa-body';
import { createServer } from 'node:http';
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
const fileHostPath = join(botInfo.WORK_PATH, 'temp', 'fileHost');
if (!existsSync(fileHostPath)) {
    mkdirSync(fileHostPath, { recursive: true });
}
app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/api/File')) {
        ctx.path = ctx.path.replace(/^\/api\/File/, '');
        const filePath = join(fileHostPath, ctx.path);
        try {
            if (existsSync(filePath)) {
                const contentType = mime.getType(filePath) || 'application/octet-stream';
                ctx.type = contentType;
                ctx.body = createReadStream(filePath);
            }
            else {
                ctx.status = 404;
                ctx.body = 'File not found';
            }
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
        }
    }
    else {
        await next();
    }
});
const server = createServer(app.callback());

export { server as default };
