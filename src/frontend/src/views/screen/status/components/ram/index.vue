<template>
  <DashboardCard title="RAM占用">
    <template #content>
      <div class="chart_box">
        <div class="charts">
          <div class="chart" ref="charts" @click="updateChart"></div>
        </div>
      </div>
    </template>
    <template #desc>
      <div style="color: white; font-size: 20px; margin-bottom: 5px">
        {{ ramData?.info[0] }}
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';

import { ref, onMounted, watch } from 'vue';

const props = defineProps(['ramData']);

let people = ref('剩余114514人');

let charts = ref();

// 初始化echart
let myCharts = ref();

watch(props, () => {
  updateChart();
});

onMounted(() => {
  myCharts.value = echarts.init(charts.value);
  updateChart();
});

const per2radix = () => {
  return Number(props.ramData?.inner ? +props.ramData.inner.replace('%', '') / 100 : 0.5);
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

const updateChart = () => {
  const curValue = per2radix() || 0;
  const info = props.ramData?.info || [''];
  myCharts.value.setOption({
    title: {
      // text: `${info[0]} ${info[1]} \n${info[2]}`,
      textStyle: {
        color: 'white',
        lineHeight: 30,
      },
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      data: [curValue, curValue + 0.02],
      // backgroundStyle: 'red',
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
