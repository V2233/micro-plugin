import request from '@/utils/request';
// import type {loginForm,loginResponsepath,userInfoResponsepath} from './type'

enum API {
  LSIT_DIR_URL = '/fs/listdir/',
  CREATE_URL = '/fs/create/',
  MKDIR_URL = '/fs/mkdir/',
  OPEN_URL = '/fs/open/',
  RM_FILE_URL = '/fs/rmfile/',
  RM_DIR_URL = '/fs/rmdir/',
  SAVE_File_URL = '/fs/savefile/',
  MOVE_File_URL = '/fs/movefile/',
  MOVE_Dir_URL = '/fs/movedir/',
  COPY_File_URL = '/fs/copyfile/',
  COPY_Dir_URL = '/fs/copydir/',
  RENAME_FILE_URL = '/fs/renamefile/',
  RENAME_Dir_URL = '/fs/renamedir/',

  READ_MEDIA_URL = '/fs/media',
  SEARCH_URL = '/fs/search/',
  UPLOAD_URL = '/fs/upload',
  DOWNLOAD_URL = '/fs/download',
  Filter_TREE_URL = '/fs/filtertree',
  FILES_SIZE_URL = '/fs/filesize',

  CONNECT_SSH_URL = '/fs/openssh',
  CLOSE_SSH_URL = '/fs/closessh',
}

// 列出文件目录
export const reqListDir = (path: any) => {
  return request.get<any, any>(API.LSIT_DIR_URL + '?path=' + path);
};

// 获取目录大小
export const reqFilesSize = (path: string, type: string) => {
  return request.get<any, any>(API.FILES_SIZE_URL + '?path=' + path + '&type=' + type);
};

// 创建文件
export const reqTouch = (path: any) => {
  return request.get<any, any>(API.CREATE_URL + '?path=' + path);
};

// 创建目录
export const reqMkdir = (path: any) => {
  return request.get<any, any>(API.MKDIR_URL + '?path=' + path);
};

// 打开并读取文件
export const reqReadFile = (path: any) => {
  return request.get<any, any>(API.OPEN_URL + '?path=' + path);
};

// 打开并读取富媒体文件
export const reqReadMediaFile = (path: any) => {
  return request.get<any, any>(API.READ_MEDIA_URL + '?path=' + path, {
    responseType: 'blob',
  });
};

// 删除文件
export const reqRmFile = (path: any) => {
  return request.delete<any, any>(API.RM_FILE_URL + '?path=' + path);
};

// 删除目录
export const reqRmDir = (path: any) => {
  return request.delete<any, any>(API.RM_DIR_URL + '?path=' + path);
};

// 保存文件
export const reqSaveFile = (path: any, content: string) => {
  return request.post<any, any>(API.SAVE_File_URL + '?path=' + path, {
    content,
  });
};

// 移动文件
export const reqMoveFile = (path: any, newPath: string) => {
  return request.get<any, any>(API.MOVE_File_URL + '?path=' + path + '&newPath=' + newPath);
};

// 移动目录
export const reqMoveDir = (path: any, newPath: string) => {
  return request.get<any, any>(API.MOVE_Dir_URL + '?path=' + path + '&newPath=' + newPath);
};

// 复制文件
export const reqCopyFile = (path: any, newPath: string) => {
  return request.get<any, any>(API.COPY_File_URL + '?path=' + path + '&newPath=' + newPath);
};

// 复制目录
export const reqCopyDir = (path: any, newPath: string) => {
  return request.get<any, any>(API.COPY_Dir_URL + '?path=' + path + '&newPath=' + newPath);
};

// 重命名文件
export const reqRenameFile = (path: any, newPath: string) => {
  return request.get<any, any>(API.RENAME_FILE_URL + '?path=' + path + '&newPath=' + newPath);
};

// 重命名文件目录
export const reqRenameDir = (path: any, newPath: string) => {
  return request.get<any, any>(API.RENAME_Dir_URL + '?path=' + path + '&newPath=' + newPath);
};

// 查找文件或目录
export const reqSearchFs = (path: any, keyWord: string) => {
  return request.get<any, any>(API.SEARCH_URL + '?path=' + path + '&keyWord=' + keyWord);
};

// 上传文件目录
export const reqUpload = (path: any) => {
  return request.get<any, any>(API.UPLOAD_URL + '?path=' + path);
};

// 下载文件目录
export const reqDownload = (path: any) => {
  return request.get<any, any>(API.DOWNLOAD_URL + '?path=' + path, {
    responseType: 'blob',
  });
};

// 过滤目录树
export const reqFilterDirTree = (path: string, ex: string) => {
  return request.get<any, any>(API.Filter_TREE_URL + '?path=' + path + '&ex=' + ex);
};

// ssh连接
export const reqConnectSSH = (data: {
  host: string;
  port?: number;
  username: string;
  password: string;
}) => {
  return request.get<any, any>(
    API.CONNECT_SSH_URL +
      '?host=' +
      data.host +
      '&port=' +
      data.port +
      '&username=' +
      data.username +
      '&password=' +
      data.password
  );
};

// 断开ssh
export const reqCloseSSH = () => {
  return request.get<any, any>(API.CLOSE_SSH_URL);
};
