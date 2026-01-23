<template>
  <div class="fakeqq-message__quote">
    <div class="fakeqq-message__quote-name">
      {{ name }}{{ time ? '&nbsp;' + time : ''
      }}<el-icon style="margin-left: 5px"><Upload /></el-icon>
    </div>
    <div class="fakeqq-message__quote-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: { type: String, required: true },
  time: {
    type: String,
    default: '',
  },
});
</script>
