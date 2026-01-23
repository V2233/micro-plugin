import request from '@/utils/request';

enum REDISAPI {
  GET_ALLKEYS_URL = '/database/redis/allkeys',
  GET_KEY_URL = '/database/redis/getkey',
  SET_KEY_URL = '/database/redis/setkey',
  DEL_KEY_URL = '/database/redis/delkey',
  DEL_KEYS_URL = '/database/redis/delkeys',
}

/**
 * 获取所有键
 * @param sep 分隔符
 * @returns
 */
export const reqRedisKeys = (sep: string | undefined) => {
  return request.get<any, any>(REDISAPI.GET_ALLKEYS_URL + (sep ? `?sep=${sep as string}` : ''));
};

/**
 * 获取某个键值
 * @param key
 * @returns
 */
export const reqGetRedisKey = (key: string) => {
  return request.get<any, any>(REDISAPI.GET_KEY_URL + '?key=' + key);
};

/**
 * 设置键
 * @param data
 * @returns
 */
export const reqSetRedisKey = (data: { key: string; value: any }) => {
  return request.post<any, any>(REDISAPI.SET_KEY_URL, data);
};

/**
 * 删除键
 * @param key
 * @returns
 */
export const reqDelRedisKey = (key: string) => {
  return request.delete<any, any>(REDISAPI.DEL_KEY_URL + '?key=' + key);
};

/**
 * 批量删除键
 * @param key
 * @returns
 */
export const reqDelRedisKeys = (key: string) => {
  return request.delete<any, any>(REDISAPI.DEL_KEYS_URL + '?key=' + key);
};
