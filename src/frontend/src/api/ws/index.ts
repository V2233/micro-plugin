import { reqServerPort } from '@/api/user/index';
import useUserStore from '@/store/modules/user';
const userStore = useUserStore();

export default class Ws {
  ws: WebSocket | null;
  url: string;
  msgQueue: any[];
  clientId: string;
  reConnectSum: number;
  address: {
    publicAddress: string;
    privateAddress: string;
  };
  constructor(url = '/micro/webui/chat') {
    this.address = {
      publicAddress: '',
      privateAddress: '',
    };
    this.ws = null;
    this.url = url;
    this.msgQueue = [];
    this.clientId = '';
    this.reConnectSum = 0;
  }

  async openWs(ip = '', cb: Function | null = null) {
    const originUrl = new URL(userStore.originAddress);
    this.ws = new WebSocket(
      (ip
        ? ip
        : `ws://${originUrl.hostname}:${
            userStore.originPort ? userStore.originPort : originUrl.port
          }`) + this.url
    );
    this.ws.addEventListener('open', e => {
      console.log('ws连接成功！' + e.target);
      cb && cb();
    });

    this.ws.addEventListener('message', e => {
      // console.log('ws收到服务端消息:' + e.data)
      const msg = JSON.parse(e.data);
      this.msgQueue.push(msg);
      if (msg.action == 'meta') {
        this.clientId = msg.params;
      }
    });

    this.ws.addEventListener('close', e => {
      console.log('ws服务端关闭！' + JSON.stringify(e));
      this.clientId = '';
    });

    this.ws.addEventListener('error', async e => {
      console.log('ws出错！' + JSON.stringify(e));
      if (!this.address.privateAddress && !this.address.publicAddress) {
        await this.getServerPort();
      }
      await this.openWs(this.address.privateAddress);
    });
  }

  async getServerPort() {
    const res: any = await reqServerPort();
    if (res.code == 200) {
      this.address = res.data;
    }
  }

  closeWs() {
    this.ws && this.ws.close();
    console.log('ws关闭成功！');
  }

  sendWs(data: any) {
    this.ws && this.ws.send(this.clientId ? { ...data, ClientId: this.clientId } : data);
  }
}
