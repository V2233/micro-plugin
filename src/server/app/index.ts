import { join } from 'path'
import { mkdirSync, existsSync, createReadStream } from 'fs'
import { pluginInfo,botInfo } from '#env'
import mime from 'mime'
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

// 本地文件服务
const fileHostPath = join(botInfo.WORK_PATH, 'temp', 'fileHost')
if(!existsSync(fileHostPath)) {
  mkdirSync(fileHostPath,{ recursive: true })
}

app.use(async (ctx, next) => {  
  if (ctx.path.startsWith('/api/File')) {  
    // 移除 /api/File 前缀，以便 KoaStatic 能正确处理剩余路径  
    ctx.path = ctx.path.replace(/^\/api\/File/, '');  
    const filePath = join(fileHostPath, ctx.path);  
    try {  
      if (existsSync(filePath)) {  
        // 设置响应类型（这里可能需要更复杂的逻辑来根据文件扩展名设置）  
        const contentType = mime.getType(filePath) || 'application/octet-stream';
        ctx.type = contentType; 
        ctx.body = createReadStream(filePath);  
      } else {  
        ctx.status = 404;  
        ctx.body = 'File not found';  
      }  
    } catch (err) {  
      ctx.status = 500;  
      ctx.body = 'Internal Server Error';  
    }  
  } else {  
    // 非静态文件请求，继续执行后续中间件  
    await next()
  }
})

/**
 * 创建server实例
 * @returns 
 */
const server = createServer(app.callback());

export default server
