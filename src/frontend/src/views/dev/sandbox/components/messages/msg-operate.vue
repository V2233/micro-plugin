<template>
  <el-popover
    placement="top-start"
    :width="230"
    trigger="contextmenu"
    v-model:visible="msgOperationVisible"
  >
    <div class="fakeqq-message-operations">
      <div class="fakeqq-message-operations-item" @click="clickOperation('copy')">
        <el-icon size="24"><CopyDocument /></el-icon>
        <div class="fakeqq-message-operations-item-title">复制</div>
      </div>
      <div class="fakeqq-message-operations-item" @click="clickOperation('forward')">
        <el-icon size="24"><Promotion /></el-icon>
        <div class="fakeqq-message-operations-item-title">转发</div>
      </div>
      <div class="fakeqq-message-operations-item" @click="clickOperation('withdraw')">
        <el-icon size="24"><Back /></el-icon>
        <div class="fakeqq-message-operations-item-title">撤回</div>
      </div>
      <div class="fakeqq-message-operations-item" @click="clickOperation('delete')">
        <el-icon size="24"><Delete /></el-icon>
        <div class="fakeqq-message-operations-item-title">删除</div>
      </div>
      <div class="fakeqq-message-operations-item" @click="clickOperation('quote')">
        <el-icon size="24"><ChatLineRound /></el-icon>
        <div class="fakeqq-message-operations-item-title">引用</div>
      </div>
      <div class="fakeqq-message-operations-item" @click="clickOperation('multicheck')">
        <el-icon size="24"><CircleCheck /></el-icon>
        <div class="fakeqq-message-operations-item-title">多选</div>
      </div>
    </div>
    <template #reference>
      <slot></slot>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const msgOperationVisible = ref(false);
const $emit = defineEmits(['msg-operation']);
const clickOperation = (e: string) => {
  $emit('msg-operation', { type: e });
  msgOperationVisible.value = false;
};
</script>
