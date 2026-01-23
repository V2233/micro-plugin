<template>
  <div class="es-layout-container">
    <Aside @dragstart="handleAsideDragstart" @dragend="handleAsideDragend" />
    <div ref="mainRef" class="es-layout-main" :style="`border: 10px solid ${mainBorderColor};`">
      <div class="es-editor-container" :style="editorContainerStyle">
        <Editor
          v-model="store.data"
          :commands="commands"
          @dragenter="dragenter"
          @drop="drop"
          @dragover.prevent
        />
      </div>
    </div>
    <Info v-model="store.current" />
  </div>
  <Preview v-model="store.preview" />
</template>

<script setup lang="ts">
import { emitter } from '@/utils/eventBus';
import {
  Back,
  Download,
  Picture,
  RefreshLeft,
  RefreshRight,
  Upload,
  View,
} from '@element-plus/icons-vue';
import { computed, onMounted, ref, watch, type CSSProperties, type PropType } from 'vue';
import { $dialog, $upload } from '../../components/common';
import Preview from '../../components/common/Preview.vue';
import Editor from '../../components/editor/index.vue';
import { useCommand } from '../../hooks/useCommand';
import { useEditorStore } from '../../store';
import type { ComponentType, EditorDataType, ToolType } from '../../types';
import { useId } from '../../utils/common';
import { events } from '../../utils/events';
import Aside from './Aside.vue';
import Info from './info/Info.vue';

const props = defineProps({
  data: {
    type: Object as PropType<EditorDataType>,
    required: true,
  },
  theme: {
    type: String as PropType<'light' | 'dark'>,
  },
});

const store = useEditorStore();

const mainBorderColor = ref('transparent');
const mainRef = ref<HTMLElement>();
const { commands } = useCommand(store);
const tools: ToolType[] = [
  {
    label: '返回',
    icon: Back,
    handler: () => {
      emitter.emit('goBack', true);
    },
  },
  { label: '撤销', icon: RefreshLeft, handler: commands.undo },
  { label: '重做', icon: RefreshRight, handler: commands.redo },
  {
    label: '导出',
    icon: Download,
    handler: () => {
      $dialog({
        title: '导出',
        content: JSON.stringify(store.data),
        confirm(text: string) {
          commands.updateContainer(JSON.parse(text));
        },
      });
    },
  },
  {
    label: '导入',
    icon: Upload,
    handler: () => {
      $upload({
        resultType: 'json',
        onChange(text: string) {
          commands.updateContainer(JSON.parse(text));
        },
      });
    },
  },
  {
    label: '插入图片',
    icon: Picture,
    handler: () => {
      $upload({
        resultType: 'image',
        onChange(e: string) {
          const defaultWidth = 200;
          const newElement: ComponentType = {
            id: useId(),
            component: 'img',
            props: {
              src: e,
              width: defaultWidth,
              onLoadOnce(e: Event) {
                // 避免多次执行
                if (newElement.props.loaded) return;
                // 图片加载完毕，得到原始宽高
                const { naturalHeight, naturalWidth } = e.target as any;
                const cur = store.data.elements.find(item => item.id === newElement.id)!;
                // 上传图片最大宽度设置
                let rate = defaultWidth / naturalWidth;
                if (rate > 1) rate = 1;
                cur.width = naturalWidth * rate;
                cur.height = naturalHeight * rate;
                newElement.props.loaded = true;
              },
            },
          };

          store.data.elements.push(newElement);
        },
      });
    },
  },
  { label: '保存', icon: View, handler: () => (store.preview = true) },
];

const editorContainerStyle = computed(() => {
  const { width, height } = store.data.container.style;
  const style: CSSProperties = {};
  const x = store.initWidth > +width!,
    y = store.initHeight > +height!;
  if (x) {
    style.position = 'absolute';
    style.left = '50%';
    style.transform = 'translateX(-50%)';
  }
  if (y) {
    style.position = 'absolute';
    style.top = '50%';
    style.transform = 'translateY(-50%)';
  }
  if (x && y) {
    style.transform = 'translate(-50%, -50%)';
  }
  return style;
});

const mainRect = computed(() => {
  return mainRef.value?.getBoundingClientRect() || ({} as DOMRect);
});

let currentComponent: ComponentType | null = null;

function handleAsideDragstart(component: ComponentType) {
  events.emit('dragstart');
  currentComponent = component;
}
function handleAsideDragend() {
  events.emit('dragend');
}
function dragenter(e: DragEvent) {
  e.dataTransfer!.dropEffect = 'move';
}

function drop(e: DragEvent) {
  if (!currentComponent) return;
  const isIcon = currentComponent.component === 'es-icon';
  const elements = [
    ...store.data.elements,
    {
      ...currentComponent,
      equalProportion: isIcon,
      left: e.offsetX - currentComponent.width! / 2,
      top: e.offsetY - currentComponent.height! / 2,
      id: useId(),
      style: currentComponent.style || {},
    },
  ];
  store.data.elements = elements;
  currentComponent = null;
}

function init() {
  store.initWidth = Math.floor(mainRect.value.width);
  store.initHeight = Math.floor(mainRect.value.height - 7);
  store.data.container.style.width = store.initWidth;
  store.data.container.style.height = store.initHeight;
}
function getData() {
  return { ...store.data };
}

watch(
  () => props.data,
  () => {
    store.update(props.data);
  },
  { immediate: true }
);

watch(
  () => props.theme,
  newTheme => {
    if (newTheme) {
      store.theme = newTheme;
    }
    if (newTheme === 'dark') {
      mainBorderColor.value = 'transparent';
    } else {
      mainBorderColor.value = '#EFF2F5';
    }
  },
  { immediate: true }
);

onMounted(() => {
  init();
});

defineExpose({
  tools,
  getData,
});
</script>

<style lang="scss">
.es-layout-container {
  display: flex;
  height: calc(100% - var(--es-header-height));
}
.es-layout-main {
  flex: 1;
  position: relative;
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 6px;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #868484;
    }
  }
  .es-editor-container {
    box-shadow: var(--el-box-shadow);
    background-color: var(--es-color-bg);
  }
}
</style>
