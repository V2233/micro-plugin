<template>
  <DashboardCard title="GPU占用">
    <template #content>
      <div class="chart_box">
        <div class="charts">
          <div class="chart" ref="charts" @click="updateGpuInfo"></div>
        </div>
      </div>
    </template>
    <template #desc>
      <div style="color: white; font-size: 16px; margin-bottom: 5px">
        {{ gpuData?.info.model }}
      </div>
      <div style="color: white; font-size: 16px">
        {{
          gpuData?.info.used +
          ' / ' +
          gpuData?.info.total +
          'GB     ' +
          gpuData?.info.temperatureGpu
        }}
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';

import { ref, onMounted, watch } from 'vue';

const props = defineProps(['gpuData']);

let charts = ref();

// 初始化echart
let myCharts = ref();

watch(props, () => {
  updateGpuInfo();
});

onMounted(() => {
  myCharts.value = echarts.init(charts.value);
  updateGpuInfo();
});

const per2radix = () => {
  return Number(props.gpuData?.inner ? props.gpuData.inner : 0.5);
};

const getColor = (curValue: number) => {
  if (curValue <= 0.6) {
    return 'rgba(0,55,160,0.6)';
  } else if (curValue < 0.8) {
    return 'orange';
  } else {
    return 'red';
  }
};

const updateGpuInfo = () => {
  const curValue = per2radix() || 0;
  const info = props.gpuData?.info || {};
  myCharts.value.setOption({
    // title: {
    //     subtext: info.temperatureGpu,
    //     subtextStyle: {
    //         color: 'white',
    //         lineHeight: 30,
    //         fontSize: 20
    //     },
    // },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      data: [curValue, curValue + 0.02],
      itemStyle: {
        color: getColor(curValue),
      },
      waveAnimation: true,
      animationDuration: 3,
      animationDurationUpdate: 0,
      radius: '80%',
      outline: {
        //外层边框颜色设置
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'skyblue',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });
};
</script>

<style scoped lang="scss">
.chart_box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .charts {
    // 此处更改图表大小
    height: 220px;
    width: 100%;
    // border: 2px solid red;
    .chart {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
