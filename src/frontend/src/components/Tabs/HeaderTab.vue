<template>
  <div
    v-if="props.type == 'left'"
    :style="{
      position: 'relative',
      height: '100%',
      background: props.backgroundColor,
      borderTopRightRadius: `${props.topRadius}px`,
      borderTopLeftRadius: `${props.topRadius}px`,
      padding: props.padding,
      display: 'flex',
    }"
  >
    <div
      :style="{
        position: 'absolute',
        width: `${props.bottomRightRadius}px`,
        height: `${props.bottomRightRadius}px`,
        background: `radial-gradient(circle at ${
          props.bottomRightRadius
        }px 0px, transparent ${props.bottomRightRadius - 1}px, ${
          props.backgroundColor
        } ${props.bottomRightRadius}px)`,
        right: `-${props.bottomRightRadius - 1}px`,
        bottom: 0,
      }"
    ></div>
    <slot></slot>
  </div>
  <div
    v-else-if="props.type == 'right'"
    :style="{
      position: 'relative',
      height: '100%',
      background: props.backgroundColor,
      borderTopRightRadius: `${props.topRadius}px`,
      borderBottomLeftRadius: `${props.topRadius}px`,
      padding: props.padding,
      display: 'flex',
    }"
  >
    <div
      :style="{
        position: 'absolute',
        width: `${props.bottomRightRadius}px`,
        height: `${props.bottomRightRadius}px`,
        background: `radial-gradient(circle at 0px ${
          props.bottomRightRadius
        }px, transparent ${props.bottomRightRadius - 1}px, ${
          props.backgroundColor
        } ${props.bottomRightRadius}px)`,
        left: `-${props.bottomRightRadius - 1}px`,
        top: 0,
      }"
    ></div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';

const props = defineProps({
  type: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
  },
  topRadius: {
    type: Number,
    default: 10,
  },
  bottomRightRadius: {
    type: Number,
    default: 14,
  },
  padding: {
    type: String,
    default: '5px 10px',
  },
  backgroundColor: {
    type: String,
    default: undefined,
  },
});
</script>
