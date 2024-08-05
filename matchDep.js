

import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import BotHelp from '../model/botHelp/botHelp.js'
import defineConfig from '../../../yunzai.config.js'
import { readSetYaml } from '../tools/setCfg.js'
import fs from 'fs'
import loader from '../../../lib/plugins/loader.js'
import lodash from "lodash"
import md5 from 'md5'
const _path = process.cwd().replace(/\\/g, '/');

let cacheData = {}
let isRemind = false

export class botHelp extends plugin {
  constructor () {
    super({
      name: '机器人全部指令',
      dsc: '指令总览',
      event: 'message',
     
    })
  } 
 
  async accept(e) {        
        if (/^#?(命令|帮助|菜单|help|说明|功能|使用说明)(.*)/g.test(e.msg) || /^#?小v刷新指令图/g.test(e.msg) || /^#?小v(开启|关闭)帮助提示/g.test(e.msg)) {
        if (/^#?小v刷新指令图/g.test(e.msg)) {
          cacheData = {}
          e.reply('清除指令图缓存成功!')
          return
        }
        if (/^#?小v关闭帮助提示/g.test(e.msg)) {
          isRemind = false
          e.reply('小v关闭帮助提示成功⋟﹏⋞')
          return
        } else if (/^#?小v开启帮助提示/g.test(e.msg)) {
          isRemind = true
          e.reply('小v开启帮助提示成功∗❛ั∀❛ั✧')
          return
        }
        let page = /^#?(命令|帮助|菜单|help|说明|功能|指令|使用说明)(.*)/g.exec(e.msg)[2]
        let packages = []           
       
        for(let plugin of loader.priority){      
          if (/\.js$/.test(plugin.key)) {
            plugin.key = 'example'
          } else if (/^system/.test(plugin.key)) {
            plugin.key = 'system'
          } else if (/^other/.test(plugin.key)) {
            plugin.key = 'other'
          } 
          let object = packages.find(data => data.packName == plugin.key)       
            if (!object) {
              packages.push({ packName: plugin.key, packPlugins: [] })
              object = packages.find(data => data.packName == plugin.key)      
            }
            let objectIndex = packages.indexOf(object)
            let p = new plugin.class(e);                
            let msg = { 
              pluginTitle: `插件名：${plugin.name}`,
              pluginFuns: []
            }
            if(lodash.isEmpty(p.rule)){
                msg.pluginFuns.push(`无命令正则`)
                packages[objectIndex].packPlugins.push(msg);
                continue;
            }
            for(let v in p.rule){
                msg.pluginFuns.push(`【${Number(v) + 1}】：${p.rule[v].reg}`)
            }    
  
            packages[objectIndex].packPlugins.push(msg)
        }   
        
        // 匹配的模块名
        const modules = await getReflectNpm('./yunzai.config.js')
        
        const npmPlugins = defineConfig.applications
     
        npmPlugins.forEach((npmPlugin,index) => {
            const npmObj = {packName: (modules[index]?modules[index]:'暂无法匹配包名'), packPlugins: [], isNpm: true}
            npmPlugin.mounted().forEach((pluginInstance) => {
                
                if(lodash.isEmpty(pluginInstance.rule)){
                    msg.pluginFuns.push(`无命令正则`)
                    npmObj.packPlugins.push(msg);
                    return
                }
                
                let msg = { 
                  pluginTitle: `插件名：${pluginInstance.name}`,
                  pluginFuns: []
                }
                
                for(let v in pluginInstance.rule){
            
                    msg.pluginFuns.push(`【${Number(v) + 1}】：${pluginInstance.rule[v].reg}`)
                }    
                npmObj.packPlugins.push(msg);
                
            })
            packages.push(npmObj)
        })
        

       let viewNumber = await readSetYaml(e, 'bothelpset')
       let viewNum = viewNumber.viewnum || 4
       let pageSum = Math.ceil(packages.length / viewNum)       

       page = Number(page)
       
       if (page > pageSum || !/^(\d+)/g.test(page) || !page) {        
         let res = ``
         for (let i=0; i<packages.length; i++) {
           let packPage = Math.ceil((i + 1) / viewNum)
           res += `● ${packages[i].packName}${packages[i].isNpm?'(npm)':''} --- ${packPage}\n`
         }
         let response = `您可以在【帮助】后添加以下页码快速定位您需要的插件:\n———————————————\n${res}———————————————\n您还可以发送【插件包详情】来查看全部插件包的简介\n如需每页只显示一个插件包，则回复【小v设置插件显示1】即可(数字过大可能导致图片发送失败)~`
         e.reply(response)
         return false
       }
       let Group = lodash.chunk(packages, viewNum);
       
       let botHelpData = await new BotHelp(e).getBotHelpData(Group[page - 1])
       let img = await this.cache(page, botHelpData)
       await this.reply(img)
     }
  }

async cache (index, data) {
    let helpData = {
      md5: '',
      img: ''
    }
    if (!cacheData[index]) {
      cacheData[index] = helpData
    }
    let tmp = md5(JSON.stringify(data))
    if (cacheData[index].md5 == tmp) return cacheData[index].img
    await this.reply('帮助数据已刷新或缓存丢失，正重新生成，请稍等~')
    cacheData[index].img = await puppeteer.screenshot('small-v-plugin/botHelp', data)
    cacheData[index].md5 = tmp

    return cacheData[index].img
  }
}


async function getReflectNpm(filePath) {  
  try {  
    const data = await new Promise((resolve, reject) => {  
      fs.readFile(filePath, 'utf8', (err, data) => {  
        if (err) {  
          reject(err);  
        } else {  
          resolve(data);  
        }  
      });  
    });  
  
    // 使用正则表达式匹配import语句  
    const importMatches = data.matchAll(/import\s+(\w+|\{[^}]*\})\s+from\s+'([^']+)'/g);  
    const importMap = new Map();  
  
    // 构建import语句的映射  
    for (const [, imports, modulePath] of importMatches) {  
      if (imports.includes('{')) {  
        // 处理命名导入（这里只取第一个作为示例）  
        importMap.set(imports.replace(/{|}/g, '').split(',')[0].trim(), modulePath);  
      } else {  
        // 默认导入  
        importMap.set(imports, modulePath);  
      }  
    }  
  
    // 匹配applications数组  
    const applicationsMatch = data.match(/applications:\s*\[([^\]]+)\]/);  
    if (applicationsMatch && applicationsMatch[1]) {  
      const applications = applicationsMatch[1].split(',').map(dep => {  
        return dep.trim().match(/^\s*(\w+)\s*\(/)?.[1] || '';  
      }).filter(dep => dep !== '');  
  
      // 将applications数组中的函数名映射为模块名称  
      const realDependencies = applications.map(appName => {  
        return importMap.get(appName) || appName;  
      });  
  
      return realDependencies;  
    } else {  
      return []; // 如果没有找到applications数组，返回一个空数组  
    }  
  } catch (error) {  
    throw new Error(`Error processing file: ${error.message}`);  
  }  
} 






