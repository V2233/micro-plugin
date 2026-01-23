import type { MessageElem } from './message/message.elem';

class Api {
  self_id = 123456789;

  connect(self_id: number) {
    return {
      sub_type: 'connect',
      meta_event_type: 'lifecycle',
      time: Math.round(Date.now() / 1000),
      self_id: self_id,
      post_type: 'meta_event',
    };
  }

  heartbeat() {
    return {
      interval: 5000,
      status: {
        app_initialized: true,
        app_enabled: true,
        app_good: true,
        online: true,
        good: true,
      },
      meta_event_type: 'heartbeat',
      time: Math.round(Date.now() / 1000),
      self_id: this.self_id,
      post_type: 'meta_event',
    };
  }

  /**
   * 制作CQ
   * @param message
   * @returns
   */
  async makeCQ(message: MessageElem[]) {
    let raw_message = '';
    message.forEach((seg: any) => {
      const data = Object.keys(seg.data).map(key => {
        if (typeof seg.data[key] == 'string') {
          return `${key}=${seg.data[key].replace(/base64:\/\/.*?(,|]|")/g, 'base64://...$1')}`;
        }
        return `${key}=${seg.data[key]}`;
      });
      raw_message += `[CQ:${seg.type},${data.join(',')}]`;
    });
    return raw_message;
  }

  send_group_msg(group_id: number, user_id: number, message: Array<any>) {
    return {
      message_type: 'group',
      sub_type: 'normal',
      message_id: Math.round(Date.now() / 1000),
      group_id: group_id,
      user_id: user_id,
      anonymous: null,
      message: message,
      raw_message: this.makeCQ(message),
      font: 0,
      sender: {
        user_id: this.self_id,
        nickname: '󠀀󠀀󠀀󠀀󠀀󠀀',
        card: '',
        sex: 'unknown',
        age: 0,
        area: '',
        level: '11',
        role: 'admin',
        title: '',
      },
      time: Math.round(Date.now() / 1000),
      self_id: this.self_id,
      post_type: 'message',
    };
  }
}
