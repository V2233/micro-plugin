import PluginHandler from './pluginHandler.js'
import { readFileSync } from 'fs';
import { pluginInfo } from '#env';
import { join } from 'path'

class PluginController {

    // 获取插件列表
    async getPluginList(ctx) {

        const pluginInstance = new PluginHandler()

        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsList
        }
    }

    // 添加插件
    async setPlugin(ctx) {

        const pluginInstance = new PluginHandler(ctx.request.body)

        pluginInstance.addPlugin()

        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        }
    }

    // 删除插件
    async deletePlugin(ctx) {
        const { index } = ctx.request.query

        const pluginInstance = new PluginHandler()
        pluginInstance.deletePlugin(index)

        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        }
    }

    // 修改插件
    async editorPlugin(ctx) {
        const { index } = ctx.request.query
        const pluginInstance = new PluginHandler()
        pluginInstance.editorPlugin(index, ctx.request.body)

        ctx.body = {
            code: 200,
            message: 'success',
            data: pluginInstance.pluginsArr
        }
    }

    // 获取图片数据
    async getImageJson(ctx) {
        const { id, hash } = ctx.request.query
        const htmlPath = join(pluginInfo.DATA_PATH, 'plugins', id, hash + '.json')
        const imageData = readFileSync(htmlPath, 'utf8')

        ctx.body = {
            code: 200,
            message: 'success',
            data: imageData
        }
    }

    // 进入插件编辑页获取消息段资源
    async getSegResources(ctx) {
        const plugin = ctx.request.body

        for (let i = 0; i < plugin.message.length; i++) {
            if (plugin.message[i].type == 'button') {
                const btnJsonPath = join(pluginInfo.DATA_PATH, 'plugins', plugin.id, 'button.json')
                plugin.message[i].content = JSON.parse(readFileSync(btnJsonPath, 'utf8'))
            }
            if (plugin.message[i].type == 'markdown') {
                const mdJsonPath = join(pluginInfo.DATA_PATH, 'plugins', plugin.id, 'markdown.json')
                plugin.message[i].content = JSON.parse(readFileSync(mdJsonPath, 'utf8'))
            }
            if(plugin.message[i].type == 'code') {
                const jsPath = join(pluginInfo.DATA_PATH, 'plugins', plugin.id, `${plugin.message[i].hash}.code.js`)
                plugin.message[i].data = readFileSync(jsPath, 'utf8')
            }
        }

        ctx.body = {
            code: 200,
            message: 'success',
            data: plugin
        }
    }
}

export default new PluginController()