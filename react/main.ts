// import './tailwindcss.js'
// import Koa from 'koa'
// import KoaStatic from 'koa-static'
// import Router from 'koa-router'
// import { Component } from './component.js'
// import { readdirSync } from 'fs'
// import { join, basename } from 'path'
// import { fileURLToPath } from 'url';

// const Com = new Component()
// const app = new Koa()
// const router = new Router()
// const Port = 8080

// // 解析路由
//   const _dirname =  fileURLToPath(import.meta.url)
//   const root_path = join(_dirname, '../../')
//   const root_name = basename(root_path)
//   const routes_path = join(_dirname, '../')

//   const plugins = readdirSync(routes_path, {
//     withFileTypes: true
//   }).filter(flie => flie.isFile())

//   for (const plugin of plugins) {
//     if (/^(routes.jsx|routes.tsx)$/.test(plugin.name)) {
//       const routes = (await import(`file://${join(routes_path, plugin.name)}`))
//         ?.default
//       if (!routes) continue
//       if (Array.isArray(routes)) {
//         for (const item of routes) {
//           const url = `/${root_name}${item.url}`
//           console.log(`http://127.0.0.1:${Port}${url}`)
//           const options = item?.options ?? {}
//           router.get(url, ctx => {
//             ctx.body = Com.create(item.element, {
//               ...options,
//               html_head: `${options?.html_head ?? ''}<link rel="stylesheet" href="/output.css">`,
//               file_create: false
//             })
//           })
//         }
//       }
//     }
//   }

// // static
// app.use(KoaStatic('react/public'))

// // routes
// app.use(router.routes())

// // listen 8000
// app.listen(Port, () => {
//   console.log('Server is running on port ' + Port)
// })
