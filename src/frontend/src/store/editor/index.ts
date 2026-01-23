import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { type App } from 'vue';

export * from './app';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  install: (app: App) => {
    app.use(pinia);
  },
};
