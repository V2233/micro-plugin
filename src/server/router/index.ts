//@ts-ignore
import Router from 'koa-router'
import auth from '../middleware/auth.js'

import UserController from '../controller/user/index.js'
import LogController from '../controller/logger/index.js'
import StateController from '../controller/status/index.js'
import FsController from '../controller/fs/index.js'
import PluginController from '../controller/plugin/index.js'
import InfoController from '../controller/info/index.js'
import ConfigController from '../controller/config/index.js'
import SandboxController from '../controller/sandbox/index.js'

enum FSAPI {
    LSIT_DIR_URL = '/fs/listdir',
    CREATE_URL = '/fs/create',
    MKDIR_URL = '/fs/mkdir',
    OPEN_URL = '/fs/open',
    RM_FILE_URL = '/fs/rmfile',
    RM_DIR_URL = '/fs/rmdir',
    SAVE_File_URL = '/fs/savefile',
    MOVE_File_URL = '/fs/movefile',
    MOVE_Dir_URL = '/fs/movedir',
    COPY_File_URL = '/fs/copyfile',
    COPY_Dir_URL = '/fs/copydir',
    RENAME_FILE_URL = '/fs/renamefile',
    RENAME_Dir_URL = '/fs/renamedir',

    READ_MEDIA_URL = '/fs/media',
    SEARCH_URL = '/fs/search',
    UPLOAD_URL = '/fs/upload',
    DOWNLOAD_URL = '/fs/download',
    FITTER_TREE_URL = '/fs/filtertree',
    FILES_SIZE_URL = '/fs/filesize'
}

enum PLUGINSAPI {
    ADD_PLUGIN_URL = '/plugins/add',
    DELETE_PLUGIN_URL = '/plugins/delete',
    PUT_PLUGIN_URL = '/plugins/put',
    GET_PLUGINLIST_URL = '/plugins/get',
    GET_HTML_PROJECT_URL = '/plugins/imgJSON',
    GET_BUTTON_PROJECT_URL = '/plugins/btnJSON',
}

enum BOTAPI {
    LOG_URL = '/bot/logs',
    STATUS_URL = '/bot/status',
    INFO_URL = '/bot/info',
    URI_URL = '/bot/URI',
    SERVER_PORT_URL = '/bot/port',
}

enum CONFIGAPI {
    GET_BOT_CONFIG_URL = '/bot/getcfg',
    SET_BOT_CONFIG_URL = '/bot/setcfg',

    GET_PLUGIN_INFO_URL = '/plugins/getinfo',
    GET_PLUGIN_CONFIG_URL = '/plugins/getcfg',
    SET_PLUGIN_CONFIG_URL = '/plugins/setcfg',

    GET_USER_CONFIG_URL = '/user/getcfg',
    SET_USER_CONFIG_URL = '/user/setcfg',

    GET_PROTOCOL_CONFIG_URL = '/protocol/getcfg',
    SET_PROTOCOL_CONFIG_URL = '/protocol/setcfg',
}

enum SANDBOXAPI {
    GET_PLUGINS_LOADER = '/sandbox/getloader',
    UPLOAD_FILE_URL = '/sandbox/upload',

    GET_ONEBOT11_DATA_URL = '/sandbox/onebot11/getdata',
    SET_ONEBOT11_DATA_URL = '/sandbox/onebot11/setdata',
    RESET_ONEBOT11_DATA_URL = '/sandbox/onebot11/resetdata'
}

const router = new Router({ prefix: '/api' })

// 账户相关
router.post('/login', UserController.login)

router.post('/logOut', UserController.logOut)

router.get('/user/info', auth, UserController.userInfo)

router.get('/user/port', auth, UserController.getPort)

router.post('/server/address', UserController.getWebAddress)


// 配置相关
router.get(CONFIGAPI.GET_BOT_CONFIG_URL, auth, ConfigController.getBotConfig)

router.post(CONFIGAPI.SET_BOT_CONFIG_URL, auth, ConfigController.setBotConfig)

router.get(CONFIGAPI.GET_USER_CONFIG_URL, auth, ConfigController.getUserConfig)

router.post(CONFIGAPI.SET_USER_CONFIG_URL, auth, ConfigController.setUserConfig)

router.get(CONFIGAPI.GET_PROTOCOL_CONFIG_URL, auth, ConfigController.getProtocolConfig)

router.post(CONFIGAPI.SET_PROTOCOL_CONFIG_URL, auth, ConfigController.setProtocolConfig)

router.get(CONFIGAPI.GET_PLUGIN_INFO_URL, auth, ConfigController.getPluginsInfoList)

router.get(CONFIGAPI.GET_PLUGIN_CONFIG_URL, auth, ConfigController.getPluginConfig)

router.post(CONFIGAPI.SET_PLUGIN_CONFIG_URL, auth, ConfigController.setPluginConfig)


// Bot相关
router.get(BOTAPI.LOG_URL, auth, LogController.logger)

router.get(BOTAPI.STATUS_URL, StateController.sysInfo)

router.get(BOTAPI.INFO_URL, InfoController.botInfo)

router.get(BOTAPI.URI_URL, InfoController.botURI)


// 沙盒
router.get(SANDBOXAPI.GET_PLUGINS_LOADER, SandboxController.getPluginsLoader)

router.post(SANDBOXAPI.UPLOAD_FILE_URL, SandboxController.uploadFile)

router.get(SANDBOXAPI.GET_ONEBOT11_DATA_URL, SandboxController.getOnebot11Data)

router.post(SANDBOXAPI.SET_ONEBOT11_DATA_URL, SandboxController.setOnebot11Data)

router.delete(SANDBOXAPI.RESET_ONEBOT11_DATA_URL, SandboxController.reSetOnebot11Data)


// 插件列表
router.post(PLUGINSAPI.ADD_PLUGIN_URL, PluginController.setPlugin)

router.delete(PLUGINSAPI.DELETE_PLUGIN_URL, PluginController.deletePlugin)

router.put(PLUGINSAPI.PUT_PLUGIN_URL, PluginController.editorPlugin)

router.get(PLUGINSAPI.GET_PLUGINLIST_URL, PluginController.getPluginList)

router.get(PLUGINSAPI.GET_HTML_PROJECT_URL, PluginController.getImageJson)

router.post(PLUGINSAPI.GET_BUTTON_PROJECT_URL, PluginController.getSegResources)


// 文件系统
router.get(FSAPI.CREATE_URL, FsController.touch)

router.get(FSAPI.LSIT_DIR_URL, FsController.listDir)

router.get(FSAPI.MKDIR_URL, FsController.mkdir)

router.get(FSAPI.OPEN_URL, FsController.readFile)

router.get(FSAPI.COPY_Dir_URL, FsController.copyDir)

router.get(FSAPI.COPY_File_URL, FsController.copyFile)

router.get(FSAPI.MOVE_Dir_URL, FsController.moveDir)

router.get(FSAPI.MOVE_File_URL, FsController.moveFile)

router.get(FSAPI.RENAME_Dir_URL, FsController.renameDir)

router.get(FSAPI.RENAME_FILE_URL, FsController.renameFile)

router.post(FSAPI.SAVE_File_URL, FsController.saveFile)

router.delete(FSAPI.RM_DIR_URL, auth, FsController.rmDir)

router.delete(FSAPI.RM_FILE_URL, auth, FsController.rmFile)

router.get(FSAPI.READ_MEDIA_URL, FsController.readMediaFile)

router.get(FSAPI.SEARCH_URL, FsController.search)

router.post(FSAPI.UPLOAD_URL, FsController.upload)

router.get(FSAPI.DOWNLOAD_URL, FsController.download)

router.get(FSAPI.FITTER_TREE_URL, FsController.getFilesTree)

router.get(FSAPI.FILES_SIZE_URL, FsController.getFilesSize)

export default router