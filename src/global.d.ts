// globals.d.ts  
// 防止编译此插件报错，实际类型由yunzaijs提供
import { Client } from 'icqq'
import { RedisClientType } from 'redis'

/// <reference types="yunzai/global" />
/// <reference types="yunzai/node_modules/chalk" />

declare global {
    /**
     * 键值对型数据库
     * @deprecated 不推荐使用，未来将废弃
     * import { Redis } from 'yunzai'
     */
    var redis: RedisClientType
    /**
     * 机器人客户端
     * @deprecated 不推荐使用，未来将废弃
     * import { Bot } from 'yunzai'
     */
    var Bot: {  
        adapter: number[];  
    } & typeof Client.prototype
    /**
     * import { Segment } from 'yunzai'
     * @deprecated 不推荐使用，未来将废弃
     */
    var segment: typeof global.segment
    /**
     * @deprecated 不推荐使用，未来将废弃
     * import { Plugin } from 'yunzai'
     */
    var plugin: typeof global.plugin
    /**
     * 统一化的打印对象
     * 构造颜色请使用 logger.chalk
     */
    var logger: LoggerType &
      ChalkInstanceType & {
        chalk: ChalkInstance
      }
    /**
     *
     * @deprecated 不推荐使用，未来将废弃
     */
    var Renderer: typeof global.Renderer
}