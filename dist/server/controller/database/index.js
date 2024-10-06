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
        try {
            const value = await redis.get(key);
            ctx.body = {
                code: 200,
                message: 'ok',
                data: value ? value.toString() : value
            };
        }
        catch (err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            };
            logger.error(err);
        }
    }
    async setKey(ctx) {
        const { key, value } = ctx.request.body;
        try {
            await redis.set(key, value);
            ctx.body = {
                code: 200,
                message: 'ok',
                data: ''
            };
        }
        catch (err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            };
            logger.error(err);
        }
    }
    async delKey(ctx) {
        const { key } = ctx.request.query;
        try {
            await redis.del(key);
            ctx.body = {
                code: 200,
                message: 'ok',
                data: ''
            };
        }
        catch (err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            };
            logger.error(err);
        }
    }
    async delKeys(ctx) {
        const { key } = ctx.request.query;
        try {
            const keys = await redis.keys(key);
            await redis.del(keys);
            ctx.body = {
                code: 200,
                message: 'ok',
                data: ''
            };
        }
        catch (err) {
            ctx.body = {
                code: 503,
                message: err.message,
                data: ''
            };
            logger.error(err);
        }
    }
}
var DatabaseController$1 = new DatabaseController();

export { DatabaseController$1 as default };
