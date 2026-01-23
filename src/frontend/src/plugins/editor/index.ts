import type { App } from 'vue';
import LocalComponent from './src/components';
import ESEditor from './src/components/layout/index.vue';
export * from './src/components';
export * from './src/hooks';
export * from './src/types';
export { ESEditor };
export default {
  install: (app: App) => {
    app.use(LocalComponent);
  },
};
