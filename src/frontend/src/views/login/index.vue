<template>
  <div class="login_container">
    <!-- 黑色遮罩层 -->
    <div class="login_mask"></div>

    <div class="login_box">
      <el-form :model="loginForm" :rules="rules" ref="loginForms" style="width: 100%">
        <h2>登录 Yunzai-Dev</h2>
        <el-form-item prop="username">
          <el-input class="form_input" :prefix-icon="User" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="form_input"
            :prefix-icon="Lock"
            show-password
            type="password"
            v-model="loginForm.password"
            @keydown.enter="login"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn_box" @click="login">
            <LoginBtn />
          </div>
        </el-form-item>
        <p>Powered by Yunzai-Bot & Micro-Plugin</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 时间欢迎提示
import { getTime } from '@/utils/time';
// 引入图标
import { Lock, User } from '@element-plus/icons-vue';
// 引入通告
import { ElNotification } from 'element-plus';
// 收集账号密码
import { reactive, ref } from 'vue';
// 引入 router
import { useRoute, useRouter } from 'vue-router';

import LoginBtn from './button.vue';

// 引入仓库
import useUserStore from '@/store/modules/user';
let useStore = useUserStore();
let $router = useRouter();
let $route = useRoute();

// 主题
let dark = ref<boolean>(true);

// 登录信息
let loginForm = reactive({ username: 'admin', password: '114514' });
// 按钮进度条
let loading = ref(false);
// 获取表单验证实例
let loginForms = ref();

/** 表单校验规则
 * @params rule 规则对象
 * @params value 校验值
 */
const validatorUsername = (rule: any, value: any, callback: any) => {
  // if(/^\d{5,10}/.test(value)) {
  // console.log(value)
  if (value.length >= 2 && value.length <= 20) {
    callback();
  } else {
    callback(new Error('账号长度2-20位'));
  }
};
const validatorPassword = (rule: any, value: any, callback: any) => {
  // if(/^\d{5,10}/.test(value)) {
  if (value.length >= 5 && value.length <= 20) {
    callback();
  } else {
    callback(new Error('密码长度5-20位'));
  }
};

const rules = reactive({
  username: [
    {
      trigger: 'change',
      validator: validatorUsername,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
});

// 点击登录
const login = async () => {
  await loginForms.value.validate();

  loading.value = true;
  // 通知仓库发送登录请求
  try {
    await useStore.userLogin(loginForm);
    // $router.push('/')
    // 判断路由是否含有重定向
    $router.push({
      path: ($route.query.redirect as any) || '/',
    });
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    });
    loading.value = false;
  } catch (err) {
    loading.value = false;
    ElNotification({
      type: 'error',
      message: (err as Error).message,
    });
  }
  // 请求成功，跳转数据页

  // 失败
};

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement;
  //判断HTML标签是否有类名dark
  html.className = 'dark';
};
</script>

<style scoped lang="scss">
.login_container {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: black;
  background-image: url('/wallpaper.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 40px;

  .login_mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2); /* 透明度25%的黑色遮罩 */
    z-index: 50;
  }

  .login_box {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 400px;
    height: auto;
    min-height: 400px;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 80;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 40px;
    margin: 20px;
    margin-right: calc(100% / 4); /* 调整位置到网页的3/4位置 */

    &:hover {
      box-shadow: 0 12px 48px rgba(29, 255, 225, 0.2);
      transform: translateY(-5px);
    }

    h2 {
      font-size: 24px;
      color: rgb(13, 234, 24);
      margin: 20px 0;
      text-align: center;
      font-weight: 600;
    }

    .btn_box {
      margin-top: 20px;
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    p:last-child {
      font-size: 13px;
      line-height: 18px;
      color: #49dd13;
      font-weight: 600;
      text-align: center;
      margin-top: 20px;
      opacity: 0.8;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }

    .blinking-image {
      height: 200px;
      animation: blink 1.2s infinite;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }

    @keyframes blink {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      30%,
      60% {
        opacity: 0.5;
        transform: scale(0.95);
      }
    }

    .el-form {
      width: 100%;
    }

    .form_input {
      color: #000;
    }

    .el-input__wrapper {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(29, 255, 225, 0.3);
      border-radius: 12px;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 10px rgba(29, 255, 225, 0.2);
      }

      &.is-focus {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(29, 255, 225, 0.3);
        border-color: rgb(29, 255, 225);
      }
    }

    .el-input__inner {
      color: white;
      background: transparent;
    }
  }

  /* 在网页宽度小于高度时调整布局 */
  @media (orientation: portrait) {
    .login_box {
      width: 100%;
      max-width: 400px;
      margin-right: 0;
    }
  }

  h1 {
    color: white;
    font-size: 40px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
