// 进行请求和响应拦截
import axios from 'axios';
import { ElMessage } from 'element-plus';
import useUserStore from '@/store/modules/user';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
nprogress.configure({ showSpinner: false });

const request = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

request.interceptors.request.use(config => {
  nprogress.start();
  const userStore = useUserStore();
  // console.log(userStore)
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  return config;
});

request.interceptors.response.use(
  response => {
    nprogress.done();
    return response?.data;
  },
  err => {
    let message = '';
    const status = err.response?.status;
    switch (status) {
      case 401:
        message = 'Token过期';
        break;
      case 403:
        message = '无权访问';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器错误';
        break;
      default:
        message = '网络出错';
        break;
    }
    ElMessage({
      type: 'error',
      message,
    });
    return Promise.reject(err);
  }
);

export default request;
