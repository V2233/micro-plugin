<template>
  <DashboardCard title="其它信息">
    <template #content>
      <div class="data_box">
        <div class="info_box">
          <div class="info" v-for="(item, index) in otherData" :key="index">
            <span class="title">{{ item.first }}</span>
            ：
            <span v-if="item.first != '环境版本'" class="detail">
              {{ item.tail }}
            </span>
            <span v-else class="detail">
              <span>node:{{ item.tail.node }} & git:{{ item.tail.git }}</span>
              <!-- <p>v8:{{ item.tail.v8 }}</p> -->
            </span>
          </div>

          <div class="info" v-for="(item, index) in networkData" :key="index">
            <span class="title">网络状态</span>
            ：
            <span class="detail">
              <span> {{ item.iface }} 进：{{ item.rx_bytes }}/ 出：{{ item.tx_bytes }} </span>
            </span>
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue';

defineProps(['otherData', 'networkData']);
</script>

<style scoped lang="scss">
.data_box {
  position: relative;
  height: 100%;
  font-size: 24px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  .info_box {
    // border: 2px solid red;
    position: relative;
    // background: url(../../images/contrast-bg.png) no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    // opacity: 0.3;
    padding: 20px;
    .info {
      margin-bottom: 10px;
      .title {
        font-size: 20px;
      }
      .detail {
        font-size: 18px;
        p {
          margin-top: 10px;
          margin-left: 110px;
        }
      }
    }
  }
}
</style>
