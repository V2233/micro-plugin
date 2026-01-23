interface resCodeType {
  code: number;
  message: string;
}

interface messageCountType {
  sent: number;
  recv: number;
  screenshot: number;
}

interface countContactsType {
  friend: number;
  group: number;
  groupMember: number;
}

export interface BotInfoType {
  avatarUrl: string;
  nickname: string;
  botRunTime: string;
  status: number;
  platform: string;
  botVersion: string;
  messageCount: messageCountType;
  countContacts: countContactsType;
}

export type BotInfoListType = BotInfoType[];

export interface BotInfoResponseType extends resCodeType {
  data: BotInfoType[];
}

// 插件类型
export interface messageType {
  type: string;
  data?: string | number;
  url?: string;
  path?: string;
  hash?: string;
  // json?: { [key: string]: any } | undefined,
  json?: string;
  content?: any;
  // }
}

export type pluginType = {
  id: string;
  event: string;
  reg: string;
  cron: string;
  delayTime: number;
  flag: string;
  isGlobal: boolean;
  isAt: boolean;
  isQuote: boolean;
  groups: string[];
  friends: string[];
  message: messageType[];
};
export interface pluginElResponseType extends resCodeType {
  data: pluginType;
}

export interface pluginResponseType extends resCodeType {
  data: pluginType[];
}

export interface botURIResponseType extends resCodeType {
  data: string;
}
