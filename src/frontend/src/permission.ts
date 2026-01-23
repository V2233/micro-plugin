// 路由鉴权
import router from '@/router';

import setting from './settings';
import useUserStore from '@/store/modules/user';
import pinia from '@/store';
const userStore = useUserStore(pinia);
window.addEventListener('load', () => {
  const savedTokens = localStorage.getItem('HISTORY_TOKENS');
  if (savedTokens) userStore.tokens = JSON.parse(savedTokens);
});
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = setting.title + '-' + to.meta.title;

  const token = userStore.token;
  const username = userStore.username;
  if (token) {
    // 登录成功不能访问login
    if (to.path == '/login') {
      next({
        path: '/',
      });
    } else {
      if (username) {
        next();
      } else {
        try {
          await userStore.userInfo();
          // 刷新的时候如果是异步路由
          next({ ...to });
        } catch (err) {
          // token过期或本地token被修改
          await userStore.logOut();
          next({
            path: '/login',
            query: {
              redirect: to.path,
            },
          });
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.path,
        },
      });
    }
  }

  if (!userStore.originAddress) {
    await userStore.getOriginAddress();
  }
});

// 全局后置守卫
router.afterEach((to: any, from: any, next: any) => {});

// 用户未登录，其余路由不能访问
// 登录成功，登录页不可访问
