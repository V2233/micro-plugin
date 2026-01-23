<template>
  <div class="fakeqq-message" :class="[onright ? 'right-chat' : 'left-chat']">
    <AvatarMenu :onright="onright" @avatar-operation="$emit('avatar-operation', $event)">
      <div
        v-if="avatar"
        :style="{ 'background-image': `url(${avatar})` }"
        class="fakeqq-message__avatar"
        @click="$emit('avatar-click', 'video')"
      ></div>
      <div v-else class="fakeqq-message__avatar" @click="$emit('avatar-click', 'video')">
        <span class="fakeqq-message__text-avatar">{{ name[0] }}</span>
      </div>
    </AvatarMenu>
    <div class="fakeqq-message__content">
      <div class="fakeqq-message__name" v-if="role !== ''">
        <span v-if="onright" :class="memberTitleClass">{{ role_title }}</span>
        {{ name }}
        <span v-if="!onright" :class="memberTitleClass">{{ role_title }}</span>
      </div>
      <msg-menu @msg-operation="$emit('msg-operation', $event)">
        <div class="fakeqq-video">
          <video
            controls
            ref="videoElement"
            :style="{ 'max-width': maxWidth, 'object-fit': 'cover', 'border-radius': '10px' }"
            style="width: 100%; height: 100%"
          >
            <source :src="src" type="video/mp4" />
            <source :src="src" type="video/ogg" />
          </video>
        </div>
      </msg-menu>

      <!-- <div class="fakeqq-message__bubble" style="cursor: pointer">
                <div class="fakeqq-message__bubble-arrow"></div>
                
            </div> -->
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
  maxWidth: { type: String, default: '400px' },
  onright: Boolean,
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
