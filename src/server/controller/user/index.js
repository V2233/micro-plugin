import { Cfg } from "#cfg";
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { getAllWebAddress } from '#utils';
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
        const skey = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign({ username }, skey, { expiresIn: '60' });
        ctx.body = {
            code: 200,
            data: token
        };
        Cfg.setConfig(token, ['userInfo', String(checkUserIndex), 'token'], 'server');
        Cfg.setConfig(skey, ['userInfo', String(checkUserIndex), 'skey'], 'server');
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
}
export default new UserController();
