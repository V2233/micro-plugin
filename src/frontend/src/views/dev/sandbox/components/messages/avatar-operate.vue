<template>
  <el-popover
    :placement="onright ? 'left-start' : 'right-start'"
    :width="80"
    trigger="contextmenu"
    v-model:visible="avatarMenuVisible"
  >
    <div class="message-avatar-operations">
      <div class="message-avatar-operations-item" @click="clickOperation('poke')">
        <!-- <el-icon size="24"><CopyDocument /></el-icon> -->
        <svg-icon name="poke" width="20px" height="20px" color="#606266" />
        <div class="message-avatar-operations-item-title">TA</div>
      </div>
      <div class="message-avatar-operations-item" @click="clickOperation('at')">
        <!-- <el-icon size="24"><Promotion /></el-icon> -->
        <svg-icon name="at" width="20px" height="20px" color="#606266" />
        <div class="message-avatar-operations-item-title">TA</div>
      </div>
    </div>
    <template #reference>
      <slot></slot>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  onright: { type: Boolean, default: false },
});

const avatarMenuVisible = ref(false);
const $emit = defineEmits(['avatar-operation']);
const clickOperation = (e: string) => {
  $emit('avatar-operation', { type: e });
  avatarMenuVisible.value = false;
};
</script>

<style scoped lang="scss">
.message-avatar-operations {
  width: 100%;
  .message-avatar-operations-item {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 3px;
    border-radius: 3px;
    .message-avatar-operations-item-title {
      margin-left: 5px;
    }
  }
  .message-avatar-operations-item:hover {
    background-color: #f2f2f2;
    cursor: pointer;
  }
}
</style>
