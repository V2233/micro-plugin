<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div
      class="layout_slider"
      :class="{
        fold: layoutSettingStore.foldMode == 1 ? true : false,
        hidden: layoutSettingStore.foldMode == 0 ? true : false,
      }"
    >
      <Logo></Logo>
      <!-- 展示菜单 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="layoutSettingStore.foldMode == 1 ? true : false"
          :default-active="$route.path"
          active-text-color="rgb(64, 158, 255)"
        >
          <Menu :menuList="useStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{
        fold: layoutSettingStore.foldMode == 1 ? true : false,
        hidden: layoutSettingStore.foldMode == 0 ? true : false,
      }"
    >
      <!-- 顶部导航 -->
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示 -->
    <div
      class="layout_main"
      :class="{
        fold: layoutSettingStore.foldMode == 1 ? true : false,
        hidden: layoutSettingStore.foldMode == 0 ? true : false,
      }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue';
import Main from './main/index.vue';
import Menu from './menu/index.vue';
import Tabbar from './tabbar/index.vue';

import useLayoutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
// import { computed } from 'vue'
// 获取路由对象
import { watch } from 'vue';
import { useRoute } from 'vue-router';
let $route = useRoute();

let useStore = useUserStore();

// 获取仓库配置

let layoutSettingStore = useLayoutSettingStore();
// console.log(useStore)
// let bgColor = computed(()=>{
//   console.log(document.documentElement.className)
//   return document.documentElement.className == 'dark'?'transparent':'rgb(159, 161, 155)'
// })
watch(
  () => layoutSettingStore.theme,
  (newTheme, oldTheme) => {
    if (!newTheme) return;
    let html = document.documentElement;
    if (newTheme == 'dark') {
      !html.classList.contains('dark') && html.classList.toggle('dark');
    } else {
      html.classList.contains('dark') && html.classList.toggle('dark');
    }
    newTheme !== oldTheme && localStorage.setItem('THEME', newTheme);
  },
  { immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'Layout',
};
</script>
<style scoped lang="scss">
@use '@/style/variable.scss' as *;

.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    // background: $base-menu-background;
    // color: rgb(2, 255, 15);

    transition: all 0.3s;

    border-radius: 0 $border-radius-medium $border-radius-medium 0;
    overflow: auto;
    box-shadow: $shadow-small;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: none;
    border: none;

    .scrollbar {
      width: 100%;
      height: calc(100vh - 3 * $base-logo-title-fontSize);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }

    &.hidden {
      width: 0;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    border-radius: 0 0 $border-radius-medium 0;
    box-shadow: $shadow-small;
    background: rgba(255, 255, 255, 0.5); /* 控件透明度50% */
    backdrop-filter: none !important;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }

    &.hidden {
      width: 100vw;
      left: 0;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    // background: rgb(159, 161, 155);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }

    &.hidden {
      width: 100vw;
      left: 0;
    }
  }
}

@media (orientation: portrait) {
  $base-menu-min-width: 40px;

  .layout_container {
    .layout_slider {
      width: $base-menu-width;

      &.fold {
        width: $base-menu-min-width;
      }
    }

    .layout_tabbar {
      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }

    .layout_main {
      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }
  }
}
</style>
