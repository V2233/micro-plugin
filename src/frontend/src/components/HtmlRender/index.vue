<template>
  <el-card style="margin: 10px 0">
    <div class="handle_bar">
      <el-form label-width="auto">
        <el-form-item label="可选设置">
          <el-checkbox
            v-model="options.resizable"
            @change="handCheckboxChange($event, 'resizable')"
          >
            是否可缩放
          </el-checkbox>
          <el-checkbox
            v-model="options.rotatable"
            @change="handCheckboxChange($event, 'rotatable')"
          >
            是否可旋转
          </el-checkbox>
          <el-checkbox v-model="options.boundary" @change="handCheckboxChange($event, 'boundary')">
            是否判断边界
          </el-checkbox>
          <el-checkbox v-model="options.disabled" @change="handCheckboxChange($event, 'disabled')">
            是否禁用
          </el-checkbox>
          <el-checkbox v-model="options.selected" @change="handCheckboxChange($event, 'selected')">
            是否可选中
          </el-checkbox>
          <el-checkbox
            v-model="options.checkCollision"
            @change="handCheckboxChange($event, 'checkCollision')"
          >
            是否开启碰撞检测
          </el-checkbox>
          <el-checkbox
            v-model="options.snapToGrid"
            @change="handCheckboxChange($event, 'snapToGrid')"
          >
            是否开启网格
          </el-checkbox>
          <el-checkbox v-model="options.snap" @change="handCheckboxChange($event, 'snap')">
            是否开启网格吸附
          </el-checkbox>
          <el-checkbox v-model="options.markline" @change="handCheckboxChange($event, 'markline')">
            是否开启辅助线
          </el-checkbox>
          <el-checkbox
            v-model="options.disabledKeyEvent"
            @change="handCheckboxChange($event, 'disabledKeyEvent')"
          >
            是否禁用方向键移动
          </el-checkbox>
          <el-checkbox v-model="options.border" @change="handCheckboxChange($event, 'border')">
            是否显示边框
          </el-checkbox>
          <el-checkbox
            v-model="options.equalProportion"
            @change="handCheckboxChange($event, 'equalProportion')"
          >
            是否宽高等比缩放
          </el-checkbox>
        </el-form-item>
      </el-form>
    </div>

    <div class="render_box" ref="html_box" :style="{ height: renderBoxHeight + 'px' }">
      <Drager v-bind="options">
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
  color: '#3a7afe',
  minWith: 20,
  minHeight: 20,
  maxWith: 400,
  maxHeight: 400,
  gridX: 50,
  gridY: 50,
  snapThreshold: 10,
  scaleRatio: 1,
  aspectRatio: 1,
  resizable: true,
  rotatable: true,
  boundary: false,
  disabled: false,
  selected: false,
  checkCollision: false,
  snapToGrid: true,
  snap: false,
  markline: false,
  disabledKeyEvent: false,
  border: true,
  equalProportion: false,
});

const renderBoxHeight = ref<number>(500);

// 控制checkbox开关
const handCheckboxChange = (e: boolean, prop: string) => {};
</script>

<style scoped lang="scss">
.render_box {
  position: relative;
  border: 2px solid blue;
  width: 100%;
  overflow: 'hidden';
}
</style>
