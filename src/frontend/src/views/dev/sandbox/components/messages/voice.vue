<template>
  <div class="fakeqq-message" :class="[onright ? 'right-chat' : 'left-chat']">
    <AvatarMenu :onright="onright" @avatar-operation="$emit('avatar-operation', $event)">
      <div
        v-if="avatar"
        :style="{ 'background-image': `url(${avatar})` }"
        class="fakeqq-message__avatar"
        @click="$emit('avatar-click', 'record')"
      ></div>
      <div v-else class="fakeqq-message__avatar" @click="$emit('avatar-click', 'record')">
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
        <div class="fakeqq-message__bubble" :onclick="playVoice" style="cursor: pointer">
          <div class="fakeqq-message__bubble-arrow"></div>
          <div class="fakeqq-voice">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="26" />
              <path
                d="M35.5,25.324,20.512,14.575a1,1,0,0,0-1.589.815v21.5a1,1,0,0,0,1.589.816L35.5,26.955a1,1,0,0,0,.237-1.394A.988.988,0,0,0,35.5,25.324Z"
              />
            </svg>
            <audio ref="audio" :src="src" @ended="reset" @loadedmetadata="onLoadedmetadata"></audio>
            <span class="fakeqq-voice__bar">
              <span
                v-for="line in getLineCount(duration)"
                :key="line.id"
                ref="voiceLine"
                class="line"
              ></span>
            </span>
            {{ formatedDuration }}
          </div>
        </div>
      </msg-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import AvatarMenu from './avatar-operate.vue';
import MsgMenu from './msg-operate.vue';

const $emit = defineEmits(['msg-operation', 'avatar-operation', 'avatar-click']);

const audio = ref<HTMLAudioElement>();
const voiceLine = ref();

const playFlag = ref(false);
const duration = ref(10);
const formatedDuration = ref('');

const props = defineProps({
  name: { type: String, required: true },
  avatar: String,
  role: { type: String, default: 'admin' },
  role_title: { type: String, default: 'LV1' },
  src: { type: String, required: true },
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

const getLineCount = (num: number) => {
  const lineArray = [];
  num = num / 1.5;
  if (num < 5) return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  for (let i = 0; i <= num; i++) {
    if (i >= 25) {
      break;
    }
    lineArray.push({ id: i });
  }
  return lineArray;
};

const reset = () => {
  playFlag.value = false;
};

const onLoadedmetadata = () => {
  const audioElem = audio.value as HTMLAudioElement;
  duration.value = Math.round(audioElem.duration ? audioElem.duration : 114514);
  const m = Math.floor(audioElem.duration / 60);
  const s = Math.round(audioElem.duration % 60);
  formatedDuration.value = m > 0 ? `${m}'${s}"` : `${s}"`;
};

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const playVoice = async () => {
  const audioElem = audio.value as HTMLAudioElement;
  const lines = voiceLine.value as NodeListOf<HTMLElement>;
  if (playFlag.value) {
    audioElem.pause();
    audioElem.currentTime = 0;
    lines.forEach(line => {
      line.style.backgroundColor = '#000';
    });
    playFlag.value = false;
  } else {
    audioElem.play();
    playFlag.value = true;
    lines.forEach(line => {
      line.style.backgroundColor = '#dddddd';
    });
    for (let index = 0; index < lines.length; index++) {
      if (audioElem.paused) return;
      await sleep((duration.value * 1000) / lines.length).then(() => {
        lines[index]!.style.backgroundColor = '#000';
      });
    }
  }
};
</script>
