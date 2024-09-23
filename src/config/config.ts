import YAML from 'yaml'
import chokidar from 'chokidar'
import { join } from 'node:path'
import { pluginInfo, botInfo } from '#env'
import { Bot } from '#bot';
import yamlHandler from './yamlHandler.js'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync
} from 'node:fs'

const bot = await Bot()

const { ROOT_PATH } = pluginInfo
const { WORK_PATH } = botInfo

/**
 * ********
 * 配置文件
 * ********
 */
class Cfg {
  /**
   * 
   */
  config = {}

  /**
   * 监听文件
   */
  watcher = { config: {}, defSet: {} }

  constructor() {
    this.mergeYamlFile()
  }

  /**
   * 机器人qq号
   */
  get qq() {
    return Number(this.getBotConfig('qq')?.qq || 114514514)
  }

  /**
   * 密码
   */
  get pwd() {
    return this.getBotConfig('qq')?.pwd || 114514514
  }

  /**
   * icqq配置
   */
  get bot() {
    const bot = this.getBotConfig('bot')
    const defbot = this.getBotdefSet('bot')
    const Config = { ...defbot, ...bot }
    Config.platform = this.getBotConfig('qq').platform
    /**
     * 设置data目录，防止pm2运行时目录不对
     */
    Config.data_dir = join(WORK_PATH, `/data/icqq/${this.qq}`)
    if (!Config.ffmpeg_path) delete Config.ffmpeg_path
    if (!Config.ffprobe_path) delete Config.ffprobe_path
    return Config
  }

  /**
   * 
   */
  get other() {
    return this.getBotConfig('other')
  }

  /**
   * 
   */
  get redis() {
    return this.getBotConfig('redis')
  }

  /**
   * 
   */
  get renderer() {
    return this.getBotConfig('renderer');
  }

  /**
   * 
   */
  get notice() {
    return this.getBotConfig('notice');
  }

  /**
   * 主人qq
   */
  get masterQQ() {
    const qqs = this.getBotConfig('other')?.masterQQ || []
    if (Array.isArray(qqs)) {
      return qqs.map(qq => String(qq))
    } else {
      return [String(qqs)]
    }
  }

  _package = null

  /**
   * package.json 
   */
  get package() {
    if (this._package) return this._package
    try {
      const data = readFileSync('package.json', 'utf8')
      this._package = JSON.parse(data)
      return this._package
    } catch {
      return {}
    }
  }

  /**
   * 群配置
   * @param groupId 
   * @returns 
   */
  getGroup(groupId = '') {
    const config = this.getBotConfig('group')
    const defCfg = this.getBotdefSet('group')
    if (config[groupId]) {
      return { ...defCfg.default, ...config.default, ...config[groupId] }
    }
    return { ...defCfg.default, ...config.default }
  }

  /**
   * other配置
   * @returns 
   */
  getOther() {
    const def = this.getBotdefSet('other')
    const config = this.getBotConfig('other')
    return { ...def, ...config }
  }

  /**
   * notice配置
   * @returns 
   */
  getNotice() {
    const def = this.getBotdefSet('notice')
    const config = this.getBotConfig('notice')
    return { ...def, ...config }
  }

  /**
   * background配置
   * @returns 
   */
  getBg() {
    const def = this.getdefSet('backgroundset')
    const config = this.getConfig('backgroundset')
    return { ...def, ...config }
  }

  /**
   * 得到默认配置
   * @param name 配置文件名称
   * @returns 
   */
  getdefSet(name: string) {
    return this.getYaml('default_config', name)
  }

  /**
   * 得到默认配置
   * @param name 配置文件名称
   * @returns 
   */
  getBotdefSet(name: string) {
    return this.getYaml('default_config', name, WORK_PATH)
  }

  /**
   * 得到生成式配置
   * @param name 
   * @returns 
   */
  getConfig(name: string) {
    return this.getYaml('config', name)
  }

  /**
   * 得到合并配置
   * @param name 
   * @returns 
   */
  getMergedConfig(name: string) {
    let config = this.getYaml('config', name)
    let def = this.getYaml('default_config', name)
    return { ...def, ...config }
  }

  /**
   * 得到机器人配置
   * @param name 
   * @returns 
   */
  getBotConfig(name: string) {
    return this.getYaml('config', name, WORK_PATH)
  }

  /**
   * 快速修改配置
   * @param data 要设置的数据
   * @param parentKeys 键的路径，数组格式分隔
   * @param name 文件名
   * @returns 
   */
  setConfig(data: any, parentKeys: any[], name: string) {
    this.setYaml('config', name, data, parentKeys)
  }

  /**
   * 获取配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  getYaml(type: string, name: string, path: string = ROOT_PATH) {
    try {
      const file = join(path, `config/${type}/${name}.yaml`)
      const key = `${type}.${name}`
      if (this.config[key]) return this.config[key]
      this.config[key] = YAML.parse(
        readFileSync(file, 'utf8')
      )
      this.watch(file, name, type)
      return this.config[key]
    } catch(err) {
      return undefined
    }
  }

  /**
   * 修改配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  setYaml(type: string, name: string, data: any, parentKeys: any[]) {
    const file = join(ROOT_PATH, `config/${type}/${name}.yaml`)
    let doc = new yamlHandler(file)
    doc.setDataRecursion(data, parentKeys)
    doc.save()
    this.watch(file, name, type)
  }

  /**
   * 合并带有注释项的配置,初始化配置
   * @param name 
   * @returns 
   */
  mergeYamlFile() {
    const path = join(ROOT_PATH, 'config', 'config')
    const pathDef = join(ROOT_PATH, 'config', 'default_config')

    if (!existsSync(path)) {
      mkdirSync(path, {
        recursive: true
      })
    }

    // 得到文件
    const files = readdirSync(pathDef).filter(file => file.endsWith('.yaml'))

    for (const file of files) {
      const cfgFile = join(path, file)
      const cfgFileDef = join(pathDef, file)

      if (!existsSync(cfgFile)) {
        copyFileSync(cfgFileDef, cfgFile)
      } else {
        // 获取用户配置
        const cfg = this.getConfig(file.replace('.yaml', ''))

        // 创建默认Yaml实例
        const doc = new yamlHandler(cfgFileDef)
        const defCfg = doc.jsonData
        const cfgKeys = Object.keys(cfg)
        // 更改写入路径文件
        doc.yamlPath = cfgFile

        // 删掉废弃的属性
        cfgKeys.forEach(key => {
          if (!defCfg.hasOwnProperty(key)) {
            delete cfg[key]
          }
        })

        // 合并一层配置，不适用于层级较深的对象或数组
        Object.entries(defCfg).forEach(([key, value]) => {
          if (cfg[key]) {

            if (value instanceof Object) {
              // 合并子对象
              doc.set(key, Object.assign(value, cfg[key]))
            } else {
              doc.set(key, cfg[key])
            }
            doc.save(cfgFile)
          }
        })
      }
    }
  }

  /**
   * 监听配置文件
   * @param file 
   * @param name 
   * @param type 
   * @returns 
   */
  watch(file: string, name: string, type = 'default_config') {
    const key = `${type}.${name}`
    if (this.watcher[key]) return
    const watcher = chokidar.watch(file)
    watcher.on('change', () => {
      delete this.config[key]

      if (typeof bot == 'undefined') return
      logger.mark(`[Micro][读取|修改配置文件][${type}][${name}]`)
      if (this[`change_${name}`]) {
        this[`change_${name}`]()
      }
    })
    this.watcher[key] = watcher
  }

}

/**
 * **********
 * 
 * ***
 */
export default new Cfg()