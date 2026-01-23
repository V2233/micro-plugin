<template>
  <el-card class="log_box" :body-style="{ height: '100%' }">
    <Terminal class="terminal" ref="termRef" @press-enter="onEnter">
      <template #header>
        <el-button
          size="small"
          style="margin-left: auto"
          @click="(devStore.fillSSHInfo(), (dialogFormVisible = true))"
        >
          SSH
        </el-button>
      </template>
    </Terminal>
    <!-- ssh连接设置 -->
    <el-dialog v-model="dialogFormVisible" title="ssh连接设置">
      <el-form>
        <el-form-item label="主机">
          <el-input
            :prefix-icon="User"
            v-model="devStore.sshInfo.host"
            :input-style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-input
            :prefix-icon="User"
            v-model="devStore.sshInfo.username"
            :input-style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            :prefix-icon="Lock"
            show-password
            type="password"
            v-model="devStore.sshInfo.password"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input
            :prefix-icon="Lock"
            v-model="devStore.sshInfo.port"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="handleConnectSSH"> 连接 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup lang="ts">
import Terminal from '@/components/Terminal/index.vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// import { Terminal } from '@xterm/xterm'
// import { FitAddon } from '@xterm/addon-fit'
// import '@xterm/xterm/css/xterm.css'

// 引入图标
import { Lock, User } from '@element-plus/icons-vue';

import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user';

import Ws from '@/api/ws';

const props = defineProps(['dirPath']);

// ssh表单
const dialogFormVisible = ref(false);
// 是否处于ssh模式
const isSSHMode = ref(false);

const devStore = useDevStore();

// 获取用户名
const userStore = useUserStore();
const userName = ref(userStore.username);

// 视图显示PATH
const prefixPath = ref(props.dirPath);

// 终端实例
// const termboxRef = ref()
// const terminal = ref<HTMLElement>()
// const term = ref<Terminal>(new Terminal({
//   // lineHeight: 1.2,
//   fontSize: 14,
//   fontFamily: "Monaco, monospace",
//   theme: {
//     background: '#181d28'
//   },
//   // 光标闪烁
//   cursorBlink: true,
//   cursorStyle: 'underline',
//   convertEol: true
//   // scrollback: 100,
//   // tabStopWidth: 4,
// }))
// const fitAddon = new FitAddon()

// 终端高度
const termHeight = ref(30);
const termFontSize = ref(14);
const termRef = ref<InstanceType<typeof Terminal>>();

let termWs = ref(new Ws('/micro/webui/term'));
const curCmdStack: string[] = [];

/**
 * 获取路径差
 * @returns
 */
const comparePaths = (path1: string, path2: string) => {
  // 使用split('/')分割路径，并过滤掉空字符串（由连续的'/'导致）
  const segments1 = path1.split('/').filter(segment => segment !== '');
  const segments2 = path2.split('/').filter(segment => segment !== '');

  // 计算两个路径的层级差
  const diff = segments2.length - segments1.length;

  if (diff === 0) {
    // 如果层级相同，直接返回path2（或根据实际情况处理）
    return '路径层级相同，返回第二个路径: ' + path2;
  } else if (diff > 0) {
    // 如果path2比path1多几级，返回多出的部分
    return segments2.slice(segments1.length).join('/');
  } else {
    // 如果path2比path1少几级，用'..'代替每缺少的一级
    return '../'.repeat(-diff) + segments2.join('/');
  }
};

const onEnter = (text: string) => {
  if (isSSHMode.value == false) {
    termWs.value.sendWs(
      JSON.stringify({
        type: 'exec',
        params: {
          cmd: text,
          path: null,
        },
      })
    );
  } else {
    termWs.value.sendWs(
      JSON.stringify({
        type: 'ssh',
        params: {
          cmd: text,
          path: null,
        },
      })
    );
  }
};

/**
 * 连接ws
 * @returns
 */
const openWs = async () => {
  await termWs.value.openWs('', () => {
    termWs.value.sendWs(
      JSON.stringify({
        type: 'exec',
        params: {
          cmd: 'cd',
          path: props.dirPath,
        },
      })
    );
  });
};

/** 连接SSH */
const handleConnectSSH = async () => {
  try {
    await devStore.connectSSH();
    termWs.value.closeWs();
    isSSHMode.value = true;
    await termWs.value.openWs('', () => {
      termWs.value.sendWs(
        JSON.stringify({
          type: 'ssh',
          params: {},
        })
      );
    });
    dialogFormVisible.value = false;
  } catch (err) {}
};

watch(
  () => termWs.value.msgQueue,
  stdout => {
    const line = stdout[stdout.length - 1];
    if (line.type == 'ssh') {
      isSSHMode.value = true;
    } else {
      isSSHMode.value = false;
    }

    if (line.action == 'meta') {
      if (line.type == 'ssh') {
        isSSHMode.value = true;
        termRef.value?.write('\n\n');
      }
      return;
    }
    termRef.value?.write(line.params);
    // ssh登出
    if (line.params?.includes('logout')) {
      isSSHMode.value = false;
      termWs.value.sendWs(
        JSON.stringify({
          type: 'ssh',
          params: {
            cmd: 'logout',
            path: null,
          },
        })
      );
    }
    // 更新路径前缀
    if (line.params?.startsWith('UpdateCwd:')) {
      prefixPath.value = line.params.replace('UpdateCwd:', '');
      termRef.value?.write('\n');
      // term.value.write(`\x1B[36;1m ${userName.value} <\x1B[36m${prefixPath.value}>\x1B[36;1m ~\x1B[0m $ `)
    }
  },
  { deep: true }
);

onMounted(() => {
  termRef.value?.write(
    `\x1B[36;1m Systerm ~\x1B[0m $ 默认使用Shell执行命令，如连接远程服务器，请点击ssh按钮使用ssh连接!\r\n`
  );
  termRef.value?.write(
    `\x1B[36;1m Systerm ~\x1B[0m $ ssh会话中使用【ctrl + c + Enter】终止应用程序运行！\r\n`
  );
  termRef.value?.write(
    `\x1B[36;1m Systerm ~\x1B[0m $ ssh会话中使用【ctrl + ad + Enter】退出ssh连接！\r\n`
  );
  termRef.value?.write(`\x1B[36;1m Systerm ~\x1B[0m $ cd ${props.dirPath}\r\n`);
  openWs();
});

onBeforeUnmount(() => {
  termWs.value.closeWs();
});
</script>
<style lang="scss" scoped>
.terminal {
  width: 100%;
  height: calc(100% - 62px);
}
.setting-bar {
  width: 100%;
  display: flex;
  margin-bottom: 5px;
}
</style>
