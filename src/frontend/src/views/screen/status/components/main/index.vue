<template>
  <div class="box">
    <div
      class="content"
      ref="scrollContainer"
      :style="{ fontSize: screenStore.settings.fontSize + 'px' }"
    >
      <!-- 每条消息 -->
      <div class="message" v-for="(e, index) in msgQueue" :key="index">
        <div class="meta" v-if="msgQueue.length == 0">请等待消息接收...</div>
        <div v-else>
          <span class="msg-origin" v-if="e.group_id" @click="initMsg('group', e.group_id)">
            {{ `[${e.group_id}：${e.group_name}][${e.sender.user_id}：${e.sender.card}]` }}
          </span>
          <span class="msg-origin" v-else @click="initMsg('private', e.sender.user_id)">
            {{ `[${e.sender.user_id}：${e.sender.nickname}]` }}
          </span>
          <!-- 处理消息类型 -->
          <span v-for="(seg, id) in e.message">
            <span v-if="seg.type == 'at'">(@{{ seg.qq }}{{ seg.text }}):</span>
            <span v-if="seg.type == 'text'">{{ seg.text }}</span>
            <p
              class="msg-img-box"
              v-if="seg.type == 'image'"
              :style="{ width: screenStore.settings.imageWidth + 'px' }"
            >
              <img
                class="msg-img"
                :key="id"
                :src="seg.url ?? seg.file"
                referrerpolicy="no-referrer"
              />
            </p>
          </span>
        </div>
      </div>
    </div>
    <!-- 消息回复框 -->
    <div class="pop-box" v-show="msgBoxVisual" tabindex="-1" @blur="msgBoxVisual = false">
      <div class="pop-content">
        <div class="pop-title">
          请回复：{{ preSentMsg.params.type == 'private' ? '好友' : '群'
          }}{{ preSentMsg.params.id }}
        </div>
        <div class="pop-send" @click="sendMsg">发送</div>
        <el-input
          class="input"
          v-model="preSentMsg.params.msg"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :input-style="{
            fontFamily: 'Roboto Mono',
            fontSize: '20px',
            color: 'cyan',
            backgroundColor: 'transparent',
          }"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Ws from '@/api/ws/index';
import useScreenStore from '@/store/modules/screen';
import moment from 'moment';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
let ws = ref(new Ws());

let screenStore = useScreenStore();
let timeId = ref<any>();
const scrollContainer = ref();

const msgBoxVisual = ref<boolean>(false);

const preSentMsg = ref({
  type: 'message',
  action: 'send_message',
  params: {
    type: '',
    id: '',
    msg: '',
  },
});

const connectWs = async () => {
  await ws.value.openWs();
};

const msgQueue = computed(() => {
  let newQueue: any[] = [];
  ws.value.msgQueue.map((Q: { type: string; action: string; params: any }) => {
    if (Q.type == 'message' && Q.action == 'e_info') {
      newQueue.push(Q.params);
    }
  });
  return newQueue;
});

// 初始化回复消息
const initMsg = (type: string, id: string) => {
  preSentMsg.value.params.type = type;
  preSentMsg.value.params.id = id;
  msgBoxVisual.value = true;
};

// 回复消息
const sendMsg = () => {
  ws.value.sendWs(JSON.stringify(preSentMsg.value));
  preSentMsg.value.params.msg = '';
};

watch(
  () => ws.value.msgQueue,
  () => {
    if (!screenStore.settings.isAutoScroll) return;
    const lastChild = scrollContainer.value.lastElementChild;
    if (lastChild) {
      lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  },
  { deep: true }
);

onMounted(() => {
  connectWs();
  timeId.value = setInterval(() => {
    const difNum = msgQueue.value.length - screenStore.curMsgQueueLength;
    screenStore.msgQps.push({
      qps: difNum,
      time: moment().format('hh:mm:ss'),
    });
    if (screenStore.msgQps.length > 15) {
      screenStore.msgQps.shift();
    }
    screenStore.curMsgQueueLength = msgQueue.value.length;
  }, 1000 * screenStore.settings.qpsInterval);
});

onBeforeUnmount(() => {
  ws.value.closeWs();
  clearInterval(timeId.value);
});
</script>

<style scoped lang="scss">
@use '@fontsource/roboto-mono/index.css' as *;

.box {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 5;

  .content {
    width: 100%;
    height: 95%;
    top: 5%;
    padding: 10px;
    position: absolute;
    // font-size: 20px;
    font-family: 'Roboto Mono', monospace, serif;
    color: #29fcff;
    z-index: 50;
    overflow-y: scroll;
    overflow-x: visible;

    .message {
      position: relative;
      margin-top: 10px;
      line-height: 1.5;

      .msg-origin {
        cursor: pointer;
      }

      .msg-img-box {
        width: 400px;
        border: 2px solid #29fcff;
        border-radius: 3px;

        .msg-img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .pop-box {
    position: absolute;
    right: 20px;
    bottom: 50px;
    width: 430px;
    height: auto;
    background: url(../../images/line-bg.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .pop-content {
      font-size: 20px;
      font-family: 'Roboto Mono', monospace, serif;
      color: #29fcff;
      z-index: 50;
      position: relative;
      width: 100%;
      height: 100;
      margin: 5px;

      .pop-title {
        position: absolute;
        top: -30px;
        left: 10px;
      }

      .pop-send {
        width: 60px;
        height: 30px;
        border: 1px solid #29fcff;
        line-height: 30px;
        text-align: center;
        border-radius: 5px 5px 0 0;
        position: absolute;
        top: -30px;
        right: 10px;
        cursor: pointer;
      }
    }
  }
}

.box::after {
  width: 100%;
  height: 97%;
  margin-top: 33px;
  content: '';
  display: block;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(../../images/logScreen.png) no-repeat;
  background-size: 100% 100%;
  z-index: -3;
}
</style>
