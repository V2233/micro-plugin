const stdin = {
    "name": {
        desc: '标准输出前缀',
        value: '标准',
        type: 'string'
    },
    "avatar": {
        desc: '标准输入头像，请填写网络地址',
        value: 'https://img.shields.io/badge/Term-std-cyan',
        type: 'string'
    },
    "uin": {
        desc: '账号',
        value: 'std',
        type: 'string'
    },
    "user_id": {
        desc: '模拟用户user_id',
        value: 114514,
        type: 'number'
    },
    "disabled": {
        desc: '是否禁用',
        value: false,
        type: 'boolean'
    },
};
const onebotv11 = {
    "url": {
        desc: '反向连接路由，协议端可以配置该路由进行反向连接',
        value: '/onebot/v11/ws',
        type: 'string'
    },
    "address": {
        desc: '正向连接地址，默认参考【Gensokyo：ws://localhost:15630/ws?access_token=12345,Langrange.Onebot：ws://localhost:8081】',
        value: [],
        type: 'array',
        subType: 'string'
    },
    "disabled": {
        desc: '是否禁用',
        value: false,
        type: 'boolean'
    },
};

export { onebotv11, stdin };
