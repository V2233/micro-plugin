import { loader } from 'yunzai/core';
import { Plugin } from '../adapter'

let plugin = await Plugin()
export class Hello extends plugin {
  constructor() {
    super({
      // 可省略，默认9999
      priority: 700,
    })
    this.rule = [
      {
        reg: /^(#|\/)?测e/,
        fnc: this.hello.name
      },
      {
        reg: /^(#|\/)?测loader/,
        fnc: this.loader.name
      },
      {
        reg: /^(#|\/)?测bot/,
        fnc: this.bot.name
      },
    ]
  }
  async hello() {
    console.log(this.e)
    return true
  }
  async loader() {
    console.log(loader.priority)
    console.log(loader.handler)
    console.log(loader.task)
    console.log(loader.watcher)
    console.log(loader.msgThrottle)
    console.log(loader.pluginCount)
    return true
  }
  async bot() {
    console.log(this.e.toString())
    return true
  }
}
