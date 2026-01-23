<template>
  <el-button
    type="primary"
    size="small"
    :icon="layoutSettingStore.globalTerminal.visible ? 'Platform' : 'Monitor'"
    circle
    @click="toggleTerminal"
  ></el-button>
  <el-button type="primary" size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button type="primary" size="small" icon="FullScreen" circle @click="fullScreen"></el-button>

  <!-- 修改关闭判定为点击外部或按下Esc -->
  <el-popover
    ref="popoverRef"
    placement="bottom"
    title="主题设置"
    :width="300"
    trigger="click"
    popper-class="theme-popover"
    :close-on-click-outside="true"
    :close-on-press-escape="true"
  >
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="isDark"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>

  <img
    class="avatar"
    :src="
      userStore.avatar
        ? userStore.avatar
        : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`
    "
  />

  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu :style="{ maxHeight: '200px' }">
        <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
        <div v-for="(item, index) in Object.keys(userStore.tokens)" :key="index">
          <el-dropdown-item
            v-if="userStore.tokens && item !== userStore.token"
            @click="checkAccout(item)"
          >
            {{ userStore.tokens[item]?.username }}
            <el-icon
              class="el-icon-close"
              style="margin-left: 5px; align-self: center"
              @click="deleteToken(item)"
            >
              <Close />
            </el-icon>
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

let $router = useRouter();
let $route = useRoute();

let layoutSettingStore = useLayoutSettingStore();
let userStore = useUserStore();

const isDark = computed(() => layoutSettingStore.theme === 'dark');

const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
};

const toggleTerminal = () => {
  layoutSettingStore.globalTerminal.visible = !layoutSettingStore.globalTerminal.visible;
};

const fullScreen = () => {
  // 判断是否全屏
  let full = document.fullscreenElement;
  if (!full) {
    // 开启全屏
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const logOut = async () => {
  // 向后端发请求

  // 清空token
  await userStore.logOut();
  // 跳转登录页
  $router.push({
    path: '/login',
    query: {
      redirect: $route.path,
    },
  });
};

// 切换账户
const checkAccout = (token: string) => {
  localStorage.setItem('TOKEN', String(token));
  window.location.reload();
};

const deleteToken = (token: string) => {
  delete userStore.tokens[token];
  localStorage.setItem('HISTORY_TOKENS', JSON.stringify(userStore.tokens));
};

//颜色组件组件的数据
const color = ref('rgba(255, 69, 0, 0.68)');
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]);

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  layoutSettingStore.theme = layoutSettingStore.theme == 'dark' ? 'light' : 'dark';
};

//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement;
  html.style.setProperty('--el-color-primary', color.value);
};
</script>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>

<style scoped lang="scss">
.avatar {
  width: 24px;
  height: 24px;
  margin: 0 10px;
  border-radius: 50%;
}

.el-icon-close {
  border-radius: 50%;
}

.el-icon-close:hover {
  background-color: green;
}
</style>
