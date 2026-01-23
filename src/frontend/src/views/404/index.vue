<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" />
    <div class="btn">
      <el-button type="primary" size="large" @click="goHome"> 回首页吧~ </el-button>
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
.box {
  width: 100vw;
  height: 100vh;
  background: skyblue;
  display: flex;
  justify-content: center;
  img {
    width: 400px;
    height: 400px;
  }
  .btn {
    width: 150px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
