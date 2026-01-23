import type {
  groupInfoType,
  groupMemberInfoType,
  friendInfoType,
} from '../protocol/onebotv11/api/type';

export interface drawerDataType {
  last_scene: number;
  scene: number;
  title: string;
  type: string;
  body: {
    member_type: 'bot' | 'friend' | 'group' | 'member';
    member_data: groupMemberInfoType;
    friend_data: friendInfoType;
    bot_welcome: string;
  };
}
