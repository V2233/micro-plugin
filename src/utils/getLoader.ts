import { pathToFileURL } from 'url';
import { join } from 'path';
import { botInfo } from '#env';
import { Loader } from '#bot'
import { readFile } from 'fs'
import lodash from 'lodash'

export async function getLoader() {
    const loader = await Loader()
    let packages = []

    for (let plugin of loader.priority) {
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
        let p = new plugin.class();
        let msg = {
            pluginTitle: `插件名：${plugin.name}`,
            pluginFuns: []
        }
        if (lodash.isEmpty(p.rule)) {
            msg.pluginFuns.push(`无命令正则`)
            packages[objectIndex].packPlugins.push(msg);
            continue;
        }
        for (let v in p.rule) {
            msg.pluginFuns.push(`【${Number(v) + 1}】：${p.rule[v].reg}`)
        }

        packages[objectIndex].packPlugins.push(msg)
    }

    // 匹配的模块名
    try {  
        const modules = await getReflectNpm('./yunzai.config.js');  
        const configPath = join(botInfo.WORK_PATH, 'yunzai.config.js');  
        const configModule = await import(pathToFileURL(configPath).toString());  
        const defineConfig = configModule.default;  
        const npmPlugins = defineConfig.applications;  
  
        for (const [index, npmPlugin] of npmPlugins.entries()) {  
            const npmObj = {  
                packName: (modules[index] ? modules[index] : '暂无法匹配包名'),  
                packPlugins: [],  
                isNpm: true  
            };  
  
            let npmPluginFuncs: any[] = [];  
            if (typeof npmPlugin === 'string') {  
                npmPluginFuncs = await (await import(npmPlugin)).default().mounted();  
            } else {  
                npmPluginFuncs = await npmPlugin.mounted();  
            }  
  
            for (const pluginInstance of npmPluginFuncs) {  
                let msg = {  
                    pluginTitle: `插件名：${pluginInstance.name}`,  
                    pluginFuns: []  
                };  
  
                if (lodash.isEmpty(pluginInstance.rule)) {  
                    msg.pluginFuns.push(`无命令正则`);  
                    npmObj.packPlugins.push(msg);  
                    continue;  
                }  
  
                for (let v in pluginInstance.rule) {  
                    msg.pluginFuns.push(`【${Number(v) + 1}】：${pluginInstance.rule[v].reg}`);  
                }  
  
                npmObj.packPlugins.push(msg);  
            }  
  
            packages.push(npmObj);  
        }  
  
    } catch (err) {  
        console.log(err);  
    }  

    return packages
}

/**
 * 匹配模块名
 * @param filePath 
 * @returns 
 */
async function getReflectNpm(filePath:string) {  
    try {  
        const data = await new Promise((resolve, reject) => {
            readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }) as string

        const applicationsMatch = data.match(/applications:\s*\[([^\]]+)\]/);  
        if (applicationsMatch && applicationsMatch[1]) {  

            const applicationsRaw = applicationsMatch[1].replace(/\s*,\s*/g, ',').split(',');  
  
            // 去除每个元素前后的空格（如果有的话）  
            const applications = applicationsRaw.map(dep => dep.trim());  
  
            return applications;  
        } else {  
            return []; 
        }  
    } catch (error) {  
        throw new Error(`Error processing file: ${error.message}`);  
    }  
} 

/**
 * @deprecated 不映射了，不稳定
 * @param filePath 
 * @returns 
 */
// async function getReflectNpm(filePath) {
//     try {
//         const data = await new Promise((resolve, reject) => {
//             readFile(filePath, 'utf8', (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         }) as string

//         // 使用正则表达式匹配import语句  
//         // const importMatches = data.matchAll(/import\s+(\w+|\{[^}]*\})\s+from\s+'([^']+)'/g);
//         const importMatches = data.matchAll(/import\s+(\w+|\{[^}]*\})\s+from\s+(['"])([^'"]+)\2/g);

//         const importMap = new Map();

//         // 构建import语句的映射  
//         for (const [, imports, modulePath] of importMatches) {
//             if (imports.includes('{')) {
//                 // 处理命名导入（这里只取第一个作为示例）  
//                 importMap.set(imports.replace(/{|}/g, '').split(',')[0].trim(), modulePath);
//             } else {
//                 // 默认导入  
//                 importMap.set(imports, modulePath);
//             }
//         }

//         // 匹配applications数组  
//         const applicationsMatch = data.match(/applications:\s*\[([^\]]+)\]/);
//         if (applicationsMatch && applicationsMatch[1]) {
//             const applications = applicationsMatch[1].split(',').map(dep => {
//                 return dep.trim().match(/^\s*(\w+)\s*\(/)?.[1] || '';
//             }).filter(dep => dep !== '');

//             // 将applications数组中的函数名映射为模块名称  
//             const realDependencies = applications.map(appName => {
//                 return importMap.get(appName) || appName;
//             });

//             return realDependencies;
//         } else {
//             return [];
//         }
//     } catch (error) {
//         throw new Error(`Error processing file: ${error.message}`);
//     }
// } 

