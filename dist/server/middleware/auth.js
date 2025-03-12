import jwt from 'jsonwebtoken';
import '../../config/index.js';
import Cfg from '../../config/config.js';

const auth = async (ctx, next) => {
    const { userInfo } = await Cfg.getConfig('server');
    const token = ctx.request.header.token;
    let userData = userInfo.find((item) => item.token == ctx.request.header.token);
    if (userData) {
        try {
            const user = jwt.verify(token, userData.skey);
            ctx.state.user = user;
        }
        catch (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    ctx.body = {
                        code: 403,
                        message: 'token过期'
                    };
                    return;
                case 'JsonWebTokenError':
                    ctx.body = {
                        code: 403,
                        message: 'token无效'
                    };
                    return;
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
