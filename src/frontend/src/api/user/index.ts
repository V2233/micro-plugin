import request from '@/utils/request';
import type { loginForm } from './type';

enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/logout',
  SERVER_PORT_URL = '/user/port',
  SERVER_ADDRESS_URL = '/server/address',
}

// 登录接口
export const reqLogin = (data: loginForm) => {
  return request.post<any, any>(API.LOGIN_URL, data);
};

// 获取用户信息
export const reqUserInfo = () => {
  return request.get<any, any>(API.USERINFO_URL);
};

// 退出登录
export const reqLogout = () => {
  return request.post<any, any>(API.LOGOUT_URL);
};

// 获取后端端口
export const reqServerPort = () => {
  return request.get<any, any>(API.SERVER_PORT_URL);
};

// 提供后端地址
export const reqSaveServerAddress = (data: {
  hostname: string;
  port: string;
  protocol: string;
  origin: string;
}) => {
  return request.post<any, any>(API.SERVER_ADDRESS_URL, data);
};
