<template>
  <div class="handle_bar">
    <el-popover placement="bottom" title="编辑器设置" :width="300" trigger="hover">
      <!-- 编辑器设置 -->
      <el-form>
        <el-form-item label="编辑器最小高度(行)">
          <el-slider
            v-model="minEditorHeight"
            size="large"
            :min="1"
            :max="maxEditorHeight"
            @input="changeMinEditorHeight"
          />
        </el-form-item>
        <el-form-item label="编辑器最大高度(行)">
          <el-slider
            v-model="maxEditorHeight"
            size="large"
            :min="20"
            :max="100"
            @input="changeMaxEditorHeight"
          />
        </el-form-item>
        <el-form-item label="字体大小">
          <el-slider
            v-model="editorFontSize"
            size="large"
            :min="12"
            :max="30"
            @input="changeEditorFontSize"
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button icon="Setting" circle size="small"></el-button>
      </template>
    </el-popover>

    <el-select
      v-model="curLang"
      placeholder="Language"
      style="width: 100px; margin: 0 5px"
      size="small"
    >
      <el-option
        v-for="(item, index) in registedLangs"
        :key="index"
        :label="item.lang"
        :value="item.lang"
      />
    </el-select>

    <el-select
      size="small"
      v-model="curTheme"
      placeholder="Theme"
      style="width: 120px; margin: 0 5px"
    >
      <el-option v-for="(item, index) in themeList" :key="index" :label="item" :value="item" />
    </el-select>

    <el-button class="setBtn" @click="saveCode" size="small">保存</el-button>
  </div>
  <v-ace-editor
    :value="code"
    :lang="curLang"
    :theme="curTheme"
    :options="options"
    :readonly="false"
    class="vue-ace-editor"
    @init="editorInit"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';

import { VAceEditor } from 'vue3-ace-editor';
import '@/utils/aceConfig.js';
import type { Ace } from 'ace-builds';

import { registedLangs } from '@/utils/aceConfig';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  ext: {
    type: String,
    default: 'js',
  },
  isImmediate: {
    type: Boolean,
    default: false,
  },
});

const editor = ref<any>();
const $emits = defineEmits(['getCode']);

const curLang = ref<string>('javascript');
const maxEditorHeight = ref<number>(30);
const minEditorHeight = ref<number>(1);
const editorFontSize = ref<number>(14);

const curTheme = ref<string>('one_dark');
const themeList = ref<string[]>(['one_dark', 'monokai', 'github', 'solarized_dark']);

watch(
  () => props.ext,
  (newExt, oldExt) => {
    let langObj = registedLangs.find(item => item.ext == newExt);
    if (langObj) {
      curLang.value = langObj.lang;
    }
  },
  { immediate: props.isImmediate }
);

/**
 * 设置编辑器配置
 * @returns
 */
const options: Partial<Ace.EditorOptions> = reactive({
  useWorker: true, // 启用语法检查,必须为true
  enableBasicAutocompletion: true, // 自动补全
  enableLiveAutocompletion: true, // 智能补全
  enableSnippets: true, // 启用代码段
  showPrintMargin: false, // 去掉灰色的线，printMarginColumn
  highlightActiveLine: true, // 高亮行
  highlightSelectedWord: true, // 高亮选中的字符
  tabSize: 4, // tab锁进字符
  fontSize: 14, // 设置字号
  wrap: true, // 是否换行
  // readonly: false, // 是否可编辑
  showGutter: true,
  minLines: 10, // 最小行数，minLines和maxLines同时设置之后，可以不用给editor再设置高度
  maxLines: 30, // 最大行数
});

/**
 * 滑动选择器事件：改变编辑器高度
 * @params height 单位：行
 * @returns
 */
const changeMaxEditorHeight = (height: number) => {
  // console.log(height)
  editor.value.setOption('maxLines', Math.round(height));
};

/**
 * 滑动选择器事件：改变编辑器高度
 * @params height 单位：行
 * @returns
 */
const changeMinEditorHeight = (height: number) => {
  // console.log(height)
  // if (height >= maxEditorHeight.value) {
  //   height = maxEditorHeight.value - 1
  // }
  editor.value.setOption('minLines', Math.round(height));
};

/**
 * 滑动选择器事件：改变编辑器字体大小
 * @params size 单位：px
 * @returns
 */
const changeEditorFontSize = (size: number) => {
  editor.value.setOption('fontSize', Math.round(size));
};

/**
 * 保存editor实例
 * @params instance
 * @returns
 */
const editorInit = (instance: any) => {
  editor.value = instance;
};

/**
 * 通知父组件保存code
 * @returns
 */
const saveCode = () => {
  $emits('getCode', editor.value?.getValue());
};
</script>

<style scoped lang="scss">
.handle_bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;

  .setBtn {
    margin-right: 10px;
  }
}

.vue-ace-editor {
  width: 100%;
  font-size: 16px;
}
</style>
