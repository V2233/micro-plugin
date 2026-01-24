var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/backend/env.ts
import { readFileSync } from "fs";
import { basename, join } from "path";
import { fileURLToPath } from "url";
var _dirname = fileURLToPath(import.meta.url);
var ROOT_PATH = join(_dirname, "../../../");
var DIST_PATH = join(_dirname, "../");
var PUBLIC_PATH = join(ROOT_PATH, "public");
var ROOT_NAME = basename(ROOT_PATH);
var pluginPackageObj = JSON.parse(
  readFileSync(join(ROOT_PATH, "package.json"), "utf8")
);
var WORK_PATH = process.cwd().replace(/\\/g, "/");
var DATA_PATH = join(WORK_PATH, "data", "micro-plugin");
var botPackageObj = JSON.parse(readFileSync(join(WORK_PATH, "package.json"), "utf8"));
var pluginInfo = {
  DIST_PATH,
  DATA_PATH,
  ROOT_PATH,
  ROOT_NAME,
  PUBLIC_PATH,
  PLUGIN_NAME: pluginPackageObj.name,
  PLUGIN_VERSION: pluginPackageObj.version,
  PLUGIN_DESC: pluginPackageObj.description,
  PLUGIN_AUTHOR: pluginPackageObj.author
};
var botInfo = {
  WORK_PATH,
  BOT_NAME: botPackageObj.name,
  BOT_VERSION: botPackageObj.version,
  BOT_DESC: botPackageObj.description,
  BOT_AUTHOR: botPackageObj.author
};

// src/backend/adapter/index.ts
import { join as join2 } from "path";
import { pathToFileURL } from "url";
var { WORK_PATH: WORK_PATH2 } = botInfo;
async function Plugin() {
  try {
    return global.plugin;
  } catch (err) {
    try {
      const plugin = (await import(join2(WORK_PATH2, "lib/plugins/plugin.js"))).default;
      return plugin;
    } catch (error) {
      const plugin = (await import(pathToFileURL(join2(WORK_PATH2, "lib/plugins/plugin.js")).toString())).default;
      return plugin;
    }
  }
}
async function Puppeteer() {
  try {
    try {
      const puppeteer = (await import(join2(WORK_PATH2, "lib/puppeteer/puppeteer.js"))).default;
      return puppeteer;
    } catch (error) {
      const puppeteer = (await import(pathToFileURL(join2(WORK_PATH2, "lib/puppeteer/puppeteer.js")).toString())).default;
      return puppeteer;
    }
  } catch (err) {
    const { puppeteer } = await import("yunzaijs");
    return puppeteer;
  }
}
async function Segment() {
  try {
    return global.segment;
  } catch (err) {
    const { Segment: Segment2 } = await import("yunzaijs");
    return Segment2;
  }
}
async function Loader() {
  try {
    try {
      const loader = (await import(join2(WORK_PATH2, "lib/plugins/loader.js"))).default;
      return loader;
    } catch (error) {
      const loader = (await import(pathToFileURL(join2(WORK_PATH2, "lib/plugins/loader.js")).toString())).default;
      return loader;
    }
  } catch (err) {
    const { Loader: Loader2 } = await import("yunzaijs");
    return Loader2;
  }
}
async function Bot2() {
  return global.Bot;
}
async function Logger() {
  return global.logger;
}
async function Redis() {
  return global.redis;
}

// src/backend/config/config.ts
import chokidar2 from "chokidar";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync as readFileSync3 } from "fs";
import { join as join3 } from "path";
import YAML2 from "yaml";

// src/backend/config/yamlHandler.ts
import chokidar from "chokidar";
import { readFileSync as readFileSync2, writeFileSync } from "fs";
import _ from "lodash";
import YAML from "yaml";
var YamlHandler = class {
  /**
   * 读写yaml文件
   *
   * @param yamlPath yaml文件绝对路径
   * @param isWatch 是否监听文件变化
   */
  constructor(yamlPath, isWatch = false) {
    this.yamlPath = yamlPath;
    this.isWatch = isWatch;
    this.yamlPath = yamlPath;
    this.isWatch = isWatch;
    this.initYaml();
  }
  document;
  watcher;
  isSave;
  initYaml() {
    try {
      this.document = YAML.parseDocument(readFileSync2(this.yamlPath, "utf8"));
    } catch (error) {
      throw error;
    }
    if (this.isWatch && !this.watcher) {
      this.watcher = chokidar.watch(this.yamlPath).on("change", () => {
        if (this.isSave) {
          this.isSave = false;
          return;
        }
        this.initYaml();
      });
    }
  }
  /**返回读取的对象 json格式*/
  get jsonData() {
    if (!this.document) {
      return null;
    }
    return this.document.toJSON();
  }
  /*检查集合是否包含key的值(在整个文件中查询有没有这个属性,对象中的属性通过.一级一级查找)*/
  has(keyPath) {
    return this.document.hasIn(keyPath.split("."));
  }
  /*返回key的值*/
  get(keyPath) {
    return _.get(this.jsonData, keyPath);
  }
  /*修改某个key的值*/
  set(keyPath, value) {
    this.document.setIn(keyPath.split("."), value);
    this.save();
  }
  /*删除key*/
  delete(keyPath) {
    this.document.deleteIn(keyPath.split("."));
    this.save();
  }
  //数组添加数据
  addIn(keyPath, value) {
    this.document.addIn(keyPath.split("."), value);
    this.save();
  }
  /**
   * 设置 document 的数据（递归式）
   * @param data 要写入的数据
   */
  setData(data) {
    this.setDataRecursion(data, []);
    this.save();
  }
  setDataRecursion(data, parentKeys) {
    if (Array.isArray(data)) {
      this.document.setIn(this.mapParentKeys(parentKeys), data);
    } else if (typeof data === "object" && data !== null) {
      for (const k in data) {
        this.setDataRecursion(data[k], parentKeys.concat(k));
      }
    } else {
      parentKeys = this.mapParentKeys(parentKeys);
      this.document.setIn(parentKeys, data);
    }
  }
  // 将数字key转为number类型，防止出现引号
  mapParentKeys(parentKeys) {
    return parentKeys.map((k) => {
      if (typeof k == "number") {
        k = String(k);
      }
      if (k.startsWith("INTEGER__")) {
        return Number.parseInt(k.replace("INTEGER__", ""));
      }
      return k;
    });
  }
  // 彻底删除某个key
  deleteKey(keyPath) {
    let keys = keyPath.split(".");
    keys = this.mapParentKeys(keys);
    this.document.deleteIn(keys);
    this.save();
  }
  save(path = this.yamlPath) {
    this.isSave = true;
    const yaml = this.document.toString();
    writeFileSync(path, yaml, "utf8");
  }
};

// src/backend/config/config.ts
var { ROOT_PATH: ROOT_PATH2 } = pluginInfo;
var { WORK_PATH: WORK_PATH3 } = botInfo;
var Cfg = class {
  /**
   *
   */
  config = {};
  /**
   * 监听文件
   */
  watcher = { config: {}, defSet: {} };
  constructor() {
    this.mergeYamlFile();
  }
  /**
   * 机器人qq号
   */
  get qq() {
    return Number(this.getBotConfig("qq")?.qq || 114514514);
  }
  /**
   * 密码
   */
  get pwd() {
    return this.getBotConfig("qq")?.pwd || 114514514;
  }
  /**
   * icqq配置
   */
  get bot() {
    const bot = this.getBotConfig("bot");
    const defbot = this.getBotdefSet("bot");
    const Config = { ...defbot, ...bot };
    Config.platform = this.getBotConfig("qq").platform;
    Config.data_dir = join3(WORK_PATH3, `/data/icqq/${this.qq}`);
    if (!Config.ffmpeg_path) delete Config.ffmpeg_path;
    if (!Config.ffprobe_path) delete Config.ffprobe_path;
    return Config;
  }
  /**
   *
   */
  get other() {
    return this.getBotConfig("other");
  }
  /**
   *
   */
  get redis() {
    return this.getBotConfig("redis");
  }
  /**
   *
   */
  get renderer() {
    return this.getBotConfig("renderer");
  }
  /**
   *
   */
  get notice() {
    return this.getBotConfig("notice");
  }
  /**
   * 主人qq
   */
  get masterQQ() {
    const qqs = this.getBotConfig("other")?.masterQQ || [];
    if (Array.isArray(qqs)) {
      return qqs.map((qq) => String(qq));
    } else {
      return [String(qqs)];
    }
  }
  _package = null;
  /**
   * package.json
   */
  get package() {
    if (this._package) return this._package;
    try {
      const data = readFileSync3("package.json", "utf8");
      this._package = JSON.parse(data);
      return this._package;
    } catch {
      return {};
    }
  }
  /**
   * 群配置
   * @param groupId
   * @returns
   */
  getGroup(groupId = "") {
    const config = this.getBotConfig("group");
    const defCfg = this.getBotdefSet("group");
    if (config[groupId]) {
      return { ...defCfg.default, ...config.default, ...config[groupId] };
    }
    return { ...defCfg.default, ...config.default };
  }
  /**
   * other配置
   * @returns
   */
  getOther() {
    const def = this.getBotdefSet("other");
    const config = this.getBotConfig("other");
    return { ...def, ...config };
  }
  /**
   * notice配置
   * @returns
   */
  getNotice() {
    const def = this.getBotdefSet("notice");
    const config = this.getBotConfig("notice");
    return { ...def, ...config };
  }
  /**
   * background配置
   * @returns
   */
  getBg() {
    const def = this.getdefSet("backgroundset");
    const config = this.getConfig("backgroundset");
    return { ...def, ...config };
  }
  /**
   * 得到默认配置
   * @param name 配置文件名称
   * @returns
   */
  getdefSet(name) {
    return this.getYaml("default_config", name);
  }
  /**
   * 得到默认配置
   * @param name 配置文件名称
   * @returns
   */
  getBotdefSet(name) {
    return this.getYaml("default_config", name, WORK_PATH3);
  }
  /**
   * 得到生成式配置
   * @param name
   * @returns
   */
  getConfig(name) {
    return this.getYaml("config", name);
  }
  /**
   * 得到合并配置
   * @param name
   * @returns
   */
  getMergedConfig(name) {
    const config = this.getYaml("config", name);
    const def = this.getYaml("default_config", name);
    return { ...def, ...config };
  }
  /**
   * 得到机器人配置
   * @param name
   * @returns
   */
  getBotConfig(name) {
    return this.getYaml("config", name, WORK_PATH3);
  }
  /**
   * 快速修改配置
   * @param data 要设置的数据
   * @param parentKeys 键的路径，数组格式分隔
   * @param name 文件名
   * @returns
   */
  setConfig(data, parentKeys, name) {
    this.setYaml("config", name, data, parentKeys);
  }
  /**
   * 获取配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  getYaml(type, name, path = ROOT_PATH2) {
    try {
      const file = join3(path, `config/${type}/${name}.yaml`);
      const key = `${type}.${name}`;
      if (this.config[key]) return this.config[key];
      this.config[key] = YAML2.parse(readFileSync3(file, "utf8"));
      this.watch(file, name, type);
      return this.config[key];
    } catch (err) {
      return void 0;
    }
  }
  /**
   * 修改配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  setYaml(type, name, data, parentKeys) {
    const file = join3(ROOT_PATH2, `config/${type}/${name}.yaml`);
    const doc = new YamlHandler(file);
    doc.setDataRecursion(data, parentKeys);
    doc.save();
    this.watch(file, name, type);
  }
  /**
   * 合并带有注释项的配置,初始化配置
   * @param name
   * @returns
   */
  mergeYamlFile() {
    const path = join3(ROOT_PATH2, "config", "config");
    const pathDef = join3(ROOT_PATH2, "config", "default_config");
    if (!existsSync(path)) {
      mkdirSync(path, {
        recursive: true
      });
    }
    const files = readdirSync(pathDef).filter((file) => file.endsWith(".yaml"));
    for (const file of files) {
      const cfgFile = join3(path, file);
      const cfgFileDef = join3(pathDef, file);
      if (!existsSync(cfgFile)) {
        copyFileSync(cfgFileDef, cfgFile);
      } else {
        const cfg = this.getConfig(file.replace(".yaml", ""));
        const doc = new YamlHandler(cfgFileDef);
        const defCfg = doc.jsonData;
        const cfgKeys = Object.keys(cfg);
        doc.yamlPath = cfgFile;
        cfgKeys.forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(defCfg, key)) {
            delete cfg[key];
          }
        });
        Object.entries(defCfg).forEach(([key, value]) => {
          if (cfg[key]) {
            if (value instanceof Object) {
              doc.set(key, Object.assign(value, cfg[key]));
            } else {
              doc.set(key, cfg[key]);
            }
            doc.save(cfgFile);
          }
        });
      }
    }
  }
  /**
   * 监听配置文件
   * @param file
   * @param name
   * @param type
   * @returns
   */
  watch(file, name, type = "default_config") {
    const key = `${type}.${name}`;
    if (this.watcher[key]) return;
    const watcher = chokidar2.watch(file);
    watcher.on("change", () => {
      this.config[key] = YAML2.parse(readFileSync3(file, "utf8"));
      logger.mark(`[Micro][\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6][${type}][${name}]`);
    });
    this.watcher[key] = watcher;
  }
};
var config_default = new Cfg();

// src/backend/utils/stdlog.ts
import chalk from "chalk";
var Stdlog = class {
  nickname(id) {
    let symbol = "";
    if (String(id).includes(":")) {
      const arg = String(id).split(":");
      symbol = arg[1];
      id = arg[0];
    } else {
      symbol = ">";
    }
    return chalk.hex("#00FFFF")(
      Bot?.[id]?.nickname ? `<${Bot?.[id]?.nickname}:${id}${symbol}` : id ? `<Bot:${id}${symbol}` : ""
    );
  }
  info(id, ...log) {
    logger.info(this.nickname(id) || "", ...log);
  }
  mark(id, ...log) {
    logger.mark(this.nickname(id) || "", ...log);
  }
  error(id, ...log) {
    logger.error(this.nickname(id) || "", ...log);
  }
  warn(id, ...log) {
    logger.warn(this.nickname(id) || "", ...log);
  }
  debug(id, ...log) {
    logger.debug(this.nickname(id) || "", ...log);
  }
  trace(id, ...log) {
    logger.trace(this.nickname(id) || "", ...log);
  }
  fatal(id, ...log) {
    logger.fatal(this.nickname(id) || "", ...log);
  }
};
var stdlog_default = new Stdlog();

// src/backend/utils/index.ts
import child_process from "child_process";
import { createHash } from "crypto";

// src/backend/utils/common.ts
import _2 from "lodash";
import moment from "moment";
var redis = await Redis();
var robot = await Bot2();
var common_default = new class {
  /**
   * 获取用户权限
   * @param {*} e - 接收到的事件对象
   * @param {"master"|"admin"|"owner"|"all"} permission - 命令所需的权限
   * @param {"admin"|"owner"|"all"} role - 用户的权限
   * @param {object} opts - 可选参数对象
   * @param {object} opts.groupObj - 群对象
   * @returns {boolean|string} - 是否具有权限
   */
  getPermission(e, permission = "all", role = "all", { groupObj = e.group || e.bot?.pickGroup?.(e.group_id) } = {}) {
    if (!groupObj && permission != "master" && role != "all") throw new Error("\u672A\u83B7\u53D6\u5230\u7FA4\u5BF9\u8C61");
    if (role == "owner" && !groupObj.is_owner) {
      return "\u274E Bot\u6743\u9650\u4E0D\u8DB3\uFF0C\u9700\u8981\u7FA4\u4E3B\u6743\u9650";
    } else if (role == "admin" && !groupObj.is_admin && !groupObj.is_owner) {
      return "\u274E Bot\u6743\u9650\u4E0D\u8DB3\uFF0C\u9700\u8981\u7BA1\u7406\u5458\u6743\u9650";
    }
    if (e.isMaster) return true;
    const memberObj = groupObj && groupObj.pickMember(e.user_id);
    if (permission == "master") {
      return "\u274E \u8BE5\u547D\u4EE4\u4EC5\u9650\u4E3B\u4EBA\u53EF\u7528";
    } else if (permission == "owner" && !memberObj.is_owner) {
      return "\u274E \u8BE5\u547D\u4EE4\u4EC5\u9650\u7FA4\u4E3B\u53EF\u7528";
    } else if (permission == "admin" && !memberObj.is_admin && !memberObj.is_owner) {
      return "\u274E \u8BE5\u547D\u4EE4\u4EC5\u9650\u7BA1\u7406\u53EF\u7528";
    }
    return true;
  }
  /**
   * 判断用户权限
   * @param e
   * @param {...any} args
   * @returns {boolean} - 是否具有权限
   */
  checkPermission(e, ...args) {
    const msg = this.getPermission(e, ...args);
    if (msg === true) return true;
    e.reply(msg, true);
    return false;
  }
  /**
   * 设置每日次数限制
   * @param {number} userId QQ
   * @param {string} key
   * @param {number} maxlimit 最大限制
   * @returns {Promise<boolean>}
   */
  async limit(userId, key, maxlimit) {
    if (maxlimit <= 0) return true;
    const redisKey = `yenai:${key}:limit:${userId}`;
    const nowNum = await redis.get(redisKey);
    if (nowNum > maxlimit) return false;
    if (!nowNum) {
      await redis.set(redisKey, 1, {
        EX: moment().add(1, "days").startOf("day").diff(void 0, "second")
      });
    } else {
      await redis.incr(redisKey);
    }
    return true;
  }
  /**
   * 取cookie
   * @param {string} data 如：qun.qq.com
   * @param {object} [bot] Bot对象适配e.bot
   * @param {boolean} [transformation] 转换为Puppeteer浏览器使用的ck
   * @returns {object}
   */
  getck(data, bot = robot, transformation) {
    const cookie = bot.cookies[data];
    function parseCkString(str) {
      const pairs = str.split(";");
      const obj = {};
      pairs.forEach((pair) => {
        const [key, value] = pair.trim().split("=");
        if (key) {
          obj[key] = decodeURIComponent(value);
        }
      });
      return obj;
    }
    const ck = parseCkString(cookie);
    if (transformation) {
      const arr = [];
      for (const i in ck) {
        arr.push({
          name: i,
          value: ck[i],
          domain: data,
          path: "/",
          expires: Date.now() + 3600 * 1e3
        });
      }
      return arr;
    } else return ck;
  }
  /**
   * 判断一个对象或数组中的所有值是否为空。
   * @param {object | Array} data - 需要检查的对象或数组。
   * @param {Array} omits - 需要忽略的属性列表。默认为空数组，表示不忽略任何属性。
   * @returns {boolean} - 如果对象或数组中的所有值都是空值，则返回 true；否则返回 false。
   */
  checkIfEmpty(data, omits = []) {
    const filteredData = _2.omit(data, omits);
    return _2.every(
      filteredData,
      (value) => _2.isPlainObject(value) ? this.checkIfEmpty(value) : _2.isEmpty(value)
    );
  }
  /**
   * 处理异常并返回错误消息。
   * @param {object} e - 事件对象。
   * @param {Error} ErrorObj - 要检查的错误对象。
   * @param {object} options - 可选参数。
   * @param {string} options.MsgTemplate - 错误消息的模板。
   * @returns {Promise<import("icqq").MessageRet>|false} 如果 ErrorObj 不是 Error 的实例，则返回 false；否则返回oicq消息返回值。
   */
  // handleException(e, ErrorObj, { MsgTemplate } = {}) {
  //   if (!(ErrorObj instanceof Error)) return false
  //   let ErrMsg = ""
  //   if (ErrorObj instanceof ReplyError) {
  //     ErrMsg = ErrorObj.message
  //   } else {
  //     ErrMsg = ErrorObj.stack
  //     logger.error(ErrorObj)
  //   }
  //   ErrMsg = MsgTemplate ? MsgTemplate.replace(/{error}/g, ErrMsg) : ErrMsg
  //   return e.reply(ErrMsg)
  // }
  // async takeSourceMsg(e, { img } = {}) {
  //   let source:any = {}
  //   if (e.getReply) {
  //     source = await e.getReply()
  //   } else if (e.source) {
  //     if (e.group?.getChatHistory) {
  //       source = (await e.group.getChatHistory(e.source.seq, 1)).pop()
  //     } else if (e.friend?.getChatHistory) {
  //       source = (await e.friend.getChatHistory(e.source.time, 1)).pop()
  //     }
  //   }
  //   if (!source) return false
  //   if (img) {
  //     let imgArr = []
  //     for (let i of source.message) {
  //       if (i.type == "image") {
  //         imgArr.push(i.url)
  //       }
  //     }
  //     return !_.isEmpty(imgArr) && imgArr
  //   }
  //   return source
  // }
}();

// src/backend/utils/formatDuration.ts
function formatDuration(time, format, repair = true) {
  const timeObj = computeTimeObject(time, repair);
  if (typeof format === "function") {
    return format(timeObj);
  }
  if (format === "default") {
    return formatDefault(timeObj);
  }
  if (typeof format === "string") {
    return formatTemplate(format, timeObj);
  }
  return timeObj;
}
function formatDefault(timeObj) {
  const { day, hour, minute, second } = timeObj;
  let result = "";
  if (day > 0) {
    result += `${day}\u5929`;
  }
  if (hour > 0) {
    result += `${hour}\u5C0F\u65F6`;
  }
  if (minute > 0) {
    result += `${minute}\u5206`;
  }
  if (second > 0) {
    result += `${second}\u79D2`;
  }
  return result;
}
function formatTemplate(format, timeObj) {
  const replaceRegexes = [
    { pattern: /dd/g, value: timeObj.day },
    { pattern: /hh/g, value: timeObj.hour },
    { pattern: /mm/g, value: timeObj.minute },
    { pattern: /ss/g, value: timeObj.second }
  ];
  for (const { pattern, value } of replaceRegexes) {
    format = format.replace(pattern, value);
  }
  return format;
}
function padWithZero(num, repair) {
  return repair && num < 10 ? `0${num}` : String(num);
}
function computeTimeObject(time, repair = true) {
  const second = padWithZero(Math.floor(time % 60), repair);
  const minute = padWithZero(Math.floor(time / 60 % 60), repair);
  const hour = padWithZero(Math.floor(time / (60 * 60) % 24), repair);
  const day = padWithZero(Math.floor(time / (24 * 60 * 60)), repair);
  return {
    day,
    hour,
    minute,
    second
  };
}

// src/backend/utils/pager.ts
var Pager = class {
  $list;
  $pageNum;
  $pageSize;
  constructor(list, pageNum, pageSize) {
    this.$list = list;
    this.$pageNum = pageNum;
    this.$pageSize = pageSize;
  }
  get pageNum() {
    return this.$pageNum;
  }
  set pageNum(pageNum) {
    this.$pageNum = pageNum;
  }
  get pageSize() {
    return this.$pageSize;
  }
  set pageSize(pageSize) {
    this.$pageSize = pageSize;
  }
  /** 根据当前分页条件，计算出的数据 */
  get records() {
    return [...this.$list].splice(this.offset, this.$pageSize);
  }
  /** 计算当前分页偏移量 */
  get offset() {
    const current = this.$pageNum;
    if (current <= 1) {
      return 0;
    }
    return Math.max((current - 1) * this.$pageSize, 0);
  }
  /** 最大页码 */
  get maxNum() {
    return Math.ceil(this.total / this.$pageSize);
  }
  /** 总行数 */
  get total() {
    return this.$list.length;
  }
  toJSON() {
    return {
      pageNum: this.$pageNum,
      pageSize: this.$pageSize,
      total: this.total,
      maxNum: this.maxNum,
      records: this.records
    };
  }
};

// src/backend/utils/getLoader.ts
import lodash from "lodash";
async function getLoader() {
  const loader = await Loader();
  const packages = [];
  for (const plugin of loader.priority) {
    if (/\.js$/.test(plugin.key)) {
      plugin.key = "example";
    } else if (/^system/.test(plugin.key)) {
      plugin.key = "system";
    } else if (/^other/.test(plugin.key)) {
      plugin.key = "other";
    }
    let object = packages.find((data) => data.packName == plugin.key);
    if (!object) {
      packages.push({ packName: plugin.key, packPlugins: [] });
      object = packages.find((data) => data.packName == plugin.key);
    }
    const objectIndex = packages.indexOf(object);
    const p = new plugin.class();
    const msg = {
      pluginTitle: `\u63D2\u4EF6\u540D\uFF1A${plugin.name}`,
      pluginFuns: []
    };
    if (lodash.isEmpty(p.rule)) {
      msg.pluginFuns.push(`\u65E0\u547D\u4EE4\u6B63\u5219`);
      packages[objectIndex].packPlugins.push(msg);
      continue;
    }
    for (const v in p.rule) {
      msg.pluginFuns.push(`\u3010${Number(v) + 1}\u3011\uFF1A${p.rule[v].reg}`);
    }
    packages[objectIndex].packPlugins.push(msg);
  }
  return packages;
}

// src/backend/utils/ipAddress.ts
import fetch from "node-fetch";
import os from "os";
var redis2 = await Redis();
async function getAllWebAddress(auto = true) {
  const { server } = config_default.getConfig("server");
  let host = server.host;
  let port = server.port;
  if (host !== "auto" && auto == false) {
    return {
      custom: [joinHttpPort(host, port)],
      local: [""],
      remote: [""]
    };
  }
  port = Number.parseInt(port);
  port = port === 80 ? null : port;
  let custom = [];
  let local = getAutoIps(port, true);
  let remote = await getRemoteIps();
  if (remote && remote.length > 0) {
    remote = remote.map((i) => joinHttpPort(i, port));
  }
  if (host) {
    if (!Array.isArray(host)) {
      host = [host];
    }
    for (const h of host) {
      if (h && h !== "auto") {
        custom.push(joinHttpPort(h, port));
      }
    }
  }
  let mountRoot = "/";
  mountRoot = mountRoot === "/" ? "" : mountRoot;
  if (mountRoot) {
    custom = custom.map((i) => i + mountRoot);
    local = local.map((i) => i + mountRoot);
    remote = remote.map((i) => i + mountRoot);
  }
  return { custom, local, remote };
}
function joinHttpPort(ip, port) {
  ip = /^http/.test(ip) ? ip : "http://" + ip;
  return `${ip}${port ? ":" + port : ""}`;
}
function getAutoIps(port, allIp) {
  const ips = getLocalIps(port);
  if (ips.length === 0) {
    ips.push(`localhost${port ? ":" + port : ""}`);
  }
  if (allIp) {
    return ips.map((ip) => `http://${ip}`);
  } else {
    return [`http://${ips[0]}`];
  }
}
function getLocalIps(port) {
  const ips = [];
  port = port ? `:${port}` : "";
  try {
    const networks = os.networkInterfaces();
    for (const [name, wlans] of Object.entries(networks)) {
      for (const wlan of wlans) {
        if (name != "lo" && name != "docker0" && wlan.address.slice(0, 2) != "fe" && wlan.address.slice(0, 2) != "fc") {
          if (["127.0.0.1", "::1"].includes(wlan.address)) {
            continue;
          }
          if (wlan.family === "IPv6") {
            ips.push(`[${wlan.address}]${port}`);
          } else {
            ips.push(`${wlan.address}${port}`);
          }
        }
      }
    }
  } catch (e) {
    let err = e?.stack || e?.message || e;
    err = err ? err.toString() : "";
    if (/Unknown system error 13/i.test(err)) {
      logger.warn(
        "[Micro-Plugin] \u7531\u4E8E\u7CFB\u7EDF\u9650\u5236\uFF0C\u65E0\u6CD5\u83B7\u53D6\u5230IP\u5730\u5740\uFF0C\u4EC5\u663E\u793A\u672C\u5730\u56DE\u73AF\u5730\u5740\u3002\u8BE5\u95EE\u9898\u76EE\u524D\u6682\u65E0\u65B9\u6848\u89E3\u51B3\uFF0C\u4F46\u4E0D\u5F71\u54CDMicro-Plugin\u4F7F\u7528\uFF0C\u60A8\u53EF\u624B\u52A8\u914D\u7F6E\u81EA\u5B9A\u4E49\u5730\u5740\u3002"
      );
      ips.push(`localhost${port}`);
    } else {
      logger.error(`\u9519\u8BEF\uFF1A${logger.red(e)}`);
    }
  }
  if (ips.length === 0) {
    logger.warn("[Micro-Plugin] \u65E0\u6CD5\u83B7\u53D6\u5230IP\u5730\u5740\uFF0C\u4EC5\u663E\u793A\u672C\u5730\u56DE\u73AF\u5730\u5740\uFF0C\u8BE6\u60C5\u8BF7\u67E5\u770B\u4EE5\u4E0A\u62A5\u9519\u3002");
    ips.push(`localhost${port}`);
  }
  return ips;
}
async function getRemoteIps() {
  const redisKey = "Yz:Micro:remote-ips:3";
  const cacheData = await redis2.get(redisKey);
  let ips;
  if (cacheData) {
    ips = JSON.parse(cacheData);
    if (Array.isArray(ips) && ips.length > 0) {
      return ips;
    }
  }
  ips = [];
  const apis = [
    // 返回IPv4地址
    "http://v4.ip.zxinc.org/info.php?type=json"
    // 返回IPv6地址（已失效）
    // 'http://v6.ip.zxinc.org/info.php?type=json'
  ];
  for (const api of apis) {
    let response;
    try {
      response = await fetch(api);
    } catch {
      continue;
    }
    if (response.status === 200) {
      const { code, data } = await response.json();
      if (code === 0) {
        ips.push(data.myip);
      }
    }
  }
  if (ips.length > 0) {
    redis2.set(redisKey, JSON.stringify(ips), { EX: 3600 * 24 });
  }
  return ips;
}

// src/backend/utils/stdout.ts
var stdoutSets = /* @__PURE__ */ new Set();
var originalWrite = process.stdout.write;
process.stdout.write = function(str, encoding, cb) {
  stdoutSets.forEach((fn) => fn(str));
  return originalWrite.call(this, str, encoding, cb);
};
var addStdoutListener = (callback) => {
  stdoutSets.add(callback);
  return () => stdoutSets.delete(callback);
};

// src/backend/utils/index.ts
function path2URI(path = botInfo.WORK_PATH) {
  return `file://${path}/`;
}
function makeMd5(data) {
  return createHash("md5").update(data).digest("hex");
}

export {
  __export,
  pluginInfo,
  botInfo,
  Plugin,
  Puppeteer,
  Segment,
  Loader,
  Bot2 as Bot,
  Logger,
  Redis,
  YamlHandler,
  config_default,
  formatDuration,
  Pager,
  stdlog_default,
  getLoader,
  getAllWebAddress,
  addStdoutListener,
  path2URI,
  makeMd5
};
