/** Markdown消息 */
export interface MarkdownElemType {
  type: 'markdown';
  content: string;
}
/** Button消息 */
export interface ButtonElemType {
  type: 'button';
  content: {
    /** 机器人appid */
    appid: number;
    /** rows 数组的每个元素表示每一行按钮 */
    rows: {
      buttons: ButtonType[];
    }[];
  };
}
export interface ButtonType {
  /** 按钮ID：在一个keyboard消息内设置唯一 */
  id?: string;
  render_data: {
    /** 按钮上的文字 */
    label: string;
    /** 点击后按钮的上文字 */
    visited_label: string;
    /** 按钮样式：0 灰色线框，1 蓝色线框 */
    style: number;
  };
  action: {
    /** 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data */
    type: number;
    permission: {
      /** 0 指定用户可操作，1 仅管理者可操作，2 所有人可操作，3 指定身份组可操作（仅频道可用） */
      type: number;
      /** 有权限的用户 id 的列表 */
      specify_user_ids?: Array<string>;
      /** 有权限的身份组 id 的列表（仅频道可用） */
      specify_role_ids?: Array<string>;
    };
    /** 操作相关的数据 */
    data: string;
    /** 指令按钮可用，指令是否带引用回复本消息，默认 false。支持版本 8983 */
    reply?: boolean;
    /** 指令按钮可用，点击按钮后直接自动发送 data，默认 false。支持版本 8983 */
    enter?: boolean;
    /** 本字段仅在指令按钮下有效，设置后后会忽略 action.enter 配置。
        设置为 1 时 ，点击按钮自动唤起启手Q选图器，其他值暂无效果。
        （仅支持手机端版本 8983+ 的单聊场景，桌面端不支持） */
    anchor?: number;
    /**【已弃用】可操作点击的次数，默认不限 */
    click_limit?: number;
    /** 【已弃用】指令按钮可用，弹出子频道选择器，默认 false */
    at_bot_show_channel_list?: boolean;
    /** 客户端不支持本action的时候，弹出的toast文案 */
    unsupport_tips: string;
  };
}
