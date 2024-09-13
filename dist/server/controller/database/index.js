import { classifyKeys } from './redis/index.js';

class DatabaseController {
    async getKeys(ctx) {
        const sep = ctx.request.query.sep || ':';
        const keys = classifyKeys(await redis.keys('*'), sep);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: keys
        };
    }
    async getKey(ctx) {
        const { key } = ctx.request.query;
        ctx.body = {
            code: 200,
            message: 'ok',
            data: await redis.get(key)
        };
    }
    async setKey(ctx) {
        const { key, value } = ctx.request.body;
        await redis.set(key, value);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: ''
        };
    }
    async delKey(ctx) {
        const { key } = ctx.request.query;
        await redis.del(key);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: ''
        };
    }
    async delKeys(ctx) {
        const { key } = ctx.request.query;
        const keys = await redis.keys(key);
        await redis.del(keys);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: ''
        };
    }
}
var DatabaseController$1 = new DatabaseController();

export { DatabaseController$1 as default };
