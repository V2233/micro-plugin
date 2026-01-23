import pinia from '@/store';
// 按钮权限实现
import useUserStore from '@/store/modules/user';
const userStore = useUserStore(pinia);
export const isHasButton = (app: any) => {
  app.directive('has', {
    mounted(el: any, options: any) {
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChiild(el);
      }
    },
  });
};
