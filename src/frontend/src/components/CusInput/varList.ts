export interface variableType {
  prop: string;
  tip: string;
}

export const varList = [
  {
    prop: 'e.msg',
    tip: '触发此功能的消息',
  },
  {
    prop: 'e.post_type',
    tip: '触发此功能消息类型',
  },
  {
    prop: 'e.message_id',
    tip: '消息唯一标识符',
  },
  {
    prop: 'e.user_id',
    tip: '用户QQ号或Id',
  },
  {
    prop: 'e.time',
    tip: '消息时间戳',
  },
  {
    prop: 'e.seq',
    tip: '消息序号',
  },
  {
    prop: 'e.rand',
    tip: '神秘的数字',
  },
  {
    prop: 'e.font',
    tip: '发送者使用的字体',
  },
  {
    prop: 'e.raw_message',
    tip: '原始消息摘要',
  },
  {
    prop: 'e.message_type',
    tip: '消息类型(group|private|guild)',
  },
  {
    prop: 'e.sender.user_id',
    tip: '发送者QQ号或Id(同e.user_id)',
  },
  {
    prop: 'e.sender.nickname',
    tip: '发送者个人昵称',
  },
  {
    prop: 'e.sender.sub_id',
    tip: '发送者虚拟id',
  },
  {
    prop: 'e.sender.card',
    tip: '发送者所在群昵称',
  },
  {
    prop: 'e.sender.sex',
    tip: '发送者性别',
  },
  {
    prop: 'e.sender.age',
    tip: '发送者年龄',
  },
  {
    prop: 'e.sender.area',
    tip: '发送者居住地',
  },
  {
    prop: 'e.sender.level',
    tip: '发送者群聊等级',
  },
  {
    prop: 'e.sender.role',
    tip: '发送者角色(owner|master|admin)',
  },
  {
    prop: 'e.sender.title',
    tip: '头衔',
  },
  {
    prop: 'e.group_id',
    tip: '群号或ID',
  },
  {
    prop: 'e.group_name',
    tip: '群昵称',
  },
  {
    prop: 'e.block',
    tip: '(true|false)',
  },
  {
    prop: 'e.sub_type',
    tip: '消息子类别',
  },
  {
    prop: 'e.anonymous',
    tip: '匿名者信息',
  },
  {
    prop: 'e.atme',
    tip: '是否@我(true|false)',
  },
  {
    prop: 'e.atall',
    tip: '是否@所有人(true|false)',
  },
  {
    prop: 'e.self_id',
    tip: '机器人QQ或ID',
  },
  {
    prop: 'e.isGroup',
    tip: '是否来自群(true|false)',
  },
  {
    prop: 'e.user_avatar',
    tip: '用户头像地址',
  },
  {
    prop: 'e.group_avatar',
    tip: '用户所在群聊头像地址',
  },
  {
    prop: 'e.user_name',
    tip: '用户昵称',
  },
  {
    prop: 'e.isMaster',
    tip: '是否是主人',
  },
];
