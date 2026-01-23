// layout 组件相关
import { defineStore } from 'pinia';
import type { SettingState } from './types/type';

const theme = localStorage.getItem('THEME') as 'light' | 'dark';

const useLayoutSettingStore = defineStore('SettingStore', {
  state: (): SettingState => {
    return {
      foldMode: 2,
      refresh: false,
      theme:
        theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
      globalTerminal: {
        running: false,
        visible: false,
      },
    };
  },
});

export default useLayoutSettingStore;
