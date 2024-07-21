const bot = {
    "log_level": {
        desc: '日志等级:trace,debug,info,warn,fatal,mark,error,off',
        value: 'info',
        type: 'string'
    },
    "ignore_self": {
        desc: '群聊和频道中过滤自己的消息',
        value: true,
        type: 'boolean'
    },
    "resend": {
        desc: '被风控时是否尝试用分片发送',
        value: false,
        type: 'boolean'
    },
    "sendmsg_error": {
        desc: '发送消息错误时是否通知主人',
        value: false,
        type: 'boolean'
    },
    "restart_port": {
        desc: '重启API端口 仅ksr.js生效',
        value: 27881,
        type: 'number'
    },
    "ffmpeg_path": {
        desc: 'ffmpeg 路径',
        value: null,
        type: 'string',
    },
    "ffprobe_path": {
        desc: 'ffprobe 路径',
        value: null,
        type: 'string'
    },
    "chromium_path": {
        desc: 'chromium其他路径',
        value: null,
        type: 'string'
    },
    "puppeteer_ws": {
        desc: 'puppeteer接口地址',
        value: null,
        type: 'string'
    },
    "puppeteer_timeout": {
        desc: 'puppeteer截图超时时间',
        value: null,
        type: 'string'
    },
    "proxyAddress": {
        desc: '米游社接口代理地址，国际服用',
        value: null,
        type: 'string'
    },
    "online_msg": {
        desc: '上线时给首个主人QQ推送帮助',
        value: true,
        type: 'boolean'
    },
    "online_msg_exp": {
        desc: '上线推送通知的冷却时间',
        value: 86400,
        type: 'number'
    },
    "skip_login": {
        desc: '是否跳过登录ICQQ',
        value: false,
        type: 'boolean'
    },
    "sign_api_addr": {
        desc: '签名API地址(如:http://127.0.0.1:8080/sign?key=114514)',
        value: null,
        type: 'string'
    },
    "ver": {
        desc: '传入的QQ版本(如:8.9.63、8.9.68)',
        value: null,
        type: 'string'
    }
};
const group = {
    "default": {
        "groupGlobalCD": {
            desc: '群聊中所有指令操作冷却时间，单位毫秒,0则无限制',
            value: 0,
            type: 'number'
        },
        "singleCD": {
            desc: '群聊中个人操作冷却时间，单位毫秒',
            value: 1000,
            type: 'number'
        },
        "onlyReplyAt": {
            desc: '是否只仅关注主动@机器人的消息， 0-否 1-是 2-触发用户非主人只回复@机器人的消息及特定前缀的消息，主人免前缀',
            value: 0,
            type: 'number'
        },
        "botAlias": {
            desc: '开启后则只回复@机器人的消息及特定前缀的消息，支持多个',
            value: ['云崽', '云宝'],
            type: 'array',
            subType: 'string'
        },
        "imgAddLimit": {
            desc: '添加表情是否限制  0-所有群员都可以添加 1-群管理员才能添加 2-主人才能添加',
            value: 0,
            type: 'number'
        },
        "imgMaxSize": {
            desc: '添加表情图片大小限制，默认2m',
            value: 2,
            type: 'number'
        },
        "addPrivate": {
            desc: '是否允许私聊添加  1-允许 0-禁止',
            value: 1,
            type: 'number'
        },
        "enable": {
            desc: '只启用功能，配置后只有该功能才响应',
            value: null,
            type: 'boolean'
        },
        "disable": {
            desc: '禁用功能，功能名称,例如：十连、角色查询、体力查询、用户绑定、抽卡记录、添加表情、欢迎新人、退群通知',
            value: ['禁用示例', '支持多个'],
            type: 'array',
            subType: 'string'
        },
    },
    123456: {
        "groupGlobalCD": {
            desc: '群聊中所有指令操作冷却时间，单位毫秒,0则无限制',
            value: 0,
            type: 'number'
        },
        "singleCD": {
            desc: '群聊中个人操作冷却时间，单位毫秒',
            value: 1000,
            type: 'number'
        }
    },
};
const notice = {
    "iyuu": {
        desc: 'IYUU(https://iyuu.cn/)',
        value: null,
        type: 'string'
    },
    "sct": {
        desc: 'Server酱(https://sct.ftqq.com/)',
        value: null,
        type: 'string'
    },
    "feishu_webhook": {
        desc: '飞书自定义机器人Webhook (https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)',
        value: null,
        type: 'string'
    },
};
const other = {
    "autoFriend": {
        desc: '是否自动同意加好友 1-同意 0-不处理',
        value: 1,
        type: 'number'
    },
    "autoQuit": {
        desc: 'Server酱(https://sct.ftqq.com/)',
        value: 50,
        type: 'number'
    },
    "masterQQ": {
        desc: '飞书自定义机器人Webhook (https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)',
        value: [2330660495],
        type: 'array',
        subType: 'number'
    },
    "disableGuildMsg": {
        desc: '禁用频道功能 true: 不接受频道消息，flase：接受频道消息',
        value: true,
        type: 'boolean'
    },
    "disablePrivate": {
        desc: '禁用私聊功能 true：私聊只接受ck以及抽卡链接（Bot主人不受限制），false：私聊可以触发全部指令，默认false',
        value: false,
        type: 'boolean'
    },
    "disableMsg": {
        desc: '禁用私聊Bot提示内容',
        value: "私聊功能已禁用，仅支持发送cookie，抽卡记录链接，记录日志文件",
        type: 'string'
    },
    "disableAdopt": {
        desc: '禁用私聊Bot提示内容',
        value: ['stoken'],
        type: 'array',
        subType: 'string'
    },
    "whiteGroup": {
        desc: '白名单群，配置后只在该群生效',
        value: null,
        type: 'array',
        subType: 'number'
    },
    "whiteQQ": {
        desc: '白名单qq',
        value: null,
        type: 'array',
        subType: 'number'
    },
    "blackGroup": {
        desc: '黑名单群',
        value: [213938015],
        type: 'array',
        subType: 'number'
    },
    "blackQQ": {
        desc: '黑名单qq',
        value: [528952540],
        type: 'array',
        subType: 'number'
    },
};
const puppeteer = {
    "chromiumPath": {
        desc: 'chromiumPath: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        value: null,
        type: 'string'
    },
    "puppeteerWS": {
        desc: 'puppeteerWS地址，如: ws://browserless:3000',
        value: null,
        type: 'string'
    },
    "headless": {
        desc: 'headless',
        value: "new",
        type: 'string'
    },
    "args": {
        desc: 'puppeteer启动args，注意args的--前缀',
        value: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'],
        type: 'array',
        subType: 'string'
    },
    "puppeteerTimeout": {
        desc: 'puppeteer截图超时时间',
        value: null,
        type: 'number'
    },
};
const qq = {
    "qq": {
        desc: 'qq账号',
        value: null,
        type: 'number'
    },
    "pwd": {
        desc: '密码，为空则用扫码登录,扫码登录现在仅能在同一ip下进行',
        value: null,
        type: 'string'
    },
    "platform": {
        desc: '1:安卓手机、 2:aPad 、 3:安卓手表、 4:MacOS 、 5:iPad 、 6:Tim',
        value: 6,
        type: 'number'
    },
};
const redis = {
    "host": {
        desc: 'redis地址',
        value: '127.0.0.1',
        type: 'string'
    },
    "port": {
        desc: 'redis端口',
        value: 6379,
        type: 'number'
    },
    "username": {
        desc: 'redis用户名，可以为空',
        value: null,
        type: 'string'
    },
    "password": {
        desc: 'redis密码，没有密码可以为空',
        value: null,
        type: 'string'
    },
    "db": {
        desc: 'redis数据库',
        value: 0,
        type: 'number'
    },
};
const renderer = {
    "name": {
        desc: '渲染后端, 默认为 puppeteer',
        value: null,
        type: 'string'
    },
};

export { bot, group, notice, other, puppeteer, qq, redis, renderer };
