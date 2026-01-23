<template>
  <div class="fakeqq-message fakeqq-forward" :class="[onright ? 'right-chat' : 'left-chat']">
    <AvatarMenu :onright="onright" @avatar-operation="$emit('avatar-operation', $event)">
      <div
        v-if="avatar"
        :style="{ 'background-image': `url(${avatar})` }"
        class="fakeqq-message__avatar"
        @click="$emit('avatar-click', 'contact')"
      ></div>
      <div v-else class="fakeqq-message__avatar" @click="$emit('avatar-click', 'contact')">
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
        <div class="fakeqq-message__bubble" @click="$emit('msg-click', {})">
          <div class="fakeqq-message__bubble-arrow"></div>
          <div class="fakeqq-contact__content">
            <img
              class="fakeqq-contact__content__avatar"
              :src="
                type == 'group'
                  ? `https://p.qlogo.cn/gh/${id}/${id}/640`
                  : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${id}`
              "
            />
            <div class="fakeqq-contact__content__right">
              {{ title }}
            </div>
          </div>
          <div class="fakeqq-forward__count">推荐群聊</div>
        </div>
      </msg-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import MsgMenu from './msg-operate.vue';
import AvatarMenu from './avatar-operate.vue';

const $emit = defineEmits(['msg-operation', 'msg-click', 'avatar-operation', 'avatar-click']);

const props = defineProps({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  role: { type: String, default: 'admin' },
  role_title: { type: String, default: 'LV1' },
  title: { type: String, required: true },
  id: { type: String, required: true },
  type: { type: String, required: true },
  counts: { type: [Number, String], default: 0 },
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

<style lang="scss" scoped>
.fakeqq-message__bubble {
  cursor: pointer;
}

.fakeqq-contact__content,
.fakeqq-contact__count {
  max-width: 100%;
  color: #8b8b8b;
  font-size: 0.8em;
  word-break: break-all;
}

.fakeqq-contact__content {
  display: flex;
  .fakeqq-contact__content__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .fakeqq-contact__content__right {
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.fakeqq-contact__bottom {
  position: absolute;
  line-height: 30px;
  bottom: -30px;
}

.fakeqq-message__bubble {
  .right-chat & {
    background-color: #fff;
    color: black;
    margin-left: auto;
  }
}
</style>
