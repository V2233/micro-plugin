import request from '@/utils/request';
import type {
  userConfigResponseType,
  guobaPluginsInfoResponseType,
  guobaPluginsConfigResponseType,
} from './type';

enum API {
  GET_CONFIG_URL = '/bot/getcfg',
  SET_CONFIG_URL = '/bot/setcfg',

  GET_PLUGIN_INFO_URL = '/plugins/getinfo',
  GET_PLUGIN_CONFIG_URL = '/plugins/getcfg',
  SET_PLUGIN_CONFIG_URL = '/plugins/setcfg',

  GET_USER_CONFIG_URL = '/user/getcfg',
  SET_USER_CONFIG_URL = '/user/setcfg',

  GET_PROTOCOL_CONFIG_URL = '/protocol/getcfg',
  SET_PROTOCOL_CONFIG_URL = '/protocol/setcfg',
}

/**
 * 获取bot配置
 * @param name 配置模块
 * @returns
 */
export const reqBotConfig = (name: string) => {
  return request.get<any, any>(API.GET_CONFIG_URL + '?name=' + name);
};

/**
 * 设置bot配置
 * @param name
 * @param data
 * @returns
 */
export const reqSetBotConfig = (name: string, data: any) => {
  return request.post<any, any>(API.SET_CONFIG_URL + '?name=' + name, data);
};

/**
 * 获取插件列表
 * @param source
 * @returns
 */
export const reqPluginInfo = (source: string) => {
  return request.get<any, guobaPluginsInfoResponseType>(
    API.GET_PLUGIN_INFO_URL + '?source=' + source
  );
};

/**
 * 获取plugin配置
 * @param pluginName
 * @param source
 * @returns
 */
export const reqPluginConfig = (pluginName: string, source: string) => {
  return request.get<any, guobaPluginsConfigResponseType>(
    API.GET_PLUGIN_CONFIG_URL + '?source=' + source + '&pluginName=' + pluginName
  );
};

/**
 * 设置plugin配置
 * @param pluginName
 * @param source
 * @param data
 * @returns
 */
export const reqSetPluginConfig = (pluginName: string, source: string, data: any) => {
  return request.post<any, any>(
    API.SET_PLUGIN_CONFIG_URL + '?source=' + source + '&pluginName=' + pluginName,
    data
  );
};

/**
 * 获取user配置
 * @returns
 */
export const reqUserConfig = () => {
  return request.get<any, userConfigResponseType>(API.GET_USER_CONFIG_URL);
};

/**
 * 设置user配置
 * @param data
 * @returns
 */
export const reqSetUserConfig = (data: any) => {
  return request.post<any, any>(API.SET_USER_CONFIG_URL, data);
};

/**
 * 获取protocol配置
 * @returns
 */
export const reqProtocolConfig = () => {
  return request.get<any, any>(API.GET_PROTOCOL_CONFIG_URL);
};

/**
 * 设置protocol配置
 * @param data
 * @returns
 */
export const reqSetProtocolConfig = (data: any) => {
  return request.post<any, any>(API.SET_PROTOCOL_CONFIG_URL, data);
};
