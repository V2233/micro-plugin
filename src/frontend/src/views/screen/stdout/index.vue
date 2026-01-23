<template>
  <el-card class="log_box" :body-style="{ height: '100%' }">
    <Terminal class="terminal" ref="termRef" @press-enter="onEnter">
      <template #header-left>
        <el-button size="small" style="margin-right: auto">实时输出</el-button>
      </template>
    </Terminal>
  </el-card>
</template>

<script setup lang="ts">
import Terminal from '@/components/Terminal/index.vue';
import useUserStore from '@/store/modules/user';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const userStore = useUserStore();

const termRef = ref<InstanceType<typeof Terminal>>();

const stdoutWs = ref<WebSocket | null>(null);

const connect = () => {
  console.log('5555555555555555555');
  const originUrl = new URL(userStore.originAddress);
  const host = `${originUrl.hostname}:${
    userStore.originPort ? userStore.originPort : originUrl.port
  }`;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = `${protocol}//${host}/micro/webui/stdout`;

  const sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  stdoutWs.value = new WebSocket(url);

  stdoutWs.value.onopen = e => {
    console.log(`[micro-stdout]已连接！`);
  };
  stdoutWs.value.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.type == 'log') termRef.value?.write(msg.data);
  };
  stdoutWs.value.onclose = e => {
    console.log(`[micro-stdout]已关闭！`, e);
  };
  stdoutWs.value.onerror = err => {
    console.log(`[micro-stdout]断开连接！`, err);
  };
};

const onEnter = (e: string) => {
  console.log(e);
  stdoutWs.value?.send(JSON.stringify({ type: 'cmd', data: e }));
};

const mockWrite = () => {
  let s =
    'fhdajkhldjj阿尽快垃圾分类会计法啦急急急卡机拉卡萨进啦科技萨拉抗打击立卡就撒科技大啦手打156545645\n';
  termRef.value?.write(s.repeat(1000));
};

onMounted(() => {
  nextTick(() => {
    console.log(222);
    termRef.value?.fitTermSize();
    console.log(333);
    if (!stdoutWs.value || stdoutWs.value?.readyState !== stdoutWs.value?.OPEN) connect();
  });
});

onBeforeUnmount(() => {
  stdoutWs.value?.close();
  stdoutWs.value = null;
});
</script>

<style scoped lang="scss">
.log_box {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
