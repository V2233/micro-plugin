<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="layoutSettingStore.foldMode == 2 ? 'Expand' : 'Fold'" />
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="margin: 0px 2px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0px 2px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import {ref} from 'vue'
import { useRoute } from 'vue-router';
import useLayoutSettingStore from '@/store/modules/setting';

let $route = useRoute();

// 获取仓库配置
let layoutSettingStore = useLayoutSettingStore();
// 用于折叠图标切换
const changeIcon = () => {
  // layoutSettingStore.fold = !layoutSettingStore.fold
  // console.log(layoutSettingStore.foldMode)
  if (layoutSettingStore.foldMode >= 2) {
    layoutSettingStore.foldMode = 0;
    return;
  }
  layoutSettingStore.foldMode++;
};
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
};
</script>

<style scoped lang="scss"></style>
