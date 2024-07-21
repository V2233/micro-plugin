import jwt from 'jsonwebtoken';
import '../../config/index.js';
import Cfg from '../../config/config.js';

const auth = async (ctx, next) => {
    const { userInfo } = await Cfg.getConfig('server');
    const token = ctx.request.header.token;
    let userData = userInfo.find((item) => item.token == ctx.request.header.token);
    if (userData) {
        try {
            const user = jwt.veryify(token, userData.skey);
            ctx.state.user = user;
        }
        catch (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    console.log('【micro-plugin】登录token过期');
                    return ctx.app.emit('error', {
                        code: 10101,
                        message: 'token过期'
                    }, ctx);
                case 'JsonWebTokenError':
                    console.log('【micro-plugin】token无效');
                    return ctx.app.emit('error', {
                        code: 10102,
                        message: 'token无效'
                    }, ctx);
            }
        }
    }
    else {
        ctx.body = {
            code: 403,
            message: '未找到该用户token'
        };
    }
    await next();
};

export { auth as default };
