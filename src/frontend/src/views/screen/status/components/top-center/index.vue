<template>
  <div class="top-center">
    <div class="center">
      <div class="title">实时状态</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.top-center {
  width: 100%;
  height: 40px;
  display: flex;
  .center {
    flex: 1;
    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100%;
      font-size: 30px;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
    }
  }
}
</style>
