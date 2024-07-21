import { join } from 'path'
import { pluginInfo } from '#env'

import Koa from 'koa'
import KoaStatic from 'koa-static'
import { koaBody } from 'koa-body'
// import cors from 'koa2-cors' 
import http from 'node:http'

import router from '../router/index.js'

const app = new Koa()

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

/**
 * 创建server实例
 * @returns 
 */
const server = http.createServer(app.callback());

export default server
