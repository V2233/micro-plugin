/**
 * 沙箱数据默认值
 */

import type { groupInfoType } from '@/views/dev/sandbox/protocol/onebotv11/api/type';

/** 群列表 */
export const group_list: groupInfoType[] = [
  {
    group_id: 397798018,
    group_name: '沙箱测试群',
    max_member_count: 200,
    member_count: 3,
    /** 每个群的消息队列 */
    msg_queue: [],
    member_list: [
      {
        group_id: 397798018,
        user_id: 2854196310,
        nickname: 'Q群管家',
        card: 'Q群管家',
        sex: 'unknown',
        age: 18,
        area: '',
        join_time: 0,
        last_sent_time: 0,
        level: 'Lv1',
        role: 'bot',
        unfriendly: false,
        title: '机器人',
        title_expire_time: 987654321,
        card_changeable: true,
        thumbs: 0,
      },
    ],
  },
];

/** 好友列表 */
export const friend_list = [
  {
    nickname: '小冰',
    remark: '',
    user_id: 2854196306,
    msg_queue: [],
    thumbs: 0,
  },
];
