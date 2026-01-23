<template>
  <div class="top-right">
    <div class="right">
      <span class="rbtn" @click="$emit('fullScreen', '')">全屏</span>
      <span class="time">当前时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { ref, onMounted, onBeforeUnmount } from 'vue';

let time = ref(moment().format('YYYY-MM-DD/hh:mm:ss'));
let timeId = ref<any>();

const $emit = defineEmits(['fullScreen']);

onMounted(() => {
  timeId.value = setInterval(() => {
    time.value = moment().format('YYYY-MM-DD/hh:mm:ss');
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeId.value);
});
</script>

<style scoped lang="scss">
.top-right {
  width: 100%;
  height: 40px;
  display: flex;

  .right {
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 150px;
      height: 40px;
      float: left;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
    }

    .rbtn:hover {
      cursor: pointer;
    }

    .time {
      color: #29fcff;
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
</style>
