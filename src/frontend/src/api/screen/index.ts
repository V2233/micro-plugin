import request from '@/utils/request';
import type { logType } from './type';

enum API {
  LOGS_URL = '/bot/logs',
  STATUS_URL = '/bot/status',
}

// 日志接口
export const reqLogs = (id: string | number, page = 0, pageSize = 50) => {
  return request.get<any, logType>(
    API.LOGS_URL + '?id=' + id + '&page=' + page + '&size=' + pageSize
  );
};

// 状态接口
export const reqStstus = () => {
  return request.get<any, any>(API.STATUS_URL);
};
