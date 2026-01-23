<template>
  <div
    ref="textRef"
    :class="['es-text', { editable }]"
    :contenteditable="editable"
    style="display: flex; width: 100%; height: 100%; word-break: break-all"
    @blur="getText"
  >
    <slot>{{ text }}</slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEditorStore } from '../../store';
const store = useEditorStore();

const props = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
  },
  id: {
    type: Number,
    default: 0,
  },
});

const textRef = ref();

function selectText() {
  if (!textRef.value) return;

  const range = document.createRange();
  range.selectNode(textRef.value);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
}

function getText(e: any) {
  store.data.elements[props.id]!.text = e.target.innerText;
}

watch(
  () => [props.editable],
  () => {
    if (props.editable) {
      selectText();
      store.data.elements[props.id]!.style!.display = 'flex';
    }
  }
);
</script>

<style lang="scss" scoped>
.es-text {
  width: calc(100% - 1px);
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  word-break: break-all;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  &.editable {
    z-index: 1;
    cursor: text;
  }
}
</style>
