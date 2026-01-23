<template>
  <div class="es-layout" @click.stop>
    <div class="es-header-toolbar">
      <div v-for="item in tools" class="es-tool-btn" @click="handleToolClick(item)">
        <el-button :icon="item.icon">{{ item.label }}</el-button>
      </div>
    </div>
    <ESEditor ref="editorRef" :data="data" :theme="layoutSettingStore.theme" />
  </div>
  <CodeDialog ref="codeRef" />
</template>

<script setup lang="ts">
import CodeDialog from '@/components/CodeDialog/index.vue';
import { type EditorDataType, ESEditor, type ToolType } from '@/plugins/editor';
import useDevStore from '@/store/modules/dev';
import useLayoutSettingStore from '@/store/modules/setting';
import { emitter } from '@/utils/eventBus';
import { getMD5Hash } from '@/utils/hash';
import { ElMessage } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const devStore = useDevStore();

const layoutSettingStore = useLayoutSettingStore();

const editedHtml = ref('');

const codeRef = ref();

const $emit = defineEmits(['outerHTML', 'mounted']);

// editorRef.value?.getData() // 获取最新数据
const editorRef = ref<InstanceType<typeof ESEditor> | null>(null);

// 初始数据
const data = ref<EditorDataType>({
  container: {
    markline: {
      show: true,
      color: '',
    },
    snapToGrid: true,
    snap: true,
    gridSize: 10,
    gridColor: '',
    style: {},
    scaleRatio: 1,
  },
  elements: [],
});

const tools = computed(() => (editorRef.value as any)?.tools || []);

/**
 * 处理工具按钮点击实际
 * @returns
 */
function handleToolClick(item: ToolType) {
  if (typeof item.handler === 'function') {
    item.handler();
  }
}

/**
 * 获取编辑器的HTML
 * @returns
 */
// const getEditorHtml = () => {
//   emitter.emit('getEditorHtml', { data: 'get' })
// }

/**
 * 返回插件编辑页
 * @returns
 */
const goBack = () => {
  devStore.scene = 1;
};

/**
 * 保存图片
 * @returns
 */
const saveImage = async () => {
  const md5 = await getMD5Hash(editedHtml.value);
  $emit('outerHTML', {
    hash: md5,
    data: editedHtml.value,
    json: JSON.stringify(editorRef.value?.getData()),
  });
  ElMessage.success('保存成功！');
  devStore.scene = 1;
};

/**
 * 保存HTML
 * @returns
 */
//  const saveHTML = async () => {
//   getEditorHtml()
//   codeRef.value.open({
//     content: editedHtml.value
//   },'html')
// }

onMounted(() => {
  $emit('mounted', 'Please set project json!');
  emitter.on('sendEditorHtml', (e: any) => {
    editedHtml.value = e.data;
    saveImage();
  });
  emitter.on('goBack', (e: any) => {
    goBack();
  });
});

onBeforeUnmount(() => {
  emitter.off('sendEditorHtml');
  emitter.off('goBack');
});
</script>

<style lang="scss">
@use './vars.scss' as *;

.es-layout {
  width: 100%;
  height: 100%;
  color: var(--es-color);
  background-color: var(--es-color-bg);
  transition: background-color 0.2s;

  // min-width: 1118px;
  .es-header-toolbar {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    .es-tool-btn + .es-tool-btn {
      margin-left: 10px;
    }
  }
}
</style>
