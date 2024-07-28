import { Cfg, YamlHandler } from "#cfg";
import _ from 'lodash'
import { botInfo, pluginInfo } from "#env";
import { join } from 'path'

import {
    bot,
    group,
    notice,
    other,
    puppeteer,
    qq,
    redis,
    renderer
} from './botCfgMap.js'

import {
    stdin,
    onebotv11
} from './protocolCfgMap.js'

import { userInfo } from './plugins/microCfgMap.js'

class ConfigController {

    // 获取机器人配置
    async getBotConfig(ctx) {

        const { name } = ctx.request.query
        const botCfg = await Cfg.getBotConfig(name)

        const defCfg = {
            bot,
            notice,
            other,
            puppeteer,
            qq,
            redis,
            renderer
        }

        let res: any

        if (name == 'group') {

            for (const groupKey in botCfg) {
                if (!group[groupKey]) {
                    group[groupKey] = group.default
                }
                for (const key in botCfg[groupKey]) {

                    if (group[groupKey].hasOwnProperty(key)) {
                        group[groupKey][key].value = botCfg[groupKey][key];
                    }
                }
                res = group
            }
        } else {
            // 遍历 botNow，更新 botDef 中对应项的 value  
            for (const key in botCfg) {
                if (defCfg[name] && defCfg[name].hasOwnProperty(key)) {
                    defCfg[name][key].value = botCfg[key];
                }
            }
            res = defCfg[name]
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        }
    }

    // 修改机器人配置
    async setBotConfig(ctx) {
        const { name } = ctx.request.query
        const data = ctx.request.body

        const botCfg = new YamlHandler(join(botInfo.WORK_PATH, 'config', 'config', name + '.yaml'))

        const cfgJson = botCfg.jsonData

        if (name == 'group') {
            for (const groupKey in data) {
                if (!cfgJson[groupKey]) {
                    cfgJson[groupKey] = cfgJson.default
                }
                for (const key in data[groupKey]) {
                    // if (cfgJson[groupKey].hasOwnProperty(key)) {
                    //     botCfg.set(groupKey + '.' + key, data[groupKey][key].value)
                    // } 

                    botCfg.document.setIn([isNaN(Number(groupKey)) ? groupKey : Number(groupKey), key], data[groupKey][key].value)
                }
                botCfg.save()
            }
        } else {
            for (const key in data) {
                if (cfgJson.hasOwnProperty(key)) {
                    if (data[key].value === "") {
                        data[key].value = null
                    }
                    botCfg.set(key, data[key].value)
                }
            }
            botCfg.save()
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: 'ok'
        }
    }

    // 获取用户权限配置
    async getUserConfig(ctx) {
        const userCfg = (await Cfg.getConfig('server')).userInfo

        const defCfg = userInfo

        let res = []
        for (const user of userCfg) {
            for (const key in user) {
                if (defCfg.hasOwnProperty(key)) {
                    defCfg[key].value = user[key]

                }
            }
            res.push(JSON.parse(JSON.stringify(defCfg)))
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        }
    }

    // 修改用户权限配置
    async setUserConfig(ctx) {

        const data = ctx.request.body

        const serverCfg = new YamlHandler(join(pluginInfo.ROOT_PATH, 'config', 'config', 'server.yaml'))

        const originalUserInfo = (serverCfg.jsonData).userInfo

        // 删掉多余user
        let userList = data.map((item) => item.username.value)
        originalUserInfo.forEach((user, index) => {
            if (!userList.includes(user.username)) {
                serverCfg.document.deleteIn(['userInfo', index])
            }
        })

        // 增加或修改user
        data.forEach((user, index) => {
            for (const key in user) {
                serverCfg.document.setIn(['userInfo', index, key], user[key].value)
            }
        });

        serverCfg.save()
        ctx.body = {
            code: 200,
            message: 'success',
            data: 'ok'
        }
    }

    // 获取协议配置
    async getProtocolConfig(ctx) {
        const protocolCfg = Cfg.getConfig('protocol')

        const defCfg = {
            stdin,
            onebotv11
        }

        for (const groupKey in protocolCfg) {
            for (const key in protocolCfg[groupKey]) {

                if (defCfg[groupKey].hasOwnProperty(key)) {
                    defCfg[groupKey][key].value = protocolCfg[groupKey][key];
                }
            }
            
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: defCfg
        }
    }

    // 修改协议配置
    async setProtocolConfig(ctx) {

        const data = ctx.request.body

        const protocolCfg = new YamlHandler(join(pluginInfo.ROOT_PATH, 'config', 'config', 'protocol.yaml'))

        for (const groupKey in data) {

            for (const key in data[groupKey]) {

                protocolCfg.document.setIn([groupKey,key],data[groupKey][key].value)
            }
            
        }

        protocolCfg.save()
        ctx.body = {
            code: 200,
            message: 'success',
            data: protocolCfg
        }
    }

}

export default new ConfigController()