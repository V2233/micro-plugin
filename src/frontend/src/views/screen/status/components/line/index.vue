<template>
  <DashboardCard
    :title="`消息流量(qps:条/${
      screenStore.settings.qpsInterval == 1 ? '' : screenStore.settings.qpsInterval
    }秒)`"
  >
    <template #content>
      <div class="chart_box">
        <div class="charts">
          <div class="chart" ref="charts"></div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import DashboardCard from '@/components/dashboard/index.vue';
import useScreenStore from '@/store/modules/screen';
let screenStore = useScreenStore();

let charts = ref();

watch(
  () => screenStore.msgQps,
  newQueue => {
    updateMsgQpsInfo();
  },
  { deep: true }
);

onMounted(() => {
  charts.value = echarts.init(charts.value);
  updateMsgQpsInfo();
});

const updateMsgQpsInfo = () => {
  //设置配置项
  charts.value.setOption({
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      //分割线不要
      splitLine: {
        show: false,
      },
      data: screenStore.msgQps.map(item => item.time),
      //轴线的设置
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      //轴线的设置
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
    },
    grid: {
      left: 40,
      top: 0,
      right: 20,
      bottom: 20,
    },
    //系列
    series: [
      {
        type: 'line',
        data: screenStore.msgQps.map(item => item.qps),
        //平滑曲线的设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'skyblue', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
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
    height: 160px;
    width: 100%;
    // border: 2px solid red;
    .chart {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
