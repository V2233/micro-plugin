import type { ButtonType } from './type.ts';
export const buttonEl = (): ButtonType => {
  return {
    /** 按钮ID：在一个keyboard消息内设置唯一 */
    id: '',
    render_data: {
      /** 按钮上的文字 */
      label: '',
      /** 点击后按钮的上文字 */
      visited_label: '',
      /** 按钮样式：0 灰色线框，1 蓝色线框 */
      style: 1,
    },
    action: {
      /** 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data */
      type: 1,
      permission: {
        /** 0 指定用户可操作，1 仅管理者可操作，2 所有人可操作，3 指定身份组可操作（仅频道可用） */
        type: 2,
        /** 有权限的用户 id 的列表 */
        specify_user_ids: [],
        /** 有权限的身份组 id 的列表（仅频道可用） */
        specify_role_ids: [],
      },
      /** 操作相关的数据 */
      data: '',
      /** 指令按钮可用，指令是否带引用回复本消息，默认 false。支持版本 8983 */
      reply: false,
      /** 指令按钮可用，点击按钮后直接自动发送 data，默认 false。支持版本 8983 */
      enter: false,
      /** 本字段仅在指令按钮下有效，设置后后会忽略 action.enter 配置。
             设置为 1 时 ，点击按钮自动唤起启手Q选图器，其他值暂无效果。
            （仅支持手机端版本 8983+ 的单聊场景，桌面端不支持） */
      anchor: 0,
      /**【已弃用】可操作点击的次数，默认不限 */
      click_limit: 99999,
      /** 【已弃用】指令按钮可用，弹出子频道选择器，默认 false */
      at_bot_show_channel_list: false,
      /** 客户端不支持本action的时候，弹出的toast文案 */
      unsupport_tips: '',
    },
  };
};

export const markdownEl = () => {
  return {
    custom_template_id: '101993071_1658748972',
    content: '',
    params: [
      {
        tempString: '',
        key: 'title',
        values: ['标题'],
      },
      {
        tempString: '',
        key: 'image',
        values: [
          'https://resource5-1255303497.cos.ap-guangzhou.myqcloud.com/abcmouse_word_watch/other/mkd_img.png',
        ],
      },
      {
        tempString: '',
        key: 'para1',
        values: ['段落1'],
      },
      {
        tempString: '',
        key: 'para2',
        values: ['段落2'],
      },
      {
        tempString: '',
        key: 'desc',
        values: ['简介'],
      },
      {
        tempString: '',
        key: 'content',
        values: ['在这个子频道非常开心'],
      },
      {
        tempString: '',
        key: 'link_introduction',
        values: ['链接介绍'],
      },
      {
        tempString: '',
        key: 'link',
        values: ['https://www.qq.com'],
      },
    ],
  };
};
