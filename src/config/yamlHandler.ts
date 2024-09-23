import { writeFileSync, readFileSync } from 'fs'
import YAML from 'yaml'
import _ from 'lodash'
import chokidar from 'chokidar'

export default class YamlHandler {
    document: any
    watcher: any
    isSave: boolean

    /**
     * 读写yaml文件
     *
     * @param yamlPath yaml文件绝对路径
     * @param isWatch 是否监听文件变化
     */
    constructor(public yamlPath:string, private isWatch = false) {
        this.yamlPath = yamlPath
        this.isWatch = isWatch
        this.initYaml()
    }

    initYaml() {
        try {
            // parseDocument 将会保留注释
            this.document = YAML.parseDocument(readFileSync(this.yamlPath, 'utf8'))
        } catch (error) {
            throw error
        }
        if (this.isWatch && !this.watcher) {
            this.watcher = chokidar.watch(this.yamlPath).on('change', () => {
                if (this.isSave) {
                    this.isSave = false
                    return
                }
                this.initYaml()
            })
        }
    }

    /**返回读取的对象 json格式*/
    get jsonData() {
        if (!this.document) {
            return null
        }
        return this.document.toJSON()
    }

    /*检查集合是否包含key的值(在整个文件中查询有没有这个属性,对象中的属性通过.一级一级查找)*/
    has(keyPath: string) {
        return this.document.hasIn(keyPath.split('.'))
    }
    /*返回key的值*/
    get(keyPath: string) {
        return _.get(this.jsonData, keyPath)
    }
    /*修改某个key的值*/
    set(keyPath: string, value: any) {
        this.document.setIn(keyPath.split('.'), value)
        this.save()
    }
    /*删除key*/
    delete(keyPath: string) {
        this.document.deleteIn(keyPath.split('.'))
        this.save()
    }
    //数组添加数据
    addIn(keyPath: string, value: any) {
        this.document.addIn(keyPath.split('.'), value)
        this.save()
    }
    /**
     * 设置 document 的数据（递归式）
     * @param data 要写入的数据
     */
    setData(data: any) {
        this.setDataRecursion(data, [])
        this.save()
    }

    setDataRecursion(data, parentKeys) {
        if (Array.isArray(data)) {
            this.document.setIn(this.mapParentKeys(parentKeys), data)
        } else if (typeof data === 'object' && data !== null) {
            for (const k in data) {
                this.setDataRecursion(data[k], parentKeys.concat(k))
            }
        } else {
            parentKeys = this.mapParentKeys(parentKeys)
            this.document.setIn(parentKeys, data)
        }
    }

    // 将数字key转为number类型，防止出现引号
    mapParentKeys(parentKeys) {
        
        return parentKeys.map((k:string | number) => {
            if(typeof k == 'number') {
                k = String(k)
            }
            if (k.startsWith('INTEGER__')) {
                return Number.parseInt(k.replace('INTEGER__', ''))
            }
            return k
        })
    }

    // 彻底删除某个key
    deleteKey(keyPath) {
        let keys = keyPath.split('.')
        keys = this.mapParentKeys(keys)
        this.document.deleteIn(keys)
        this.save()
    }

    save(path = this.yamlPath) {
        this.isSave = true
        let yaml = this.document.toString()
        writeFileSync(path, yaml, 'utf8')
    }
}
