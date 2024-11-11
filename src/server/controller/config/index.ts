import { readdirSync, statSync, existsSync } from 'fs';
import { Cfg, YamlHandler } from "#cfg";
import { botInfo, pluginInfo } from "#env";
import { join } from 'path'
import { pathToFileURL } from 'url';
import { getNestedProperty } from './tools.js'
import { Result } from '../../utils/result.js';
import type { schemaType, guobaSupportType } from './type.js'
import _ from 'lodash'


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

    // 获取插件列表
    async getPluginsInfoList(ctx) {
        const { source } = ctx.request.query

        const pluginInfoArr = []
        if(source == 'guoba') {

            
            const pluginsPath = join(botInfo.WORK_PATH, 'plugins')
            const packages = readdirSync(pluginsPath)
            for(let pkg of packages) {
                const pkgPath = join(pluginsPath, pkg)
                if(statSync(pkgPath).isDirectory()) {
                    const guobaSupportPath = join(pkgPath, 'guoba.support.js')
                    if(existsSync(guobaSupportPath)) {
                        const guobaCfg = await import(pathToFileURL(guobaSupportPath).toString())
                        const pkgCfg = await guobaCfg.supportGuoba()
                        
                        // 算了，吃力不讨好
                        // if(pkgCfg.pluginInfo.iconPath) {
                        //     const fileHostPath = join(botInfo.WORK_PATH, 'temp', 'fileHost')
                        //     const { iconPath } = pkgCfg.pluginInfo
                        //     const iconName = makeMd5(pkgCfg.pluginInfo.name??pkg).slice(0,8)
                        //     const iconFilePath = join(fileHostPath,iconName + '-logo.png')
                        //     if(!existsSync(iconFilePath)) {
                        //         if (iconPath.match(/^https?:\/\//))
                        //             writeFileSync(iconFilePath,Buffer.from(await (await fetch(iconPath)).arrayBuffer()))
                        //         else if (existsSync(iconPath)) {
                        //             copyFileSync(iconPath,iconFilePath)
                        //         }
                        //     }
                        //     pkgCfg.pluginInfo.iconPath = 'http://localhost:23306/api/File' + iconName
                        // }
                        
                        // 防止name不是真实包名
                        pluginInfoArr.push(Object.assign(pkgCfg.pluginInfo || {}, {pluginName: pkg}))
                    }
                }
            }
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInfoArr
        }
    }

    // 获取单个插件配置
    async getPluginConfig(ctx) {
        const {pluginName , source} = ctx.request.query

        let pluginCfg:guobaSupportType = {
            pluginInfo: {},
            configInfo: {
                schemas: [{
                    field: 'nana',
                    label: '呐呐~',
                    bottomHelpMessage: '咪',
                    component: 'InputTextArea'
                }],
                getConfigData: () => {},
                setConfigData: (data, { Result }) => { console.log(data, Result) }
            },
            
        }

        let res = []

        if(source == 'guoba') {
            const guobaSupportPath = join(botInfo.WORK_PATH, 'plugins', pluginName, 'guoba.support.js')
            const { supportGuoba } = await import(pathToFileURL(guobaSupportPath).toString())
            pluginCfg = await supportGuoba()

            const cfgSets = await pluginCfg.configInfo.getConfigData()
            res = pluginCfg.configInfo.schemas.map((cfg:schemaType) => {
                // 判断是否存在该属性
                if(cfg.field) {
                    const NestedProperty = getNestedProperty(cfgSets,cfg.field)
                    if(NestedProperty.isTrue) {
                        return Object.assign(cfg, {value: NestedProperty.value})
                    } else {
                        return cfg
                    }
                } else {
                    return cfg
                }
                
            })
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: res
        }
    }

    // 设置单个插件配置
    async setPluginConfig(ctx) {
        const {pluginName , source} = ctx.request.query
        const data = ctx.request.body
        // console.log(data)

        let pluginCfg:guobaSupportType = {
            pluginInfo: {},
            configInfo: {
                schemas: [{
                    field: 'nana',
                    label: '呐呐~',
                    bottomHelpMessage: '咪',
                    component: 'InputTextArea'
                }],
                getConfigData: () => {},
                setConfigData: (data, { Result }) => { console.log(data, Result) }
            },
        }

        const dataParams:{[key:string]:any} = {}

        data.forEach(cfg => {
            if(('value' in cfg) && cfg.field) {
                dataParams[cfg.field] = cfg.value
            }
        });

        let res:Result

        if(source == 'guoba') {
            const guobaSupportPath = join(botInfo.WORK_PATH, 'plugins', pluginName, 'guoba.support.js')
            const { supportGuoba } = await import(pathToFileURL(guobaSupportPath).toString())
            pluginCfg = await supportGuoba()
            res = await pluginCfg.configInfo.setConfigData(dataParams, { Result })
        }

        ctx.body = {
            code: 200,
            message: res.message,
            data: res.httpStatus
        }
    }

}

export default new ConfigController()
