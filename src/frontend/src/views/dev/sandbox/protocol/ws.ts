import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user';
import Events from '../protocol/onebotv11/event/event';
import msgQueueController from './onebotv11/queue/msgQueue';
import { Res } from './onebotv11/api/api2';
import { ElMessage } from 'element-plus';

const devStore = useDevStore();
const userStore = useUserStore();

export default class Onebot {
  bot: WebSocket | null;
  url: string;
  msgQueue: any[];
  res: Res | null;
  heartbeat_id: NodeJS.Timeout | null;
  constructor(public protocolUrl = '/onebot/v11/ws') {
    const originUrl = new URL(userStore.originAddress);
    const customAddress = devStore[devStore.curAdapter].settings.ws_forward_address;
    this.url = customAddress
      ? customAddress
      : `ws://${originUrl.hostname}:${userStore.originPort ? userStore.originPort : originUrl.port}${protocolUrl}`;
    this.bot = null;
    this.msgQueue = [];
    this.res = null;
    this.heartbeat_id = null;
  }

  connect(uin: number) {
    this.bot = new WebSocket(this.url);
    this.bot.addEventListener('open', e => {
      this.bot?.send(JSON.stringify(Events.lifecycle('connect')));
      console.log('ws连接成功！' + e.target);
      this.res = new Res(this.bot as WebSocket);
      if (devStore[devStore.curAdapter].settings.heart_beat) {
        this.heartbeat_id = setInterval(() => {
          this.bot?.send(
            JSON.stringify(
              Events.heartbeat({
                app_initialized: true,
                app_enabled: true,
                app_good: true,
                online: true,
                good: true,
              })
            )
          );
        }, 5000);
      }
    });

    this.bot.addEventListener('message', async e => {
      console.log('ws收到服务端消息:');
      const json = JSON.parse(e.data);
      // console.log(json)
      // api解析动作并响应
      this.res?.parse_action(json);
      if (json.action) {
        if (
          json.action == 'send_group_msg' ||
          (json.action == 'send_msg' &&
            (json.params?.message_type == 'group' || json.params?.group_id))
        ) {
          if (!msgQueueController.isBotInCurScene) {
            ElMessage.warning('当前聊天场景不存在测试Bot！');
            return;
          }
          const pre = Events.group_message({
            message_id: Math.round(Date.now()),
            group_id: json.params.group_id,
            user_id: devStore[devStore.curAdapter].cur_bot_id,
            nickname: msgQueueController.curBot?.nickname as string,
            message: await Events.handleMessage(json.params.message),
            raw_message: Events.makeCQ(json.params.message),
            sex: 'female',
          });
          msgQueueController.groupQueue_push(pre);
        }
        if (
          json.action == 'send_private_msg' ||
          (json.action == 'send_msg' &&
            (json.params?.message_type == 'private' || !json.params?.group_id))
        ) {
          if (!msgQueueController.isBotInCurScene) {
            ElMessage.warning('当前聊天场景不存在测试Bot！');
            return;
          }
          const pre = Events.private_message({
            message_id: Math.round(Date.now()),
            user_id: devStore[devStore.curAdapter].cur_bot_id,
            nickname: msgQueueController.curBot?.nickname as string,
            message: await Events.handleMessage(json.params.message),
            raw_message: Events.makeCQ(json.params.message),
            sex: 'female',
          });
          msgQueueController.privateQueue_push(pre);
        }
        if (json.action == 'send_group_forward_msg') {
          if (!msgQueueController.isBotInCurScene) {
            ElMessage.warning('当前聊天场景不存在测试Bot！');
            return;
          }
          const pre = Events.group_message({
            message_id: Math.round(Date.now()),
            group_id: json.params.group_id,
            user_id: devStore[devStore.curAdapter].cur_bot_id,
            nickname: msgQueueController.curBot?.nickname as string,
            message: [],
            messages: json.params.messages,
            raw_message: Events.makeCQ(json.params.messages),
            sex: 'female',
          });
          msgQueueController.groupQueue_push(pre);
        }
        if (json.action == 'send_private_forward_msg') {
          if (!msgQueueController.isBotInCurScene) {
            ElMessage.warning('当前聊天场景不存在测试Bot！');
            return;
          }
          const pre = Events.private_message({
            message_id: Math.round(Date.now()),
            user_id: devStore[devStore.curAdapter].cur_bot_id,
            nickname: msgQueueController.curBot?.nickname as string,
            message: [],
            messages: json.params.messages,
            raw_message: Events.makeCQ(json.params.messages),
            sex: 'female',
          });
          msgQueueController.privateQueue_push(pre);
        }
      }
    });

    this.bot.addEventListener('close', e => {
      console.log('ws服务端关闭！' + JSON.stringify(e));
      ElMessage.warning('监听到ws连接断开，可刷新页面重连');
      if (this.heartbeat_id) {
        clearInterval(this.heartbeat_id);
      }
    });

    this.bot.addEventListener('error', async e => {
      console.log('ws出错！' + JSON.stringify(e));
      if (this.heartbeat_id) {
        clearInterval(this.heartbeat_id);
      }
      this.bot?.close();
    });
  }
}
