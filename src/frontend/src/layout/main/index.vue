<template>
  <global-terminal
    class="terminal-com"
    v-if="layoutSettingStore.globalTerminal.running"
    v-show="layoutSettingStore.globalTerminal.visible"
  ></global-terminal>
  <router-view v-slot="{ Component, route }">
    <transition name="page-slide">
      <!-- 渲染layout以及路由组件的子路由 -->
      <div class="com" :key="route.fullPath">
        <component :is="Component" v-if="flag" />
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import useLayoutSettingStore from '@/store/modules/setting';
import GlobalTerminal from './GlobalTerminal.vue';

let layoutSettingStore = useLayoutSettingStore();

let flag = ref(true);

watch(
  () => layoutSettingStore.globalTerminal.visible,
  (newValue, oldValue) => {
    if (oldValue == false) {
      if (!layoutSettingStore.globalTerminal.running) {
        layoutSettingStore.globalTerminal.running = true;
      }
    }
  }
);

// 监听仓库数据变化
watch(
  () => layoutSettingStore.refresh,
  () => {
    console.log('刷新');
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
    // 页面刷新时重新渲染组件
    // const comElement = document.querySelector('.com')
    // console.log(comElement)
    // if (comElement) {
    //   comElement.classList.remove('page-slide-enter-active')
    //   nextTick(() => {
    //     comElement.classList.add('page-slide-enter-active')
    //   })
    // }
  }
);
</script>

<script lang="ts">
export default {
  name: 'Main',
};
</script>

<style scoped lang="scss">
// .terminal-com {
//   z-index: 500000;
//   position: absolute;
//   left: 10px;
//   right: 10px;
//   top: 10px;
//   bottom: 10px;
// }

// 页面切换动画 - 向右划出 + 从右侧划入
// Out Sine缓动函数: cubic-bezier(0.61, 1, 0.88, 1)
.page-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.page-slide-enter-active {
  transition: all 1s cubic-bezier(0.61, 1, 0.88, 1);
}
.page-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.page-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.page-slide-leave-active {
  transition: all 1s cubic-bezier(0.61, 1, 0.88, 1);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.com {
  /* 确保动画效果正确显示，两个页面能够重叠 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}
</style>
