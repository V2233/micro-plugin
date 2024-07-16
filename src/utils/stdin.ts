// import readline from "node:readline/promises"
// import fs from "node:fs/promises"
// import path from "node:path"
// import { spawn } from "node:child_process"
// import { Bot, Logger } from '#bot'

// const bot = await Bot()
// const logger = await Logger()

// function makeLog(level: string, msg: string, id: string) {
//   logger[level](logger.blue(`<${id}>:${msg}`))
// }

// bot?.adapter?.push(new class stdinAdapter {
//   id: string
//   name: string
//   path: string
//   catimg: any
//   constructor() {
//     this.id = "stdin"
//     this.name = "标准输入"
//     this.path = "data/stdin/"
//     this.catimg = file => new Promise(resolve =>
//       spawn("catimg", ["-l0", file], { stdio: "inherit" })
//         .on("error", () => this.catimg = () => { })
//         .on("close", resolve)
//     )
//   }

//   async sendMsg(msg) {
//     if (!Array.isArray(msg))
//       msg = [msg]
//     for (let i of msg) {
//       if (typeof i != "object")
//         i = { type: "text", text: i }

//       let file
//       if (i.file) {
//         file = await bot.fileType(i)
//         if (Buffer.isBuffer(file.buffer)) {
//           file.path = `${this.path}${file.name}`
//           await fs.writeFile(file.path, file.buffer)
//         }
//       }

//       switch (i.type) {
//         case "text":
//           if (i.text.match("\n"))
//             i.text = `发送文本：\n${i.text}`
//           makeLog("info", i.text, this.id)
//           break
//         case "image":
//           await this.catimg(file.path)
//           makeLog("info", `发送图片：${file.url}\n文件已保存到：${logger.cyan(file.path)}`, this.id)
//           break
//         case "record":
//           makeLog("info", `发送音频：${file.url}\n文件已保存到：${logger.cyan(file.path)}`, this.id)
//           break
//         case "video":
//           makeLog("info", `发送视频：${file.url}\n文件已保存到：${logger.cyan(file.path)}`, this.id)
//           break
//         case "reply":
//           break
//         case "at":
//           break
//         case "node":
//           bot.sendForwardMsg(msg => this.sendMsg(msg), i.data)
//           break
//         default:
//           makeLog("info", i, this.id)
//       }
//     }
//     return { message_id: Date.now().toString(36) }
//   }

//   recallMsg(message_id) {
//     makeLog("info", `撤回消息：${message_id}`, this.id)
//   }

//   async sendFile(file, name = path.basename(file)) {
//     const buffer = await bot.Buffer(file)
//     if (!Buffer.isBuffer(buffer)) {
//       makeLog("error", `发送文件错误：找不到文件 ${logger.red(file)}`, this.id)
//       return false
//     }

//     const files = `${this.path}${Date.now().toString(36)}-${name}`
//     makeLog("info", `发送文件：${file}\n文件已保存到：${logger.cyan(files)}`, this.id)
//     return fs.writeFile(files, buffer)
//   }

//   pickFriend() {
//     return {
//       sendMsg: msg => this.sendMsg(msg),
//       recallMsg: message_id => this.recallMsg(message_id),
//       sendFile: (file, name) => this.sendFile(file, name),
//       pickMember: function () { return this },
//     }
//   }

//   message(msg) {
//     fs.appendFile(`${this.path}history`, `${Date.now().toString(36)}:${msg}\n`, "utf8")
//     const data = {
//       bot: Bot[this.id],
//       self_id: this.id,
//       user_id: this.id,
//       post_type: "message",
//       message_type: "private",
//       sender: { user_id: this.id, nickname: this.name },
//       message: [{ type: "text", text: msg }],
//       raw_message: msg,
//     }
//     makeLog("info", `系统消息：${data.raw_message}`, this.id)
//     bot.em(`${data.post_type}.${data.message_type}`, data)
//   }

//   async load(force) {
//     if (!(process.stdin.isTTY || process.env.FORCE_TTY || force)) return

//     await bot.mkdir(this.path)
//     Bot[this.id] = {
//       adapter: this,
//       sdk: readline.createInterface({
//         input: process.stdin,
//         output: process.stderr,
//       }).on("line", data => this.message(String(data)))
//         .on("close", () => process.exit(1)),

//       uin: this.id,
//       nickname: this.name,
//       version: { id: this.id, name: this.name },

//       pickFriend: () => this.pickFriend(),
//       get stat() { return bot.stat },
//       get pickUser() { return this.pickFriend },
//       get pickMember() { return this.pickFriend },
//       get pickGroup() { return this.pickFriend },

//       fl: new Map().set(this.id, {
//         user_id: this.id,
//         nickname: this.name,
//         group_id: this.id,
//         group_name: this.name,
//       }),
//       get gl() { return this.fl },
//       gml: new Map,
//     }
//     Bot[this.id].gml.set(this.id, Bot[this.id].fl)

//     try {
//       Bot[this.id].sdk.history = (await fs.readFile(`${this.path}history`, "utf8")).split("\n").slice(-Bot[this.id].sdk.historySize - 1, -1).map(i => i.replace(/^[0-9a-z]+?:/, "")).reverse()
//     } catch (err) {
//       makeLog("trace", err, this.id)
//     }

//     makeLog("mark", `${this.name}(${this.id}) 已连接`, this.id)
//     bot.em(`connect.${this.id}`, { self_id: this.id })
//   }
// })