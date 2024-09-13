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

        ctx.body = {
            code: 200,
            message: 'ok',
            data: await redis.get(key)
        }
    }

    // 设置键
    async setKey(ctx: any) {

        const { key,value } = ctx.request.body
        await redis.set(key,value)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: ''
        }
    }

    // 删除键
    async delKey(ctx: any) {

        const { key } = ctx.request.query
        await redis.del(key)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: ''
        }
    }

    // 批量删除键
    async delKeys(ctx: any) {
        const { key } = ctx.request.query
        const keys = await redis.keys(key);
        
        await redis.del(keys); 

        ctx.body = {
            code: 200,
            message: 'ok',
            data: ''
        }
    }
}

export default new DatabaseController()