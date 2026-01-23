import request from '@/utils/request';

enum API {
  GET_PLUGINS_LOADER = '/sandbox/getloader',
  UPLOAD_FILE_URL = '/sandbox/upload',

  GET_ONEBOT11_DATA_URL = '/sandbox/onebot11/getdata',
  SET_ONEBOT11_DATA_URL = '/sandbox/onebot11/setdata',
  RESET_ONEBOT11_DATA_URL = '/sandbox/onebot11/resetdata',
}

/**
 * 获取插件指令
 * @returns
 */
export const reqPluginsLoader = () => {
  return request.get<any, any>(API.GET_PLUGINS_LOADER);
};

/**
 * 上传文件
 * @param formData
 * @returns
 */
export const reqUploadFile = (formData: FormData) => {
  return request.post<any, any>(API.UPLOAD_FILE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 获取onebot数据
 * @returns
 */
export const reqOnebot11Data = () => {
  return request.get<any, any>(API.GET_ONEBOT11_DATA_URL);
};

/**
 * 设置onebot11数据
 * @param data
 * @returns
 */
export const reqSetOnebot11Data = (data: any) => {
  return request.post<any, any>(API.SET_ONEBOT11_DATA_URL, data);
};

/**
 * 重置onebot11数据
 * @returns
 */
export const reqResetOnebot11Data = () => {
  return request.delete<any, any>(API.RESET_ONEBOT11_DATA_URL);
};
