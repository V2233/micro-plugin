import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute } from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;
