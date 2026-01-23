<script setup lang="ts"></script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@media (orientation: portrait) {
  .el-dialog {
    width: 90% !important;
  }

  .el-card {
    .el-card__body {
      padding: 10px;
    }
  }

  .el-menu--collapse {
    --el-menu-base-level-padding: 10px;
  }
}
.layout_main {
  padding: 0 !important;
}
</style>
