import { reqLogin, reqLogout, reqSaveServerAddress, reqUserInfo } from '@/api/user';
import type { loginForm, loginResponseData, userInfoResponseData } from '@/api/user/type';
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token';
import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';
import type { UserState } from './types/type';

// 引入常量路由
import router from '@/router';
import { anyRoute, asnycRoute, constantRoute } from '@/router/routes';

// 深拷贝
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep';

// 过滤展示的异步路由
function filterAsyncRoute(asyncRoute: any[], hiddenRoutes: string[]): any[] {
  return asyncRoute.filter((item: any) => {
    const itemName = item.name || ''; // 将当前路由名称转换为小写
    if (!hiddenRoutes.includes(itemName)) {
      // 如果当前路由名称不在隐藏列表中
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, hiddenRoutes); // 递归处理子路由
      }
      return true;
    }
    return false; // 如果需要隐藏的路由，则不返回此路由
  });
}

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //生成菜单需要的数组
      username: '',
      avatar: '',
      masterQQ: 0,
      //存储当前用户是否包含某一个按钮
      buttons: [],
      /** 请求源，用于服务端提供链接 */
      originAddress: '',
      originPort: 23306,
      tokens: {},
    };
  },
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data);
      // console.log(result)
      // 成功，获取token
      if (result.code == 200) {
        this.token = result.data as string;
        SET_TOKEN(result.data as string);
        const savedTokensString = localStorage.getItem('HISTORY_TOKENS');
        if (!savedTokensString) {
          this.tokens = {
            [result.data]: data,
          };
        } else {
          this.tokens = JSON.parse(savedTokensString);
          const existed = Object.keys(this.tokens).find(
            token => this.tokens[token]?.username === data.username
          );
          if (existed) {
            delete this.tokens[existed];
          }
          this.tokens[result.data as string] = data;
        }
        localStorage.setItem('HISTORY_TOKENS', JSON.stringify(this.tokens));
        return Promise.resolve('ok');
      } else {
        return Promise.reject(new Error(result.data));
      }
    },
    async userInfo() {
      const result: userInfoResponseData = await reqUserInfo();
      // console.log(this.token)
      // console.log(result)
      // 成功，获取token
      if (result.code == 200) {
        this.username = result.data.username;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        this.masterQQ = result.data.masterQQ;
        // 计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asnycRoute), result.data.routes || []);
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
        // 动态追加注册路由
        const routers = [...userAsyncRoute, anyRoute];
        routers.forEach((route: any) => {
          router.addRoute(route);
        });

        return Promise.resolve('ok');
      } else {
        ElNotification.error(`[${result.code}]${result.message}`);
        return Promise.reject(new Error(JSON.stringify(result.data)));
      }
    },
    async logOut() {
      const result: any = await reqLogout();
      if (result.code == 200) {
        ((this.token = ''), (this.username = ''));
        this.avatar = '';
        this.masterQQ = 0;
        REMOVE_TOKEN();
        return Promise.resolve('ok');
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    async getOriginAddress() {
      this.originAddress = window.location.origin;
      const urlObj = new URL(this.originAddress);
      const { hostname, port, protocol, origin } = urlObj;
      const res: any = await reqSaveServerAddress({ hostname, port, protocol, origin });
      if (res.code == 200) {
        this.originPort = res.data.port;
        return Promise.resolve('ok');
      } else {
        return Promise.reject(new Error(res.message));
      }
    },
  },
  getters: {},
});

export default useUserStore;
