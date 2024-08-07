import Router from 'koa-router';
import auth from '../middleware/auth.js';
import UserController from '../controller/user/index.js';
import LogController from '../controller/logger/index.js';
import StateController from '../controller/status/index.js';
import FsController from '../controller/fs/index.js';
import PluginController from '../controller/plugin/index.js';
import InfoController from '../controller/info/index.js';
import ConfigController from '../controller/config/index.js';

var FSAPI;
(function (FSAPI) {
    FSAPI["LSIT_DIR_URL"] = "/fs/listdir";
    FSAPI["CREATE_URL"] = "/fs/create";
    FSAPI["MKDIR_URL"] = "/fs/mkdir";
    FSAPI["OPEN_URL"] = "/fs/open";
    FSAPI["RM_FILE_URL"] = "/fs/rmfile";
    FSAPI["RM_DIR_URL"] = "/fs/rmdir";
    FSAPI["SAVE_File_URL"] = "/fs/savefile";
    FSAPI["MOVE_File_URL"] = "/fs/movefile";
    FSAPI["MOVE_Dir_URL"] = "/fs/movedir";
    FSAPI["COPY_File_URL"] = "/fs/copyfile";
    FSAPI["COPY_Dir_URL"] = "/fs/copydir";
    FSAPI["RENAME_FILE_URL"] = "/fs/renamefile";
    FSAPI["RENAME_Dir_URL"] = "/fs/renamedir";
    FSAPI["READ_MEDIA_URL"] = "/fs/media";
    FSAPI["SEARCH_URL"] = "/fs/search";
    FSAPI["UPLOAD_URL"] = "/fs/upload";
    FSAPI["DOWNLOAD_URL"] = "/fs/download";
    FSAPI["FITTER_TREE_URL"] = "/fs/filtertree";
    FSAPI["FILES_SIZE_URL"] = "/fs/filesize";
})(FSAPI || (FSAPI = {}));
var PLUGINSAPI;
(function (PLUGINSAPI) {
    PLUGINSAPI["ADD_PLUGIN_URL"] = "/plugins/add";
    PLUGINSAPI["DELETE_PLUGIN_URL"] = "/plugins/delete";
    PLUGINSAPI["PUT_PLUGIN_URL"] = "/plugins/put";
    PLUGINSAPI["GET_PLUGINLIST_URL"] = "/plugins/get";
    PLUGINSAPI["GET_HTML_PROJECT_URL"] = "/plugins/imgJSON";
    PLUGINSAPI["GET_BUTTON_PROJECT_URL"] = "/plugins/btnJSON";
})(PLUGINSAPI || (PLUGINSAPI = {}));
var BOTAPI;
(function (BOTAPI) {
    BOTAPI["LOG_URL"] = "/bot/logs";
    BOTAPI["STATUS_URL"] = "/bot/status";
    BOTAPI["INFO_URL"] = "/bot/info";
    BOTAPI["URI_URL"] = "/bot/URI";
    BOTAPI["SERVER_PORT_URL"] = "/bot/port";
})(BOTAPI || (BOTAPI = {}));
var CONFIGAPI;
(function (CONFIGAPI) {
    CONFIGAPI["GET_BOT_CONFIG_URL"] = "/bot/getcfg";
    CONFIGAPI["SET_BOT_CONFIG_URL"] = "/bot/setcfg";
    CONFIGAPI["GET_PLUGIN_INFO_URL"] = "/plugins/getinfo";
    CONFIGAPI["GET_PLUGIN_CONFIG_URL"] = "/plugins/getcfg";
    CONFIGAPI["SET_PLUGIN_CONFIG_URL"] = "/plugins/setcfg";
    CONFIGAPI["GET_USER_CONFIG_URL"] = "/user/getcfg";
    CONFIGAPI["SET_USER_CONFIG_URL"] = "/user/setcfg";
    CONFIGAPI["GET_PROTOCOL_CONFIG_URL"] = "/protocol/getcfg";
    CONFIGAPI["SET_PROTOCOL_CONFIG_URL"] = "/protocol/setcfg";
})(CONFIGAPI || (CONFIGAPI = {}));
const router = new Router({ prefix: '/api' });
router.post('/login', UserController.login);
router.post('/logOut', UserController.logOut);
router.get('/user/info', auth, UserController.userInfo);
router.get('/user/port', auth, UserController.getPort);
router.get(CONFIGAPI.GET_BOT_CONFIG_URL, auth, ConfigController.getBotConfig);
router.post(CONFIGAPI.SET_BOT_CONFIG_URL, auth, ConfigController.setBotConfig);
router.get(CONFIGAPI.GET_USER_CONFIG_URL, auth, ConfigController.getUserConfig);
router.post(CONFIGAPI.SET_USER_CONFIG_URL, auth, ConfigController.setUserConfig);
router.get(CONFIGAPI.GET_PROTOCOL_CONFIG_URL, auth, ConfigController.getProtocolConfig);
router.post(CONFIGAPI.SET_PROTOCOL_CONFIG_URL, auth, ConfigController.setProtocolConfig);
router.get(CONFIGAPI.GET_PLUGIN_INFO_URL, auth, ConfigController.getPluginsInfoList);
router.get(CONFIGAPI.GET_PLUGIN_CONFIG_URL, auth, ConfigController.getPluginConfig);
router.post(CONFIGAPI.SET_PLUGIN_CONFIG_URL, auth, ConfigController.setPluginConfig);
router.get(BOTAPI.LOG_URL, auth, LogController.logger);
router.get(BOTAPI.STATUS_URL, StateController.sysInfo);
router.get(BOTAPI.INFO_URL, InfoController.botInfo);
router.get(BOTAPI.URI_URL, InfoController.botURI);
router.post(PLUGINSAPI.ADD_PLUGIN_URL, PluginController.setPlugin);
router.delete(PLUGINSAPI.DELETE_PLUGIN_URL, PluginController.deletePlugin);
router.put(PLUGINSAPI.PUT_PLUGIN_URL, PluginController.editorPlugin);
router.get(PLUGINSAPI.GET_PLUGINLIST_URL, PluginController.getPluginList);
router.get(PLUGINSAPI.GET_HTML_PROJECT_URL, PluginController.getImageJson);
router.post(PLUGINSAPI.GET_BUTTON_PROJECT_URL, PluginController.getSegResources);
router.get(FSAPI.CREATE_URL, FsController.touch);
router.get(FSAPI.LSIT_DIR_URL, FsController.listDir);
router.get(FSAPI.MKDIR_URL, FsController.mkdir);
router.get(FSAPI.OPEN_URL, FsController.readFile);
router.get(FSAPI.COPY_Dir_URL, FsController.copyDir);
router.get(FSAPI.COPY_File_URL, FsController.copyFile);
router.get(FSAPI.MOVE_Dir_URL, FsController.moveDir);
router.get(FSAPI.MOVE_File_URL, FsController.moveFile);
router.get(FSAPI.RENAME_Dir_URL, FsController.renameDir);
router.get(FSAPI.RENAME_FILE_URL, FsController.renameFile);
router.post(FSAPI.SAVE_File_URL, FsController.saveFile);
router.delete(FSAPI.RM_DIR_URL, auth, FsController.rmDir);
router.delete(FSAPI.RM_FILE_URL, auth, FsController.rmFile);
router.get(FSAPI.READ_MEDIA_URL, FsController.readMediaFile);
router.get(FSAPI.SEARCH_URL, FsController.search);
router.post(FSAPI.UPLOAD_URL, FsController.upload);
router.get(FSAPI.DOWNLOAD_URL, FsController.download);
router.get(FSAPI.FITTER_TREE_URL, FsController.getFilesTree);
router.get(FSAPI.FILES_SIZE_URL, FsController.getFilesSize);

export { router as default };
