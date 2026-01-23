import type { queueItemType } from '../event/type';
interface actionType {
  echo: string;
  action: string;
  params: any;
}

type retcodeType =
  | 0
  | 10001
  | 10002
  | 10003
  | 10004
  | 10005
  | 10006
  | 10007
  | 10101
  | 10102
  | 20001
  | 20002;

import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user';
import type { groupInfoType, groupMemberInfoType } from './type';
const devStore = useDevStore();
const userStore = useUserStore();

export class Res {
  self_id: number;
  constructor(public ws: WebSocket) {
    this.ws = ws;
    this.self_id = 1593519730;
  }

  sendApi(
    echo: string,
    data: any,
    message = '',
    retcode: retcodeType,
    status: 'ok' | 'failed' = 'ok'
  ) {
    this.ws.send(
      JSON.stringify({
        status,
        retcode,
        data,
        message,
        echo,
      })
    );
  }

  ok = (echo: string, data: any, message: string, retcode: retcodeType = 0) => {
    this.sendApi(echo, data, message, retcode);
  };

  failed = (echo: string, data: any, message: string, retcode: retcodeType = 10001) => {
    this.sendApi(echo, data, message, retcode);
  };

  parse_action(data: actionType) {
    if (!data.action) return;

    const actionMap: { [key: string]: any } = {
      send_group_forward_msg: this.send_group_forward_msg,
      send_private_forward_msg: this.send_private_forward_msg,
      send_private_msg: this.send_private_msg,
      send_group_msg: this.send_group_msg,
      send_msg: this.send_msg,
      delete_msg: this.delete_msg,
      get_msg: this.get_msg,
      get_forward_msg: this.get_forward_msg,
      send_like: this.send_like,
      set_group_kick: this.set_group_kick,
      set_group_ban: this.set_group_ban,
      set_group_anonymous_ban: this.set_group_anonymous_ban,
      set_group_whole_ban: this.set_group_whole_ban,
      set_group_admin: this.set_group_admin,
      set_group_anonymous: this.set_group_anonymous,
      set_group_card: this.set_group_card,
      set_group_name: this.set_group_name,
      set_group_leave: this.set_group_leave,
      set_group_special_title: this.set_group_special_title,
      set_friend_add_request: this.set_friend_add_request,
      set_group_add_request: this.set_group_add_request,
      get_login_info: this.get_login_info,
      get_stranger_info: this.get_stranger_info,
      get_friend_list: this.get_friend_list,
      get_group_info: this.get_group_info,
      get_group_list: this.get_group_list,
      get_group_msg_history: this.get_group_msg_history,
      get_group_member_info: this.get_group_member_info,
      get_group_member_list: this.get_group_member_list,
      get_group_honor_info: this.get_group_honor_info,
      get_cookies: this.get_cookies,
      get_csrf_token: this.get_csrf_token,
      get_credentials: this.get_credentials,
      get_record: this.get_record,
      get_image: this.get_image,
      can_send_image: this.can_send_image,
      can_send_record: this.can_send_record,
      get_status: this.get_status,
      get_version_info: this.get_version_info,
      set_restart: this.set_restart,
      clean_cache: this.clean_cache,
      _set_model_show: this._set_model_show,
    };

    if (data.action in actionMap) {
      const reply = actionMap[data.action](data.params);
      this.ok(data.echo, reply, '', 0);
    } else {
      console.log('不存在此方法！');
      this.failed(data.echo, {}, '不存在此方法！');
    }
  }

  get curMsgQueue() {
    if (devStore[devStore.curAdapter].cur_message_type == 'group') {
      const curGroup = devStore[devStore.curAdapter].group_list.find(
        group => group.group_id == devStore[devStore.curAdapter].cur_group_id
      );
      if (curGroup) return curGroup.msg_queue;
    } else {
      const curPrivate = devStore[devStore.curAdapter].friend_list.find(
        friend => friend.user_id == devStore[devStore.curAdapter].cur_private_id
      );
      if (curPrivate) return curPrivate.msg_queue;
    }
  }

  get curGroup() {
    return devStore[devStore.curAdapter].group_list.find(
      group => group.group_id == devStore[devStore.curAdapter].cur_group_id
    ) as groupInfoType;
  }

  get curGroupIndex() {
    return devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == devStore[devStore.curAdapter].cur_group_id
    );
  }

  send_private_msg(params: any) {
    return 'ok';
  }

  send_group_msg(params: any) {
    return 'ok';
  }

  send_msg(params: any) {
    return 'ok';
  }

  send_group_forward_msg(params: any) {
    return 'ok';
  }

  send_private_forward_msg(params: any) {
    return 'ok';
  }

  /**
   * 撤回消息
   * @param params
   * @returns
   */
  delete_msg(params: any) {
    const { message_id } = params;
    let found = false;
    devStore[devStore.curAdapter].group_list.forEach(group => {
      group.msg_queue.forEach(queue => {
        if (queue.message_id == message_id) {
          (queue as any).toast = { isDeleted: true };
          found = true;
        }
      });
    });
    devStore[devStore.curAdapter].friend_list.forEach(friend => {
      friend.msg_queue.forEach(queue => {
        if (queue.message_id == message_id) {
          (queue as any).toast = { isDeleted: true };
          found = true;
        }
      });
    });
    return found ? 'ok' : 'message_id not found!';
  }

  /**
   * 获取消息
   * @param params
   * @returns
   */
  get_msg(params: any) {
    const { message_id } = params;
    const queues: queueItemType[] = [];
    devStore[devStore.curAdapter].group_list.forEach(group => {
      queues.push(...group.msg_queue);
    });
    devStore[devStore.curAdapter].friend_list.forEach(friend => {
      queues.push(...friend.msg_queue);
    });
    let res;
    queues.forEach(msg => {
      if (msg.message_id == message_id) {
        const { time, message_type, message_id, sender, message } = msg;
        res = {
          time,
          message_type,
          message_id,
          real_id: message_id,
          sender,
          message,
        };
      }
    });
    return res;
  }

  /**
   * 获取合并消息
   * @param params
   * @returns
   */
  get_forward_msg(params: any) {
    const { id } = params;
    const queues: queueItemType[] = [];
    devStore[devStore.curAdapter].group_list.forEach(group => {
      queues.push(...group.msg_queue);
    });
    devStore[devStore.curAdapter].friend_list.forEach(friend => {
      queues.push(...friend.msg_queue);
    });
    let res;
    queues.forEach(msg => {
      if (msg.message_id == id) {
        const { message, messages } = msg;
        res = messages ? messages : message;
      }
    });
    return res;
  }

  /**
   * 点赞
   * @param params
   * @returns
   */
  send_like(params: any) {
    const { user_id, times } = params;
    if (devStore[devStore.curAdapter].cur_message_type == 'group') {
      const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
        group => group.group_id == devStore[devStore.curAdapter].cur_group_id
      );
      const memberInfoIndex = devStore[devStore.curAdapter]!.group_list[
        groupIndex
      ]!.member_list.findIndex(member => member.user_id == user_id);
      if (memberInfoIndex != -1 && groupIndex != -1) {
        if (
          devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[memberInfoIndex]!
            .thumbs === undefined
        ) {
          devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[
            memberInfoIndex
          ]!.thumbs = 0;
        }
        //@ts-ignore
        devStore[devStore.curAdapter].group_list[groupIndex].member_list[memberInfoIndex].thumbs +=
          Number(times);
      }
    } else {
      const memberInfoIndex = devStore[devStore.curAdapter].friend_list.findIndex(
        member => member.user_id == user_id
      );
      if (memberInfoIndex != -1) {
        if (devStore[devStore.curAdapter]!.friend_list[memberInfoIndex]!.thumbs === undefined) {
          devStore[devStore.curAdapter]!.friend_list[memberInfoIndex]!.thumbs = 0;
        }
        //@ts-ignore
        devStore[devStore.curAdapter].friend_list[memberInfoIndex].thumbs += Number(times);
      }
    }

    return 'ok';
  }

  /**
   * 移除群聊
   * @param params
   * @returns
   */
  set_group_kick(params: any) {
    const { group_id, user_id, reject_add_request } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    const memberInfoIndex = devStore[devStore.curAdapter]!.group_list[
      groupIndex
    ]!.member_list.findIndex(member => member.user_id == user_id);
    if (memberInfoIndex !== -1) {
      devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list.splice(memberInfoIndex, 1);
    }

    return 'ok';
  }

  /**
   * 群禁言
   * @param params
   * @returns
   */
  set_group_ban(params: any) {
    const { group_id, user_id, duration } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    const memberInfoIndex = devStore[devStore.curAdapter]!.group_list[
      groupIndex
    ]!.member_list.findIndex(member => member.user_id == user_id);
    if (memberInfoIndex != -1 && this.curGroupIndex != -1) {
      (
        devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[memberInfoIndex] as any
      ).ban = duration;
      setTimeout(
        () =>
          delete (
            devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[
              memberInfoIndex
            ] as any
          ).ban,
        duration
      );
    }
    return 'ok';
  }

  /**
   * 匿名用户禁言
   * @param params
   * @returns
   */
  set_group_anonymous_ban(params: any) {
    return 'ok';
  }

  /**
   * 全体群禁言
   * @param params
   * @returns
   */
  set_group_whole_ban(params: any) {
    const { group_id, enable } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    if (groupIndex !== -1) {
      if (enable) {
        (devStore[devStore.curAdapter].group_list[groupIndex] as any).ban == true;
      } else {
        (devStore[devStore.curAdapter].group_list[groupIndex] as any).ban == false;
      }
      return 'ok';
    }
    return 'error';
  }

  /**
   * 设置群管
   * @param params
   * @returns
   */
  set_group_admin(params: any) {
    const { group_id, user_id, enable } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    const memberInfoIndex = devStore[devStore.curAdapter]!.group_list[
      groupIndex
    ]!.member_list.findIndex(member => member.user_id == user_id);
    if (memberInfoIndex !== -1) {
      if (enable) {
        devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[memberInfoIndex]!.role =
          'admin';
      } else {
        devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[memberInfoIndex]!.role =
          'member';
      }
      return 'ok';
    }
    return 'error';
  }

  /**
   * 设置群匿名用户
   * @param params
   * @returns
   */
  set_group_anonymous(params: any) {
    return;
  }

  /**
   * 修改群名片
   * @param params
   * @returns
   */
  set_group_card(params: any) {
    const { group_id, user_id, card } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    const memberInfoIndex = devStore[devStore.curAdapter]!.group_list[
      groupIndex
    ]!.member_list.findIndex(member => member.user_id == user_id);
    if (memberInfoIndex !== -1) {
      devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[memberInfoIndex]!.card =
        card;
    }
    return;
  }

  /**
   * 设置群名
   * @param params
   * @returns
   */
  set_group_name(params: any) {
    const { group_id, group_name } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    if (groupIndex !== -1) {
      devStore[devStore.curAdapter]!.group_list[groupIndex]!.group_name = group_name;
      return 'ok';
    }
    return 'error';
  }

  /**
   * 解散群聊
   * @param params
   * @returns
   */
  set_group_leave(params: any) {
    const { group_id, is_dismiss } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    if (groupIndex !== -1) {
      if (is_dismiss) {
        devStore[devStore.curAdapter].group_list.splice(groupIndex, 1);
      } else {
        const memberIndex = devStore[devStore.curAdapter]!.group_list[
          groupIndex
        ]!.member_list.findIndex(
          member => member.user_id == devStore[devStore.curAdapter].cur_bot_id
        );
        if (memberIndex !== -1) {
          devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list.splice(memberIndex, 1);
        }
      }
      return 'ok';
    }
    return;
  }

  /**
   * 设置成员头衔
   * @param params
   * @returns
   */
  set_group_special_title(params: any) {
    const { group_id, user_id, special_title, duration } = params;
    const groupIndex = devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == group_id
    );
    const memberInfoIndex = devStore[devStore.curAdapter]!.group_list[
      groupIndex
    ]!.member_list.findIndex(member => member.user_id == user_id);
    if (memberInfoIndex !== -1) {
      devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[memberInfoIndex]!.title =
        special_title;
      devStore[devStore.curAdapter]!.group_list[groupIndex]!.member_list[
        memberInfoIndex
      ]!.title_expire_time = duration;
    }
    return 'ok';
  }

  /**
   * 处理加好友请求
   * @param params
   * @returns
   */
  set_friend_add_request(params: any) {
    const { flag, approve, remark } = params;

    return 'ok';
  }

  /**
   * 处理加群请求
   * @param params
   * @returns
   */
  set_group_add_request(params: any) {
    return 'ok';
  }

  /**
   * 获取登录信息
   * @param params
   * @returns
   */
  get_login_info(params: any) {
    const curbotID = devStore[devStore.curAdapter].cur_bot_id;
    const botInfo = devStore[devStore.curAdapter].friend_list.find(f => f.user_id == curbotID);
    return {
      user_id: curbotID,
      nickname: botInfo ? botInfo.nickname : String(devStore[devStore.curAdapter].cur_bot_id),
    };
  }

  /**
   * 获取陌生人信息
   * @param params
   * @returns
   */
  get_stranger_info(params: any) {
    return {};
  }

  /**
   * 获取好友列表
   * @param params
   * @returns
   */
  get_friend_list(params: any) {
    const friends = devStore[devStore.curAdapter].friend_list.map(friend => {
      return {
        nickname: friend.nickname,
        remark: friend.remark,
        user_id: friend.user_id,
      };
    });
    return friends;
  }

  /**
   * 获取群信息
   * @param params
   * @returns
   */
  get_group_info(params: any) {
    const group = devStore[devStore.curAdapter].group_list.find(g => g.group_id == params.group_id);
    return group || {};
  }

  /**
   * 获取群聊列表
   * @param params
   * @returns
   */
  get_group_list(params: any) {
    const groups = devStore[devStore.curAdapter].group_list.map(group => {
      return {
        group_id: group.group_id,
        group_name: group.group_name,
        max_member_count: group.max_member_count,
        member_count: group.member_list?.length,
      };
    });
    return groups || [];
  }

  /**
   * 获取群成员信息
   * @param params
   * @returns
   */
  get_group_member_info(params: any) {
    const group = devStore[devStore.curAdapter].group_list.find(g => g.group_id == params.group_id);
    if (group) {
      const member = group?.member_list?.find(
        (m: groupMemberInfoType) => m.user_id == params.user_id
      );
      if (member) return member;
    }
    return {};
  }

  /**
   * 群成员列表
   * @param params
   * @returns
   */
  get_group_member_list(params: any) {
    const group = devStore[devStore.curAdapter].group_list.find(g => g.group_id == params.group_id);
    return group?.member_list;
  }

  /**
   * 群荣誉信息
   * @param params
   * @returns
   */
  get_group_honor_info(params: any) {
    return {};
  }

  get_cookies(params: any) {
    return {
      cookies: '',
    };
  }

  get_csrf_token(params: any) {
    return {
      token: 114514,
    };
  }

  get_credentials(params: any) {
    return {
      cookies: '',
      token: 114514,
    };
  }

  get_record(params: any) {
    const { file } = params;
    return `http://127.0.0.1:${userStore.originPort}/api/File/` + file;
  }

  get_image(params: any) {
    const { file } = params;
    return `http://127.0.0.1:${userStore.originPort}/api/File/` + file;
  }

  can_send_image(params: any) {
    return {
      yes: true,
    };
  }

  can_send_record(params: any) {
    return {
      yes: true,
    };
  }

  get_status(params: any) {
    return {
      app_initialized: true,
      app_enabled: true,
      app_good: true,
      online: true,
      good: true,
    };
  }

  get_version_info(params: any) {
    return {
      app_name: 'sandbox.OneBot',
      app_version: '0.0.1',
      protocol_version: 'v11',
    };
  }

  set_restart(params: any) {
    return 'Cannot restart!';
  }

  clean_cache(params: any) {
    return 'ok';
  }

  _set_model_show(params: any) {
    console.log(params.model);
    console.log(params.model_show);
    return 'ok';
  }

  /** 拓展 */
  /** 注意，如果是机器人发的额消息，文件返回的base64类型 */
  get_group_msg_history(params: any) {
    const { group_id, message_seq, message_id, count } = params;
    const group = devStore[devStore.curAdapter].group_list.find(g => g.group_id == group_id);
    if (group) {
      const endIndex = group.msg_queue.findIndex(
        q => q.message_id == (message_id ? message_id : message_seq)
      );
      if (endIndex) {
        const safeEndIndex = Math.min(endIndex, group.msg_queue.length - 1);
        // 截取消息，包含 endIndex 对应的元素（如果它有效），但不超过 count 条
        const tempQueue = group.msg_queue.slice(endIndex - count + 1, endIndex + 1);
        return { messages: tempQueue };
      } else {
        const tempQueue = group.msg_queue.slice(-count);
        return { messages: tempQueue };
      }
    }
  }
}
