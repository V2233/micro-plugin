<template>
  <el-card style="margin: 10px 0; height: 500px">
    <div class="handle_bar">
      <el-button></el-button>
    </div>
    <div class="render_box" ref="html_box">
      <Drager :snapToGrid="true" :markline="true" :checkCollision="true">
        <div style="width: 100%; height: 100%; background-color: red"></div>
      </Drager>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import Drager from 'es-drager';
import 'es-drager/lib/style.css';
import { ref, reactive } from 'vue';
const options = reactive({
  width: 100,
  height: 100,
  left: 0,
  top: 0,
  angle: 0,
});
</script>

<style scoped lang="scss">
.render_box {
  position: relative;
}
</style>
