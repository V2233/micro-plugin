<template>
  <div
    class="cus_input"
    :contenteditable="true"
    ref="input"
    @input="exposeInnerText"
    :style="{
      width: width,
      lineHeight: lineHeight,
      border: '2px solid ' + color,
      fontSize: fontSize,
      minWidth: minWidth,
    }"
  ></div>

  <!-- 弹出多选框 -->
  <el-dialog v-model="dialogTableVisible" title="事件变量" width="360">
    <el-table :data="variableList" style="max-height: 400px; overflow-y: scroll">
      <el-table-column prop="prop"></el-table-column>
      <el-table-column prop="tip"></el-table-column>
      <el-table-column width="80">
        <template #="{ row, $index }">
          <el-button size="small" @click="add(row)">插入</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { varList, type variableType } from './varList';
import { addVariable } from './method';
import { nextTick } from 'vue';

const $emit = defineEmits(['innerText']);

const input = ref();

// 存储键盘符/的个数
let sepCount = 0;

// 变量列表
const variableList = ref<variableType[]>(varList);

// 变量弹窗是否显示
const dialogTableVisible = ref<boolean>(false);

//接受父组件传递过来的参数
const props = defineProps({
  // 字体大小
  fontSize: {
    type: String,
    default: '16px',
  },
  //默认边框颜色
  color: {
    type: String,
    default: 'rgba(220,223,230,0.5)',
  },
  //宽度
  width: {
    type: String,
    default: '100%',
  },
  minWidth: {
    type: String,
    default: '100px',
  },
  //行高度
  lineHeight: {
    type: String,
    default: '20px',
  },
  cusInputValue: {
    type: String,
    default: '',
  },
});

watch(
  () => props.cusInputValue,
  newValue => {
    // console.log(newValue)
    nextTick(() => {
      if (!newValue) {
        input.value.innerText = '';
      } else {
        input.value.innerText = newValue;
      }
    });
  },
  { immediate: true }
);

const exposeInnerText = () => {
  $emit('innerText', input.value.innerText);
  // 兼容软键盘
  const curSepCount = input.value.innerText.match(/\//g) || [];
  if (curSepCount.length == sepCount + 1) {
    dialogTableVisible.value = true;
  }
  sepCount = curSepCount.length;
};

const getText = () => {
  return input.value.innerText;
};

const setText = (value: string) => {
  input.value.innerText = value;
};

const add = (row: variableType) => {
  dialogTableVisible.value = false;
  addVariable(row);
};

defineExpose({ getText, setText });
</script>

<style lang="scss">
.variable-template-Text {
  color: #409eff;
  cursor: pointer;
}

// .variable-template-Text:hover {
//     display: inline-block;
// }
</style>

<style scoped lang="scss">
.cus_input {
  box-sizing: border-box;
  border-radius: 5px;
  display: block;
  padding: 4px 8px;
  position: relative;
  white-space: normal;
  // height: 30px;
  // text-align: center;
  max-width: 100%;
  align-items: center;
  word-wrap: break-all;

  .variable-select {
    color: #409eff;
  }
}

.cus_input:hover {
  border-color: #409eff;
}
</style>
