import { createApp } from 'vue';
import App from './App.vue';

import ElementPlus from 'element-plus';
//@ts-ignore
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css';

// import './style.css'
import '@/style/index.scss';
import 'virtual:svg-icons-register';

// 路由
import router from './router';

// element图标
import ElementPlusIcons from '@/plugins/element-plus';

// 全局组件
import globalComponent from '@/components';

// Es-editor
import editor from '@/plugins/editor';

// 仓库
import pinia from './store';

// 导航守卫
import './permission';

// 自定义指令
import { isHasButton } from '@/directive/has';

const app = createApp(App);

isHasButton(app);

app.use(router);

app.use(globalComponent);

app.use(editor);

app.use(ElementPlusIcons);

app.use(ElementPlus, {
  locale: zhCn, //
});

app.use(pinia);

app.mount('#app');

export { app };
