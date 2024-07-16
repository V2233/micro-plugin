import fetch from 'node-fetch'
import net from 'net'
import { exec } from 'child_process'
import { Plugin } from '../../adapter'
import { join } from 'path'
import { createRequire } from 'module'
import { existsSync } from 'fs'
import { Logger, Redis, Bot } from '#bot';

const require = createRequire(import.meta.url)

const plugin = await Plugin()
const logger = await Logger()
const redis = await Redis()
const bot = await Bot()

/**
 *
 * @param port
 * @returns
 */
const isPortTaken = async port => {
  return new Promise(resolve => {
    const tester = net
      .createServer()
      .once('error', () => resolve(true))
      .once('listening', () =>
        tester.once('close', () => resolve(false)).close()
      )
      .listen(port)
  })
}

/**
 * 
 */
const REDIS_RESTART_KEY = 'Yz:restart'

/**
 *
 */
export class Restart extends plugin {
  constructor() {
    super()
    this.priority = 10
  }

  /**
   * 
   */
  async init() {
    const data = await redis.get(REDIS_RESTART_KEY)
    if (data) {
      const restart = JSON.parse(data)
      const uin = restart?.uin || bot.uin
      let time = restart.time || new Date().getTime()
      time = (new Date().getTime() - time) / 1000
      let msg = `重启成功：耗时${time.toFixed(2)}秒`
      try {
        if (restart.isGroup) {
          bot[uin].pickGroup(restart.id).sendMsg(msg)
        } else {
          bot[uin].pickUser(restart.id).sendMsg(msg)
        }
      } catch (error) {
        /** 不发了，发不出去... */
        logger.debug(error)
      }
      redis.del(REDIS_RESTART_KEY)
    }

    // 如果 return 'return' 则跳过解析
  }


  /**
   * 
   * @returns 
   */
  async restart() {
    // 开始询问是否有正在运行的同实例进程
    const dir = join(process.cwd(), 'pm2.config.cjs')
    if (!existsSync(dir)) {
      // 不存在配置，错误
      this.e.reply('pm2 配置丢失')
      return
    }
    const cfg = require(dir)
    const restart_port = cfg?.restart_port || 27881
    await this.e.reply('开始执行重启，请稍等...')
    logger.mark(`${this.e.logFnc} 开始执行重启，请稍等...`)
    /**
     * 
     */
    const data = JSON.stringify({
      uin: this.e?.self_id || this.e.bot.uin,
      isGroup: !!this.e.isGroup,
      id: this.e.isGroup ? this.e.group_id : this.e.user_id,
      time: new Date().getTime()
    })
    const npm = await this.checkPnpm()
    await redis.set(REDIS_RESTART_KEY, data, { EX: 120 })

    /**
     * 
     */
    if (await isPortTaken(restart_port)) {
      try {
        const result = await fetch(
          `http://localhost:${restart_port}/restart`
        ).then(res => res.text())
        if (result !== `OK`) {
          redis.del(REDIS_RESTART_KEY)
          this.e.reply(`操作失败！`)
          logger.error(`重启失败`)
        }
      } catch (error) {
        redis.del(REDIS_RESTART_KEY)
        this.e.reply(`操作失败！\n${error}`)
      }
    } else {
      /**
       * 
       */
      try {
        exec(`${npm} run start`, { windowsHide: true }, (error, stdout, _) => {
          if (error) {
            redis.del(REDIS_RESTART_KEY)
            this.e.reply(`操作失败！\n${error.stack}`)
            logger.error(`重启失败\n${error.stack}`)
          } else if (stdout) {
            logger.mark('重启成功，运行已由前台转为后台')
            logger.mark(`查看日志请用命令：${npm} run logs`)
            logger.mark(`停止后台运行命令：${npm} run stop`)
            process.exit()
          }
        })
      } catch (error) {
        redis.del(REDIS_RESTART_KEY)
        this.e.reply(`操作失败！\n${error.stack ?? error}`)
      }
    }

    return true
  }


  /**
   * 
   * @returns 
   */
  async checkPnpm() {
    return 'npm'
  }

  /**
   * 
   * @param cmd 
   * @returns 
   */
  async execSync(cmd) {
    return new Promise(resolve => {
      exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }

  /**
   * 
   * @returns 
   */
  async stop() {
    // 开始询问是否有正在运行的同实例进程
    const dir = join(process.cwd(), 'pm2.config.cjs')
    if (!existsSync(dir)) {
      // 不存在配置，错误
      this.e.reply('pm2 配置丢失')
      return
    }
    const cfg = require(dir)
    const restart_port = cfg?.restart_port || 27881
    if (await isPortTaken(restart_port)) {
      try {
        logger.mark('关机成功，已停止运行')
        await this.e.reply(`关机成功，已停止运行`)
        await fetch(`http://localhost:${restart_port}/exit`)
        return
      } catch (error) {
        this.e.reply(`操作失败！\n${error}`)
        logger.error(`关机失败\n${error}`)
      }
    }
    if (!process.argv[1].includes('pm2')) {
      logger.mark('关机成功，已停止运行')
      await this.e.reply('关机成功，已停止运行')
      process.exit()
    }
    logger.mark('关机成功，已停止运行')
    await this.e.reply('关机成功，已停止运行')
    const npm = await this.checkPnpm()
    exec(`${npm} run stop`, { windowsHide: true }, error => {
      if (error) {
        this.e.reply(`操作失败！\n${error.stack}`)
        logger.error(`关机失败\n${error.stack}`)
      }
    })
  }
}