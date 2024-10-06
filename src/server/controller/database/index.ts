import { classifyKeys } from './redis/index.js'


class DatabaseController {
    // 日志展示
    async getKeys(ctx: any) {
        const sep = ctx.request.query.sep || ':'
        
        const keys = classifyKeys(await redis.keys('*'), sep)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: keys
        }
    }

    // 获取键
    async getKey(ctx: any) {
        const { key } = ctx.request.query

        try {
            const value = await redis.get(key)
            ctx.body = {
                code: 200,
                message: 'ok',
                data: value?value.toString():value
            }
        } catch(err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            }
            logger.error(err)
        }
        
    }

    // 设置键
    async setKey(ctx: any) {

        const { key,value } = ctx.request.body

        try {
            await redis.set(key,value)
            ctx.body = {
                code: 200,
                message: 'ok',
                data: ''
            }
        } catch(err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            }
            logger.error(err)
        }
    }

    // 删除键
    async delKey(ctx: any) {

        const { key } = ctx.request.query

        try {
            await redis.del(key)
            ctx.body = {
                code: 200,
                message: 'ok',
                data: ''
            }
        } catch(err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            }
            logger.error(err)
        }
    }

    // 批量删除键
    async delKeys(ctx: any) {
        const { key } = ctx.request.query

        try {
            const keys = await redis.keys(key);
            await redis.del(keys); 
            ctx.body = {
                code: 200,
                message: 'ok',
                data: ''
            }
        } catch(err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            }
            logger.error(err)
        }
    }
}

export default new DatabaseController()