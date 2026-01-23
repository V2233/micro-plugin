<template>
  <div
    class="fakeqq-window"
    :style="{
      backgroundColor: isCodeVisible ? 'black' : '#f0f0f0',
    }"
  >
    <!-- 顶部 -->
    <div class="fakeqq-header" v-show="header_visible" style="background-color: #f5f4f2">
      <el-icon
        class="fakeqq-header__bth"
        size="24"
        @click="footer_type == 'none' ? (devStore.qqScene = 1) : (devStore.qqScene = 0)"
      >
        <ArrowLeft />
      </el-icon>
      <span class="fakeqq-header__title">
        <svg-icon name="ear" class="fakeqq-header__bth" />
        {{ title }}{{ count ? '(' + count + ')' : '' }}
      </span>
      <svg-icon
        name="menu"
        width="24px"
        height="24px"
        class="fakeqq-header__bth"
        color="#000000"
        @click="goSetting"
      />
    </div>
    <!-- 聊天区域 -->
    <div class="fakeqq-container" ref="containerRef">
      <div v-show="!isCodeVisible" style="width: 100%; height: 100%; position: relative">
        <slot name="chat"></slot>
      </div>

      <!-- 代码展示区域 -->
      <div class="fakeqq-container-code" v-if="isCodeVisible">
        <pre
          class="fakeqq-container-code-text"
        ><code class="language-json"><span v-html="highlightCode"></span></code></pre>
      </div>
    </div>
    <!-- 抽屉 -->
    <div
      class="fakeqq-container"
      v-show="isDrawerOpen"
      :style="{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0px',
      }"
    >
      <div class="fakeqq-container-drawer">
        <el-drawer
          v-model="isDrawerOpen"
          :size="drawerWidth"
          title="群聊设置"
          :with-header="false"
          @close="goSetting(false)"
          style="background-color: #f2f2f2"
        >
          <slot name="drawer"></slot>
        </el-drawer>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="fakeqq-footer" v-show="footer_type == 'Input'">
      <!-- 唤出at列表 -->
      <el-popover
        placement="top-start"
        :width="300"
        trigger="click"
        v-model:visible="isAtListVisible"
      >
        <template #reference>
          <div style="position: absolute; top: 0; left: 15px; width: 1px; height: 1px"></div>
        </template>
        <slot name="atlist"></slot>
      </el-popover>

      <form class="fakeqq-footer__input">
        <el-input
          style="width: 100%; height: 100%"
          type="textarea"
          v-model="inputValue"
          autofocus
          :disabled="input_disabled"
          :autosize="{ minRows: 1, maxRows: 3 }"
          @input="exposeInnerText"
          @focus="$emit('footerBtn', 'none')"
        >
        </el-input>
        <button class="fakeqq-footer__input-btn" type="reset" @click="handleSendInputValue">
          发送
        </button>
      </form>
      <div class="fakeqq-footer__btn">
        <!-- 录音 -->
        <svg-icon name="voice" @click="$emit('footerBtn', 'audio')" />

        <!-- Emoji表情 -->
        <el-popover placement="top-start" title="Emoji" :width="320" trigger="click">
          <div class="emoji-box">
            <!-- <emoji-picker ref="emojiRef"/> -->
            <Picker
              :data="emojiIndex"
              set="twitter"
              :emojiSize="18"
              :showPreview="false"
              @select="handleInput('emoji', $event)"
              :style="{ height: '300px' }"
            />
          </div>

          <template #reference>
            <svg-icon name="face" width="19px" height="19px" color="black" />
          </template>
        </el-popover>

        <!-- QQ表情 -->
        <svg-icon name="emoji" @click="$emit('footerBtn', 'face')" />

        <!-- 指令列表 -->
        <el-popover
          placement="top-start"
          title="指令列表"
          :width="360"
          trigger="click"
          v-model:visible="isRegsVisible"
        >
          <div class="regs-box">
            <el-menu default-active="2" class="el-menu-vertical-demo dark-mode">
              <el-sub-menu
                :index="'pkg-' + index"
                popper-class="dark-mode"
                :popper-offset="4"
                v-for="(pkg, index) in pkgs"
                :key="index"
              >
                <template #title>
                  <el-icon>
                    <FolderOpened />
                  </el-icon>
                  <span>{{ pkg.packName }}</span>
                </template>

                <el-sub-menu :index="'js-' + id" v-for="(js, id) in pkg.packPlugins" :key="id">
                  <template #title>
                    <el-icon>
                      <Guide />
                    </el-icon>
                    <span>{{ js.pluginTitle }}</span>
                  </template>
                  <el-menu-item
                    v-for="(reg, i) in js.pluginFuns"
                    @click="handleInput('regs', `${index}.${id}.${i}`)"
                    >{{ reg }}</el-menu-item
                  >
                </el-sub-menu>
              </el-sub-menu>
            </el-menu>
          </div>

          <template #reference>
            <svg-icon name="robot" color="#515151" @click="getPluginsLoader" />
          </template>
        </el-popover>

        <!-- 代码窗口打印 -->
        <!-- <svg-icon name="code" width="19px" height="19px" color="black" @click="$emit('connectWs',{})"/> -->
        <svg-icon
          name="code"
          width="19px"
          height="19px"
          color="black"
          @click="isCodeVisible = !isCodeVisible"
        />
        <!-- 文件 -->
        <svg-icon name="more" @click="$emit('footerBtn', 'file')" />
      </div>
    </div>
    <div class="fakeqq-footer-toolview" v-if="footerview_visible">
      <slot name="tools"></slot>
    </div>
    <!-- 多选操作栏 -->
    <div class="fakeqq-footer-multicheck" v-if="footer_type == 'MultiCheck'">
      <div class="fakeqq-footer-multicheck-item">
        <div class="fakeqq-footer-multicheck-icon" @click="$emit('multiCheck', 'forward')">
          <svg-icon name="forward" width="30px" height="30px"></svg-icon>
        </div>
        <div class="fakeqq-footer-multicheck-icon-desc">逐条转发</div>
      </div>
      <div class="fakeqq-footer-multicheck-item">
        <div class="fakeqq-footer-multicheck-icon" @click="$emit('multiCheck', 'multiforward')">
          <svg-icon name="multiforward" width="24px" height="24px"></svg-icon>
        </div>
        <div class="fakeqq-footer-multicheck-icon-desc">合并转发</div>
      </div>
      <div class="fakeqq-footer-multicheck-item">
        <div class="fakeqq-footer-multicheck-icon" @click="$emit('multiCheck', 'delete')">
          <el-icon size="26">
            <Delete />
          </el-icon>
        </div>
        <div class="fakeqq-footer-multicheck-icon-desc">删除</div>
      </div>
      <div class="fakeqq-footer-multicheck-item">
        <div class="fakeqq-footer-multicheck-icon" @click="$emit('multiCheck', 'close')">
          <el-icon size="30">
            <Close />
          </el-icon>
        </div>
        <div class="fakeqq-footer-multicheck-icon-desc">关闭</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// all emoji sets.
import data from 'emoji-mart-vue-fast/data/all.json';
// Import default CSS
import { ElNotification } from 'element-plus';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
//@ts-ignore
import { EmojiIndex, Picker } from 'emoji-mart-vue-fast/src';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type {
  groupMsgQueueItemType,
  privateMsgQueueItemType,
} from '../protocol/onebotv11/event/type';

import { reqPluginsLoader } from '@/api/dev/sandbox/index';
import useDevStore from '@/store/modules/dev';
import { fromCqcode2 } from '../protocol/common/cq';

import hljs from 'highlight.js/lib/core';
import JsonLanguage from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', JsonLanguage);

const devStore = useDevStore();
const pkgs = ref<any[]>([]);

/** 表情索引实例 */
const emojiIndex = ref(new EmojiIndex(data));

/** input输入内容 */
const inputValue = ref('');

/** 指令可视化 */
const isRegsVisible = ref(false);

/** 聊天容器实例 */
const containerRef = ref();

/** 抽屉打开状态 */
const isDrawerOpen = ref(false);

/** 代码调试区是否可见 */
const isCodeVisible = ref(false);

/** 抽屉宽度，适配移动端 */
const drawerWidth = ref('50%');

const highlightCode = ref('');

/** 记录@符号个数 */
let sepCount = 0;

const isAtListVisible = ref(false);

const props = defineProps({
  title: { type: String, required: true },
  count: { type: [String, Number], default: '' },
  /** 是否展示header */
  header_visible: { type: Boolean, default: true },
  /** 页脚类型(none-无，Input-输入框，MultiCheck-多选) */
  footer_type: { type: String, default: 'Input' },
  /** 用于刷新滚动条 */
  msgs_length: { type: Number, default: 0 },
  /** 是否展示工具栏试图 */
  footerview_visible: { type: Boolean, default: false },
  /** 是否禁用输入框 */
  input_disabled: { type: Boolean, default: false },
});

watch(
  () => props.msgs_length,
  () => {
    nextTick(() => {
      containerRef.value.scrollTop = containerRef.value.scrollHeight;
    });

    const processedQueue = (
      devStore[devStore.curAdapter].cur_message_type === 'group'
        ? (getCurGroup()?.msg_queue as groupMsgQueueItemType[])
        : (getCurPrivate()?.msg_queue as privateMsgQueueItemType[])
    ).map(q => {
      const newMessage = q.message.map((seg: any) => {
        if (seg.data?.file) {
          // 替换整个Base64字符串为占位符
          const newData = { ...seg.data, file: seg.data?.file.replace(/base64.*/, 'base64,...') };
          return { ...seg, data: newData };
        } else {
          return seg;
        }
      });
      return {
        ...q,
        message: newMessage,
        raw_message: q.raw_message.replace(/file=data:[^,]+;base64,[^\]]+\]/, 'file=base64,...]'),
      };
    });

    const codeJson = JSON.stringify(processedQueue, null, 2);
    highlightCode.value = hljs.highlight(codeJson, { language: 'json' }).value;
  }
);

const $emit = defineEmits([
  'sendInput',
  'connectWs',
  'goSetting',
  'multiCheck',
  'inputContent',
  'footerBtn',
]);

/**
 * 向父组件传文本
 */
const exposeInnerText = () => {
  $emit('inputContent', inputValue.value);
  // 兼容软键盘
  const curSepCount = inputValue.value.match(/@/g) || [];
  if (curSepCount.length == sepCount + 1) {
    isAtListVisible.value = true;
  } else {
    isAtListVisible.value = false;
  }
  sepCount = curSepCount.length;
};

/**
 * 进入设置
 */
const goSetting = (closed?: boolean) => {
  // 主动关闭
  if (closed === false) {
    isDrawerOpen.value = false;
    $emit('goSetting', false);
    return;
  }
  // 被动切换
  if (isDrawerOpen.value) {
    isDrawerOpen.value = false;
    $emit('goSetting', false);
  } else {
    isDrawerOpen.value = true;
    $emit('goSetting', true);
  }
};

/**
 * 获取插件信息
 */
const getPluginsLoader = async () => {
  // 缓存一下
  if (pkgs.value?.length > 0) return;
  let res: any = await reqPluginsLoader();
  if (res.code == 200) {
    pkgs.value = res.data;
  }
};

/**
 * 处理各种输入
 * @param type
 * @param i
 */
const handleInput = (type: string, i: any) => {
  switch (type) {
    case 'regs':
      isRegsVisible.value = false;
      const [pkgId, jsId, regId] = (i as string).split('.').map(id => Number(id));
      const str =
        pkgs.value[pkgId as number]?.packPlugins?.[jsId as number]?.pluginFuns?.[regId as number] ??
        '';
      inputValue.value += str.replace(/【\d+】(:|：)/, '');
      break;
    case 'emoji':
      isRegsVisible.value = false;
      inputValue.value += i.native;
      break;
    default:
  }
};

/** 处理文本特殊含义 */
const handleSendInputValue = () => {
  try {
    $emit('sendInput', fromCqcode2(inputValue.value));
  } catch (err: any) {
    ElNotification({
      title: '解析CQ码出错！',
      message: err.message,
      type: 'error',
      duration: 3000,
    });
  }
  inputValue.value = '';
};

defineExpose({ inputValue, isDrawerOpen });

/** 调整抽屉大小 */
const resizeDrawer = () => {
  if (window.innerWidth > window.innerHeight) drawerWidth.value = '50%';
  else drawerWidth.value = '100%';
};

window.onresize = () => {
  resizeDrawer();
};

/** 避免缓存 */
const getCurGroup = () => {
  return devStore[devStore.curAdapter].group_list.find(
    (group: any) => group.group_id == devStore[devStore.curAdapter].cur_group_id
  );
};

/** 避免缓存 */
const getCurPrivate = () => {
  return devStore[devStore.curAdapter].friend_list.find(
    (friend: any) => friend.user_id == devStore[devStore.curAdapter].cur_private_id
  );
};

onMounted(() => {
  resizeDrawer();
});

onBeforeUnmount(() => {
  window.onresize = null;
});
</script>

<style lang="scss">
@use './fakeqq.scss' as *;
@use '@fontsource/roboto-mono/index.css' as *;

.regs-box {
  width: 100%;
  height: 400px;
  overflow-y: scroll;
  cursor: pointer;
}

.emoji-box {
  width: 100%;
  height: 300px;
  cursor: pointer;
}

.fakeqq-container-drawer {
  position: absolute;
  width: 100%;
  height: 100%;

  .el-overlay {
    position: absolute;
    overflow: hidden;

    .el-drawer__body {
      padding: 0;
    }
  }
}

.fakeqq-container-code {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: white;

  .fakeqq-container-code-text {
    code {
      font-family: 'Roboto Mono', monospace, serif;
      word-break: break-all;
      white-space: pre-wrap;
      font-size: 12px;
      max-width: 100vw;
    }

    pre code.hljs {
      display: block;
      overflow-x: auto;
      padding: 1em;
    }

    code.hljs {
      padding: 3px 5px;
    }

    .hljs {
      background: #272822;
      color: #ddd;
    }

    .hljs-tag,
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-strong,
    .hljs-number,
    .hljs-name {
      color: #f92672;
    }

    .hljs-code {
      color: #66d9ef;
    }

    .hljs-attribute,
    .hljs-attr,
    .hljs-symbol,
    .hljs-regexp,
    .hljs-link {
      color: #bf79db;
    }

    .hljs-string,
    .hljs-bullet,
    .hljs-subst,
    .hljs-title,
    .hljs-section,
    .hljs-emphasis,
    .hljs-type,
    .hljs-built_in,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-addition,
    .hljs-variable,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #a6e22e;
    }

    .hljs-title.class_,
    .hljs-class .hljs-title {
      color: white;
    }

    .hljs-comment,
    .hljs-quote,
    .hljs-deletion,
    .hljs-meta {
      color: #75715e;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-doctag,
    .hljs-title,
    .hljs-section,
    .hljs-type,
    .hljs-selector-id {
      font-weight: bold;
    }
  }
}

.fakeqq-footer-toolview {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #f5f4f2;
  border-top: 1px solid #f3f2f263;
  height: auto;
}

.fakeqq-footer-multicheck {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #f5f4f2;
  height: 80px;

  // border: 2px solid red;
  .fakeqq-footer-multicheck-item {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .fakeqq-footer-multicheck-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #ffffff;
    }

    .fakeqq-footer-multicheck-icon:hover {
      background-color: #f5f5f5;
    }

    .fakeqq-footer-multicheck-icon-desc {
      text-align: center;
      margin-top: 5px;
      font-size: 12px;
      // border: 2px solid red;
    }
  }
}
</style>
