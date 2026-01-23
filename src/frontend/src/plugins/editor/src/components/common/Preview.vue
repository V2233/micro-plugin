<template>
  <el-dialog draggable fullscreen>
    <div class="es-preview-tools">
      <el-button type="primary" @click="handleExport('png')">PNG</el-button>
      <el-button type="primary" @click="handleExport('jpg')">JPG</el-button>
      <el-button type="primary" @click="handleExport('pdf')">PDF</el-button>
      <el-button type="primary" @click="handleExport('html')">HTML</el-button>
      <el-button type="primary" @click="handleSaveHtml">保存到插件</el-button>
    </div>
    <div
      class="es-preview-body"
      :style="{ width: editorStyle.width, height: editorStyle.height, border: '1px dashed gray' }"
    >
      <div ref="editorRef" class="es-editor preview" :style="editorStyle">
        <template v-for="item in store.data.elements">
          <component
            :is="item.component!"
            v-bind="item.props"
            :style="{
              ...pickStyle(item.style, false),
              width: item.width + 'px',
              height: item.height + 'px',
              position: 'absolute',
              left: item.left + 'px',
              top: item.top + 'px',
            }"
          >
            <TextEditor v-if="item.text" :text="item.text" :style="pickStyle(item.style)" />
          </component>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import TextEditor from '../editor/TextEditor.vue';
import { computed, ref, onBeforeUnmount } from 'vue';
import html2canvas from 'html2canvas';
import JsPdf from 'jspdf';
import { dayjs } from 'element-plus';
import { pickStyle } from '../../utils';
import { useEditorStore } from '../../store';
import { emitter } from '@/utils/eventBus';

const store = useEditorStore();
const editorRef = ref<HTMLElement>();
const editorStyle = computed(() => {
  const { width, height } = store.data.container.style;
  return {
    ...store.data.container.style,
    width: width + 'px',
    height: height + 'px',
    transform: `scale(${scaleRatio.value})`,
    transformOrigin: 'top left',
  };
});
const scaleRatio = computed(() => store.data.container?.scaleRatio || 1);

const handleSaveHtml = () => {
  const { width } = store.data.container.style;
  emitter.emit('sendEditorHtml', {
    data: `<body style="width: ${width}px;">${editorRef.value?.outerHTML}</body>`,
  });
  store.preview = false;
};

function handleExport(type: 'png' | 'jpg' | 'pdf' | 'html') {
  const { width, height } = store.data.container.style;
  // 生成文件名称
  const filename = dayjs().format('YYYY-MM-DD-HH-mm-ss') + '.' + type;

  if (type === 'html') {
    // 创建一个 Blob 对象，内容是 HTML
    const blob = new Blob(
      [
        `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8" /><meta http-equiv="content-type" content="text/html;charset=utf-8" /></head><body style="width: ${width}px;">${editorRef.value?.outerHTML}</body></html>`,
      ],
      { type: 'text/html' }
    );

    // 创建a标签
    const link = document.createElement('a');
    link.download = filename;
    // 创建临时url
    const href = URL.createObjectURL(blob);
    link.href = href;
    // 调用click
    document.body.appendChild(link); // 确保链接在DOM中，以便可以触发点击
    link.click();
    // 销毁
    URL.revokeObjectURL(href);
    document.body.removeChild(link); // 清理DOM
    return;
  }

  html2canvas(editorRef.value!).then(canvas => {
    if (type === 'pdf') {
      const doc = new JsPdf('l', 'pt', 'a4');
      const imageData = canvas.toDataURL();
      doc.addImage(imageData, 'PNG', 0, 0, +width!, +height!);
      return doc.save(filename);
    }
    canvas.toBlob(blob => {
      // 创建a标签
      const link = document.createElement('a');
      link.download = filename;
      // 创建临时url
      const href = URL.createObjectURL(blob!);
      link.href = href;
      // 调用click
      link.click();
      // 销毁
      URL.revokeObjectURL(href);
    });
  });
}

onBeforeUnmount(() => {
  emitter.off('getEditorHtml');
});
</script>

<style lang="scss" scoped>
.es-editor {
  &.preview {
    position: relative;

    .es-drager.disabled {
      opacity: 1;
    }
  }
}

.es-preview-body {
  margin: 0 auto;
  border: var(--es-border);
}

.es-preview-tools {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
