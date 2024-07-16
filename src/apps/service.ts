import { Plugin } from '#bot'
import microWs from '../server/index.js'
import type { EventType } from '../adapter/types/types.js'

let plugin = await Plugin()

export class Service extends plugin {
  e: EventType
  constructor() {
    super({
      name: "ws服务",
      event: "message"
    })
  }
  async accept() {
    // console.log(this.e)
    const { msg, message, group_name, group_id, sender } = this.e
    if (!sender.user_id) {
      sender.user_id = this.e.user_id
    }

    microWs.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info')
    return true
  }
}

