<template>
  <div
    class="light-source"
    :class="{ active: active }"
    :style="lightSourceStyle"
    @click="$emit('click', $event)"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const $emit = defineEmits(['click']);

const props = defineProps({
  left: {
    type: String,
    default: '0',
  },
  top: {
    type: String,
    default: '0',
  },
  right: {
    type: String,
    default: '0',
  },
  bottom: {
    type: String,
    default: '0',
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const lightSourceStyle = computed<any>(() => {
  // const tlr = props.left === 'unset' && props.top === 'unset' ? '30px' : '0'
  // const trr = props.right === 'unset' && props.top === 'unset' ? '30px' : '0'
  // const brr = props.right === 'unset' && props.bottom === 'unset' ? '30px' : '0'
  // const blr = props.left === 'unset' && props.bottom === 'unset' ? '30px' : '0'
  return {
    position: 'absolute',
    left: props.left,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    height: '20px',
    width: '20px',
    cursor: 'pointer',
    border: '2px solid black',
    'border-bottom-right-radius':
      props.right === 'unset' && props.bottom === 'unset' ? '20px' : 'unset',
    'border-bottom-left-radius':
      props.left === 'unset' && props.bottom === 'unset' ? '20px' : 'unset',
    'border-top-right-radius': props.right === 'unset' && props.top === 'unset' ? '20px' : 'unset',
    'border-top-left-radius': props.left === 'unset' && props.top === 'unset' ? '20px' : 'unset',
  };
});
</script>

<style scoped lang="scss">
.active {
  background: #ffff00;
}
</style>
