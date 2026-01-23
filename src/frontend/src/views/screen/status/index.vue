<template>
  <div class="container" ref="screenContainer">
    <Bg style="position: fixed; z-index: -5; top: -20px; left: -20px" />
    <div class="screen_box">
      <div class="screen" ref="screen">
        <div class="bottom">
          <div class="left">
            <TopLeft class="top_left" />
            <Cpu class="cpu" :cpuData="stateData.cpuInfo" />
            <Ram class="ram" :ramData="stateData.ramInfo" />
            <Gpu class="gpu" v-if="stateData.gpuInfo" :gpuData="stateData.gpuInfo" />
            <Rank class="rank" @update-state="switchUpdateState" />
          </div>
          <div class="center">
            <TopCenter class="top_center" />
            <Main class="map" />
            <Line class="line" />
          </div>
          <div class="right">
            <TopRight class="top_right" @full-screen="toggleFullScreen(screenContainer)" />
            <Disk class="disk" :diskSize="stateData.diskSizeInfo" :swapData="stateData.swapInfo" />
            <Heap class="heap" :nodeData="stateData.nodeInfo" />
            <Other
              class="other"
              :otherData="stateData.otherInfo"
              :networkData="stateData.networkInfo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Bg from './bg.vue';
import TopCenter from './components/top-center/index.vue';
import TopLeft from './components/top-left/index.vue';
import TopRight from './components/top-right/index.vue';
import Cpu from './components/cpu/index.vue';
import Gpu from './components/gpu/index.vue';
import Ram from './components/ram/index.vue';
import Disk from './components/disk/index.vue';
import Heap from './components/heap/index.vue';
import Other from './components/other/index.vue';
import Main from './components/main/index.vue';
import Line from './components/line/index.vue';
import Rank from './components/rank/index.vue';

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { reqStstus } from '@/api/screen/index';
import useScreenstore from '@/store/modules/screen';

const screenStore = useScreenstore();

// 获取大屏dom
let screen = ref();
let screenContainer = ref();

let timeId = ref<any>();

let stateData = ref<any>([]);

const resizeObserver = ref();

onMounted(() => {
  changeSize();
  resizeObserver.value = new ResizeObserver(() => {
    changeSize();
  });
  if (screenContainer.value) {
    resizeObserver.value.observe(screenContainer.value);
  }

  getStatus();
});

const getStatus = async () => {
  let res: any = await reqStstus();
  if (res.code == 200) {
    if (stateData.value.length == 0) {
      const envEditionData = res.data.otherInfo.find((item: any) => item.first == '环境版本');
      if (envEditionData) {
        if (envEditionData.tail.platform !== 'win32') {
          screenStore.settings.isAutoUpdated = true;
          screenStore.settings.updateInterval = 1;
          setTimeout(() => {
            switchUpdateState(true);
          }, screenStore.settings.updateInterval * 1000);
        }
      }
    }
    stateData.value = res.data;
    // console.log(res.data)
  }
};

const switchUpdateState = (isOpen: boolean) => {
  // console.log(isOpen)
  timeId.value && clearInterval(timeId.value);
  if (isOpen) {
    getStatus();
    timeId.value = setInterval(() => {
      getStatus();
    }, screenStore.settings.updateInterval * 1000);
  }
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
};

function getScale(isChanged = false, w = 1920, h = 1080) {
  // const { clientWidth, clientHeight } = screenContainer.value.offsetParent
  const { clientWidth, clientHeight } = screenContainer.value;
  if (isChanged) {
    const ww = clientWidth / 480;
    // const wh = clientHeight / h
    return ww * 0.8;
  } else {
    const ww = clientWidth / w;
    const wh = clientHeight / h;
    return ww < wh ? ww : wh;
  }
}

// window.onresize = () => {
//   changeSize()
// }

const changeSize = () => {
  let scale = 1;
  if (window.innerWidth > window.innerHeight) {
    scale = getScale();
  } else {
    scale = getScale(true);
  }
  screen.value.style.transform =
    window.innerWidth > window.innerHeight
      ? `scale(${scale}) translate(-50%,-50%)`
      : `scale(${scale}) translateX(-40%)`;
};

// const observer = new ResizeObserver(entries => {
//     screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
// })
// observer.observe(screenContainer.value)

onBeforeUnmount(() => {
  if (resizeObserver.value) {
    resizeObserver.value.unobserve(screenContainer.value);
  }
  if (timeId.value) {
    clearInterval(timeId.value);
  }
});
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  // border: 2px solid red;

  // // 确保所有文字都是白色
  // * {
  //   color: white !important;
  // }

  .screen_box {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    position: absolute;
    overflow: hidden;
  }

  .screen {
    position: absolute;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    z-index: 100;

    .bottom {
      display: flex;

      .right {
        flex: 1;
      }

      .left {
        flex: 1;
        height: 1080px;
        display: flex;
        flex-direction: column;

        .top_left {
          width: 100%;
          height: 40px;
        }

        .cpu {
          flex: 1;
        }

        .ram {
          flex: 1;
        }

        .gpu {
          flex: 1;
        }

        .rank {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        height: 1080px;
        flex-direction: column;

        .top_center {
          width: 100%;
          height: 40px;
        }

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
          // padding-right: 20px;
        }
      }

      .right {
        flex: 1;
        height: 1080px;
        display: flex;
        flex-direction: column;

        .top_right {
          width: 100%;
          height: 40px;
        }

        .heap {
          flex: 1;
        }

        .disk {
          flex: 1.2;
        }

        .other {
          flex: 1;
        }
      }
    }
  }
}

@media (orientation: portrait) {
  .container {
    // overflow: scroll;
    .screen_box {
      overflow: scroll;

      .screen {
        top: 0;
        left: 40%;
        width: 480px;
        height: 3240px;

        .bottom {
          display: block;

          .left {
            flex: 1;
          }

          .center {
            flex: 1;
          }

          .right {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
