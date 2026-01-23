import request from '@/utils/request';
import type {
  BotInfoResponseType,
  botURIResponseType,
  pluginType,
  pluginResponseType,
  pluginElResponseType,
} from './type';

enum API {
  BOT_INFO_URL = '/bot/info',
  BOT_WORKURI_URL = '/bot/URI',

  ADD_PLUGIN_URL = '/plugins/add',
  DELETE_PLUGIN_URL = '/plugins/delete',
  PUT_PLUGIN_URL = '/plugins/put',
  GET_PLUGINLIST_URL = '/plugins/get',

  GET_HTML_PROJECT_URL = '/plugins/imgJSON',
  GET_BUTTON_PROJECT_URL = '/plugins/btnJSON',
}

/**
 *  获取bot信息
 * @returns
 */
export const reqBotInfo = () => {
  return request.get<any, BotInfoResponseType>(API.BOT_INFO_URL);
};

/**
 * 获取bot工作URI
 * @returns
 */
export const reqBotWorkURI = () => {
  return request.get<any, botURIResponseType>(API.BOT_WORKURI_URL);
};

/**
 * 获取插件列表
 * @returns
 */
export const reqPluginsList = () => {
  return request.get<any, pluginResponseType>(API.GET_PLUGINLIST_URL);
};

/**
 * 添加插件
 * @param plugin 插件对象
 * @returns
 */
export const reqAddPlugin = (plugin: pluginType) => {
  return request.post<any, pluginResponseType>(API.ADD_PLUGIN_URL, plugin);
};

/**
 * 删除插件
 * @param index 插件索引
 * @returns
 */
export const reqDeletePlugin = (index: number) => {
  return request.delete<any, pluginResponseType>(API.DELETE_PLUGIN_URL + '?index=' + index);
};

/**
 * 修改插件
 * @param index 插件索引
 * @param plugin 插件对象
 * @returns
 */
export const reqEditorPlugin = (index: string, plugin: pluginType) => {
  return request.put<any, pluginResponseType>(API.PUT_PLUGIN_URL + '?index=' + index, plugin);
};

/**
 *
 * @param id 插件id
 * @param hash 图片哈希
 * @returns
 */
export const reqImageJson = (id: string, hash: string) => {
  return request.get<any, any>(API.GET_HTML_PROJECT_URL + '?id=' + id + '&hash=' + hash);
};

/**
 *
 * @param plugin 插件数据
 * @returns
 */
export const reqBtnJson = (data: pluginType) => {
  return request.post<any, pluginElResponseType>(API.GET_BUTTON_PROJECT_URL, data);
};
