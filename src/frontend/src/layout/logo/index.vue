<template>
  <div class="logo" v-if="setting.logoHidden == false">
    <!-- <img :src="setting.logo" v-if="layoutSettingStore.foldMode == 0?false:true"/> -->
    <p>{{ layoutSettingStore.foldMode == 2 ? setting.title : '' }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/settings';
import useLayoutSettingStore from '@/store/modules/setting';
let layoutSettingStore = useLayoutSettingStore();
</script>

<script lang="ts">
export default {
  name: 'Logo',
};
</script>

<style scoped lang="scss">
@use '@/style/variable.scss' as *;

.logo {
  width: 100%;
  height: $base-menu-logo-height;
  // color: white;
  display: flex;
  align-items: center;
  padding: 20px 5px;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 5px;
  }
}
</style>
