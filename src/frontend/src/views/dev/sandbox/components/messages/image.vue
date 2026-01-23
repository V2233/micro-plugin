<template>
  <div class="fakeqq-message" :class="[onright ? 'right-chat' : 'left-chat']">
    <AvatarMenu :onright="onright" @avatar-operation="$emit('avatar-operation', $event)">
      <div
        v-if="avatar"
        :style="{ 'background-image': `url(${avatar})` }"
        class="fakeqq-message__avatar"
        @click="$emit('avatar-click', 'image')"
      ></div>
      <div v-else class="fakeqq-message__avatar" @click="$emit('avatar-click', 'image')">
        <span class="fakeqq-message__text-avatar">{{ name[0] }}</span>
      </div>
    </AvatarMenu>
    <div class="fakeqq-message__content">
      <div class="fakeqq-message__name" v-if="role !== ''">
        <span v-if="role === 'bot'" class="fakeqq-message__member__card__bot__logo">
          <svg-icon name="robot" width="12px" height="12px" color="white" />
        </span>
        <span v-if="onright && role !== 'bot'" :class="memberTitleClass">{{ role_title }}</span>
        {{ name }}
        <span v-if="!onright && role !== 'bot'" :class="memberTitleClass">{{ role_title }}</span>
      </div>
      <msg-menu @msg-operation="$emit('msg-operation', $event)">
        <el-image
          :src="src"
          :preview-src-list="srcList"
          :initial-index="0"
          :style="{ 'max-width': maxWidth, 'border-radius': '5px' }"
        />
      </msg-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import MsgMenu from './msg-operate.vue';
import AvatarMenu from './avatar-operate.vue';

const $emit = defineEmits(['msg-operation', 'avatar-operation', 'avatar-click']);

const props = defineProps({
  name: { type: String, required: true },
  avatar: String,
  role: { type: String, default: 'admin' },
  role_title: { type: String, default: 'LV1' },
  src: { type: String, required: true },
  onright: Boolean,
  maxWidth: { type: String, default: '250px' },
  srcList: { type: Array, default: [] },
  initialIndex: { type: Number, default: 0 },
});

const memberTitleClass = computed(() => {
  switch (props.role) {
    case 'owner':
      return 'fakeqq-message__title__owner';
    case 'admin':
      return 'fakeqq-message__title__admin';
    case 'member':
      return 'fakeqq-message__title__member';
    default:
      return '';
  }
});
</script>
