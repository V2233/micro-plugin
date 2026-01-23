<template>
  <DashboardCard title="面板设置">
    <template #content>
      <div class="setting-box">
        <div class="settings">
          <div class="slider-demo-block">
            <span class="demonstration">自动滚动</span>
            <el-switch
              v-model="screenStore.settings.isAutoScroll"
              class="mb-2"
              size="small"
              style="--el-switch-on-color: cyan"
            />
          </div>

          <div class="slider-demo-block">
            <div>
              <span class="demonstration">自动刷新</span>
              <el-input-number
                v-model="screenStore.settings.updateInterval"
                :min="0.5"
                :max="120"
                size="small"
                style="margin-left: 35px"
                @change="changeUpdateInterval"
              />
              <span style="margin-left: 10px; font-size: 14px">s / interval</span>
            </div>
            <el-switch
              v-model="screenStore.settings.isAutoUpdated"
              class="mb-2"
              size="small"
              style="--el-switch-on-color: cyan"
              @change="$emit('updateState', $event)"
            />
          </div>

          <div class="slider-demo-block">
            <span class="demonstration">字体大小</span>
            <el-slider v-model="screenStore.settings.fontSize" :min="12" :max="50" />
          </div>

          <div class="slider-demo-block">
            <span class="demonstration">图片宽度</span>
            <el-slider v-model="screenStore.settings.imageWidth" :min="50" :max="940" />
          </div>

          <div class="slider-demo-block">
            <span class="demonstration">流量单位</span>
            <el-slider v-model="screenStore.settings.qpsInterval" :min="1" :max="60" />
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue';
import useScreenstore from '@/store/modules/screen';
import { onMounted } from 'vue';

const screenStore = useScreenstore();
const $emit = defineEmits(['updateState']);

const changeUpdateInterval = (interval: number) => {
  if (screenStore.settings.isAutoUpdated) {
    $emit('updateState', true);
  }
};

//组件挂载完毕
onMounted(() => {});
</script>

<style scoped lang="scss">
.setting-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .settings {
    height: 90%;
    width: 80%;
    font-size: 20px;
    color: white;
  }
}

.slider-demo-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  line-height: 34px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>
