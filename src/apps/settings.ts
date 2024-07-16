import { Plugin } from '#bot'
import { Cfg } from '#cfg'
import { startServer, stopServer, restartServer } from '../server/index.js'
import type { RuleType, EventType } from '../adapter/types/types.js'

let plugin = await Plugin()

export class Service extends plugin {
    priority: number
    rule: RuleType
    e: EventType
    constructor() {
        super({
            name: "设置",
            event: "message"
        })
        this.priority = 500
        this.rule = [
            {
                reg: /小微设置面板端口(.*)/,
                fnc: "setWebPort"
            },
            {
                reg: /小微开启面板服务/,
                fnc: "startWeb"
            },
            {
                reg: /小微关闭面板服务/,
                fnc: "closeWeb"
            },
            {
                reg: /小微重启面板服务/,
                fnc: "reStartWeb"
            },
        ]
    }

    async setWebPort() {
        let port = 23306
        if (/小微设置面板端口(\d+)/.test(this.e.msg)) {
            port = Number(this.e.msg.replace(/.*小微设置面板端口/, ''))
            if (port < 5000 || port > 65535) {
                this.e.reply('范围请选择【5000~65535】')
                return
            }
        } else {
            this.e.reply('范围请选择【5000~65535】')
            return
        }

        try {
            Cfg.setConfig(port, ['server', 'port'], 'server')
            this.e.reply('端口号设置成功，更新为' + port)
        } catch (err) {
            this.e.reply(JSON.stringify(err))
        }
    }

    async startWeb() {
        try {
            const port = Cfg.getConfig('server').server.port
            await startServer(port)
            this.e.reply('小微插件面板服务启动成功！')
        } catch (err) {
            this.e.reply(JSON.stringify(err))
        }
    }

    async reStartWeb() {
        try {
            this.e.reply('开始重启面板请稍等...')
            const port = Cfg.getConfig('server').server.port
            const startDate = Date.now()
            await restartServer(port)
            this.e.reply('小微插件面板服务重启成功！耗时' + (Date.now() - startDate) + 'ms')
        } catch (err) {
            this.e.reply(JSON.stringify(err))
        }
    }

    async closeWeb() {
        try {
            await stopServer()
            this.e.reply('小微插件面板服务关闭成功！')
        } catch (err) {
            this.e.reply(JSON.stringify(err))
        }
    }
}