<template>
  <div class="fakeqq-message" :class="[onright ? 'right-chat' : 'left-chat']">
    <AvatarMenu :onright="onright" @avatar-operation="$emit('avatar-operation', $event)">
      <div
        v-if="avatar"
        :style="{ 'background-image': `url(${avatar})` }"
        class="fakeqq-message__avatar"
        @click="$emit('avatar-click', 'file')"
      ></div>
      <div v-else class="fakeqq-message__avatar" @click="$emit('avatar-click', 'file')">
        <span class="fakeqq-message__text-avatar">{{ name[0] }}</span>
      </div>
    </AvatarMenu>
    <div class="fakeqq-message__content" :onclick="click">
      <div class="fakeqq-message__name" v-if="role !== ''">
        <span v-if="onright" :class="memberTitleClass">{{ role_title }}</span>
        {{ name }}
        <span v-if="!onright" :class="memberTitleClass">{{ role_title }}</span>
      </div>
      <msg-menu @msg-operation="$emit('msg-operation', $event)">
        <div class="fakeqq-message__bubble" @click="$emit('msg-click', {})" style="cursor: pointer">
          <div class="fakeqq-message__bubble-arrow"></div>
          <div class="fakeqq-file__content">
            <div class="fakeqq-file__info">
              <div class="fakeqq-file__name">{{ filename }}</div>
              <div class="fakeqq-file__size">{{ filesize }}</div>
            </div>
            <div class="fakeqq-file__icon">
              <img :src="fileicon" />
            </div>
          </div>
        </div>
      </msg-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import MsgMenu from './msg-operate.vue';
import AvatarMenu from './avatar-operate.vue';

const $emit = defineEmits(['msg-operation', 'msg-click', 'avatar-operation', 'avatar-click']);

const fileRef = ref();

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: 'admin',
  },
  role_title: {
    type: String,
    default: 'LV1',
  },
  filename: {
    type: String,
    required: true,
  },
  filesize: {
    type: String,
    required: true,
  },
  fileicon: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    default: '',
  },
  onright: Boolean,
  click: {
    type: Function,
    default: function () {},
  }, // eslint-disable-line
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

// onMounted(() => {
//     if (props.href) {
//       const file = fileRef.value as HTMLAnchorElement
//       file.href = props.href
//     }
// })
</script>
