export const userInfo = {
    "avatar": {
        desc: '如果配置优先使用该头像，否则使用第一主人头像，如(https://q1.qlogo.cn/g?b=qq&s=0&nk=2330660495)',
        value: '',
        type: 'string'
    },
    "username": {
        desc: '登录账号',
        value: '',
        type: 'string'
    },
    "password": {
        desc: '登录密码',
        value: '',
        type: 'string'
    },
    "desc": {
        desc: '管理员描述',
        value: '普通管理员',
        type: 'string'
    },
    "routes": {
        desc: '勾选后该模块对此管理员隐藏',
        value: '普通管理员',
        type: 'array',
        subType: 'string'
    },
    // "token": {
    //     desc: '(自动生成)',
    //     value: '',
    //     type: 'string'
    // },
    // "skey": {
    //     desc: '(自动生成)',
    //     value: '',
    //     type: 'string'
    // },
}