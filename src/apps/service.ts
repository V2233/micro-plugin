import { Plugin,Bot } from '#bot'
import microWs from '../server/index.js'
let bot = await Bot()

let plugin = await Plugin()

export class Service extends plugin {

  constructor() {
    super({
      name: "ws服务",
      event: "message"
    })
    this.priority = 4000
    // this.rule = [
    //     {
    //         reg: /(.*)/,
    //         fnc: "listen",
    //     },
    //   ]
    this.init()
  }

  async init() {
    // 事件
    try {
      bot.on?.("message", async(e) => { 
        this.e = e
        await this.listen()
      })
    } catch (err) {

    }

  }

  async listen() {
    // console.log(this.e)
    const { msg, message, group_name, group_id, sender } = this.e
    if (!sender.user_id) {
      sender.user_id = this.e.user_id
    }

    microWs.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info')
    return true
  }
}

