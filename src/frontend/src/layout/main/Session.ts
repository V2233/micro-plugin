import useUserStore from '@/store/modules/user';
const userStore = useUserStore();

export enum NoticeTypes {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export default class Session {
  static sessions = new Map<string, Session>();
  static activeSession: Session | null = null;

  static onSessionsChange: ((type: NoticeTypes, message: string) => void) | null = null;

  static deleteSession(session: Session | string) {
    const sess = Session.sessions.get(typeof session === 'string' ? session : session.id);
    if (sess) {
      Session.sessions.delete(sess.id);
      sess.ws?.close();
      Session.onSessionsChange?.(NoticeTypes.SUCCESS, sess.name + '会话关闭成功！');
    }
  }

  ws: WebSocket | null;
  msgQueue: any[];
  id: string;
  reConnectSum: number;
  baseUrl: string;
  url: string = '';
  name = `[micro-terminal]`;

  sshConfig?: {
    loading: boolean;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
  };

  constructor(public mode: 'ssh' | 'shell' = 'shell') {
    const originUrl = new URL(userStore.originAddress);
    const host = `${originUrl.hostname}:${
      userStore.originPort ? userStore.originPort : originUrl.port
    }`;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    this.baseUrl = `${protocol}//${host}`;
    this.ws = null;
    this.msgQueue = [];
    this.reConnectSum = 0;
    this.id = `${Date.now()}_${Math.random().toString(36).substr(5, 9)}`;
  }

  connect(
    path = '/micro/webui/term',
    sessionName = `[micro-terminal][${this.id}]`
  ): Promise<Event> {
    this.url = this.baseUrl + path;
    this.name = sessionName;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = e => {
        console.log(`${sessionName}已连接！`);
        Session.activeSession = this;
        Session.sessions.set(this.id, this);
        Session.onSessionsChange?.(NoticeTypes.SUCCESS, `${sessionName}已连接！`);
        resolve(e);
      };
      this.ws.addEventListener('message', e => {
        const msg = JSON.parse(e.data);
        this.msgQueue.push(msg);
      });
      this.ws.onclose = e => {
        console.log(`${sessionName}已关闭！`, e);
        const existed = Session.sessions.delete(this.id);
        existed &&
          Session.onSessionsChange?.(
            NoticeTypes.WARNING,
            `${sessionName}关闭：${e.reason || e.code}`
          );
      };
      this.ws.onerror = err => {
        console.log(`${sessionName}连接报错！`, err);
        Session.sessions.delete(this.id);
        Session.onSessionsChange?.(NoticeTypes.ERROR, `${sessionName}连接报错：${err.type}`);
        reject(err);
      };
    });
  }
}
