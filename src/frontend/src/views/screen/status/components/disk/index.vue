<template>
  <DashboardCard title="磁盘占用">
    <template #content>
      <div class="charts_box">
        <div class="progress_box" v-for="(item, index) in computedDiskSize">
          <span>{{ item.fs }}</span>
          <el-progress
            :key="index"
            :text-inside="true"
            :percentage="item.percentage * 100"
            :stroke-width="20"
            :color="item.barColor"
            :striped="true"
            :striped-flow="true"
            :format="() => item.used.replace(/[A-Z]+/, '') + '/ ' + item.size"
            :duration="5"
            @click="updateDiskSize"
          />
          <span>{{ item.percentage * 100 + '%' }}</span>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue';

import * as echarts from 'echarts';
import { ref, onMounted, computed, watch } from 'vue';
let charts = ref();

const props = defineProps(['diskSize', 'swapData']);

const getStatus = (curValue: number) => {
  if (curValue <= 0.6) {
    return '#409EFF';
  } else if (curValue < 0.8) {
    return '#E6A23C';
  } else {
    return '#F56C6c';
  }
};

const computedDiskSize = computed(() => {
  let tempDiskSize = props.diskSize
    ? props.diskSize
    : [
        {
          fs: '/',
          type: '',
          size: '0 GB',
          used: '114514 GB',
          available: 0,
          use: 0,
          mount: '/',
          rw: true,
          percentage: 0,
        },
      ];

  let swap = props.swapData;
  if (swap) {
    tempDiskSize.push({
      fs: swap.title + ':',
      type: '',
      size: swap.info[1],
      available: 0,
      used: swap.info[0],
      mount: swap.title,
      percentage: Number(swap.inner.replace('%', '')) / 100,
    });
  }

  return tempDiskSize.map((item: any) => {
    item.barColor = getStatus(item.percentage);
    return item;
  });
});

onMounted(() => {
  // console.log(props.diskSize)
});

const updateDiskSize = () => {
  console.log(props.diskSize);
};
</script>

<style scoped lang="scss">
.charts_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;

  .progress_box {
    width: 80%;
    display: flex;
    align-items: center;
    margin-top: 20px;
    color: white;
    // border: 2px solid red;
    .el-progress--line {
      max-width: 100%;
      width: 100%;
      margin: 0 10px;
    }
  }
}
</style>
