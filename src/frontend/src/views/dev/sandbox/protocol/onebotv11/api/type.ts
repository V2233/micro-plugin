import type { groupMsgQueueItemType, privateMsgQueueItemType } from '../event/type';

export interface groupInfoType {
  group_id: number;
  group_name: string;
  max_member_count: number;
  member_count: number;
  msg_queue: groupMsgQueueItemType[] | [];
  member_list: groupMemberInfoType[];
  searched?: boolean;
  avatar?: string;
}

export interface friendInfoType {
  nickname: string;
  remark: string;
  user_id: number;
  msg_queue: privateMsgQueueItemType[] | [];
  thumbs?: number;
  searched?: boolean;
  avatar?: string;
}

export interface strangerInfoType {
  nickname: string;
  user_id: number;
  sex: string;
  age: number;
  thumbs?: number;
}

export interface groupMemberInfoType {
  group_id: number;
  user_id: number;
  nickname: string;
  card: string;
  sex: string;
  age: number;
  area: string;
  join_time: number;
  last_sent_time: number;
  level: string;
  role: 'owner' | 'admin' | 'member' | 'bot';
  unfriendly: boolean;
  title: string;
  title_expire_time: number;
  card_changeable: boolean;
  thumbs?: number;
  avatar?: string;
}

export interface groupSpecialTitleType {
  group_id: number;
  user_id: number;
  special_title: string;
  duration: number | -1;
}

interface honorType {
  user_id: number;
  nickname: string;
  avatar: string;
  description: string;
}

export interface groupHonorInfoType {
  group_id: number;
  current_talkative: {
    user_id: number;
    nickname: string;
    avatar: string;
    day_count: number;
  };
  talkative_list: honorType[];
  performer_list: honorType[];
  legend_list: honorType[];
  strong_newbie_list: honorType[];
  emotion_list: honorType[];
}

export interface credentialsType {
  cookies: string;
  csrf_token: number;
}
