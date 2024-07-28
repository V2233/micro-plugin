import { join } from 'path'
import { pluginInfo,botInfo } from '#env'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import { koaBody } from 'koa-body'
import { createServer } from 'node:http'

import router from '../router/index.js'

const app = new Koa()

// import cors from 'koa2-cors' 
//跨域配置
// app.use(
//     cors({
//         origin: function (ctx) {
//             return ctx.request.headers.origin || ""
//         },
//         //cookie
//         credentials: true,
//         //允许所有HTTP请求方法
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//         //设置允许给客户端的响应头信息
//         exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//         //所有头信息字段
//         allowHeaders: ['Content-Type', 'Authorization', 'Accept']
//     })
// )

// body解析
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: join(pluginInfo.PUBLIC_PATH, 'upload'),
        multiples: true,
        keepExtensions: true,
        maxFieldsSize: 4 * 1024 * 1024 * 1024
    }
}));

// 注册路由
app.use(router.routes()).use(router.allowedMethods());

// 静态
app.use(KoaStatic(join(pluginInfo.PUBLIC_PATH, 'static')))

app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/api/File')) {
      // 去除 '/static' 前缀并处理静态文件请求
      ctx.path = ctx.path.replace(/^\/api\/File/, '')
      await KoaStatic(join(botInfo.WORK_PATH, 'temp', 'FileToUrl'))
    } else {
      // 非静态文件请求，继续执行后续中间件
      await next();
    }
});

/**
 * 创建server实例
 * @returns 
 */
const server = createServer(app.callback());

export default server
