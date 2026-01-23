import { defineStore } from 'pinia';
import type { ScreenState } from './types/type';

const useScreenstore = defineStore('Screen', {
  state: (): ScreenState => {
    return {
      // 消息流速
      msgQps: [],
      curMsgQueueLength: 0,
      settings: {
        imageWidth: 400,
        isAutoScroll: true,
        isAutoUpdated: false,
        updateInterval: 10,
        qpsInterval: 1,
        fontSize: 20,
      },
    };
  },
  actions: {},
  getters: {},
});

export default useScreenstore;
