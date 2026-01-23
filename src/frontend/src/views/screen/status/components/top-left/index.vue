<template>
  <div class="top-left">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter();

const goHome = () => {
  $router.push('/home');
};
</script>

<style scoped lang="scss">
.top-left {
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    .lbtn {
      width: 100px;
      height: 40px;
      float: right;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
    }
    .lbtn:hover {
      cursor: pointer;
    }
  }
}
</style>
