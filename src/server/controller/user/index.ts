//@ts-ignore
import { Cfg } from "#cfg";
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { getAllWebAddress } from '#utils'

class UserController {
    // 登录
    async login(ctx: any) {
        const { userInfo } = await Cfg.getConfig('server')
        const res = ctx.request.body;
        const { username, password } = res
        //查看用户信息是否包含有次token用户
        const checkUserIndex = userInfo.findIndex((item) => item.username === username && item.password === password)
        //没有返回失败的信息
        if (checkUserIndex == -1) {
            ctx.body = {
                code: 403,
                data: 'error: 账户或密码不对！',
            }
            return
        }
        const skey = crypto.randomBytes(32).toString('hex')
        const token = jwt.sign({ username }, skey, { expiresIn: '60' })
        ctx.body = {
            code: 200,
            data: token
        }
        Cfg.setConfig(token, ['userInfo', String(checkUserIndex), 'token'], 'server')
        Cfg.setConfig(skey, ['userInfo', String(checkUserIndex), 'skey'], 'server')
    }

    // 登出
    async logOut(ctx: any) {
        // const { userInfo } = await Cfg.getConfig('server')
        //如果有返回成功信息
        ctx.body = {
            code: 200,
            message: 'success',
            // data: userInfo[0]
        }
    }

    // 用户信息
    async userInfo(ctx: any) {
        const { userInfo } = await Cfg.getConfig('server')
        const masterQQ = Cfg.masterQQ
        let user = userInfo.find((item) => item.token == ctx.request.header.token)
        //如果有返回成功信息
        if (user) {
            user.masterQQ = Array.isArray(masterQQ) ? masterQQ[0] : masterQQ
            ctx.body = {
                code: 200,
                message: 'success',
                data: user
            }
        } else {
            ctx.body = {
                code: 403,
                message: '未找到该用户登录'
            }
        }

    }

    // ws获取后端连接地址
    async getPort(ctx) {
        const { local, remote } = await getAllWebAddress()

        ctx.body = {
            code: 200,
            message: 'success',
            data: {
                publicAddress: remote[0].replace('http', 'ws').replace('https', 'wss'),
                privateAddress: local[0].replace('http', 'ws').replace('https', 'wss')
            }
        }
    }

    // 获取本机web地址
    async getWebAddress(ctx) {
        const {hostname} = ctx.request.body;
        if(hostname) {
            Cfg.setConfig(hostname, ['server', 'host'], 'server')
            const { port } = (await Cfg.getConfig('server')).server
            ctx.body = {
                code: 200,
                message: 'success',
                data: {
                    hostname: hostname,
                    port: port
                }
            }
        } else {
            ctx.body = {
                code: 500,
                message: 'error',
                data: '保存服务端地址失败'
            }
        }
        
    }

}

export default new UserController()