import '../../../config/index.js';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import '../../../utils/index.js';
import Cfg from '../../../config/config.js';
import { getAllWebAddress } from '../../../utils/ipAddress.js';

class UserController {
    async login(ctx) {
        const { userInfo } = await Cfg.getConfig('server');
        const res = ctx.request.body;
        const { username, password } = res;
        const checkUserIndex = userInfo.findIndex((item) => item.username === username && item.password === password);
        if (checkUserIndex == -1) {
            ctx.body = {
                code: 403,
                data: 'error: 账户或密码不对！',
            };
            return;
        }
        const skey = crypto.createHash('sha256').update(password).digest('hex');
        const expires = userInfo[checkUserIndex].expires || '86400s';
        const token = jwt.sign({ username }, skey, { expiresIn: expires });
        Cfg.setConfig({ ...userInfo[checkUserIndex], token, skey, expires }, ['userInfo', String(checkUserIndex)], 'server');
        ctx.body = {
            code: 200,
            data: token
        };
    }
    async logOut(ctx) {
        ctx.body = {
            code: 200,
            message: 'success',
        };
    }
    async userInfo(ctx) {
        const { userInfo } = await Cfg.getConfig('server');
        const masterQQ = Cfg.masterQQ;
        let user = userInfo.find((item) => item.token == ctx.request.header.token);
        if (user) {
            user.masterQQ = Array.isArray(masterQQ) ? masterQQ[0] : masterQQ;
            ctx.body = {
                code: 200,
                message: 'success',
                data: user
            };
        }
        else {
            ctx.body = {
                code: 403,
                message: '未找到该用户登录'
            };
        }
    }
    async getPort(ctx) {
        const { local, remote } = await getAllWebAddress();
        ctx.body = {
            code: 200,
            message: 'success',
            data: {
                publicAddress: remote[0].replace('http', 'ws').replace('https', 'wss'),
                privateAddress: local[0].replace('http', 'ws').replace('https', 'wss')
            }
        };
    }
    async getWebAddress(ctx) {
        const { hostname } = ctx.request.body;
        if (hostname) {
            Cfg.setConfig(hostname, ['server', 'host'], 'server');
            const { port } = (await Cfg.getConfig('server')).server;
            ctx.body = {
                code: 200,
                message: 'success',
                data: {
                    hostname: hostname,
                    port: port
                }
            };
        }
        else {
            ctx.body = {
                code: 500,
                message: 'error',
                data: '保存服务端地址失败'
            };
        }
    }
}
var UserController$1 = new UserController();

export { UserController$1 as default };
