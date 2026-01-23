<template>
  <el-card class="log_box">
    <div class="log_select">
      <div class="log_title">
        <span style="margin-right: 10px; color: white">日志</span>
      </div>
      <!-- 日志多选框 -->
      <div class="select_log">
        <el-button
          class="update_btn"
          size="small"
          icon="Refresh"
          circle
          @click="updateLog"
          style="margin-right: -5px"
        ></el-button>
        <!-- 设置 -->
        <el-popover placement="bottom" title="日志设置" :width="300" trigger="click">
          <!-- 表单元素 -->
          <el-form>
            <el-form-item label="窗口高度">
              <el-slider
                v-model="logBoxHeight"
                size="large"
                :min="400"
                :max="1000"
                @input="changeLogHeight"
              />
            </el-form-item>
            <el-form-item label="字体大小">
              <el-slider
                v-model="logFontSize"
                size="large"
                :min="12"
                :max="30"
                @input="changeLogFontSize"
              />
            </el-form-item>
            <el-form-item label="分页大小">
              <el-slider v-model="pageSize" size="large" :min="20" :max="1000" />
            </el-form-item>
          </el-form>
          <template #reference>
            <el-button size="small" icon="Setting" circle style="margin-right: 5px"></el-button>
          </template>
        </el-popover>
        <!-- 日期选择 -->
        <el-select
          v-model="curLog"
          placeholder="Select"
          size="small"
          style="width: 130px"
          @change="changeLog"
        >
          <el-option
            v-for="(item, index) in logsList"
            :key="index"
            :label="item.replace('command.', '')"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <!-- 日志窗口 -->
    <ul class="page-logs" :style="{ height: `${newHeight}px` }" v-infinite-scroll="loadPage">
      <li
        class="line"
        v-for="(item, index) in logs"
        :key="index"
        :style="{
          fontSize: `${newFontSize}px`,
          marginTop: `${Math.round(newFontSize * 0.2)}px`,
          lineHeight: `${String(Math.round(1.5 * newFontSize))}px`,
        }"
      >
        <span class="timestamp">{{ index }}</span>
        <span class="timestamp">{{ item.time }}</span>
        <span
          :class="
            LEVEL_MAP[item.level as keyof typeof LEVEL_MAP]
              ? LEVEL_MAP[item.level as keyof typeof LEVEL_MAP]
              : LEVEL_MAP['STDOUT']
          "
        >
          [{{ item.level }}]
        </span>
        <span class="detail">
          {{ item.detail }}
        </span>
      </li>
    </ul>
  </el-card>
</template>

<script setup lang="ts">
import { reqLogs } from '@/api/screen/index';
import { onMounted, ref } from 'vue';

type logType = {
  time: string;
  level: string;
  detail: string;
};

let logs = ref<logType[]>([]);
let logsList = ref<string[]>([]);
let logId = ref<string>('0');
let curLog = ref('0');
let page = ref(0);
let pageSize = ref(50);

// 窗口设置
let logBoxHeight = ref(500);
let newHeight = ref(500);
let logFontSize = ref(16);
let newFontSize = ref(16);

const LEVEL_MAP = ref({
  STDOUT: 'stdout',
  TRACE: 'level-trace',
  DEBUG: 'level-debug',
  INFO: 'level-info',
  WARN: 'level-warn',
  WARNING: 'level-warn',
  ERROR: 'level-error',
  ERRO: 'level-error',
  FATAL: 'level-fatal',
  MARK: 'level-mark',
});

onMounted(() => {
  newHeight.value = window.innerHeight - 150;
  getLog();
});

const changeLogHeight = (e: number) => {
  newHeight.value = logBoxHeight.value;
};

const changeLogFontSize = (e: number) => {
  newFontSize.value = logFontSize.value;
};

// const changePageSize = (e: number) => {
//   console.log(e)
//   // pageSize.value = e
// }

const getLog = async (id?: string) => {
  console.log(logId.value, id, curLog.value);
  if (logId.value != id) {
    logs.value = [];
    logId.value = id || '0';
    page.value = 0;
  }
  let res: any;
  if (id == '0' || !id) {
    res = await reqLogs('0', page.value, pageSize.value);
  } else {
    res = await reqLogs(id, page.value, pageSize.value);
  }
  // console.log(res)
  if (res.code == 200) {
    logs.value.push(...res.data.logs);
    logsList.value = res.data.logList;
    curLog.value = res.data.curLog;
  }
};

const loadPage = () => {
  page.value++;
  getLog(curLog.value);
};

const changeLog = (e: string) => {
  getLog(e);
};

const updateLog = () => {
  getLog(curLog.value);
};
</script>

<style scoped lang="scss">
@use '@fontsource/roboto-mono/index.css' as *;

$--terminal-bg: #24292f;
$--terminal-fg: white;
$--terminal-bg-hover: #32383f;
$--terminal-fg-hover: white;
$--terminal-bg-selection: rgba(33, 139, 255, 0.15);
$--terminal-separator: rgba(140, 149, 159, 0.75);
$--terminal-timestamp: white;
$--terminal-detail: white;

$--terminal-trace: white;
$--terminal-debug: white;
$--terminal-info: white;
$--terminal-warn: white;
$--terminal-error: white;
$--terminal-fatal: white;
$--terminal-mark: white;

.log_box {
  width: 100%;

  .log_select {
    // border: 2px solid red;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .log_title {
      font-size: 18px;
      font-family: 'Roboto Mono';
      font-weight: 700;
      display: flex;
      align-items: center;
    }
  }
}

.page-logs {
  color: white !important;
  background-color: $--terminal-bg;
  margin-top: 20rpx;
  border-radius: 5px;
  padding-bottom: 5px;
  padding-top: 5px;

  overflow-y: scroll;

  .logs {
    transform-origin: top left;
    padding: 15rpx 10rpx;
  }

  .logs:first-child .line:first-child {
    margin-top: 0;

    &::before {
      display: none;
    }
  }

  .line {
    padding: 0 0.5rem;
    border-radius: 2px;
    white-space: pre-wrap;
    position: relative;
    font-family: 'Roboto Mono', monospace, serif;
    max-width: 200rpx;
    word-wrap: break-word;
    color: white !important;

    &:hover {
      color: white !important;
      background-color: $--terminal-bg-hover;
    }

    ::selection {
      background-color: $--terminal-bg-selection;
    }

    .timestamp {
      color: white !important;
      font-weight: bold;
      margin-right: 0;
    }

    .level {
      color: white !important;
      font-weight: bold;
      margin-right: 0;
    }

    .detail {
      color: white !important;
      font-weight: bold;
    }

    .level-trace {
      color: white !important;
    }

    .level-debug {
      color: white !important;
    }

    .level-info {
      color: white !important;
    }

    .level-warn {
      color: white !important;
    }

    .level-error {
      color: white !important;
    }

    .level-fatal {
      color: white !important;
    }

    .level-mark {
      color: white !important;
    }

    .stdout {
      color: white !important;
    }
  }
}
</style>
