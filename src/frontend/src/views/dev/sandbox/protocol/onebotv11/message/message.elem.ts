/** TEXT (此元素可使用字符串代替) */
export interface TextElem {
  type: 'text';
  data: {
    text: string;
  };
}

/** 表情 */
export interface FaceElem {
  type: 'face';
  data: {
    /** QQ 表情 ID */
    id: string;
  };
}

/** 图片 */
export interface ImageElem {
  type: 'image';
  data: {
    /**
     * @type {string} 本地图片文件路径，例如`"/tmp/1.jpg"`
     * @type {Buffer} 图片`Buffer`
     * @type {Readable} 可读的图片数据流
     */
    file: string | Buffer | import('stream').Readable;
    /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
    cache?: 0 | 1;
    /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
    proxy?: 0 | 1;
    /** 流的超时时间，默认60(秒) */
    timeout?: number;
    /** 图片url地址，接收时有效 */
    url?: string;
    /** 图片类型，flash 表示闪照，无此参数表示普通图片 */
    type?: 'flash';
  };
}

/** 语音 */
export interface RecordElem {
  type: 'record';
  data: {
    /**
     * @type {string} 本地文件路径，例如`"/tmp/1.mp3"`
     * @type {Buffer} `Buffer`
     * @type {Readable} 可读的数据流
     */
    file: string | Buffer | import('stream').Readable;
    /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
    cache?: 0 | 1;
    /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
    proxy?: 0 | 1;
    /** 流的超时时间，默认60(秒) */
    timeout?: number;
    /** 音频url地址，接收时有效 */
    url?: string;
    /** 发送时可选，默认 0，设置为 1 表示变声 */
    magic?: 0 | 1;
  };
}

/** 视频 */
export interface VideoElem {
  type: 'video';
  data: {
    /**
     * @type {string} 本地文件路径，例如`"/tmp/1.mp4"`
     * @type {Buffer} `Buffer`
     * @type {Readable} 可读的数据流
     */
    file: string | Buffer | import('stream').Readable;
    /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
    cache?: 0 | 1;
    /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
    proxy?: 0 | 1;
    /** 流的超时时间，默认60(秒) */
    timeout?: number;
    /** 视频url地址，接收时有效 */
    url?: string;
  };
}

/** 通用文件 */
export interface FileElem {
  type: 'file';
  data: {
    /**
     * @type {string} 本地图片文件路径，例如`"/tmp/1.jpg"`
     * @type {Buffer} `Buffer`
     * @type {Readable} 可读的数据流
     */
    file: string | Buffer | import('stream').Readable;
    /** 只在通过网络 URL 发送时有效，表示是否使用已缓存的文件，默认 1 */
    cache?: 0 | 1;
    /** 只在通过网络 URL 发送时有效，表示是否通过代理下载文件（需通过环境变量或配置文件配置代理），默认 1 */
    proxy?: 0 | 1;
    /** 流的超时时间，默认60(秒) */
    timeout?: number;
    /** url地址，接收时有效 */
    url?: string;
    /** 文件名 */
    name?: string;
    /** 文件大小 */
    size?: number;
  };
}

/** AT */
export interface AtElem {
  type: 'at';
  data: {
    qq: string;
  };
}

/** 猜拳 */
export interface RpsElem {
  type: 'rps';
  data: {
    id: string;
  };
}

/** 骰子 */
export interface DiceElem {
  type: 'dice';
  data: {
    id: string;
  };
}

/** 窗口抖动 */
export interface ShakeElem {
  type: 'shake';
  data: {
    id: string;
  };
}

/** 戳一戳 */
export interface PokeElem {
  type: 'poke';
  data: {
    id: string;
    type?: string;
    name?: string;
  };
}

/** 匿名消息 */
export interface AnonymousElem {
  type: 'anonymous';
  data: {
    ignore: 0 | 1;
  };
}

/** 链接分享 */
export interface ShareElem {
  type: 'share';
  data: {
    /** URL */
    url: string;
    /** 标题 */
    title: string;
    /** 发送时可选，内容描述 */
    content?: string;
    /** 发送时可选，图片 URL */
    image?: string;
  };
}

/** 推荐好友或群 */
export interface ContactElem {
  type: 'contact';
  data: {
    type: 'qq' | 'group';
    /** 被推荐人的 QQ 或 群 号 */
    id: string;
  };
}

/** 位置 */
export interface LocationElem {
  type: 'location';
  data: {
    /** 纬度 */
    lat: string;
    /** 经度 */
    lon: string;
    /** 发送时可选，标题 */
    title: string;
    /** 发送时可选，内容描述 */
    content: string;
  };
}

/** 音乐分享 */
export interface MusicElem {
  type: 'music';
  data: {
    /** 分别表示使用 QQ 音乐、网易云音乐、虾米音乐等 */
    type: string;
    /** 歌曲 ID */
    id?: string;
    /** type 为custom时有效 */
    url?: string;
    /** type 为custom时有效 如http://baidu.com/1.mp3 */
    audio?: string;
    /** type 为custom时有效 */
    title?: string;
    /** 发送时可选，内容描述 */
    content?: string;
    /** 发送时可选，图片 URL */
    image?: string;
  };
}

/** 回复 */
export interface ReplyElem {
  type: 'reply';
  data: {
    /** 回复时引用的消息 ID */
    id: string;
  };
}

/** 合并转发 */
export interface ForwardElem {
  type: 'forward';
  data: {
    /** 回复时引用的消息 ID */
    id: string;
  };
}

/** 合并转发节点 */
export interface NodeElem {
  type: 'node';
  data: {
    /** 转发的消息 ID */
    id?: string;
    /** 发送者 QQ 号 */
    user_id?: string;
    /** 兼容一下 */
    uin?: number;
    /** 发送者昵称 */
    nickname?: string;
    /** 兼容昵称 */
    name?: string;
    /** 消息内容，支持发送消息时的 message 数据类型 */
    content?: string | MessageElem[];
  };
}

/** XML消息 */
export interface XmlElem {
  type: 'xml';
  data: {
    data: XMLDocument;
  };
}

/** JSON消息 */
export interface JsonElem {
  type: 'json';
  data: {
    data: JSON;
  };
}

/** 骰子 */
export interface DiceElem {
  type: 'dice';
  data: {
    id: string;
  };
}

/** 猜拳 */
export interface RpsElem {
  type: 'rps';
  data: {
    id: string;
  };
}

/** Markdown消息 */
export interface MarkdownElem {
  type: 'markdown';
  data: {
    content: any;
  };
}

/** Button消息 */
export interface ButtonElem {
  type: 'button' | 'keyboard';
  content: {
    /** 机器人appid */
    appid: number;
    /** rows 数组的每个元素表示每一行按钮 */
    rows: {
      buttons: any[];
    }[];
  };
}

export type MessageElem =
  | TextElem
  | FaceElem
  | ImageElem
  | AtElem
  | ReplyElem
  | RecordElem
  | VideoElem
  | FileElem
  | JsonElem
  | XmlElem
  | PokeElem
  | LocationElem
  | ShareElem
  | FaceElem
  | NodeElem
  | ShakeElem
  | MusicElem
  | RpsElem
  | DiceElem
  | MarkdownElem
  | ButtonElem
  | ContactElem;
