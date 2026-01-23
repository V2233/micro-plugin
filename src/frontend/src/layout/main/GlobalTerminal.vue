<template>
  <div class="log_box">
    <Terminal class="terminal" ref="termRef" @press-enter="onEnter">
      <template #header-left>
        <el-button
          size="small"
          v-for="sess of tabs"
          :type="sess.id === termSession?.id ? 'primary' : 'default'"
          @click="changeTab(sess)"
        >
          <span
            v-if="sess.mode == 'shell' && netRtt"
            :style="{ color: netRttColor, marginRight: '5px' }"
            >{{ netRtt + ' ms ' }}
          </span>
          {{ sess.mode == 'shell' ? sess.mode + '_' + sess.id.split('_')[1] : '' }}
          {{
            sess.mode == 'ssh'
              ? `${sess.mode}_${sess.id.split('_')[1]}${sess.sshConfig ? '@' + sess.sshConfig?.username : ''}`
              : ''
          }}
          <el-icon class="el-icon--right">
            <Close @click="deleteSession(sess)" />
          </el-icon>
        </el-button>
        <el-dropdown>
          <el-button icon="Plus" circle size="small" style="margin-left: 5px"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleConnectShell"> Shell </el-dropdown-item>
              <el-dropdown-item @click="dialogFormVisible = true"> SSH </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #header-right>
        <el-tooltip effect="dark" content="销毁全部会话" placement="bottom-end">
          <el-button
            icon="SwitchButton"
            circle
            size="small"
            @click="destroy"
            style="color: red"
          ></el-button>
        </el-tooltip>
      </template>
    </Terminal>
    <!-- ssh连接设置 -->
    <el-dialog v-model="dialogFormVisible" title="ssh连接设置">
      <el-form>
        <el-form-item label="主机">
          <el-input
            :placeholder="localtionHost"
            :prefix-icon="User"
            v-model="devStore.sshInfo.host"
            :input-style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-input
            placeholder="root"
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
            placeholder="22"
            :prefix-icon="Lock"
            v-model="devStore.sshInfo.port"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          size="default"
          @click="handleConnectSSH"
          :loading="!!termSession?.sshConfig?.loading"
        >
          连接
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Terminal from '@/components/Terminal/index.vue';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

// 引入图标
import { Lock, User } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';

import useDevStore from '@/store/modules/dev';
import useLayoutSettingStore from '@/store/modules/setting';

import Session, { NoticeTypes } from './Session';

const props = defineProps(['dirPath']);

// ssh表单
const dialogFormVisible = ref(false);

const devStore = useDevStore();

const layoutSettingStore = useLayoutSettingStore();

// 视图显示PATH
const prefixPath = ref(props.dirPath);

const termRef = ref<InstanceType<typeof Terminal>>();

const termSession = shallowRef<Session>();

const tabs = ref<Session[]>([]);

const localtionHost = ref(location.hostname || location.host);

//@ts-ignore
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

//@ts-ignore
const netRtt = ref(connection?.rtt);

const netRttColor = computed(() => {
  if (netRtt.value <= 100) {
    return 'green';
  } else if (netRtt.value <= 250) {
    return 'yellow';
  } else {
    return 'red';
  }
});

const updateRtt = () => {
  netRtt.value = connection?.rtt;
};

const onEnter = (text: string) => {
  updateRtt();
  if (!termSession.value) return;
  if (text.startsWith('clear')) {
    termSession.value.msgQueue = [];
    const ss = Session.sessions.get(termSession.value.id);
    if (ss) ss.msgQueue = [];
  }
  if (termSession.value?.mode == 'ssh') {
    termSession.value.ws?.send(
      JSON.stringify({
        clientId: termSession.value.id,
        type: 'ssh',
        params: {
          cmd: text,
          path: null,
        },
      })
    );
  } else {
    termSession.value.ws?.send(
      JSON.stringify({
        clientId: termSession.value.id,
        type: 'exec',
        params: {
          cmd: text,
          path: null,
        },
      })
    );
  }
};

/** 连接SSH */
const handleConnectSSH = async () => {
  const urlParams = new URLSearchParams({
    host: devStore.sshInfo.host,
    port: String(devStore.sshInfo.port),
    username: devStore.sshInfo.username,
    password: devStore.sshInfo.password,
  });

  termSession.value = new Session('ssh');
  // return
  termSession.value!.sshConfig = {
    loading: true,
  };
  termSession.value.connect('/micro/webui/term/ssh?' + urlParams.toString()).then(e => {
    termSession.value?.ws?.send(
      JSON.stringify({
        type: 'ssh',
        params: {},
      })
    );
    termSession.value!.sshConfig = {
      loading: false,
      host: urlParams.get('host') || '',
      username: urlParams.get('username') || '',
      password: urlParams.get('password') || '',
      port: Number(urlParams.get('port')),
    };
    dialogFormVisible.value = false;
    termRef.value?.write('正在连接SSH...\n');
    termSession.value?.ws?.addEventListener('message', e => {
      const msg = JSON.parse(e.data);
      console.log(msg);
      if (msg.type === 'ssh') {
        if (msg.action === 'stdout') termRef.value?.write(msg.params);
        else if (msg.action === 'meta') termRef.value?.termRef.clear();
      }
    });
  });
};

/** 连接Shell */
const handleConnectShell = async () => {
  termSession.value = new Session('shell');
  termSession.value.connect().then(e => {
    termSession.value?.ws?.addEventListener('message', e => {
      const msg = JSON.parse(e.data);
      console.log(msg);
      if (msg.type === 'exec') {
        termRef.value?.write(msg.params);
      }
    });
  });
};

const changeTab = (session: Session) => {
  if (session.id == termSession.value?.id) return;
  Session.activeSession = session;
  termSession.value = session;
  termRef.value?.termRef.clear();
  termRef.value?.write(
    session.msgQueue
      .map(v => {
        if (
          (v?.type === 'exec' || v?.type === 'ssh') &&
          (v?.action === 'stdout' || v?.action === 'stderr')
        ) {
          return v.params;
        } else {
          return '';
        }
      })
      .join('\n')
  );
};

const destroy = () => {
  Session.sessions.forEach(session => {
    if (session.ws?.readyState == session.ws?.OPEN) {
      session.ws?.close();
    }
    session.msgQueue = [];
  });
  Session.sessions.clear();
  Session.activeSession = null;
  Session.onSessionsChange?.(NoticeTypes.SUCCESS, '会话已注销！');

  layoutSettingStore.globalTerminal.visible = false;
  layoutSettingStore.globalTerminal.running = false;
};

const deleteSession = (session: Session) => {
  if (tabs.value.length <= 1) {
    destroy();
    return;
  }
  Session.deleteSession(session);
  changeTab(tabs.value[0] as Session);
};

onMounted(() => {
  Session.onSessionsChange = (type, message) => {
    ElNotification({
      type,
      message,
    });
    tabs.value = tabs.value = Array.from(Session.sessions.values());
  };
  handleConnectShell();
  connection?.addEventListener('change', updateRtt);
});

onBeforeUnmount(() => {
  destroy();
  Session.onSessionsChange = null;
  connection?.removeEventListener('change', updateRtt);
});
</script>
<style lang="scss" scoped>
@use '@/style/variable.scss' as *;
.log_box {
  border-radius: $border-radius-medium;
  overflow: hidden;
  z-index: 88;
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
  // padding-top: 5px;
}
</style>
