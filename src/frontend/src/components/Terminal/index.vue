<template>
  <div class="bg-main" ref="termboxRef">
    <div class="setting-bar" v-if="headerVisible">
      <HeaderTab v-if="headerLeftVisible" :background-color="termBgColor">
        <slot name="header-left"></slot>
      </HeaderTab>
      <HeaderTab
        v-if="headerRightVisible"
        :background-color="termBgColor"
        style="margin-left: auto"
        type="right"
      >
        <slot name="header-right"></slot>
        <el-popover
          placement="bottom"
          title="终端设置"
          :width="300"
          trigger="click"
          style="z-index: 500"
        >
          <!-- 终端设置 -->
          <el-form>
            <el-form-item label="高度(行)">
              <el-slider
                v-model="termHeight"
                size="large"
                :min="20"
                :max="100"
                @input="changeTermHeight"
              />
            </el-form-item>
            <el-form-item label="字体大小">
              <el-slider
                v-model="termFontSize"
                size="large"
                :min="10"
                :max="30"
                @input="changeFontSize"
              />
            </el-form-item>
            <el-form-item label="背景透明度">
              <el-slider v-model="termBgOpacity" size="large" :min="0" :max="1" :step="0.05" />
            </el-form-item>
            <slot name="settings"></slot>
          </el-form>
          <template #reference>
            <el-button icon="Setting" circle size="small"></el-button>
          </template>
        </el-popover>
        <el-button
          size="small"
          icon="FullScreen"
          circle
          style="margin: 0 5px"
          @click="toggleFullScreen(termboxRef)"
        ></el-button>
      </HeaderTab>
    </div>
    <!-- 终端视图 -->
    <div class="terminal-container" :style="{ background: termBgColor }">
      <div ref="terminal" id="terminal"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderTab from '@/components/Tabs/HeaderTab.vue';

import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
// import { WebLinksAddon } from '@xterm/addon-web-links';
// import { CanvasAddon } from '@xterm/addon-canvas'

import '@xterm/xterm/css/xterm.css';

import useLayoutSettingStore from '@/store/modules/setting';

const layoutSettingStore = useLayoutSettingStore();

/** 终端高度 */
const termHeight = ref(30);
/** 终端字体大小 */
const termFontSize = ref(14);
/** 终端背景透明度 */
const termBgOpacity = ref(0.8);

const props = defineProps({
  headerVisible: {
    type: Boolean,
    default: true,
  },
  headerLeftVisible: {
    type: Boolean,
    default: true,
  },
  headerRightVisible: {
    type: Boolean,
    default: true,
  },
});

const $emit = defineEmits(['pressEnter', 'bgColorChange']);

const termBgColor = ref(
  layoutSettingStore.theme === 'dark'
    ? `rgba(0, 0, 0, ${termBgOpacity.value})`
    : `rgba(255, 255, 255, ${termBgOpacity.value})`
);

const termThemes = reactive({
  dark: {
    background: '#00000000', // 不追踪termBgOpacity.value
    black: '#ffffff',
    red: '#cd3131',
    green: '#0dbc79',
    yellow: '#e5e510',
    blue: '#2472c8',
    cyan: '#11a8cd',
    white: '#e5e5e5',
    brightBlack: '#666666',
    brightRed: '#f14c4c',
    brightGreen: '#23d18b',
    brightYellow: '#f5f543',
    brightBlue: '#3b8eea',
    brightCyan: '#29b8db',
    brightWhite: '#e5e5e5',
    foreground: '#cccccc',
    selectionBackground: '#3a3d41',
    cursor: '#ffffff',
  },
  light: {
    background: '#ffffff00',
    black: '#000000',
    red: '#aa3731',
    green: '#448c27',
    yellow: '#cb9000',
    blue: '#325cc0',
    cyan: '#0083b2',
    white: '#7f7f7f',
    brightBlack: '#777777',
    brightRed: '#f05050',
    brightGreen: '#60cb00',
    brightYellow: '#ffbc5d',
    brightBlue: '#007acc',
    brightCyan: '#00aacb',
    brightWhite: '#b0b0b0',
    foreground: '#000000',
    selectionBackground: '#bfdbfe',
    cursor: '#00dacc',
  },
});

watch(
  () => layoutSettingStore.theme + termBgOpacity.value,
  () => {
    termBgColor.value =
      layoutSettingStore.theme === 'dark'
        ? `rgba(0, 0, 0, ${termBgOpacity.value})`
        : `rgba(255, 255, 255, ${termBgOpacity.value})`;
    $emit('bgColorChange', termBgColor.value);
    term.value.options.theme = termThemes[layoutSettingStore.theme];
  }
);

const termTheme = ref(
  layoutSettingStore.theme === 'dark' ? termThemes['dark'] : termThemes['light']
);

// 终端实例
const termboxRef = ref();
const terminal = ref<HTMLElement>();
const term = ref<Terminal>(
  new Terminal({
    lineHeight: 1.2,
    fontSize: termFontSize.value,
    fontFamily:
      'Monaco, monospace, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", "JetBrains Mono"',
    theme: termTheme.value,
    // 光标闪烁
    cursorBlink: true,
    cursorStyle: 'block',
    convertEol: true,
    // scrollback: 100,
    // tabStopWidth: 4,
    rows: termHeight.value,
    allowTransparency: true,
  })
);

const fitAddon = new FitAddon();

/**
 * 改变高度
 * @returns
 */
const changeTermHeight = (rows: number) => {
  term.value && term.value.resize(term.value.cols, rows);
};

/**
 * 改变字体大小
 * @returns
 */
const changeFontSize = (size: number) => {
  term.value.options.fontSize = size;
};

/**
 * 全屏模式
 * @returns
 */
const toggleFullScreen = (elem: HTMLElement) => {
  // 检查传入的元素是否存在
  if (!elem) {
    console.error('需要传入一个元素');
    return;
  }

  // 检查该元素是否已经是全屏状态
  if (!document.fullscreenElement) {
    // 如果不是全屏，尝试进入全屏
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.error('全屏请求失败:', err);
      });
    } else {
      console.error('当前浏览器不支持全屏API');
    }
  } else {
    // 如果已经是全屏，则退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  fitTermSize();
};

/**
 * 终端输入触发事件
 * @returns
 */
const onTermData = () => {
  // 输入与粘贴的情况,onData不能重复绑定,不然会发送多次
  let cache = '';

  term.value.onData(data => {
    if (data.endsWith('\n') || data.endsWith('\r') || data.endsWith('\x0D')) {
      $emit('pressEnter', cache);
      if (cache.startsWith('clear')) {
        term.value.clear();
      } else {
        term.value.write('\n');
      }
      cache = '';
    } else if (data === '\x08' || data === '\x7F') {
      if (!cache) return;
      cache = cache.slice(0, -1);
      term.value.write('\b \b');
    } else {
      cache += data;
      term.value.write(data);
      console.log(cache);
    }
  });
};

const resizeObserver = ref<ResizeObserver | null>();

/**
 * 适应浏览器尺寸变化
 * @returns
 */
const fitTermSize = () => {
  fitAddon.fit();

  const container = terminal.value?.parentElement;
  if (!container) return;

  const availableHeight = container.clientHeight;

  if (availableHeight <= 0) return;

  const rows = Math.floor(availableHeight / (termFontSize.value * 1.2));

  term.value.resize(term.value.cols, rows);
};

onMounted(() => {
  term.value.open(terminal.value as HTMLElement);
  term.value.loadAddon(fitAddon);
  //   term.value.loadAddon(
  //         new WebLinksAddon((event, uri) => {
  //         if (event.ctrlKey || event.metaKey) {
  //             window.open(uri, '_blank');
  //         }
  //         })
  //     );
  // terminal.loadAddon(new CanvasAddon());
  resizeObserver.value = new ResizeObserver(() => {
    fitTermSize();
  });
  resizeObserver.value.observe(termboxRef.value);
  onTermData();
});

onBeforeUnmount(() => {
  resizeObserver.value?.disconnect();
});

const write = (str: string) => {
  term.value.write(str);
};

defineExpose({ write, fitTermSize, termRef: term, termBgColor });
</script>
<style lang="scss" scoped>
.bg-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .terminal-container {
    width: 100%;
    height: 100%;
    border: 0.1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0 0 5px 5px;
    overflow: hidden;
    padding: 5px;
    .terminal {
      width: 100%;
      height: 100%;
    }
  }
  .setting-bar {
    width: 100%;
    display: flex;
    justify-content: end;
  }
}
</style>
