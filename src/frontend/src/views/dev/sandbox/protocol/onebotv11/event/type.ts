import type { MessageElem, NodeElem } from '../message/message.elem';

export interface groupMsgType {
  /** 消息 ID */
  message_id: number;
  /** 群号 */
  group_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 发送者昵称 */
  nickname: string;
  /** 消息内容 */
  message: MessageElem[];
  /** 原始消息内容 */
  raw_message: string;
  /** 合并消息内容 */
  messages?: NodeElem[];
  /** 消息子类型，正常消息是 normal，匿名消息是 anonymous，系统提示（如「管理员已禁止群内匿名聊天」）是 notice */
  sub_type?: 'normal' | 'anonymous' | 'notice';
  /** 头像地址 */
  avatar?: string;
  /** 群名片 */
  card?: string;
  /** 角色 */
  role?: 'owner' | 'admin' | 'member' | 'bot';
  /** 群聊等级 */
  level?: string;
  /** 发送者性别 */
  sex?: 'male' | 'female' | 'unknown';
  /** 发送者年龄 */
  age?: number;
  /** 发送者居住地 */
  area?: string;
  /** 专属头衔 */
  title?: string;
  /** 字体 */
  font?: string;
  /** 匿名用户 ID */
  id?: number;
  /** 匿名用户名称 */
  name?: string;
  /** 匿名用户 flag，在调用禁言 API 时需要传入 */
  flag?: string;
}

export interface privateMsgType {
  /** 消息 ID */
  message_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 发送者昵称 */
  nickname: string;
  /** 消息内容 */
  message: MessageElem[];
  /** 合并消息内容 */
  messages?: NodeElem[];
  /** 原始消息内容 */
  raw_message: string;
  /** 消息子类型，如果是好友则是 friend，如果是群临时会话则是 group */
  sub_type?: 'friend' | 'group' | 'other';
  /** 性别 */
  sex?: 'male' | 'female' | 'unknown';
  /** 年龄 */
  age?: number;
  /** 头像 */
  avatar?: string;
  /** 字体 */
  font?: string;
}

export interface groupMsgQueueItemType {
  time: number;
  /** (int64)	收到事件的机器人 QQ 号 */
  self_id: number;
  /** 事件类型 */
  post_type: 'message' | 'notice' | 'request' | 'meta_event';
  /** 消息类型 */
  message_type: 'group' | 'private';
  /** 消息子类型，正常消息是 normal，匿名消息是 anonymous，系统提示（如「管理员已禁止群内匿名聊天」）是 notice */
  sub_type: 'normal' | 'anonymous' | 'notice';
  /** 到下次心跳的间隔，单位毫秒 */
  interval: number;
  /** 消息 ID */
  message_id: number;
  /** 群号 */
  group_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 匿名信息，如果不是匿名消息则为 null */
  anonymous: {
    id: number;
    name: string;
    flag: string;
  };
  /** 消息内容 */
  message: MessageElem[];
  /** 合并消息 */
  messages?: NodeElem[];
  /** 原始消息内容 */
  raw_message: string;
  /** 字体 */
  font: string;
  /** 发送人信息 */
  sender: {
    user_id: number;
    nickname: string;
    sex: 'male' | 'female' | 'unknown';
    age: number;
    card: string;
    area: string;
    level: string;
    role: 'owner' | 'admin' | 'member' | 'bot';
    title: string;
    avatar: string;
  };
}

export interface privateMsgQueueItemType {
  time: number;
  /** (int64)	收到事件的机器人 QQ 号 */
  self_id: number;
  /** 事件类型 */
  post_type: 'message' | 'notice' | 'request' | 'meta_event';
  /** 消息类型 */
  message_type: 'private';
  /** 消息子类型，如果是好友则是 friend，如果是群临时会话则是 group */
  sub_type: 'friend' | 'group' | 'other';
  /** 到下次心跳的间隔，单位毫秒 */
  interval: number;
  /** 消息 ID */
  message_id: number;
  /** 发送者 QQ 号 */
  user_id: number;
  /** 消息内容 */
  message: MessageElem[];
  /** 合并消息 */
  messages?: NodeElem[];
  /** 原始消息内容 */
  raw_message: string;
  /** 字体 */
  font: string;
  /** 发送人信息 */
  sender: {
    user_id: number;
    nickname: string;
    sex: 'male' | 'female' | 'unknown';
    age: number;
    avatar: string;
    card?: string;
  };
}

export type msgQueueItemType = groupMsgType | privateMsgType;

export type queueItemType = groupMsgQueueItemType | privateMsgQueueItemType;
