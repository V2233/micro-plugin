<template>
  <DashboardCard title="堆和栈">
    <template #content>
      <div class="chart_box">
        <div class="charts">
          <div class="charts" ref="charts"></div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue';

import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';

const props = defineProps(['nodeData']);

let charts = ref();

watch(props, () => {
  updateChart();
});

onMounted(() => {
  charts.value = echarts.init(charts.value);
  updateChart();
});

const updateChart = () => {
  const node = props.nodeData || {
    inner: 0,
    title: 'Node',
    info: {
      rss: '0 MB',
      heapTotal: '0 MB',
      heapUsed: '0 MB',
      occupy: 0,
    },
  };
  //设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: 30,
      top: 40,
      orient: 'vertical', //图例组件方向的设置
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Node(MB)',
        type: 'pie',
        // radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },

        labelLine: {
          show: false,
        },
        data: [
          {
            value: Number(node.info.heapUsed.replace(/[A-Z]+/, '')),
            name: '栈',
          },
          {
            value: Number(node.info.heapTotal.replace(/[A-Z]+/, '')),
            name: '堆',
          },
        ],
      },
    ],
    //调整图形图标的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  };
  charts.value.setOption(option);
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
    height: 220px;
    width: 100%;
  }
}
</style>
