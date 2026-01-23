import type { BotInfoType } from '@/api/dev/plugin/type';
import type {
  friendInfoType,
  groupInfoType,
} from '@/views/dev/sandbox/protocol/onebotv11/api/type';
import type { RouteRecordRaw } from 'vue-router';

export interface DevState {
  curPath: string;
  isPluginEdited: boolean;
  scene: number;
  curEditedMode: string;
  curPluginId: string;
  qqScene: number;
  isPortrait: boolean;
  botsInfo: BotInfoType[];
  /** ssh连接设置 */
  sshInfo: {
    host: string;
    port?: number;
    username: string;
    password: string;
  };
  /** 避免ts报any类型，后续可拓展 */
  curAdapter: 'onebot11';
  onebot11: {
    /** 群聊列表 */
    group_list: Array<groupInfoType>;
    /** 好友列表 */
    friend_list: Array<friendInfoType>;
    /** 频道列表 */
    guild_list: Array<any>;
    /** 当前是群聊还是私聊场景 */
    cur_message_type: 'group' | 'private';
    /** 当前所在群号 */
    cur_group_id: number;
    /** 当前所在私聊场景对方id，和cur_group_id之间必有一个为0 */
    cur_private_id: number;
    /** 当前机器人id */
    cur_bot_id: number;
    /** 当前自己信息 */
    cur_self_info: {
      user_id: number;
      nickname: string;
      sex: 'female' | 'male' | 'unknown';
      age: number;
      area: string;
      thumbs: number;
    };
    settings: {
      ws_forward_address: string;
      heart_beat: boolean;
      local_storage: boolean;
    };
  };
}

interface settingType {
  updateInterval: number;
  imageWidth: number;
  isAutoScroll: boolean;
  isAutoUpdated: boolean;
  qpsInterval: number;
  fontSize: number;
}

interface msgQpsType {
  qps: number;
  time: string;
}

export interface ScreenState {
  msgQps: msgQpsType[];
  curMsgQueueLength: number;
  settings: settingType;
}

export interface UserState {
  token: string | null;
  menuRoutes: RouteRecordRaw[];
  username: string;
  avatar: string;
  masterQQ?: string | number;
  buttons: string[];
  originAddress: string;
  originPort: number;
  tokens: {
    [key: string]: {
      username: string;
      password: string;
    };
  };
}
export interface SettingState {
  /** 控制折叠菜单：0:完全关闭；1:只留图标；2:全展开 */
  foldMode: 0 | 1 | 2;
  /** main组件是否刷新 */
  refresh: boolean;
  /** 主题模式 */
  theme: 'light' | 'dark';
  /** 全局终端配置 */
  globalTerminal: {
    /** 是否正在渲染 */
    running: boolean;
    /** 是否显示 */
    visible: boolean;
  };
}
