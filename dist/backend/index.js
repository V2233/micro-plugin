import {
  Bot as Bot2,
  Loader,
  Logger,
  Pager,
  Plugin,
  Puppeteer,
  Redis,
  Segment,
  YamlHandler,
  __export,
  addStdoutListener,
  botInfo,
  config_default,
  formatDuration,
  getAllWebAddress,
  getLoader,
  makeMd5,
  path2URI,
  pluginInfo,
  stdlog_default
} from "./chunk-4A22Q7QC.js";

// src/backend/index.ts
import chalk2 from "chalk";

// src/backend/server/index.ts
import chalk from "chalk";

// src/backend/server/app/index.ts
import { createReadStream as createReadStream2, existsSync as existsSync5, mkdirSync as mkdirSync5 } from "fs";
import Koa from "koa";
import { koaBody } from "koa-body";
import KoaStatic from "koa-static";
import mime2 from "mime";
import { createServer } from "http";
import { join as join9 } from "path";

// src/backend/server/router/index.ts
import Router from "koa-router";

// src/backend/server/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = async (ctx, next) => {
  const { userInfo: userInfo2 } = await config_default.getConfig("server");
  const token = ctx.request.header.token;
  const userData = userInfo2.find((item) => item.token == ctx.request.header.token);
  if (userData) {
    try {
      const user = jwt.verify(token, userData.skey);
      ctx.state.user = user;
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          ctx.body = {
            code: 403,
            message: "token\u8FC7\u671F"
          };
          return;
        // return ctx.app.emit('error', {
        //     code: 10101,
        //     message: '【micro-plugin】token过期'
        // }, ctx)
        case "JsonWebTokenError":
          ctx.body = {
            code: 403,
            message: "token\u65E0\u6548"
          };
          return;
      }
    }
  } else {
    ctx.body = {
      code: 403,
      message: "\u672A\u627E\u5230\u8BE5\u7528\u6237token"
    };
  }
  await next();
};
var auth_default = auth;

// src/backend/server/controller/user/index.ts
import jwt2 from "jsonwebtoken";
import crypto from "crypto";
var UserController = class {
  // 登录
  async login(ctx) {
    const { userInfo: userInfo2 } = await config_default.getConfig("server");
    const res = ctx.request.body;
    const { username, password } = res;
    const checkUserIndex = userInfo2.findIndex(
      (item) => item.username === username && item.password === password
    );
    if (checkUserIndex == -1) {
      ctx.body = {
        code: 403,
        data: "error: \u8D26\u6237\u6216\u5BC6\u7801\u4E0D\u5BF9\uFF01"
      };
      return;
    }
    const skey = crypto.createHash("sha256").update(password).digest("hex");
    const expires = userInfo2[checkUserIndex].expires || "86400s";
    const token = jwt2.sign({ username }, skey, { expiresIn: expires });
    config_default.setConfig(
      { ...userInfo2[checkUserIndex], token, skey, expires },
      ["userInfo", String(checkUserIndex)],
      "server"
    );
    ctx.body = {
      code: 200,
      data: token
    };
  }
  // 登出
  async logOut(ctx) {
    ctx.body = {
      code: 200,
      message: "success"
      // data: userInfo[0]
    };
  }
  // 用户信息
  async userInfo(ctx) {
    const { userInfo: userInfo2 } = await config_default.getConfig("server");
    const masterQQ = config_default.masterQQ;
    const user = userInfo2.find((item) => item.token == ctx.request.header.token);
    if (user) {
      user.masterQQ = Array.isArray(masterQQ) ? masterQQ[0] : masterQQ;
      ctx.body = {
        code: 200,
        message: "success",
        data: user
      };
    } else {
      ctx.body = {
        code: 403,
        message: "\u672A\u627E\u5230\u8BE5\u7528\u6237\u767B\u5F55"
      };
    }
  }
  // ws获取后端连接地址
  async getPort(ctx) {
    const { local, remote } = await getAllWebAddress();
    ctx.body = {
      code: 200,
      message: "success",
      data: {
        publicAddress: remote[0].replace("http", "ws").replace("https", "wss"),
        privateAddress: local[0].replace("http", "ws").replace("https", "wss")
      }
    };
  }
  // 获取本机web地址
  async getWebAddress(ctx) {
    const { hostname } = ctx.request.body;
    if (hostname) {
      config_default.setConfig(hostname, ["server", "host"], "server");
      const { port } = (await config_default.getConfig("server")).server;
      ctx.body = {
        code: 200,
        message: "success",
        data: {
          hostname,
          port
        }
      };
    } else {
      ctx.body = {
        code: 500,
        message: "error",
        data: "\u4FDD\u5B58\u670D\u52A1\u7AEF\u5730\u5740\u5931\u8D25"
      };
    }
  }
};
var user_default = new UserController();

// src/backend/server/controller/logger/index.ts
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// src/backend/server/controller/logger/logs.ts
function getLatestLog(logs) {
  function parseDateFromFilename(filename) {
    const match = filename.match(/^command\.(\d{4}-\d{2}-\d{2})\.log$/);
    if (match) {
      return new Date(match[1]);
    }
    return null;
  }
  let latestDate = null;
  let latestLog = "";
  for (const log of logs) {
    const date = parseDateFromFilename(log);
    if (date !== null && (latestDate === null || date > latestDate)) {
      latestDate = date;
      latestLog = log;
    } else if (date === null && latestDate === null) {
      latestLog = log;
    }
  }
  return latestLog;
}
function parseLog(log) {
  const regex = /^(\[\d+:\d+:\d+.\d+\])\[([A-Z]+?)\](.*)/;
  const match = regex.exec(log);
  if (match && match.length >= 4) {
    const time = match[1];
    const level = match[2];
    const detail = match[3];
    return { time, level, detail };
  } else {
    return {
      time: "",
      level: "",
      detail: log
    };
  }
}

// src/backend/server/controller/logger/index.ts
var curLogs = [];
var curLog = "";
var LogController = class {
  // 日志展示
  async logger(ctx) {
    const { id, page, size } = ctx.request.query;
    const logs = readdirSync(join(botInfo.WORK_PATH, "logs"));
    let logText = "";
    let resLogs = [];
    const p = page || 0;
    const pageSize = +size || 50;
    if (logs.length == 0) {
      resLogs = [
        {
          time: "",
          level: "WARN",
          detail: "\u5F53\u524D\u65E5\u5FD7\u4E3A\u7A7A\uFF0C\u8BF7\u673A\u5668\u4EBA\u53D1\u9001\u6D88\u606F\u540E\u5237\u65B0\u65E5\u5FD7\uFF01"
        }
      ];
    } else {
      if (id != curLog) {
        if (id == "0" || !id) {
          curLog = getLatestLog(logs);
          logText = readFileSync(join(botInfo.WORK_PATH, "logs", curLog), "utf8");
        } else {
          logText = readFileSync(join(botInfo.WORK_PATH, "logs", id), "utf8");
          curLog = id;
        }
        curLogs = logText.split("\n");
      }
      const start = pageSize * p;
      const sliceLogs = curLogs.slice(start, Math.min(start + pageSize, curLogs.length));
      resLogs = sliceLogs.map((line) => parseLog(line.trim()));
    }
    ctx.body = {
      code: 200,
      message: "ok",
      data: {
        logList: logs,
        logs: resLogs,
        curLog,
        page: p
      }
    };
  }
};
var logger_default = new LogController();

// src/backend/server/controller/status/state/utils.ts
var si = false;
var osInfo = null;
async function initDependence() {
  if (si) return si;
  try {
    si = await import("systeminformation");
    osInfo = await si.osInfo();
    return si;
  } catch (error) {
    if (error.stack?.includes("Cannot find package")) {
      logger.warn(`\u7F3A\u5C11\u4F9D\u8D56\uFF0C\u8BF7\u8FD0\u884C\uFF1A${logger.red("pnpm add systeminformation -w")}`);
      logger.debug(decodeURI(error.stack));
    } else {
      logger.error(`\u8F7D\u5165\u9519\u8BEF\uFF1A${logger.red("systeminformation")}`);
      logger.error(decodeURI(error.stack));
    }
  }
}
await initDependence();
function getFileSize(size, { decimalPlaces = 2, showByte = true, showSuffix = true } = {}) {
  if (size === null || size === void 0) return "0B";
  if (typeof decimalPlaces !== "number" || !Number.isInteger(decimalPlaces)) {
    throw new Error("decimalPlaces \u5FC5\u987B\u662F\u4E00\u4E2A\u6574\u6570");
  }
  const units = ["B", "K", "M", "G", "T"];
  const powers = [0, 1, 2, 3, 4];
  const num = 1024;
  const precalculated = powers.map((power) => Math.pow(num, power));
  let unitIndex = 0;
  while (size >= precalculated[unitIndex + 1] && unitIndex < precalculated.length - 1) {
    unitIndex++;
  }
  const buildSizeString = (value, unit, _showSuffix = showSuffix) => {
    const suffix = ` ${unit}${_showSuffix ? "B" : ""}`;
    return value.toFixed(decimalPlaces) + suffix;
  };
  if (showByte && size < num) {
    return buildSizeString(size, "B", false);
  }
  return buildSizeString(size / precalculated[unitIndex], units[unitIndex]);
}

// src/backend/server/controller/status/state/CPU.ts
async function getCpuInfo() {
  let {
    currentLoad: { currentLoad },
    cpu,
    fullLoad
  } = await si.get({
    currentLoad: "currentLoad",
    cpu: "manufacturer,speed,cores",
    fullLoad: "*"
  });
  let { manufacturer, speed, cores } = cpu;
  if (currentLoad == null || currentLoad == void 0) return false;
  fullLoad = Math.round(fullLoad);
  manufacturer = manufacturer?.split(" ")?.[0] ?? "unknown";
  return {
    inner: Math.round(currentLoad) / 100,
    title: "CPU",
    info: [`${manufacturer}`, `${cores}\u6838 ${speed}GHz`, `CPU\u6EE1\u8F7D\u7387 ${fullLoad}%`]
  };
}

// src/backend/server/controller/status/state/GPU.ts
var isGPU = false;
(async function initGetIsGPU() {
  if (!await initDependence()) return;
  const { controllers } = await si.graphics();
  if (controllers?.find((item) => item.memoryUsed && item.memoryFree && item.utilizationGpu)) {
    isGPU = true;
  }
})();
async function getGPU() {
  if (!isGPU) return false;
  try {
    const { controllers } = await si.graphics();
    const graphics = controllers?.find(
      (item) => item.memoryUsed && item.memoryFree && item.utilizationGpu
    );
    if (!graphics) {
      logger.warn("GPU\u6570\u636E\u5F02\u5E38\uFF1A\n", controllers);
      return false;
    }
    let { vendor, temperatureGpu, utilizationGpu, memoryTotal, memoryUsed, model } = graphics;
    temperatureGpu && (temperatureGpu = temperatureGpu + "\u2103");
    return {
      inner: Math.round(utilizationGpu) / 100,
      title: "GPU",
      info: {
        used: (memoryUsed / 1024).toFixed(2),
        total: (memoryTotal / 1024).toFixed(2),
        vendor,
        model,
        temperatureGpu
      }
    };
  } catch (e) {
    logger.warn("\u83B7\u53D6GPU\u5931\u8D25");
    return false;
  }
}

// src/backend/server/controller/status/state/networkStats.ts
async function getNetwork() {
  return (await si.get({
    networkStats: "rx_bytes,tx_bytes,iface"
  })).networkStats.map((item) => ({
    rx_bytes: getFileSize(item.rx_bytes),
    tx_bytes: getFileSize(item.tx_bytes),
    iface: item.iface
  }));
}

// src/backend/server/controller/status/state/SWAP.ts
async function getSwapInfo() {
  const swapData = await si.get({
    mem: "swaptotal,swapused,swapfree"
  });
  const {
    mem: { swaptotal, swapused }
  } = swapData;
  const swapUsagePercentage = swapused / swaptotal * 100;
  const formatSwaptotal = getFileSize(swaptotal);
  const formatSwapused = getFileSize(swapused);
  return {
    inner: `${Math.round(swapUsagePercentage)}%`,
    percentage: Math.round(swapUsagePercentage),
    title: "SWAP",
    info: [formatSwapused, formatSwaptotal]
  };
}

// src/backend/server/controller/status/state/RAM.ts
import os from "os";
async function getMemUsage() {
  const total = os.totalmem();
  const active = total - os.freemem();
  const activePercentage = (active / total).toFixed(2);
  const totalMem = getFileSize(total);
  const activeMem = getFileSize(active);
  return {
    inner: `${Math.round(Number(activePercentage) * 100)}%`,
    title: "RAM",
    info: [`${activeMem} / ${totalMem}`]
  };
}

// src/backend/server/controller/status/state/NodeInfo.ts
import os2 from "os";
async function getNodeInfo() {
  const memory = process.memoryUsage();
  const rss = getFileSize(memory.rss);
  const heapTotal = getFileSize(memory.heapTotal);
  const heapUsed = getFileSize(memory.heapUsed);
  const occupy = Number((memory.rss / (os2.totalmem() - os2.freemem())).toFixed(2));
  return {
    inner: Math.round(occupy * 100),
    title: "Node",
    info: {
      rss,
      heapTotal,
      heapUsed,
      occupy
    }
  };
}

// src/backend/server/controller/status/state/OtherInfo.ts
import fs from "fs";
import _ from "lodash";
import os3 from "os";
import { join as join2 } from "path";
var loader = await Loader();
async function getOtherInfo(e = { isPro: false }) {
  const otherInfo = [];
  otherInfo.push({
    first: "\u63D2\u4EF6",
    tail: getPluginNum(e)
  });
  otherInfo.push({
    first: "\u7CFB\u7EDF",
    tail: osInfo?.distro
  });
  otherInfo.push({
    first: "\u7CFB\u7EDF\u8FD0\u884C",
    tail: getSystime()
  });
  otherInfo.push({
    first: "\u73AF\u5883\u7248\u672C",
    tail: await getEnvVersion()
  });
  return _.compact(otherInfo);
}
function getSystime() {
  return formatDuration(os3.uptime(), "dd\u5929hh\u5C0F\u65F6mm\u5206", false);
}
function getPluginNum(e = { isPro: false }) {
  const dir = botInfo.WORK_PATH + "/plugins";
  const dirArr = fs.readdirSync(dir, { withFileTypes: true });
  const exc = ["example"];
  const plugin3 = dirArr.filter(
    (i) => i.isDirectory() && fs.existsSync(join2(dir, i.name, "package.json")) && !exc.includes(i.name)
  );
  const plugins = plugin3?.length;
  const jsDir = join2(dir, "example");
  let js = 0;
  try {
    js = fs.readdirSync(jsDir)?.filter((item) => item.endsWith(".js"))?.length;
  } catch (error) {
  }
  const pluginsStr = `${plugins ?? 0} plugins | example ${js ?? 0} js`;
  if (loader && e.isPro) {
    const { priority, task } = loader;
    const loaderStr = `${priority?.length} fnc | ${task?.length} task`;
    return `${pluginsStr} | ${loaderStr}`;
  }
  return pluginsStr;
}
async function getEnvVersion() {
  const { node, git } = await si.versions("node,git");
  return {
    node,
    git,
    platform: os3.platform()
  };
}

// src/backend/server/controller/status/state/FsSize.ts
import _3 from "lodash";

// src/backend/server/controller/status/state/Monitor.ts
import _2 from "lodash";
var Monitor_default = new class Monitor {
  _network;
  _fsStats;
  chartData;
  valueObject;
  chartDataKey;
  constructor() {
    this._network = null;
    this._fsStats = null;
    this.chartData = {
      network: {
        // 上行
        upload: [],
        // 下行
        download: []
      },
      fsStats: {
        // 读
        readSpeed: [],
        // 写
        writeSpeed: []
      },
      // cpu
      cpu: [],
      // 内存
      ram: []
    };
    this.valueObject = {
      networkStats: "rx_bytes,tx_bytes,iface",
      currentLoad: "currentLoad",
      mem: "active"
    };
    this.init();
  }
  set network(value) {
    if (_2.isNumber(value[0]?.tx_bytes) && _2.isNumber(value[0]?.rx_bytes)) {
      this._network = value;
      this._addData(this.chartData.network.upload, [Date.now(), value[0].tx_bytes]);
      this._addData(this.chartData.network.download, [Date.now(), value[0].rx_bytes]);
    }
  }
  get network() {
    return this._network;
  }
  set fsStats(value) {
    if (_2.isNumber(value?.wx_bytes) && _2.isNumber(value?.rx_bytes)) {
      this._fsStats = value;
      this._addData(this.chartData.fsStats.writeSpeed, [Date.now(), value.wx_bytes]);
      this._addData(this.chartData.fsStats.readSpeed, [Date.now(), value.rx_bytes]);
    }
  }
  get fsStats() {
    return this._fsStats;
  }
  async init() {
    if (!await initDependence()) return;
    this.getData();
  }
  async getData() {
    const data = await si.get(this.valueObject);
    const {
      networkStats,
      mem: { active },
      currentLoad: { currentLoad }
    } = data;
    this.network = networkStats;
    if (_2.isNumber(active)) {
      this._addData(this.chartData.ram, [Date.now(), active]);
    }
    if (_2.isNumber(currentLoad)) {
      this._addData(this.chartData.cpu, [Date.now(), currentLoad]);
    }
    return data;
  }
  /**
   * 向数组中添加数据，如果数组长度超过允许的最大值，则删除最早添加的数据
   * @param {Array} arr - 要添加数据的数组
   * @param {*} data - 要添加的新数据
   * @param {number} [maxLen] - 数组允许的最大长度，默认值为60
   * @returns {void}
   */
  _addData(arr, data, maxLen = 60) {
    if (data === null || data === void 0) return;
    if (arr.length >= maxLen) {
      _2.pullAt(arr, 0);
    }
    arr.push(data);
  }
}();

// src/backend/server/controller/status/state/FsSize.ts
async function getFsSize() {
  const HardDisk = _3.uniqWith(
    await si.fsSize(),
    (a, b) => a.used === b.used && a.size === b.size && a.use === b.use && a.available === b.available
  ).filter((item) => item.size && item.used && item.available && item.use);
  if (_3.isEmpty(HardDisk)) return false;
  return HardDisk.map((item) => {
    item.percentage = +(+item.used / +item.size).toFixed(2);
    item.used = getFileSize(item.used);
    item.size = getFileSize(item.size);
    item.use = Math.round(item.use);
    return item;
  });
}

// src/backend/server/controller/status/index.ts
var StateController = class {
  // 系统状态
  async sysInfo(ctx) {
    const promises = [
      getCpuInfo(),
      getGPU(),
      getSwapInfo(),
      getMemUsage(),
      getFsSize(),
      getNodeInfo(),
      getOtherInfo(),
      getNetwork()
    ];
    const [cpuInfo, gpuInfo, swapInfo, ramInfo, diskSizeInfo, nodeInfo, otherInfo, networkInfo] = await Promise.all(promises);
    ctx.body = {
      code: 200,
      message: "success",
      data: {
        cpuInfo,
        gpuInfo,
        swapInfo,
        ramInfo,
        diskSizeInfo,
        nodeInfo,
        networkInfo,
        otherInfo
      }
    };
  }
};
var status_default = new StateController();

// src/backend/server/controller/fs/index.ts
import mime from "mime";
import { basename, join as join4 } from "path";

// src/backend/server/app/webui/terminal/config.ts
var TermCfg = {
  ssh: {
    isOpen: false,
    host: "",
    port: 22,
    username: "",
    password: ""
  }
};

// src/backend/server/controller/fs/tools.ts
import dirTree from "directory-tree";
import { copyFileSync, mkdirSync, readdirSync as readdirSync2, stat, statSync } from "fs";
import { join as join3 } from "path";
function getDir(path2, depth = 1) {
  if (depth) {
    return dirTree(path2, { attributes: ["mtime", "type"], depth });
  } else if (depth == null) {
    return dirTree(path2, { attributes: ["mtime", "type"] });
  }
}
function unlinkedPath(path2) {
  let lastSepIndex = path2.lastIndexOf("/");
  if (lastSepIndex == -1) {
    lastSepIndex = path2.lastIndexOf("\\");
  }
  return path2.slice(0, lastSepIndex);
}
function copyDirectory(src, dest) {
  mkdirSync(dest, { recursive: true });
  const files = readdirSync2(src);
  files.forEach((file) => {
    const srcFile = join3(src, file);
    const destFile = join3(dest, file);
    const stats = statSync(srcFile);
    if (stats.isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      copyFileSync(srcFile, destFile);
    }
  });
}
function fuzzyMatchInDirectoryTree(dirPath, keyword) {
  const matchedItems = [];
  function traverseTree(path2) {
    const node = getDir(path2);
    if (node.name.includes(keyword)) {
      if (node.type == "directory") {
        const tempNode = JSON.parse(JSON.stringify(node));
        delete tempNode.children;
        matchedItems.push(tempNode);
      } else {
        matchedItems.push(node);
      }
    }
    if (node.type == "directory") {
      node.children.forEach((child) => {
        traverseTree(child.path);
      });
    }
  }
  traverseTree(dirPath);
  return matchedItems;
}
function filterDirectoryTree(tree, extension) {
  function containsFileWithExtension(node) {
    if (node.type === "file" && node.name.includes(`${extension}`)) {
      return true;
    }
    if (node.type === "directory" && node.children) {
      for (const child of node.children) {
        if (containsFileWithExtension(child)) {
          return true;
        }
      }
    }
    return false;
  }
  if (tree.type === "directory" && !containsFileWithExtension(tree)) {
    return void 0;
  }
  if (tree.children) {
    tree.children = tree.children.filter((child) => {
      const filteredChild = filterDirectoryTree(child, extension);
      return filteredChild !== void 0;
    });
  }
  return tree;
}
function calculateFileSize(filePath) {
  return new Promise((resolve, reject) => {
    stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isFile() ? stats.size : 0);
      }
    });
  });
}
async function calculateTotalSize(tree) {
  let totalSize = 0;
  async function traverse(node) {
    if (node.type === "file") {
      const fileSize = await calculateFileSize(node.path);
      totalSize += fileSize;
    } else if (node.type === "directory") {
      for (const child of node.children) {
        await traverse(child);
      }
    }
  }
  for (const node of tree.children) {
    await traverse(node);
  }
  return totalSize;
}
function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// src/backend/server/controller/fs/index.ts
import {
  copyFileSync as copyFileSync2,
  createReadStream,
  existsSync,
  mkdirSync as mkdirSync2,
  readFileSync as readFileSync2,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync
} from "fs";
var FsController = class {
  // curPath = botInfo.WORK_PATH
  // 文件列表
  async listDir(ctx) {
    const { path: path2 } = ctx.request.query;
    const dirInfo = getDir(path2 == 0 ? botInfo.WORK_PATH : path2);
    ctx.body = {
      code: 200,
      message: "ok",
      data: dirInfo
    };
  }
  // 创建文件
  async touch(ctx) {
    const { path: path2 } = ctx.request.query;
    writeFileSync(path2, "", "utf8");
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(path2)
    };
  }
  // 创建目录
  async mkdir(ctx) {
    const { path: path2 } = ctx.request.query;
    mkdirSync2(path2);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(path2)
    };
  }
  // 读取文件
  async readFile(ctx) {
    const { path: path2 } = ctx.request.query;
    const content = readFileSync2(path2, "utf-8");
    ctx.body = {
      code: 200,
      message: "ok",
      data: content
    };
  }
  // 读取媒体文件
  async readMediaFile(ctx) {
    const { path: path2 } = ctx.request.query;
    const fileBuffer = readFileSync2(path2);
    const contentType = mime.getType(path2) || "application/octet-stream";
    ctx.type = contentType;
    ctx.body = fileBuffer;
  }
  // 删除文件
  async rmFile(ctx) {
    const { path: path2 } = ctx.request.query;
    unlinkSync(path2);
    const prePath = unlinkedPath(path2);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(prePath)
    };
  }
  // 删除目录
  async rmDir(ctx) {
    const { path: path2 } = ctx.request.query;
    rmSync(path2, { recursive: true, force: true });
    const prePath = unlinkedPath(path2);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(prePath)
    };
  }
  // 保存文件
  async saveFile(ctx) {
    const { path: path2 } = ctx.request.query;
    const { content } = ctx.request.body;
    writeFileSync(path2, content, "utf8");
    ctx.body = {
      code: 200,
      message: "ok"
    };
  }
  // 移动文件
  async moveFile(ctx) {
    const { path: path2, newPath } = ctx.request.query;
    renameSync(path2, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(newPath)
    };
  }
  // 移动目录
  async moveDir(ctx) {
    const { path: path2, newPath } = ctx.request.query;
    renameSync(path2, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(newPath)
    };
  }
  // 重命名文件
  async renameFile(ctx) {
    const { path: path2, newPath } = ctx.request.query;
    renameSync(path2, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(newPath)
    };
  }
  // 重命名目录
  async renameDir(ctx) {
    const { path: path2, newPath } = ctx.request.query;
    renameSync(path2, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(newPath)
    };
  }
  // 复制文件
  async copyFile(ctx) {
    const { path: path2, newPath } = ctx.request.query;
    copyFileSync2(path2, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(newPath)
    };
  }
  // 复制目录
  async copyDir(ctx) {
    const { path: path2, newPath } = ctx.request.query;
    copyDirectory(path2, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: getDir(newPath)
    };
  }
  // 查找
  async search(ctx) {
    const { path: path2, keyWord } = ctx.request.query;
    const res = fuzzyMatchInDirectoryTree(path2, keyWord);
    ctx.body = {
      code: 200,
      message: "ok",
      data: res
    };
  }
  // 上传
  async upload(ctx) {
    const { path: path2 } = ctx.request.body;
    const { filepath, originalFilename } = ctx.request.files.file;
    const newPath = join4(path2, originalFilename);
    if (!existsSync(path2)) {
      mkdirSync2(path2, { recursive: true });
    }
    console.log("\u3010micro-plugin\u3011\u4E0A\u4F20\u6587\u4EF6\uFF1A");
    console.log(ctx.request.body);
    renameSync(filepath, newPath);
    ctx.body = {
      code: 200,
      message: "ok",
      data: newPath
    };
  }
  // 下载
  async download(ctx) {
    const { path: path2 } = ctx.request.query;
    console.log(path2);
    try {
      ctx.set("Content-disposition", `attachment; filename="${basename(path2)}"`);
      ctx.set("Content-Type", "application/octet-stream");
      ctx.body = createReadStream(path2);
    } catch (error) {
      ctx.body = {
        code: 500,
        message: JSON.stringify(error)
      };
    }
  }
  // 得到过滤树
  async getFilesTree(ctx) {
    let { path: path2, ex } = ctx.request.query;
    const node = await getDir(path2, null);
    if (!path2) {
      path2 = join4(botInfo.WORK_PATH, "plugins");
    }
    const res = filterDirectoryTree(node, ex) ? node : { children: [] };
    ctx.body = {
      code: 200,
      message: "success",
      data: Object.assign(res, {
        children: res.children.filter(
          (item) => item.type == "directory" || item.type == "file" && item.name.includes(ex)
        )
      })
    };
  }
  // 计算文件大小
  async getFilesSize(ctx) {
    const { path: path2, type } = ctx.request.query;
    const res = type == "file" ? await calculateFileSize(path2) : await calculateTotalSize(getDir(path2, null));
    ctx.body = {
      code: 200,
      message: "success",
      data: formatFileSize(res)
    };
  }
  // 连接ssh
  async connectSSH(ctx) {
    const { host, port, username, password } = ctx.request.query;
    TermCfg.ssh.isOpen = true;
    TermCfg.ssh.host = host;
    TermCfg.ssh.port = port;
    TermCfg.ssh.username = username;
    TermCfg.ssh.password = password;
    ctx.body = {
      code: 200,
      message: "success",
      data: "ok"
    };
  }
  // 关闭ssh
  async closeSSH(ctx) {
    TermCfg.ssh.isOpen = false;
    ctx.body = {
      code: 200,
      message: "success",
      data: "ok"
    };
  }
};
var fs_default = new FsController();

// src/backend/server/controller/plugin/index.ts
import { readFileSync as readFileSync4 } from "fs";
import { join as join6 } from "path";

// src/backend/server/controller/plugin/pluginHandler.ts
import { existsSync as existsSync2, mkdirSync as mkdirSync3, readFileSync as readFileSync3, rmSync as rmSync2, writeFileSync as writeFileSync2 } from "fs";
import { join as join5 } from "path";
var PluginHandler = class {
  constructor(curPlugin) {
    this.curPlugin = curPlugin;
    this.indexPath = join5(pluginInfo.DATA_PATH, "regs.json");
    this.pluginsPath = join5(pluginInfo.DATA_PATH, "plugins");
    this.curPlugin = curPlugin;
    this.pluginsArr = [];
  }
  pluginsPath;
  indexPath;
  pluginsArr;
  /**
   *  获取插件列表
   */
  get pluginsList() {
    return JSON.parse(readFileSync3(this.indexPath, "utf-8"));
  }
  /**
   *  写入插件列表
   */
  set pluginsList(value) {
    writeFileSync2(this.indexPath, JSON.stringify(value, null, 2), "utf-8");
  }
  /**
   * 处理后的插件列表
   */
  get plugins() {
    return JSON.stringify(this.pluginsArr, null, 2);
  }
  /**
   * 设置当前插件对象
   * @param value 插件对象
   * @returns
   */
  setCurPlugin(value) {
    this.curPlugin = value;
  }
  /**
   * 存储插件列表
   * @param value 插件对象
   * @returns
   */
  async setPluginsList(value) {
    writeFileSync2(this.indexPath, JSON.stringify(value, null, 2), "utf-8");
  }
  /**
   * 新增插件
   * @returns
   */
  async addPlugin(value = null, id = "") {
    if (id !== "") {
      this.curPlugin = value;
    }
    this.pluginsArr = this.pluginsList;
    const pluginPath = join5(this.pluginsPath, this.curPlugin.id);
    const { message } = this.curPlugin;
    const newMessage = message.map((item) => {
      switch (item.type) {
        case "code":
          if (!existsSync2(pluginPath)) {
            mkdirSync3(pluginPath, { recursive: true });
          }
          writeFileSync2(join5(pluginPath, item.hash + ".code.js"), item.data, "utf-8");
          item.data = "";
          break;
        case "text":
          break;
        case "image":
          if (!existsSync2(pluginPath)) {
            mkdirSync3(pluginPath, { recursive: true });
          }
          if (!item.url && item.hash && item.data) {
            item.data = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8" /><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title>${item.hash}</title></head>${item.data}</html>`;
            writeFileSync2(join5(pluginPath, item.hash + ".html"), item.data, "utf-8");
            item.data = "";
            if (item.json) {
              writeFileSync2(join5(pluginPath, item.hash + ".json"), item.json, "utf-8");
              item.json = "";
            }
          }
          break;
        case "record":
          if (!existsSync2(pluginPath)) {
            mkdirSync3(pluginPath, { recursive: true });
          }
          break;
        case "video":
          if (!existsSync2(pluginPath)) {
            mkdirSync3(pluginPath, { recursive: true });
          }
          break;
        case "face":
          break;
        case "poke":
          break;
        case "dice":
          break;
        case "rps":
          break;
        case "markdown":
          if (!existsSync2(pluginPath)) {
            mkdirSync3(pluginPath, { recursive: true });
          }
          if (item.content) {
            writeFileSync2(join5(pluginPath, "markdown.json"), JSON.stringify(item.content), "utf-8");
            item.content = {};
          }
          break;
        case "button":
          if (!existsSync2(pluginPath)) {
            mkdirSync3(pluginPath, { recursive: true });
          }
          if (item.content) {
            writeFileSync2(join5(pluginPath, "button.json"), JSON.stringify(item.content), "utf-8");
            item.content = {};
          }
          break;
        default:
          Promise.reject(new Error("\u4E0D\u652F\u6301\u8BE5\u7C7B\u578B"));
      }
      return item;
    });
    if (id !== "") {
      const index = this.pluginsArr.findIndex((item) => item.id == id);
      this.pluginsArr[index] = Object.assign(this.curPlugin, { message: newMessage });
    } else {
      this.pluginsArr.unshift(Object.assign(this.curPlugin, { message: newMessage }));
    }
    this.setPluginsList(this.pluginsArr);
    return true;
  }
  /**
   * 删除插件
   * @returns
   */
  async deletePlugin(index) {
    this.pluginsArr = this.pluginsList;
    const pluginPath = join5(this.pluginsPath, this.pluginsArr[index].id);
    if (existsSync2(pluginPath)) {
      rmSync2(pluginPath, { recursive: true, force: true });
    }
    this.pluginsArr.splice(index, 1);
    this.setPluginsList(this.pluginsArr);
    return true;
  }
  /**
   * 修改某个插件
   * @returns
   */
  async editorPlugin(id, value) {
    this.addPlugin(value, id);
    return true;
  }
};

// src/backend/server/controller/plugin/index.ts
var PluginController = class {
  // 获取插件列表
  async getPluginList(ctx) {
    const pluginInstance = new PluginHandler();
    ctx.body = {
      code: 200,
      message: "success",
      data: pluginInstance.pluginsList
    };
  }
  // 添加插件
  async setPlugin(ctx) {
    const pluginInstance = new PluginHandler(ctx.request.body);
    pluginInstance.addPlugin();
    ctx.body = {
      code: 200,
      message: "success",
      data: pluginInstance.pluginsArr
    };
  }
  // 删除插件
  async deletePlugin(ctx) {
    const { index } = ctx.request.query;
    const pluginInstance = new PluginHandler();
    pluginInstance.deletePlugin(index);
    ctx.body = {
      code: 200,
      message: "success",
      data: pluginInstance.pluginsArr
    };
  }
  // 修改插件
  async editorPlugin(ctx) {
    const { index } = ctx.request.query;
    const pluginInstance = new PluginHandler();
    pluginInstance.editorPlugin(index, ctx.request.body);
    ctx.body = {
      code: 200,
      message: "success",
      data: pluginInstance.pluginsArr
    };
  }
  // 获取图片数据
  async getImageJson(ctx) {
    const { id, hash } = ctx.request.query;
    const htmlPath = join6(pluginInfo.DATA_PATH, "plugins", id, hash + ".json");
    const imageData = readFileSync4(htmlPath, "utf8");
    ctx.body = {
      code: 200,
      message: "success",
      data: imageData
    };
  }
  // 进入插件编辑页获取消息段资源
  async getSegResources(ctx) {
    const plugin3 = ctx.request.body;
    for (let i = 0; i < plugin3.message.length; i++) {
      if (plugin3.message[i].type == "button") {
        const btnJsonPath = join6(pluginInfo.DATA_PATH, "plugins", plugin3.id, "button.json");
        plugin3.message[i].content = JSON.parse(readFileSync4(btnJsonPath, "utf8"));
      }
      if (plugin3.message[i].type == "markdown") {
        const mdJsonPath = join6(pluginInfo.DATA_PATH, "plugins", plugin3.id, "markdown.json");
        plugin3.message[i].content = JSON.parse(readFileSync4(mdJsonPath, "utf8"));
      }
      if (plugin3.message[i].type == "code") {
        const jsPath = join6(
          pluginInfo.DATA_PATH,
          "plugins",
          plugin3.id,
          `${plugin3.message[i].hash}.code.js`
        );
        plugin3.message[i].data = readFileSync4(jsPath, "utf8");
      }
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: plugin3
    };
  }
};
var plugin_default = new PluginController();

// src/backend/server/controller/info/botInfo.ts
import { createRequire } from "module";
import moment from "moment";
var require2 = createRequire(import.meta.url);
var redis2 = await Redis();
async function getBotInfo(selfId) {
  const botList = _getBotList(selfId);
  const dataPromises = botList.map(async (i) => {
    let bot4 = Bot[i];
    if (!bot4) bot4 = {};
    if (bot4?.uin == 88888 || i == 88888) bot4.uin = selfId;
    const nickname = bot4?.nickname || bot4?.uin || i;
    const status = bot4?.status || 11;
    const apk = bot4?.apk;
    const version = bot4?.version;
    const avatarUrl = bot4?.avatar ?? (Number(bot4?.uin) ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot4?.uin}` : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot4?.self_id}`);
    const verKey = "version";
    const platform = apk ? `${apk.display} v${apk[verKey]}` : version?.version ?? "\u672A\u77E5";
    const messageCount = await getMessageCount(bot4);
    const countContacts = getCountContacts(bot4);
    const botRunTime = formatDuration(
      Date.now() / 1e3 - bot4?.stat?.start_time,
      "dd\u5929hh:mm:ss",
      true
    );
    let platformVersion = "";
    try {
      platformVersion = `ICQQ v${require2("icqq/package.json").version}`;
    } catch (err) {
      platformVersion = "\u672A\u77E5\u534F\u8BAE\u7248\u672C";
    }
    const botVersion = version ? `${version.name}${apk ? ` ${version.version}` : ""}` : platformVersion;
    return {
      avatarUrl,
      nickname,
      botRunTime,
      status,
      platform,
      botVersion,
      messageCount,
      countContacts
    };
  });
  return Promise.all(dataPromises);
}
async function getMessageCount(bot4) {
  const nowDate = moment().format("MMDD");
  const keys = [
    `Yz:count:send:msg:bot:${bot4?.uin}:total`,
    `Yz:count:receive:msg:bot:${bot4?.uin}:total`,
    `Yz:count:send:image:bot:${bot4?.uin}:total`,
    `Yz:count:screenshot:day:${nowDate}`
  ];
  const values = await redis2.mGet(keys) || [];
  const sent = values[0] || bot4?.stat?.sent_msg_cnt || 0;
  const recv = values[1] || bot4?.stat?.recv_msg_cnt || 0;
  const screenshot = values[2] || values[3] || 0;
  return {
    sent,
    recv,
    screenshot
  };
}
function getCountContacts(bot4) {
  const friend = bot4?.fl?.size || 0;
  const group2 = bot4?.gl?.size || 0;
  const groupMember = Array.from(bot4?.gml?.values() || []).reduce(
    (acc, curr) => acc + curr.size,
    0
  );
  return {
    friend,
    group: group2,
    groupMember
  };
}
function _getBotList(selfId) {
  let BotList = [selfId];
  if (Array.isArray(Bot.uin)) {
    BotList = Bot.uin;
  } else {
    BotList = Bot.adapter;
  }
  return BotList;
}

// src/backend/server/controller/info/index.ts
var InfoController = class {
  // 获取机器人基本信息
  async botInfo(ctx) {
    const botInfo2 = await getBotInfo(config_default.qq);
    ctx.body = {
      code: 200,
      message: "success",
      data: botInfo2
    };
  }
  // 获取工作URI
  async botURI(ctx) {
    ctx.body = {
      code: 200,
      message: "success",
      data: path2URI()
    };
  }
};
var info_default = new InfoController();

// src/backend/server/controller/config/index.ts
import { existsSync as existsSync3, readdirSync as readdirSync3, statSync as statSync2 } from "fs";
import { join as join7 } from "path";
import { pathToFileURL } from "url";

// src/backend/server/utils/result.ts
var Result = class _Result {
  constructor(code, result, message, httpStatus = 200) {
    this.code = code;
    this.result = result;
    this.message = message;
    this.httpStatus = httpStatus;
    this.code = code;
    this.result = result;
    this.message = message;
    this.httpStatus = httpStatus;
  }
  /** 无返回值 */
  static VOID = /* @__PURE__ */ Symbol();
  /** 尚未实现错误码 */
  static ERR_CODE_501 = /* @__PURE__ */ Symbol();
  /**
   * 成功
   * @static
   * @param result 返回结果
   * @param message 返回消息
   * @returns {Result}
   */
  static ok(result, message = "ok") {
    return new _Result(200, result, message);
  }
  /**
   * 错误
   * @static
   * @returns {Result}
   */
  static error(...args) {
    switch (args.length) {
      case 1:
        if (typeof args[0] === "number") {
          return new _Result(args[0], {}, "error");
        } else {
          return new _Result(-1, {}, args[0]);
        }
      case 2:
        if (typeof args[0] === "number") {
          return new _Result(args[0], {}, args[1] ?? "error");
        } else if (typeof args[1] === "number") {
          return new _Result(-1, {}, args[0], args[1]);
        } else {
          return new _Result(-1, args[1], args[0]);
        }
      case 3:
        if (typeof args[0] === "number") {
          return new _Result(args[0], args[1], args[2]);
        } else {
          return new _Result(-1, args[0], args[1], args[2]);
        }
      case 4:
        return new _Result(args[0], args[1], args[2], args[3]);
    }
  }
  /**
   * 尚未登录
   *
   * @returns {Result}
   */
  static noLogin() {
    return new _Result(401, null, "Token\u5931\u6548\u6216\u5C1A\u672A\u767B\u5F55", 401);
  }
  /**
   * 尚未授权
   *
   * @returns {Result}
   */
  static noAuth() {
    return new _Result(403, null, "\u6CA1\u6709\u6743\u9650", 403);
  }
  /**
   * 404未找到
   *
   * @returns {Result}
   */
  static notFound() {
    return new _Result(404, null, "404 Not Found", 404);
  }
  /**
   * 功能尚未实现
   *
   * @returns {Result}
   */
  static unrealized() {
    return new _Result(501, null, "\u8BE5\u529F\u80FD\u5728\u5F53\u524D\u7248\u672C\u4E2D\u5C1A\u672A\u5B9E\u73B0", 501);
  }
  get isOk() {
    return this.code === 0;
  }
  toJSON() {
    return {
      ok: this.isOk,
      code: this.code,
      result: this.result,
      message: this.message
    };
  }
};

// src/backend/server/controller/config/tools.ts
import _4 from "lodash";
function getNestedProperty(obj, path2) {
  const keys = path2.split(".");
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!current || !(key in current)) {
      return { isTrue: false };
    }
    current = current[key];
    if (i === keys.length - 1) {
      return { isTrue: true, value: current };
    }
  }
}

// src/backend/server/controller/config/botCfgMap.ts
var bot = {
  log_level: {
    desc: "\u65E5\u5FD7\u7B49\u7EA7:trace,debug,info,warn,fatal,mark,error,off",
    value: "info",
    type: "string"
  },
  ignore_self: {
    desc: "\u7FA4\u804A\u548C\u9891\u9053\u4E2D\u8FC7\u6EE4\u81EA\u5DF1\u7684\u6D88\u606F",
    value: true,
    type: "boolean"
  },
  resend: {
    desc: "\u88AB\u98CE\u63A7\u65F6\u662F\u5426\u5C1D\u8BD5\u7528\u5206\u7247\u53D1\u9001",
    value: false,
    type: "boolean"
  },
  sendmsg_error: {
    desc: "\u53D1\u9001\u6D88\u606F\u9519\u8BEF\u65F6\u662F\u5426\u901A\u77E5\u4E3B\u4EBA",
    value: false,
    type: "boolean"
  },
  restart_port: {
    desc: "\u91CD\u542FAPI\u7AEF\u53E3 \u4EC5ksr.js\u751F\u6548",
    value: 27881,
    type: "number"
  },
  ffmpeg_path: {
    desc: "ffmpeg \u8DEF\u5F84",
    value: null,
    type: "string"
  },
  ffprobe_path: {
    desc: "ffprobe \u8DEF\u5F84",
    value: null,
    type: "string"
  },
  chromium_path: {
    desc: "chromium\u5176\u4ED6\u8DEF\u5F84",
    value: null,
    type: "string"
  },
  puppeteer_ws: {
    desc: "puppeteer\u63A5\u53E3\u5730\u5740",
    value: null,
    type: "string"
  },
  puppeteer_timeout: {
    desc: "puppeteer\u622A\u56FE\u8D85\u65F6\u65F6\u95F4",
    value: null,
    type: "string"
  },
  proxyAddress: {
    desc: "\u7C73\u6E38\u793E\u63A5\u53E3\u4EE3\u7406\u5730\u5740\uFF0C\u56FD\u9645\u670D\u7528",
    value: null,
    type: "string"
  },
  online_msg: {
    desc: "\u4E0A\u7EBF\u65F6\u7ED9\u9996\u4E2A\u4E3B\u4EBAQQ\u63A8\u9001\u5E2E\u52A9",
    value: true,
    type: "boolean"
  },
  online_msg_exp: {
    desc: "\u4E0A\u7EBF\u63A8\u9001\u901A\u77E5\u7684\u51B7\u5374\u65F6\u95F4",
    value: 86400,
    type: "number"
  },
  skip_login: {
    desc: "\u662F\u5426\u8DF3\u8FC7\u767B\u5F55ICQQ",
    value: false,
    type: "boolean"
  },
  sign_api_addr: {
    desc: "\u7B7E\u540DAPI\u5730\u5740(\u5982:http://127.0.0.1:8080/sign?key=114514)",
    value: null,
    type: "string"
  },
  ver: {
    desc: "\u4F20\u5165\u7684QQ\u7248\u672C(\u5982:8.9.63\u30018.9.68)",
    value: null,
    type: "string"
  }
};
var group = {
  default: {
    groupGlobalCD: {
      desc: "\u7FA4\u804A\u4E2D\u6240\u6709\u6307\u4EE4\u64CD\u4F5C\u51B7\u5374\u65F6\u95F4\uFF0C\u5355\u4F4D\u6BEB\u79D2,0\u5219\u65E0\u9650\u5236",
      value: 0,
      type: "number"
    },
    singleCD: {
      desc: "\u7FA4\u804A\u4E2D\u4E2A\u4EBA\u64CD\u4F5C\u51B7\u5374\u65F6\u95F4\uFF0C\u5355\u4F4D\u6BEB\u79D2",
      value: 1e3,
      type: "number"
    },
    onlyReplyAt: {
      desc: "\u662F\u5426\u53EA\u4EC5\u5173\u6CE8\u4E3B\u52A8@\u673A\u5668\u4EBA\u7684\u6D88\u606F\uFF0C 0-\u5426 1-\u662F 2-\u89E6\u53D1\u7528\u6237\u975E\u4E3B\u4EBA\u53EA\u56DE\u590D@\u673A\u5668\u4EBA\u7684\u6D88\u606F\u53CA\u7279\u5B9A\u524D\u7F00\u7684\u6D88\u606F\uFF0C\u4E3B\u4EBA\u514D\u524D\u7F00",
      value: 0,
      type: "number"
    },
    botAlias: {
      desc: "\u5F00\u542F\u540E\u5219\u53EA\u56DE\u590D@\u673A\u5668\u4EBA\u7684\u6D88\u606F\u53CA\u7279\u5B9A\u524D\u7F00\u7684\u6D88\u606F\uFF0C\u652F\u6301\u591A\u4E2A",
      value: ["\u4E91\u5D3D", "\u4E91\u5B9D"],
      type: "array",
      subType: "string"
    },
    imgAddLimit: {
      desc: "\u6DFB\u52A0\u8868\u60C5\u662F\u5426\u9650\u5236  0-\u6240\u6709\u7FA4\u5458\u90FD\u53EF\u4EE5\u6DFB\u52A0 1-\u7FA4\u7BA1\u7406\u5458\u624D\u80FD\u6DFB\u52A0 2-\u4E3B\u4EBA\u624D\u80FD\u6DFB\u52A0",
      value: 0,
      type: "number"
    },
    imgMaxSize: {
      desc: "\u6DFB\u52A0\u8868\u60C5\u56FE\u7247\u5927\u5C0F\u9650\u5236\uFF0C\u9ED8\u8BA42m",
      value: 2,
      type: "number"
    },
    addPrivate: {
      desc: "\u662F\u5426\u5141\u8BB8\u79C1\u804A\u6DFB\u52A0  1-\u5141\u8BB8 0-\u7981\u6B62",
      value: 1,
      type: "number"
    },
    enable: {
      desc: "\u53EA\u542F\u7528\u529F\u80FD\uFF0C\u914D\u7F6E\u540E\u53EA\u6709\u8BE5\u529F\u80FD\u624D\u54CD\u5E94",
      value: null,
      type: "boolean"
    },
    disable: {
      desc: "\u7981\u7528\u529F\u80FD\uFF0C\u529F\u80FD\u540D\u79F0,\u4F8B\u5982\uFF1A\u5341\u8FDE\u3001\u89D2\u8272\u67E5\u8BE2\u3001\u4F53\u529B\u67E5\u8BE2\u3001\u7528\u6237\u7ED1\u5B9A\u3001\u62BD\u5361\u8BB0\u5F55\u3001\u6DFB\u52A0\u8868\u60C5\u3001\u6B22\u8FCE\u65B0\u4EBA\u3001\u9000\u7FA4\u901A\u77E5",
      value: ["\u7981\u7528\u793A\u4F8B", "\u652F\u6301\u591A\u4E2A"],
      type: "array",
      subType: "string"
    }
  },
  123456: {
    groupGlobalCD: {
      desc: "\u7FA4\u804A\u4E2D\u6240\u6709\u6307\u4EE4\u64CD\u4F5C\u51B7\u5374\u65F6\u95F4\uFF0C\u5355\u4F4D\u6BEB\u79D2,0\u5219\u65E0\u9650\u5236",
      value: 0,
      type: "number"
    },
    singleCD: {
      desc: "\u7FA4\u804A\u4E2D\u4E2A\u4EBA\u64CD\u4F5C\u51B7\u5374\u65F6\u95F4\uFF0C\u5355\u4F4D\u6BEB\u79D2",
      value: 1e3,
      type: "number"
    }
  }
};
var notice = {
  iyuu: {
    desc: "IYUU(https://iyuu.cn/)",
    value: null,
    type: "string"
  },
  sct: {
    desc: "Server\u9171(https://sct.ftqq.com/)",
    value: null,
    type: "string"
  },
  feishu_webhook: {
    desc: "\u98DE\u4E66\u81EA\u5B9A\u4E49\u673A\u5668\u4EBAWebhook (https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)",
    value: null,
    type: "string"
  }
};
var other = {
  autoFriend: {
    desc: "\u662F\u5426\u81EA\u52A8\u540C\u610F\u52A0\u597D\u53CB 1-\u540C\u610F 0-\u4E0D\u5904\u7406",
    value: 1,
    type: "number"
  },
  autoQuit: {
    desc: "\u81EA\u52A8\u9000\u7FA4\u4EBA\u6570\uFF08\u673A\u5668\u4EBA\u52A0\u5165\u7FA4\u804A\u540E\uFF0C\u82E5\u7FA4\u804A\u4EBA\u6570\u5C0F\u4E8E\u8BBE\u5B9A\u4EBA\u6570\u5219\u81EA\u52A8\u9000\u7FA4\uFF09",
    value: 50,
    type: "number"
  },
  masterQQ: {
    desc: "\u4E3B\u4EBAQQ\u53F7",
    value: [2330660495],
    type: "array",
    subType: "number"
  },
  disableGuildMsg: {
    desc: "\u7981\u7528\u9891\u9053\u529F\u80FD true: \u4E0D\u63A5\u53D7\u9891\u9053\u6D88\u606F\uFF0Cflase\uFF1A\u63A5\u53D7\u9891\u9053\u6D88\u606F",
    value: true,
    type: "boolean"
  },
  disablePrivate: {
    desc: "\u7981\u7528\u79C1\u804A\u529F\u80FD true\uFF1A\u79C1\u804A\u53EA\u63A5\u53D7ck\u4EE5\u53CA\u62BD\u5361\u94FE\u63A5\uFF08Bot\u4E3B\u4EBA\u4E0D\u53D7\u9650\u5236\uFF09\uFF0Cfalse\uFF1A\u79C1\u804A\u53EF\u4EE5\u89E6\u53D1\u5168\u90E8\u6307\u4EE4\uFF0C\u9ED8\u8BA4false",
    value: false,
    type: "boolean"
  },
  disableMsg: {
    desc: "\u7981\u7528\u79C1\u804ABot\u63D0\u793A\u5185\u5BB9",
    value: "\u79C1\u804A\u529F\u80FD\u5DF2\u7981\u7528\uFF0C\u4EC5\u652F\u6301\u53D1\u9001cookie\uFF0C\u62BD\u5361\u8BB0\u5F55\u94FE\u63A5\uFF0C\u8BB0\u5F55\u65E5\u5FD7\u6587\u4EF6",
    type: "string"
  },
  disableAdopt: {
    desc: "\u7981\u7528\u79C1\u804ABot\u63D0\u793A\u5185\u5BB9",
    value: ["stoken"],
    type: "array",
    subType: "string"
  },
  whiteGroup: {
    desc: "\u767D\u540D\u5355\u7FA4\uFF0C\u914D\u7F6E\u540E\u53EA\u5728\u8BE5\u7FA4\u751F\u6548",
    value: null,
    type: "array",
    subType: "number"
  },
  whiteQQ: {
    desc: "\u767D\u540D\u5355qq",
    value: null,
    type: "array",
    subType: "number"
  },
  blackGroup: {
    desc: "\u9ED1\u540D\u5355\u7FA4",
    value: [213938015],
    type: "array",
    subType: "number"
  },
  blackQQ: {
    desc: "\u9ED1\u540D\u5355qq",
    value: [528952540],
    type: "array",
    subType: "number"
  }
};
var puppeteer = {
  chromiumPath: {
    desc: "chromiumPath: C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    value: null,
    type: "string"
  },
  puppeteerWS: {
    desc: "puppeteerWS\u5730\u5740\uFF0C\u5982: ws://browserless:3000",
    value: null,
    type: "string"
  },
  headless: {
    desc: "headless",
    value: "new",
    type: "string"
  },
  args: {
    desc: "puppeteer\u542F\u52A8args\uFF0C\u6CE8\u610Fargs\u7684--\u524D\u7F00",
    value: ["--disable-gpu", "--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
    type: "array",
    subType: "string"
  },
  puppeteerTimeout: {
    desc: "puppeteer\u622A\u56FE\u8D85\u65F6\u65F6\u95F4",
    value: null,
    type: "number"
  }
};
var qq = {
  qq: {
    desc: "qq\u8D26\u53F7",
    value: null,
    type: "number"
  },
  pwd: {
    desc: "\u5BC6\u7801\uFF0C\u4E3A\u7A7A\u5219\u7528\u626B\u7801\u767B\u5F55,\u626B\u7801\u767B\u5F55\u73B0\u5728\u4EC5\u80FD\u5728\u540C\u4E00ip\u4E0B\u8FDB\u884C",
    value: null,
    type: "string"
  },
  platform: {
    desc: "1:\u5B89\u5353\u624B\u673A\u3001 2:aPad \u3001 3:\u5B89\u5353\u624B\u8868\u3001 4:MacOS \u3001 5:iPad \u3001 6:Tim",
    value: 6,
    type: "number"
  }
};
var redis3 = {
  host: {
    desc: "redis\u5730\u5740",
    value: "127.0.0.1",
    type: "string"
  },
  port: {
    desc: "redis\u7AEF\u53E3",
    value: 6379,
    type: "number"
  },
  username: {
    desc: "redis\u7528\u6237\u540D\uFF0C\u53EF\u4EE5\u4E3A\u7A7A",
    value: null,
    type: "string"
  },
  password: {
    desc: "redis\u5BC6\u7801\uFF0C\u6CA1\u6709\u5BC6\u7801\u53EF\u4EE5\u4E3A\u7A7A",
    value: null,
    type: "string"
  },
  db: {
    desc: "redis\u6570\u636E\u5E93",
    value: 0,
    type: "number"
  }
};
var renderer = {
  name: {
    desc: "\u6E32\u67D3\u540E\u7AEF, \u9ED8\u8BA4\u4E3A puppeteer",
    value: null,
    type: "string"
  }
};

// src/backend/server/controller/config/protocolCfgMap.ts
var stdin = {
  name: {
    desc: "\u6807\u51C6\u8F93\u51FA\u524D\u7F00",
    value: "\u6807\u51C6",
    type: "string"
  },
  avatar: {
    desc: "\u6807\u51C6\u8F93\u5165\u5934\u50CF\uFF0C\u8BF7\u586B\u5199\u7F51\u7EDC\u5730\u5740",
    value: "https://img.shields.io/badge/Term-std-cyan",
    type: "string"
  },
  uin: {
    desc: "\u8D26\u53F7",
    value: "std",
    type: "string"
  },
  user_id: {
    desc: "\u6A21\u62DF\u7528\u6237user_id",
    value: 114514,
    type: "number"
  },
  disabled: {
    desc: "\u662F\u5426\u7981\u7528",
    value: false,
    type: "boolean"
  }
};
var onebotv11 = {
  url: {
    desc: "\u53CD\u5411\u8FDE\u63A5\u8DEF\u7531\uFF0C\u534F\u8BAE\u7AEF\u53EF\u4EE5\u914D\u7F6E\u8BE5\u8DEF\u7531\u8FDB\u884C\u53CD\u5411\u8FDE\u63A5",
    value: "/onebot/v11/ws",
    type: "string"
  },
  address: {
    desc: "\u6B63\u5411\u8FDE\u63A5\u5730\u5740\uFF0C\u9ED8\u8BA4\u53C2\u8003\u3010Gensokyo\uFF1Aws://localhost:15630/ws?access_token=12345,Langrange.Onebot\uFF1Aws://localhost:8081\u3011",
    value: [],
    type: "array",
    subType: "string"
  },
  disabled: {
    desc: "\u662F\u5426\u7981\u7528",
    value: false,
    type: "boolean"
  }
};

// src/backend/server/controller/config/plugins/microCfgMap.ts
var userInfo = {
  avatar: {
    desc: "\u5982\u679C\u914D\u7F6E\u4F18\u5148\u4F7F\u7528\u8BE5\u5934\u50CF\uFF0C\u5426\u5219\u4F7F\u7528\u7B2C\u4E00\u4E3B\u4EBA\u5934\u50CF\uFF0C\u5982(https://q1.qlogo.cn/g?b=qq&s=0&nk=2330660495)",
    value: "",
    type: "string"
  },
  username: {
    desc: "\u767B\u5F55\u8D26\u53F7",
    value: "",
    type: "string"
  },
  password: {
    desc: "\u767B\u5F55\u5BC6\u7801",
    value: "",
    type: "string"
  },
  desc: {
    desc: "\u7BA1\u7406\u5458\u63CF\u8FF0",
    value: "\u666E\u901A\u7BA1\u7406\u5458",
    type: "string"
  },
  expires: {
    desc: "token\u8FC7\u671F\u65F6\u95F4",
    value: "86400",
    type: "string"
  },
  routes: {
    desc: "\u52FE\u9009\u540E\u8BE5\u6A21\u5757\u5BF9\u6B64\u7BA1\u7406\u5458\u9690\u85CF",
    value: "\u666E\u901A\u7BA1\u7406\u5458",
    type: "array",
    subType: "string"
  }
  // "token": {
  //     desc: '(自动生成)',
  //     value: '',
  //     type: 'string'
  // },
  // "skey": {
  //     desc: '(自动生成)',
  //     value: '',
  //     type: 'string'
  // },
};

// src/backend/server/controller/config/index.ts
var ConfigController = class {
  // 获取机器人配置
  async getBotConfig(ctx) {
    const { name } = ctx.request.query;
    const botCfg = await config_default.getBotConfig(name);
    const defCfg = {
      bot,
      notice,
      other,
      puppeteer,
      qq,
      redis: redis3,
      renderer
    };
    let res;
    if (name == "group") {
      for (const groupKey in botCfg) {
        if (!group[groupKey]) {
          group[groupKey] = group.default;
        }
        for (const key in botCfg[groupKey]) {
          if (Object.prototype.hasOwnProperty.call(group[groupKey], key)) {
            group[groupKey][key].value = botCfg[groupKey][key];
          }
        }
        res = group;
      }
    } else {
      for (const key in botCfg) {
        if (defCfg[name] && Object.prototype.hasOwnProperty.call(defCfg[name], key)) {
          defCfg[name][key].value = botCfg[key];
        }
      }
      res = defCfg[name];
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: res
    };
  }
  // 修改机器人配置
  async setBotConfig(ctx) {
    const { name } = ctx.request.query;
    const data = ctx.request.body;
    const botCfg = new YamlHandler(join7(botInfo.WORK_PATH, "config", "config", name + ".yaml"));
    const cfgJson = botCfg.jsonData;
    if (name == "group") {
      for (const groupKey in data) {
        if (!cfgJson[groupKey]) {
          cfgJson[groupKey] = cfgJson.default;
        }
        for (const key in data[groupKey]) {
          botCfg.document.setIn(
            [isNaN(Number(groupKey)) ? groupKey : Number(groupKey), key],
            data[groupKey][key].value
          );
        }
        botCfg.save();
      }
    } else {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(cfgJson, key)) {
          if (data[key].value === "") {
            data[key].value = null;
          }
          botCfg.set(key, data[key].value);
        }
      }
      botCfg.save();
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: "ok"
    };
  }
  // 获取用户权限配置
  async getUserConfig(ctx) {
    const userCfg = (await config_default.getConfig("server")).userInfo;
    const defCfg = userInfo;
    const res = [];
    for (const user of userCfg) {
      for (const key in user) {
        if (Object.prototype.hasOwnProperty.call(defCfg, key)) {
          defCfg[key].value = user[key];
        }
      }
      res.push(JSON.parse(JSON.stringify(defCfg)));
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: res
    };
  }
  // 修改用户权限配置
  async setUserConfig(ctx) {
    const data = ctx.request.body;
    const serverCfg = new YamlHandler(
      join7(pluginInfo.ROOT_PATH, "config", "config", "server.yaml")
    );
    const originalUserInfo = serverCfg.jsonData.userInfo;
    const userList = data.map((item) => item.username.value);
    originalUserInfo.forEach((user, index) => {
      if (!userList.includes(user.username)) {
        serverCfg.document.deleteIn(["userInfo", index]);
      }
    });
    data.forEach((user, index) => {
      for (const key in user) {
        serverCfg.document.setIn(["userInfo", index, key], user[key].value);
      }
    });
    serverCfg.save();
    ctx.body = {
      code: 200,
      message: "success",
      data: "ok"
    };
  }
  // 获取协议配置
  async getProtocolConfig(ctx) {
    const protocolCfg = config_default.getConfig("protocol");
    const defCfg = {
      stdin,
      onebotv11
    };
    for (const groupKey in protocolCfg) {
      for (const key in protocolCfg[groupKey]) {
        if (Object.prototype.hasOwnProperty.call(defCfg[groupKey], key)) {
          defCfg[groupKey][key].value = protocolCfg[groupKey][key];
        }
      }
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: defCfg
    };
  }
  // 修改协议配置
  async setProtocolConfig(ctx) {
    const data = ctx.request.body;
    const protocolCfg = new YamlHandler(
      join7(pluginInfo.ROOT_PATH, "config", "config", "protocol.yaml")
    );
    for (const groupKey in data) {
      for (const key in data[groupKey]) {
        protocolCfg.document.setIn([groupKey, key], data[groupKey][key].value);
      }
    }
    protocolCfg.save();
    ctx.body = {
      code: 200,
      message: "success",
      data: protocolCfg
    };
  }
  // 获取插件列表
  async getPluginsInfoList(ctx) {
    const { source } = ctx.request.query;
    const pluginInfoArr = [];
    if (source == "guoba") {
      const pluginsPath2 = join7(botInfo.WORK_PATH, "plugins");
      const packages = readdirSync3(pluginsPath2);
      for (const pkg of packages) {
        const pkgPath = join7(pluginsPath2, pkg);
        if (statSync2(pkgPath).isDirectory()) {
          const guobaSupportPath = join7(pkgPath, "guoba.support.js");
          if (existsSync3(guobaSupportPath)) {
            const guobaCfg = await import(pathToFileURL(guobaSupportPath).toString());
            const pkgCfg = await guobaCfg.supportGuoba();
            pluginInfoArr.push(Object.assign(pkgCfg.pluginInfo || {}, { pluginName: pkg }));
          }
        }
      }
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: pluginInfoArr
    };
  }
  // 获取单个插件配置
  async getPluginConfig(ctx) {
    const { pluginName, source } = ctx.request.query;
    let pluginCfg = {
      pluginInfo: {},
      configInfo: {
        schemas: [
          {
            field: "nana",
            label: "\u5450\u5450~",
            bottomHelpMessage: "\u54AA",
            component: "InputTextArea"
          }
        ],
        getConfigData: () => {
        },
        setConfigData: (data, { Result: Result2 }) => {
          console.log(data, Result2);
        }
      }
    };
    let res = [];
    if (source == "guoba") {
      const guobaSupportPath = join7(botInfo.WORK_PATH, "plugins", pluginName, "guoba.support.js");
      const { supportGuoba } = await import(pathToFileURL(guobaSupportPath).toString());
      pluginCfg = await supportGuoba();
      const cfgSets = await pluginCfg.configInfo.getConfigData();
      res = pluginCfg.configInfo.schemas.map((cfg) => {
        if (cfg.field) {
          const NestedProperty = getNestedProperty(cfgSets, cfg.field);
          if (NestedProperty.isTrue) {
            return Object.assign(cfg, { value: NestedProperty.value });
          } else {
            return cfg;
          }
        } else {
          return cfg;
        }
      });
    }
    ctx.body = {
      code: 200,
      message: "success",
      data: res
    };
  }
  // 设置单个插件配置
  async setPluginConfig(ctx) {
    const { pluginName, source } = ctx.request.query;
    const data = ctx.request.body;
    let pluginCfg = {
      pluginInfo: {},
      configInfo: {
        schemas: [
          {
            field: "nana",
            label: "\u5450\u5450~",
            bottomHelpMessage: "\u54AA",
            component: "InputTextArea"
          }
        ],
        getConfigData: () => {
        },
        setConfigData: (data2, { Result: Result2 }) => {
          console.log(data2, Result2);
        }
      }
    };
    const dataParams = {};
    data.forEach((cfg) => {
      if ("value" in cfg && cfg.field) {
        dataParams[cfg.field] = cfg.value;
      }
    });
    let res;
    if (source == "guoba") {
      const guobaSupportPath = join7(botInfo.WORK_PATH, "plugins", pluginName, "guoba.support.js");
      const { supportGuoba } = await import(pathToFileURL(guobaSupportPath).toString());
      pluginCfg = await supportGuoba();
      res = await pluginCfg.configInfo.setConfigData(dataParams, { Result });
    }
    ctx.body = {
      code: 200,
      message: res.message,
      data: res.httpStatus
    };
  }
};
var config_default2 = new ConfigController();

// src/backend/server/controller/sandbox/index.ts
import { readFile, rename, writeFile } from "fs/promises";
import { createHash } from "crypto";
import { existsSync as existsSync4, mkdirSync as mkdirSync4, unlinkSync as unlinkSync2 } from "fs";
import { extname, join as join8 } from "path";
var SandboxController = class {
  // 系统状态
  async getPluginsLoader(ctx) {
    const pkgs = await getLoader();
    ctx.body = {
      code: 200,
      message: "success",
      data: pkgs
    };
  }
  // 上传文件
  async uploadFile(ctx) {
    const { filepath, originalFilename } = ctx.request.files.file;
    const fileHostPath2 = join8(botInfo.WORK_PATH, "temp", "fileHost");
    const fileBuffer = await readFile(filepath);
    const hash = createHash("md5");
    hash.update(fileBuffer);
    const md5Hash = hash.digest("hex");
    const fileExt = extname(originalFilename);
    const newFilename = `${md5Hash}${fileExt}`;
    const newPath = join8(fileHostPath2, newFilename);
    console.log("\u3010micro-plugin\u3011\u4E0A\u4F20\u6587\u4EF6\uFF1A");
    console.log(ctx.request.body);
    await rename(filepath, newPath);
    let address = "";
    const { port, host } = config_default.getConfig("server").server;
    if (host === "auto") {
      const { remote } = await getAllWebAddress();
      address = `http://${remote[0]}:${port}/api/File/${newFilename}`;
    } else {
      address = `http://${host}:${port}/api/File/${newFilename}`;
    }
    ctx.body = {
      code: 200,
      message: "ok",
      data: address
    };
  }
  // 获取onebot11数据
  async getOnebot11Data(ctx) {
    const sandboxPath = join8(pluginInfo.DATA_PATH, "sandbox");
    if (!existsSync4(sandboxPath)) {
      mkdirSync4(sandboxPath, { recursive: true });
    }
    const onebotv11Json = join8(sandboxPath, "onebotv11.json");
    if (!existsSync4(onebotv11Json)) {
      ctx.body = {
        code: 200,
        message: "onebotv11.json not existed!",
        data: null
      };
    } else {
      ctx.body = {
        code: 200,
        message: "ok",
        data: JSON.parse(await readFile(onebotv11Json, "utf-8"))
      };
    }
  }
  // 设置onebot11数据
  async setOnebot11Data(ctx) {
    const sandboxPath = join8(pluginInfo.DATA_PATH, "sandbox");
    if (!existsSync4(sandboxPath)) {
      mkdirSync4(sandboxPath, { recursive: true });
    }
    const onebotv11Json = join8(sandboxPath, "onebotv11.json");
    await writeFile(onebotv11Json, JSON.stringify(ctx.request.body));
    ctx.body = {
      code: 200,
      message: "ok",
      data: {}
    };
  }
  // 重置onebot11数据
  async reSetOnebot11Data(ctx) {
    const onebotv11Json = join8(pluginInfo.DATA_PATH, "sandbox", "onebotv11.json");
    if (existsSync4(onebotv11Json)) {
      unlinkSync2(onebotv11Json);
      ctx.body = {
        code: 200,
        message: "ok",
        data: {}
      };
    } else {
      ctx.body = {
        code: 500,
        message: "\u6570\u636E\u5DF2\u5220\u9664",
        data: {}
      };
    }
  }
};
var sandbox_default = new SandboxController();

// src/backend/server/controller/database/redis/index.ts
function classifyKeys(keys, sep = ":") {
  const root = { name: "", path: "", children: [] };
  const nodeMap = { "": root };
  keys.forEach((key) => {
    const parts = key.split(sep);
    let currentNode = root;
    let path2 = "";
    parts.forEach((part, index) => {
      path2 += `${path2 ? sep : ""}${part}`;
      if (nodeMap[path2]) {
        currentNode = nodeMap[path2];
      } else {
        const newNode = { name: part, path: path2, children: [] };
        currentNode.children.push(newNode);
        currentNode = newNode;
        nodeMap[path2] = currentNode;
      }
      if (index < parts.length - 1) {
        currentNode.path = path2;
      }
    });
  });
  return root.children;
}

// src/backend/server/controller/database/index.ts
var DatabaseController = class {
  // 日志展示
  async getKeys(ctx) {
    const sep = ctx.request.query.sep || ":";
    const keys = classifyKeys(await redis.keys("*"), sep);
    ctx.body = {
      code: 200,
      message: "ok",
      data: keys
    };
  }
  // 获取键
  async getKey(ctx) {
    const { key } = ctx.request.query;
    try {
      const value = await redis.get(key);
      ctx.body = {
        code: 200,
        message: "ok",
        data: value ? value.toString() : value
      };
    } catch (err) {
      ctx.body = {
        code: 503,
        message: err.message,
        data: ""
      };
      logger.error(err);
    }
  }
  // 设置键
  async setKey(ctx) {
    const { key, value } = ctx.request.body;
    try {
      await redis.set(key, value);
      ctx.body = {
        code: 200,
        message: "ok",
        data: ""
      };
    } catch (err) {
      ctx.body = {
        code: 503,
        message: err.message,
        data: ""
      };
      logger.error(err);
    }
  }
  // 删除键
  async delKey(ctx) {
    const { key } = ctx.request.query;
    try {
      await redis.del(key);
      ctx.body = {
        code: 200,
        message: "ok",
        data: ""
      };
    } catch (err) {
      ctx.body = {
        code: 503,
        message: err.message,
        data: ""
      };
      logger.error(err);
    }
  }
  // 批量删除键
  async delKeys(ctx) {
    const { key } = ctx.request.query;
    try {
      const keys = await redis.keys(key);
      await redis.del(keys);
      ctx.body = {
        code: 200,
        message: "ok",
        data: ""
      };
    } catch (err) {
      ctx.body = {
        code: 503,
        message: err.message,
        data: ""
      };
      logger.error(err);
    }
  }
};
var database_default = new DatabaseController();

// src/backend/server/router/index.ts
var router = new Router({ prefix: "/api" });
router.post("/login", user_default.login);
router.post("/logOut", user_default.logOut);
router.get("/user/info", auth_default, user_default.userInfo);
router.get("/user/port", auth_default, user_default.getPort);
router.post("/server/address", user_default.getWebAddress);
router.get("/bot/getcfg" /* GET_BOT_CONFIG_URL */, auth_default, config_default2.getBotConfig);
router.post("/bot/setcfg" /* SET_BOT_CONFIG_URL */, auth_default, config_default2.setBotConfig);
router.get("/user/getcfg" /* GET_USER_CONFIG_URL */, auth_default, config_default2.getUserConfig);
router.post("/user/setcfg" /* SET_USER_CONFIG_URL */, auth_default, config_default2.setUserConfig);
router.get("/protocol/getcfg" /* GET_PROTOCOL_CONFIG_URL */, auth_default, config_default2.getProtocolConfig);
router.post("/protocol/setcfg" /* SET_PROTOCOL_CONFIG_URL */, auth_default, config_default2.setProtocolConfig);
router.get("/plugins/getinfo" /* GET_PLUGIN_INFO_URL */, auth_default, config_default2.getPluginsInfoList);
router.get("/plugins/getcfg" /* GET_PLUGIN_CONFIG_URL */, auth_default, config_default2.getPluginConfig);
router.post("/plugins/setcfg" /* SET_PLUGIN_CONFIG_URL */, auth_default, config_default2.setPluginConfig);
router.get("/bot/logs" /* LOG_URL */, auth_default, logger_default.logger);
router.get("/bot/status" /* STATUS_URL */, status_default.sysInfo);
router.get("/bot/info" /* INFO_URL */, info_default.botInfo);
router.get("/bot/URI" /* URI_URL */, info_default.botURI);
router.get("/sandbox/getloader" /* GET_PLUGINS_LOADER */, sandbox_default.getPluginsLoader);
router.post("/sandbox/upload" /* UPLOAD_FILE_URL */, sandbox_default.uploadFile);
router.get("/sandbox/onebot11/getdata" /* GET_ONEBOT11_DATA_URL */, sandbox_default.getOnebot11Data);
router.post("/sandbox/onebot11/setdata" /* SET_ONEBOT11_DATA_URL */, sandbox_default.setOnebot11Data);
router.delete("/sandbox/onebot11/resetdata" /* RESET_ONEBOT11_DATA_URL */, sandbox_default.reSetOnebot11Data);
router.get("/database/redis/allkeys" /* GET_ALLKEYS_URL */, database_default.getKeys);
router.get("/database/redis/getkey" /* GET_KEY_URL */, database_default.getKey);
router.post("/database/redis/setkey" /* SET_KEY_URL */, database_default.setKey);
router.delete("/database/redis/delkey" /* DEL_KEY_URL */, database_default.delKey);
router.delete("/database/redis/delkeys" /* DEL_KEYS_URL */, database_default.delKeys);
router.post("/plugins/add" /* ADD_PLUGIN_URL */, plugin_default.setPlugin);
router.delete("/plugins/delete" /* DELETE_PLUGIN_URL */, plugin_default.deletePlugin);
router.put("/plugins/put" /* PUT_PLUGIN_URL */, plugin_default.editorPlugin);
router.get("/plugins/get" /* GET_PLUGINLIST_URL */, plugin_default.getPluginList);
router.get("/plugins/imgJSON" /* GET_HTML_PROJECT_URL */, plugin_default.getImageJson);
router.post("/plugins/btnJSON" /* GET_BUTTON_PROJECT_URL */, plugin_default.getSegResources);
router.get("/fs/create" /* CREATE_URL */, fs_default.touch);
router.get("/fs/listdir" /* LSIT_DIR_URL */, fs_default.listDir);
router.get("/fs/mkdir" /* MKDIR_URL */, fs_default.mkdir);
router.get("/fs/open" /* OPEN_URL */, fs_default.readFile);
router.get("/fs/copydir" /* COPY_Dir_URL */, fs_default.copyDir);
router.get("/fs/copyfile" /* COPY_File_URL */, fs_default.copyFile);
router.get("/fs/movedir" /* MOVE_Dir_URL */, fs_default.moveDir);
router.get("/fs/movefile" /* MOVE_File_URL */, fs_default.moveFile);
router.get("/fs/renamedir" /* RENAME_Dir_URL */, fs_default.renameDir);
router.get("/fs/renamefile" /* RENAME_FILE_URL */, fs_default.renameFile);
router.post("/fs/savefile" /* SAVE_File_URL */, fs_default.saveFile);
router.delete("/fs/rmdir" /* RM_DIR_URL */, auth_default, fs_default.rmDir);
router.delete("/fs/rmfile" /* RM_FILE_URL */, auth_default, fs_default.rmFile);
router.get("/fs/media" /* READ_MEDIA_URL */, fs_default.readMediaFile);
router.get("/fs/search" /* SEARCH_URL */, fs_default.search);
router.post("/fs/upload" /* UPLOAD_URL */, fs_default.upload);
router.get("/fs/download" /* DOWNLOAD_URL */, fs_default.download);
router.get("/fs/filtertree" /* FITTER_TREE_URL */, fs_default.getFilesTree);
router.get("/fs/filesize" /* FILES_SIZE_URL */, fs_default.getFilesSize);
router.get("/fs/openssh" /* CONNECT_SSH_URL */, fs_default.connectSSH);
router.get("/fs/closessh" /* CLOSE_SSH_URL */, fs_default.closeSSH);
var router_default = router;

// src/backend/server/app/index.ts
var app = new Koa();
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: join9(pluginInfo.PUBLIC_PATH, "upload"),
      multiples: true,
      keepExtensions: true,
      maxFieldsSize: 4 * 1024 * 1024 * 1024
    }
  })
);
app.use(router_default.routes()).use(router_default.allowedMethods());
app.use(KoaStatic(join9(pluginInfo.PUBLIC_PATH, "static")));
var fileHostPath = join9(botInfo.WORK_PATH, "temp", "fileHost");
if (!existsSync5(fileHostPath)) {
  mkdirSync5(fileHostPath, { recursive: true });
}
app.use(async (ctx, next) => {
  if (ctx.path.startsWith("/api/File")) {
    ctx.path = ctx.path.replace(/^\/api\/File/, "");
    const filePath = join9(fileHostPath, ctx.path);
    try {
      if (existsSync5(filePath)) {
        const contentType = mime2.getType(filePath) || "application/octet-stream";
        ctx.type = contentType;
        ctx.body = createReadStream2(filePath);
      } else {
        ctx.status = 404;
        ctx.body = "File not found";
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
  } else {
    await next();
  }
});
var server = createServer(app.callback());
var app_default = server;

// src/backend/server/app/ws.ts
import { WebSocket } from "ws";

// src/backend/server/app/adapter/protocol/tools.ts
import { randomUUID } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import _5 from "lodash";
import { mkdir, readFile as readFile2, rm, stat as stat2, writeFile as writeFile2 } from "fs/promises";
import { basename as basename2, dirname, join as join10 } from "path";
var BotAPI = class {
  // constructor() {
  // const CopyBot = Bot
  //@ts-ignore
  // Bot = new Proxy({}, {
  //     get (target, prop, receiver) {
  //         if (prop in target) {
  //             if(typeof target[prop] === 'function') return target[prop].bind(this)
  //                 else return target[prop]
  //         }
  //         if (prop in this) {
  //             if(typeof this[prop] === 'function') return this[prop].bind(this)
  //                 else return this[prop]
  //         }
  //         return Reflect.get(CopyBot, prop, receiver)
  //     }
  // })
  // }
  fs = /* @__PURE__ */ Object.create(null);
  stat = { start_time: Date.now() / 1e3 };
  get uin() {
    return Bot.adapter ?? [];
  }
  /**
   * 延时
   * @param time (ms)
   * @param promise
   * @returns
   */
  sleep(time, promise) {
    if (promise) return Promise.race([promise, this.sleep(time)]);
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  /**
   * 文件状态
   * @param path
   * @param opts
   * @returns
   */
  async fsStat(path2, opts) {
    try {
      return await stat2(path2, opts);
    } catch (err) {
      stdlog_default.trace("", "\u83B7\u53D6", path2, "\u72B6\u6001\u9519\u8BEF", err);
      return false;
    }
  }
  /**
   *
   * @param dir
   * @param opts
   * @returns
   */
  async mkdir(dir, opts) {
    try {
      await mkdir(dir, { recursive: true, ...opts });
      return true;
    } catch (err) {
      stdlog_default.error("", "\u521B\u5EFA", dir, "\u9519\u8BEF", err);
      return false;
    }
  }
  /**
   *
   * @param file
   * @param opts
   * @returns
   */
  async rm(file, opts) {
    try {
      await rm(file, { force: true, recursive: true, ...opts });
      return true;
    } catch (err) {
      stdlog_default.error("", "\u5220\u9664", file, "\u9519\u8BEF", err);
      return false;
    }
  }
  /**
   *
   * @param url
   * @param file
   * @param opts
   * @returns
   */
  async download(url, file, opts) {
    let buffer;
    if (!file || (await this.fsStat(file))?.isDirectory?.()) {
      const type = await this.fileType(url, opts);
      file = file ? join10(file, type.name) : type.name;
      buffer = type.buffer;
    } else {
      await this.mkdir(dirname(file));
      buffer = await this.Buffer(url, opts);
    }
    await writeFile2(file, buffer);
    return { url, file, buffer };
  }
  /**
   * 发布
   * @param name 事件{post_type.message_type.sub_type}
   * @param data
   */
  $emit(name = "", data = {}) {
    this.prepareEvent(data);
    while (true) {
      Bot.emit(name, data);
      const i = name.lastIndexOf(".");
      if (i === -1) break;
      name = name.slice(0, i);
    }
  }
  /**
   * 发布前处理
   * @param data
   * @returns
   */
  prepareEvent(data) {
    if (!Bot[data.self_id]) return;
    if (!data.bot)
      Object.defineProperty(data, "bot", {
        value: Bot[data.self_id]
      });
    if (!data.friend && data.user_id)
      Object.defineProperty(data, "friend", {
        value: data.bot.pickFriend(data.user_id)
      });
    if (!data.group && data.group_id)
      Object.defineProperty(data, "group", {
        value: data.bot.pickGroup(data.group_id)
      });
    if (!data.member && data.group && data.user_id)
      Object.defineProperty(data, "member", {
        value: data.group.pickMember(data.user_id)
      });
    if (data.bot.adapter?.id) data.adapter_id = data.bot.adapter.id;
    if (data.bot.adapter?.name) data.adapter_name = data.bot.adapter.name;
    for (const i of [data.friend, data.group, data.member]) {
      if (typeof i !== "object") continue;
      i.sendFile ??= (file, name) => i.sendMsg({ type: "file", file, name });
      i.makeForwardMsg ??= this.makeForwardMsg;
      i.sendForwardMsg ??= (msg) => this.sendForwardMsg((msg2) => i.sendMsg(msg2), msg);
      i.getInfo ??= () => i.info || i;
    }
  }
  /**
   *
   * @param data
   * @returns
   */
  StringOrNull(data) {
    if (typeof data === "object" && typeof data.toString !== "function") return "[object null]";
    return String(data);
  }
  /**
   *
   * @param data
   * @param base64
   * @returns
   */
  StringOrBuffer(data, base64) {
    const string = String(data);
    return string.includes("\uFFFD") ? base64 ? `base64://${data.toString("base64")}` : data : string;
  }
  getCircularReplacer() {
    const _this_ = this, ancestors = [];
    return function(key, value) {
      switch (typeof value) {
        case "function":
          return String(value);
        case "object":
          if (value === null) return null;
          if (value instanceof Map || value instanceof Set) return Array.from(value);
          if (value instanceof Error) return value.stack;
          if (value.type === "Buffer" && Array.isArray(value.data))
            try {
              return _this_.StringOrBuffer(Buffer.from(value), true);
            } catch {
            }
          break;
        default:
          return value;
      }
      while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop();
      if (ancestors.includes(value)) return `[Circular ${_this_.StringOrNull(value)}]`;
      ancestors.push(value);
      return value;
    };
  }
  /**
   * 针对对象处理
   * @param data
   * @param opts
   * @returns
   */
  String(data, opts = null) {
    switch (typeof data) {
      case "string":
        return data;
      case "function":
        return String(data);
      case "object":
        if (data instanceof Error) return data.stack;
        if (Buffer.isBuffer(data)) return this.StringOrBuffer(data, true);
    }
    try {
      return JSON.stringify(data, this.getCircularReplacer(), opts) || this.StringOrNull(data);
    } catch (err) {
      return this.StringOrNull(data);
    }
  }
  /**
   *
   * @param data
   * @param opts
   * @returns
   */
  async Buffer(data, opts = {}) {
    if (Buffer.isBuffer(data)) return data;
    data = this.String(data);
    if (data.startsWith("base64://")) return Buffer.from(data.replace("base64://", ""), "base64");
    else if (data.match(/^https?:\/\//))
      return opts.http ? data : Buffer.from(await (await fetch(data, opts)).arrayBuffer());
    else if (data.startsWith("file://")) {
      if (await this.fsStat(data.replace(/^file:\/\//, ""))) {
        return opts.file ? data : Buffer.from(await readFile2(data.replace(/^file:\/\//, "")));
      }
    }
    return data;
  }
  /**
   *
   * @param data
   * @param opts
   * @returns
   */
  async fileType(data, opts = {}) {
    const file = {
      url: "",
      name: data.name,
      buffer: Buffer.alloc(0),
      type: {
        ext: "jpg",
        mime: "image/jpeg"
      },
      md5: "",
      path: ""
    };
    try {
      if (Buffer.isBuffer(data.file)) {
        file.url = "Buffer";
        file.buffer = data.file;
      } else {
        file.url = _5.truncate(data, { length: 32 }) || "Buffer";
        file.buffer = await this.Buffer(data.file, opts);
      }
      if (Buffer.isBuffer(file.buffer)) {
        file.type = await fileTypeFromBuffer(file.buffer);
        file.md5 = makeMd5(file.buffer);
        file.name ??= `${Date.now().toString(36)}.${file.md5.slice(0, 8)}.${file.type.ext}`;
      }
    } catch (err) {
      stdlog_default.error("", "\u6587\u4EF6\u7C7B\u578B\u68C0\u6D4B\u9519\u8BEF", file, err);
    }
    file.name ??= `${Date.now().toString(36)}-${basename2(file.url)}`;
    return file;
  }
  /**
   *
   * @param file
   * @param opts
   * @returns
   */
  async fileToUrl(file, opts = {}) {
    const { name, time = 6e4, times = 1 } = opts;
    const { port } = config_default.getConfig("server").server;
    file = typeof file === "object" && !Buffer.isBuffer(file) && { ...file } || await this.fileType({ file, name }, { http: true });
    if (!Buffer.isBuffer(file.buffer)) return file.buffer;
    file.name = file.name ? encodeURIComponent(file.name) : randomUUID();
    if (typeof times === "number") file.times = times;
    this.fs[file.name] = file;
    if (time) setTimeout(() => this.fs[file.name] = this.fs.timeout, time);
    return `http://localhost:${port}/api/File/${file.name}`;
  }
  /**
   *
   * @param {IncomingMessage} req
   */
  fileSend(req) {
    const url = req.url.replace(/^\//, "");
    let file = this.fs[url] || this.fs[404];
    if (typeof file.times === "number") {
      if (file.times > 0) file.times--;
      else file = this.fs.timeout;
    }
    if (file.type?.mime) req.res.setHeader("Content-Type", file.type.mime);
    stdlog_default.mark(
      "",
      `\u53D1\u9001\u6587\u4EF6\uFF1A${file.name}(${file.url} ${(file.buffer.length / 1024).toFixed(2)}KB)`,
      `${req.sid} => ${req.rid}`
    );
    req.res.send(file.buffer);
  }
  /**
   *
   * @param msg
   * @returns
   */
  makeForwardMsg(msg) {
    return { type: "node", data: msg };
  }
  /**
   *
   * @param send
   * @param msg
   * @returns
   */
  async sendForwardMsg(send, msg) {
    const messages = [];
    for (const { message } of Array.isArray(msg) ? msg : [msg]) messages.push(await send(message));
    return messages;
  }
  /**
   * 耗时统计
   * @param time1
   * @param time2
   * @returns
   */
  getTimeDiff(time1 = this.stat.start_time * 1e3, time2 = Date.now()) {
    const time = (time2 - time1) / 1e3;
    let ret = "";
    const day = Math.floor(time / 3600 / 24);
    if (day) ret += `${day}\u5929`;
    const hour = Math.floor(time / 3600 % 24);
    if (hour) ret += `${hour}\u65F6`;
    const min = Math.floor(time / 60 % 60);
    if (min) ret += `${min}\u5206`;
    const sec = (time % 60).toFixed(3);
    if (sec) ret += `${sec}\u79D2`;
    return ret || "0\u79D2";
  }
  /**------------对bots操作-------------- */
  getFriendArray() {
    const array = [];
    for (const bot_id of this.uin)
      for (const [id, i] of Bot[bot_id].fl || []) array.push({ ...i, bot_id });
    return array;
  }
  getFriendList() {
    const array = [];
    for (const bot_id of this.uin) array.push(...Bot[bot_id].fl?.keys() || []);
    return array;
  }
  getFriendMap() {
    const map = /* @__PURE__ */ new Map();
    for (const bot_id of this.uin)
      for (const [id, i] of Bot[bot_id].fl || []) map.set(id, { ...i, bot_id });
    return map;
  }
  get fl() {
    return this.getFriendMap();
  }
  getGroupArray() {
    const array = [];
    for (const bot_id of this.uin)
      for (const [id, i] of Bot[bot_id].gl || []) array.push({ ...i, bot_id });
    return array;
  }
  getGroupList() {
    const array = [];
    for (const bot_id of this.uin) array.push(...Bot[bot_id].gl?.keys() || []);
    return array;
  }
  getGroupMap() {
    const map = /* @__PURE__ */ new Map();
    for (const bot_id of this.uin)
      for (const [id, i] of Bot[bot_id].gl || []) map.set(id, { ...i, bot_id });
    return map;
  }
  get gl() {
    return this.getGroupMap();
  }
  get gml() {
    const map = /* @__PURE__ */ new Map();
    for (const bot_id of this.uin)
      for (const [id, i] of Bot[bot_id].gml || [])
        map.set(id, Object.assign(new Map(i), { bot_id }));
    return map;
  }
  pickFriend(user_id, strict) {
    user_id = Number(user_id) || user_id;
    let user = this.fl.get(user_id);
    if (!user)
      for (const [id, ml] of this.gml) {
        user = ml.get(user_id);
        if (user) {
          user.bot_id = ml.bot_id;
          break;
        }
      }
    if (user) return Bot[user.bot_id].pickFriend(user_id);
    if (strict) return {};
  }
  get pickUser() {
    return this.pickFriend;
  }
  pickGroup(group_id, strict) {
    group_id = Number(group_id) || group_id;
    const group2 = this.gl.get(group_id);
    if (group2) return Bot[group2.bot_id].pickGroup(group_id);
    if (strict) return {};
  }
  pickMember(group_id, user_id) {
    return this.pickGroup(group_id).pickMember(user_id);
  }
};
var tools_default = new BotAPI();

// src/backend/server/app/webui/plugins/msgHandler.ts
var bot2 = await Bot2();
function makeStdin(text, mt) {
  mt.sendMsg(
    {
      sender: {
        user_id: 114514,
        nickname: "\u7CFB\u7EDF\u63D0\u793A"
      },
      message: [
        {
          type: "text",
          text
        }
      ]
    },
    "e_info"
  );
}
async function handleReplyMsg(data, mt) {
  if (data.type == "message" && data.action == "send_message") {
    const { params } = data;
    if (params.type == "group") {
      await bot2.pickGroup(params.id).sendMsg(params.msg);
      makeStdin(`\u53D1\u9001\u7FA4\u804A${params.id}\u6210\u529F\uFF01`, mt);
    } else if (params.type == "private") {
      await bot2.pickFriend(params.id).sendMsg(params.msg);
      makeStdin(`\u53D1\u9001\u79C1\u804A${params.id}\u6210\u529F\uFF01`, mt);
    } else if (params.type == "guild") {
      await bot2.pickGuild(params.guild_id).sendMsg(params.id, params.msg);
      makeStdin(`\u53D1\u9001\u9891\u9053${params.id}\u6210\u529F\uFF01`, mt);
    }
  }
}

// src/backend/server/app/adapter/protocol/OnebotV11/index.js
import { randomUUID as randomUUID2 } from "crypto";
import path from "path";

// src/backend/server/app/adapter/common/face.ts
var faceMap = {
  0: "[\u60CA\u8BB6]",
  1: "[\u6487\u5634]",
  2: "[\u8272]",
  3: "[\u53D1\u5446]",
  4: "[\u5F97\u610F]",
  5: "[\u6D41\u6CEA]",
  6: "[\u5BB3\u7F9E]",
  7: "[\u95ED\u5634]",
  8: "[\u7761]",
  9: "[\u5927\u54ED]",
  10: "[\u5C34\u5C2C]",
  11: "[\u53D1\u6012]",
  12: "[\u8C03\u76AE]",
  13: "[\u5472\u7259]",
  14: "[\u5FAE\u7B11]",
  15: "[\u96BE\u8FC7]",
  16: "[\u9177]",
  18: "[\u6293\u72C2]",
  19: "[\u5410]",
  20: "[\u5077\u7B11]",
  21: "[\u53EF\u7231]",
  22: "[\u767D\u773C]",
  23: "[\u50B2\u6162]",
  24: "[\u9965\u997F]",
  25: "[\u56F0]",
  26: "[\u60CA\u6050]",
  27: "[\u6D41\u6C57]",
  28: "[\u61A8\u7B11]",
  29: "[\u60A0\u95F2]",
  30: "[\u594B\u6597]",
  31: "[\u5492\u9A82]",
  32: "[\u7591\u95EE]",
  33: "[\u5618]",
  34: "[\u6655]",
  35: "[\u6298\u78E8]",
  36: "[\u8870]",
  37: "[\u9AB7\u9AC5]",
  38: "[\u6572\u6253]",
  39: "[\u518D\u89C1]",
  41: "[\u53D1\u6296]",
  42: "[\u7231\u60C5]",
  43: "[\u8DF3\u8DF3]",
  46: "[\u732A\u5934]",
  49: "[\u62E5\u62B1]",
  53: "[\u86CB\u7CD5]",
  54: "[\u95EA\u7535]",
  55: "[\u70B8\u5F39]",
  56: "[\u5200]",
  57: "[\u8DB3\u7403]",
  59: "[\u4FBF\u4FBF]",
  60: "[\u5496\u5561]",
  61: "[\u996D]",
  63: "[\u73AB\u7470]",
  64: "[\u51CB\u8C22]",
  66: "[\u7231\u5FC3]",
  67: "[\u5FC3\u788E]",
  69: "[\u793C\u7269]",
  74: "[\u592A\u9633]",
  75: "[\u6708\u4EAE]",
  76: "[\u8D5E]",
  77: "[\u8E29]",
  78: "[\u63E1\u624B]",
  79: "[\u80DC\u5229]",
  85: "[\u98DE\u543B]",
  86: "[\u6004\u706B]",
  89: "[\u897F\u74DC]",
  96: "[\u51B7\u6C57]",
  97: "[\u64E6\u6C57]",
  98: "[\u62A0\u9F3B]",
  99: "[\u9F13\u638C]",
  100: "[\u7CD7\u5927\u4E86]",
  101: "[\u574F\u7B11]",
  102: "[\u5DE6\u54FC\u54FC]",
  103: "[\u53F3\u54FC\u54FC]",
  104: "[\u54C8\u6B20]",
  105: "[\u9119\u89C6]",
  106: "[\u59D4\u5C48]",
  107: "[\u5FEB\u54ED\u4E86]",
  108: "[\u9634\u9669]",
  109: "[\u4EB2\u4EB2]",
  110: "[\u5413]",
  111: "[\u53EF\u601C]",
  112: "[\u83DC\u5200]",
  113: "[\u5564\u9152]",
  114: "[\u7BEE\u7403]",
  115: "[\u4E52\u4E53]",
  116: "[\u793A\u7231]",
  117: "[\u74E2\u866B]",
  118: "[\u62B1\u62F3]",
  119: "[\u52FE\u5F15]",
  120: "[\u62F3\u5934]",
  121: "[\u5DEE\u52B2]",
  122: "[\u7231\u4F60]",
  123: "[\u4E0D]",
  124: "[\u597D]",
  125: "[\u8F6C\u5708]",
  126: "[\u78D5\u5934]",
  127: "[\u56DE\u5934]",
  128: "[\u8DF3\u7EF3]",
  129: "[\u6325\u624B]",
  130: "[\u6FC0\u52A8]",
  131: "[\u8857\u821E]",
  132: "[\u732E\u543B]",
  133: "[\u5DE6\u592A\u6781]",
  134: "[\u53F3\u592A\u6781]",
  136: "[\u53CC\u559C]",
  137: "[\u97AD\u70AE]",
  138: "[\u706F\u7B3C]",
  140: "[K\u6B4C]",
  144: "[\u559D\u5F69]",
  145: "[\u7948\u7977]",
  146: "[\u7206\u7B4B]",
  147: "[\u68D2\u68D2\u7CD6]",
  148: "[\u559D\u5976]",
  151: "[\u98DE\u673A]",
  158: "[\u949E\u7968]",
  168: "[\u836F]",
  169: "[\u624B\u67AA]",
  171: "[\u8336]",
  172: "[\u7728\u773C\u775B]",
  173: "[\u6CEA\u5954]",
  174: "[\u65E0\u5948]",
  175: "[\u5356\u840C]",
  176: "[\u5C0F\u7EA0\u7ED3]",
  177: "[\u55B7\u8840]",
  178: "[\u659C\u773C\u7B11]",
  180: "[\u60CA\u559C]",
  181: "[\u9A9A\u6270]",
  182: "[\u7B11\u54ED]",
  183: "[\u6211\u6700\u7F8E]",
  184: "[\u6CB3\u87F9]",
  185: "[\u7F8A\u9A7C]",
  187: "[\u5E7D\u7075]",
  188: "[\u86CB]",
  190: "[\u83CA\u82B1]",
  192: "[\u7EA2\u5305]",
  193: "[\u5927\u7B11]",
  194: "[\u4E0D\u5F00\u5FC3]",
  197: "[\u51B7\u6F20]",
  198: "[\u5443]",
  199: "[\u597D\u68D2]",
  200: "[\u62DC\u6258]",
  201: "[\u70B9\u8D5E]",
  202: "[\u65E0\u804A]",
  203: "[\u6258\u8138]",
  204: "[\u5403]",
  205: "[\u9001\u82B1]",
  206: "[\u5BB3\u6015]",
  207: "[\u82B1\u75F4]",
  208: "[\u5C0F\u6837\u513F]",
  210: "[\u98D9\u6CEA]",
  211: "[\u6211\u4E0D\u770B]",
  212: "[\u6258\u816E]",
  214: "[\u5575\u5575]",
  215: "[\u7CCA\u8138]",
  216: "[\u62CD\u5934]",
  217: "[\u626F\u4E00\u626F]",
  218: "[\u8214\u4E00\u8214]",
  219: "[\u8E6D\u4E00\u8E6D]",
  220: "[\u62FD\u70B8\u5929]",
  221: "[\u9876\u5471\u5471]",
  222: "[\u62B1\u62B1]",
  223: "[\u66B4\u51FB]",
  224: "[\u5F00\u67AA]",
  225: "[\u64A9\u4E00\u64A9]",
  226: "[\u62CD\u684C]",
  227: "[\u62CD\u624B]",
  228: "[\u606D\u559C]",
  229: "[\u5E72\u676F]",
  230: "[\u5632\u8BBD]",
  231: "[\u54FC]",
  232: "[\u4F5B\u7CFB]",
  233: "[\u6390\u4E00\u6390]",
  234: "[\u60CA\u5446]",
  235: "[\u98A4\u6296]",
  236: "[\u5543\u5934]",
  237: "[\u5077\u770B]",
  238: "[\u6247\u8138]",
  239: "[\u539F\u8C05]",
  240: "[\u55B7\u8138]",
  241: "[\u751F\u65E5\u5FEB\u4E50]",
  242: "[\u5934\u649E\u51FB]",
  243: "[\u7529\u5934]",
  244: "[\u6254\u72D7]",
  245: "[\u52A0\u6CB9\u5FC5\u80DC]",
  246: "[\u52A0\u6CB9\u62B1\u62B1]",
  247: "[\u53E3\u7F69\u62A4\u4F53]",
  260: "/\u642C\u7816\u4E2D",
  261: "/\u5FD9\u5230\u98DE\u8D77",
  262: "/\u8111\u9614\u75BC",
  263: "/\u6CA7\u6851",
  264: "/\u6342\u8138",
  265: "/\u8FA3\u773C\u775B",
  266: "/\u54E6\u54DF",
  267: "/\u5934\u79C3",
  268: "/\u95EE\u53F7\u8138",
  269: "/\u6697\u4E2D\u89C2\u5BDF",
  270: "/emm",
  271: "/\u5403\u74DC",
  272: "/\u5475\u5475\u54D2",
  273: "/\u6211\u9178\u4E86",
  274: "/\u592A\u5357\u4E86",
  276: "/\u8FA3\u6912\u9171",
  277: "/\u6C6A\u6C6A",
  278: "/\u6C57",
  279: "/\u6253\u8138",
  280: "/\u51FB\u638C",
  281: "/\u65E0\u773C\u7B11",
  282: "/\u656C\u793C",
  283: "/\u72C2\u7B11",
  284: "/\u9762\u65E0\u8868\u60C5",
  285: "/\u6478\u9C7C",
  286: "/\u9B54\u9B3C\u7B11",
  287: "/\u54E6",
  288: "/\u8BF7",
  289: "/\u7741\u773C",
  290: "/\u6572\u5F00\u5FC3",
  291: "/\u9707\u60CA",
  292: "/\u8BA9\u6211\u5EB7\u5EB7",
  293: "/\u6478\u9526\u9CA4",
  294: "/\u671F\u5F85",
  295: "/\u62FF\u5230\u7EA2\u5305",
  296: "/\u771F\u597D",
  297: "/\u62DC\u8C22",
  298: "/\u5143\u5B9D",
  299: "/\u725B\u554A",
  300: "/\u80D6\u4E09\u65A4",
  301: "/\u597D\u95EA",
  302: "/\u5DE6\u62DC\u5E74",
  303: "/\u53F3\u62DC\u5E74",
  304: "/\u7EA2\u5305\u5305",
  305: "/\u53F3\u4EB2\u4EB2",
  306: "/\u725B\u6C14\u51B2\u5929",
  307: "/\u55B5\u55B5",
  308: "/\u6C42\u7EA2\u5305",
  309: "/\u8C22\u7EA2\u5305",
  310: "/\u65B0\u5E74\u70DF\u82B1",
  311: "/\u6253call",
  312: "/\u53D8\u5F62",
  313: "/\u55D1\u5230\u4E86",
  314: "/\u4ED4\u7EC6\u5206\u6790",
  315: "/\u52A0\u6CB9",
  316: "/\u6211\u6CA1\u4E8B",
  317: "/\u83DC\u6C6A",
  318: "/\u5D07\u62DC",
  319: "/\u6BD4\u5FC3",
  320: "/\u5E86\u795D",
  321: "/\u8001\u8272\u75DE",
  322: "/\u62D2\u7EDD",
  323: "/\u5ACC\u5F03",
  324: "/\u5403\u7CD6",
  325: "/\u60CA\u5413",
  326: "/\u751F\u6C14",
  327: "/\u52A0\u4E00",
  328: "/\u9519\u53F7",
  329: "/\u5BF9\u53F7",
  330: "/\u5B8C\u6210",
  331: "/\u660E\u767D",
  332: "/\u4E3E\u724C\u724C",
  333: "/\u70DF\u82B1",
  334: "/\u864E\u864E\u751F\u5A01",
  335: "/\u7EFF\u9A6C\u62A4\u4F53",
  336: "/\u8C79\u5BCC",
  337: "/\u82B1\u6735\u8138",
  338: "/\u6211\u60F3\u5F00\u4E86",
  339: "/\u8214\u5C4F",
  340: "/\u70ED\u5316\u4E86",
  341: "/\u6253\u62DB\u547C",
  342: "/\u9178Q",
  343: "/\u6211\u65B9\u4E86",
  344: "/\u5927\u6028\u79CD",
  345: "/\u7EA2\u5305\u591A\u591A",
  346: "/\u4F60\u771F\u68D2\u68D2",
  347: "/\u5927\u5C55\u5B8F\u5154",
  348: "/\u798F\u841D\u535C"
};
var pokeMap = {
  0: "[\u56DE\u6233]",
  1: "[\u6233\u4E00\u6233]",
  2: "[\u6BD4\u5FC3]",
  3: "[\u70B9\u8D5E]",
  4: "[\u5FC3\u788E]",
  5: "[666]",
  6: "[\u653E\u5927\u62DB]",
  2e3: "[\u6572\u95E8]",
  2001: "[\u6293\u4E00\u4E0B]",
  2002: "[\u788E\u5C4F]",
  2003: "[\u52FE\u5F15]",
  2004: "[\u624B\u96F7]",
  2005: "[\u7ED3\u5370]",
  2006: "[\u53EC\u5524\u672F]",
  2007: "[\u73AB\u7470\u82B1]",
  2008: "[\u8FCE\u6625]",
  2009: "[\u8BA9\u4F60\u76AE]",
  2010: "[\u97F3\u54CD]",
  2011: "[\u5B9D\u8D1D\u7403]"
};

// src/backend/server/app/adapter/protocol/OnebotV11/index.js
var OnebotV11 = class {
  bot;
  id;
  name;
  path;
  echo;
  timeout;
  constructor(bot4, req) {
    this.bot = bot4;
    this.id = "114514";
    if (req) this.id = req.headers["x-self-id"] ?? "";
    this.name = "OneBotv11";
    this.path = this.name;
    this.echo = {};
    this.timeout = 6e4;
    bot4.on("message", async (data) => {
      await this.message(data, bot4);
    });
    bot4.on("error", async (error) => stdlog_default.error("", error));
    bot4.on("close", () => stdlog_default.info("Onebotv11", `${this.id} \u8FDE\u63A5\u5DF2\u65AD\u5F00!`));
    stdlog_default.info("Onebotv11", "\u8F7D\u5165\u6210\u529F\uFF01");
  }
  makeLog(msg) {
    return tools_default.String(msg).replace(/base64:\/\/.*?(,|]|")/g, "base64://...$1");
  }
  sendApi(data, ws, action, params = {}) {
    const echo = randomUUID2();
    const request = { action, params, echo };
    ws.send(JSON.stringify(request));
    return new Promise(
      (resolve, reject) => this.echo[echo] = {
        request,
        resolve,
        reject,
        timeout: setTimeout(() => {
          reject(Object.assign(request, { timeout: this.timeout }));
          delete this.echo[echo];
          stdlog_default.error(data.self_id, "\u8BF7\u6C42\u8D85\u65F6", request);
          ws.terminate();
        }, this.timeout)
      }
    );
  }
  async getReceivedMsg(message_id) {
    const msg = (await Bot[this.id].sendApi("get_msg", { message_id })).data;
    return msg;
  }
  async getMsg(data, message_id) {
    const msg = (await data.bot.sendApi("get_msg", { message_id })).data;
    if (msg?.message) msg.message = (await this.parseMsg(msg.message, data)).message;
    return msg;
  }
  async source(i, data) {
    const msg_id = i.data.id;
    if (!msg_id) return false;
    let source;
    try {
      let retryCount = 0;
      while (retryCount < 2) {
        source = await this.getReceivedMsg(msg_id);
        if (typeof source === "string") {
          stdlog_default.error(this.id, `\u83B7\u53D6\u5F15\u7528\u6D88\u606F\u5185\u5BB9\u5931\u8D25\uFF0C\u6B63\u5728\u91CD\u8BD5\uFF1A\u7B2C ${retryCount} \u6B21`);
          retryCount++;
        } else {
          break;
        }
      }
      if (typeof source === "string") {
        stdlog_default.error(this.id, "\u83B7\u53D6\u5F15\u7528\u6D88\u606F\u5185\u5BB9\u5931\u8D25\uFF0C\u91CD\u8BD5\u6B21\u6570\u4E0A\u9650\uFF0C\u5DF2\u7EC8\u6B62");
        return false;
      }
      stdlog_default.debug("", source);
      const { message, raw_message } = await this.parseMsg(source.message, data, false);
      source = {
        ...source,
        time: source.message_id,
        seq: source.message_id,
        user_id: source.sender.user_id,
        message,
        raw_message
      };
      return source;
    } catch (error) {
      stdlog_default.error("", error);
      return false;
    }
  }
  async makeFile(file) {
    file = await tools_default.Buffer(file, { http: true });
    if (Buffer.isBuffer(file)) file = `base64://${file.toString("base64")}`;
    return file;
  }
  async makeMsg(msg) {
    if (!Array.isArray(msg)) msg = [msg];
    const msgs = [];
    const forward = [];
    for (let i of msg) {
      if (typeof i !== "object") {
        i = { type: "text", data: { text: i } };
      } else if (!i.data) {
        i = { type: i.type, data: { ...i, type: void 0 } };
      }
      switch (i.type) {
        case "at":
          i.data.qq = String(i.data.qq);
          break;
        case "face":
          i.data.id = String(i.data.id);
          break;
        case "poke":
          i.data.id = String(i.data.id ? i.data.id : i.data.qq);
          break;
        case "dice":
          i.data.id = String(i.data.id);
          break;
        case "new_dice":
          i.data.id = String(i.data.id);
          break;
        case "rps":
          i.data.id = String(i.data.id);
          break;
        case "reply":
          i.data.id = String(i.data.id);
          break;
        case "button":
          console.log(i);
          break;
        case "node":
          forward.push(...i.data);
          continue;
        case "raw":
          i = i.data;
          break;
      }
      if (i.data.file) i.data.file = await this.makeFile(i.data.file);
      msgs.push(i);
    }
    return [msgs, forward];
  }
  async sendMsg(msg, send, sendForwardMsg) {
    const [message, forward] = await this.makeMsg(msg);
    const ret = [];
    if (forward.length) {
      const data = await sendForwardMsg(forward);
      if (Array.isArray(data)) ret.push(...data);
      else ret.push(data);
    }
    if (message.length) ret.push(await send(message));
    if (ret.length === 1) return ret[0];
    const message_id = [];
    for (const i of ret) if (i?.message_id) message_id.push(i.message_id);
    return { data: ret, message_id };
  }
  sendFriendMsg(data, msg) {
    return this.sendMsg(
      msg,
      (message) => {
        stdlog_default.info(`${data.self_id} => ${data.user_id}`, `\u53D1\u9001\u597D\u53CB\u6D88\u606F\uFF1A${this.makeLog(message)}`);
        data.bot.sendApi("send_msg", {
          user_id: data.user_id,
          message
        });
      },
      (msg2) => this.sendFriendForwardMsg(data, msg2)
    );
  }
  sendGroupMsg(data, msg) {
    return this.sendMsg(
      msg,
      (message) => {
        stdlog_default.info(`${data.self_id} => ${data.group_id}`, `\u53D1\u9001\u7FA4\u6D88\u606F\uFF1A${this.makeLog(message)}`);
        return data.bot.sendApi("send_msg", {
          group_id: data.group_id,
          message
        });
      },
      (msg2) => this.sendGroupForwardMsg(data, msg2)
    );
  }
  sendGuildMsg(data, msg) {
    return this.sendMsg(
      msg,
      (message) => {
        stdlog_default.info(
          `${data.self_id}] => ${data.guild_id}-${data.channel_id}`,
          `\u53D1\u9001\u9891\u9053\u6D88\u606F\uFF1A${this.makeLog(message)}`
        );
        return data.bot.sendApi("send_guild_channel_msg", {
          guild_id: data.guild_id,
          channel_id: data.channel_id,
          message
        });
      },
      (msg2) => Bot.sendForwardMsg ? Bot.sendForwardMsg((msg3) => this.sendGuildMsg(data, msg3), msg2) : tools_default.sendForwardMsg((msg3) => this.sendGuildMsg(data, msg3), msg2)
    );
  }
  async recallMsg(data, message_id) {
    stdlog_default.info(data.self_id, `\u64A4\u56DE\u6D88\u606F\uFF1A${message_id}`);
    if (!Array.isArray(message_id)) message_id = [message_id];
    const msgs = [];
    for (const i of message_id) msgs.push(await data.bot.sendApi("delete_msg", { message_id: i }));
    return msgs;
  }
  async parseMsg(msg, data, parseReply = true) {
    let file;
    let source;
    const message = [];
    const ToString_arr = [];
    const log_message_arr = [];
    const raw_message_arr = [];
    for (let i of Array.isArray(msg) ? msg : [msg]) {
      switch (i.type) {
        case "at":
          message.push({ type: "at", ...i.data });
          try {
            const qq2 = i.data.qq;
            ToString_arr.push(`{at:${qq2}}`);
            const groupMemberList = data.group_id ? Bot[this.id].gml.get(data.group_id)?.get(qq2) : Bot[this.id].gl.get(data.user_id)?.get(qq2);
            const at = groupMemberList?.nickname || groupMemberList?.card || qq2;
            raw_message_arr.push(`@${at}`);
            log_message_arr.push(at == qq2 ? `@${qq2}` : `<@${at}:${qq2}>`);
          } catch (err) {
            raw_message_arr.push(`@${i.data.qq}`);
            log_message_arr.push(`@${i.data.qq}`);
          }
          break;
        case "text":
          message.push({ type: "text", text: i.data.text });
          raw_message_arr.push(i.data.text);
          log_message_arr.push(i.data.text);
          ToString_arr.push(i.data.text);
          break;
        case "face":
          message.push({ type: "face", ...i.data });
          raw_message_arr.push(`[${faceMap[Number(i.data.id)] || "\u52A8\u753B\u8868\u60C5"}]`);
          log_message_arr.push(`<${faceMap[Number(i.data.id)] || `\u52A8\u753B\u8868\u60C5:${i.data.id}`}>`);
          ToString_arr.push(`{face:${i.data.id}}`);
          break;
        case "reply":
          if (parseReply) source = await this.source(i, data);
          if (source && data.group_id) {
            const qq2 = Number(source.sender.user_id);
            const text = source.sender.nickname;
            message.unshift({ type: "at", qq: qq2, text });
            raw_message_arr.unshift(`@${text}`);
            log_message_arr.unshift(`<\u56DE\u590D:${text}(${qq2})>`);
          }
          break;
        case "image":
          message.push({ ...i.data, type: "image" });
          raw_message_arr.push("[\u56FE\u7247]");
          log_message_arr.push(`<\u56FE\u7247:${i.data?.url || i.data.file}>`);
          ToString_arr.push(`{image:${i.data.file}}`);
          break;
        case "record":
          message.push({ type: "record", ...i.data });
          raw_message_arr.push("[\u8BED\u97F3]");
          log_message_arr.push(`<\u8BED\u97F3:${i.data?.url || i.data.file}>`);
          ToString_arr.push(`{record:${i.data.file}}`);
          break;
        case "video":
          message.push({ type: "video", ...i.data });
          raw_message_arr.push("[\u89C6\u9891]");
          log_message_arr.push(`<\u89C6\u9891:${i.data?.url || i.data.file}>`);
          ToString_arr.push(`{video:${i.data.file}}`);
          break;
        case "file":
          file = { ...i.data, fid: i.data.id };
          message.push({ type: "file", ...i.data, fid: i.data.id });
          raw_message_arr.push("[\u6587\u4EF6]");
          log_message_arr.push(`<\u89C6\u9891:${i.data?.url || i.data.file}>`);
          ToString_arr.push(`{file:${i.data.id}}`);
          redis.set(i.data.id, JSON.stringify(i.data));
          break;
        case "forward":
          message.push({ type: "node", ...i.data });
          raw_message_arr.push("[\u8F6C\u53D1\u6D88\u606F]");
          log_message_arr.push(`<\u8F6C\u53D1\u6D88\u606F:${JSON.stringify(i.data)}>`);
          ToString_arr.push(`{forward:${i.data.id}}`);
          break;
        case "json":
          message.push({ type: "json", ...i.data });
          raw_message_arr.push("[json\u6D88\u606F]");
          log_message_arr.push(`<json\u6D88\u606F:${i.data.data}>`);
          ToString_arr.push(i.data.data);
          break;
        case "xml":
          message.push({ type: "xml", ...i.data });
          raw_message_arr.push("[xml\u6D88\u606F]");
          log_message_arr.push(`<xml\u6D88\u606F:${i.data}>`);
          ToString_arr.push(i.data.data);
          break;
        case "basketball":
          message.push({ type: "basketball", ...i.data });
          raw_message_arr.push("[\u7BEE\u7403]");
          log_message_arr.push(`<\u7BEE\u7403:${i.data.id}>`);
          ToString_arr.push(`{basketball:${i.data.id}}`);
          break;
        case "new_rps":
          message.push({ type: "new_rps", ...i.data });
          raw_message_arr.push("[\u731C\u62F3]");
          log_message_arr.push(`<\u731C\u62F3:${i.data.id}>`);
          ToString_arr.push(`{new_rps:${i.data.id}}`);
          break;
        case "new_dice":
          message.push({ type: "new_dice", ...i.data });
          raw_message_arr.push("[\u9AB0\u5B50]");
          log_message_arr.push(`<\u9AB0\u5B50:${i.data.id}>`);
          ToString_arr.push(`{new_dice:${i.data.id}}`);
          break;
        case "dice":
          message.push({ type: "dice", ...i.data });
          raw_message_arr.push("[\u9AB0\u5B50]");
          log_message_arr.push(`<\u9AB0\u5B50:${i.data.id}>`);
          ToString_arr.push(`{dice:${i.data}}`);
          break;
        case "rps":
          message.push({ type: "rps", ...i.data });
          raw_message_arr.push("[\u526A\u5200\u77F3\u5934\u5E03]");
          log_message_arr.push(`<\u526A\u5200\u77F3\u5934\u5E03:${i.data.id}>`);
          ToString_arr.push(`{rps:${i.data}}`);
          break;
        case "poke":
          message.push({ type: "poke", ...i.data });
          raw_message_arr.push(`[${pokeMap[Number(i.data.id)]}]`);
          log_message_arr.push(`<${pokeMap[Number(i.data.id)]}>`);
          ToString_arr.push(`{poke:${i.data.id}}`);
          break;
        case "touch":
          message.push({ type: "touch", ...i.data });
          raw_message_arr.push("[\u53CC\u51FB\u5934\u50CF]");
          log_message_arr.push(`<<\u53CC\u51FB\u5934\u50CF:${i.data.id}>`);
          ToString_arr.push(`{touch:${i.data.id}}`);
          break;
        case "music":
          message.push({ type: "music", ...i.data });
          raw_message_arr.push("[\u97F3\u4E50]");
          log_message_arr.push(`<\u97F3\u4E50:${i.data.id}>`);
          ToString_arr.push(`{music:${i.data.id}}`);
          break;
        case "custom":
          message.push({ type: "custom", ...i.data });
          raw_message_arr.push("[\u81EA\u5B9A\u4E49\u97F3\u4E50]");
          log_message_arr.push(`<\u81EA\u5B9A\u4E49\u97F3\u4E50:${i.data.url}>`);
          ToString_arr.push(`{custom:${i.data.url}}`);
          break;
        case "weather":
          message.push({ type: "weather", ...i.data });
          raw_message_arr.push("[\u5929\u6C14]");
          log_message_arr.push(`<\u5929\u6C14:${i.data.city}>`);
          ToString_arr.push(`{weather:${i.data.city}}`);
          break;
        case "location":
          message.push({ type: "location", ...i.data });
          raw_message_arr.push("[\u4F4D\u7F6E\u5206\u4EAB]");
          log_message_arr.push(`<\u4F4D\u7F6E\u5206\u4EAB:${i.data.lat}-${i.data.lon}>`);
          ToString_arr.push(`{location:${i.data.lat}-${i.data.lon}}`);
          break;
        case "share":
          message.push({ type: "share", ...i.data });
          raw_message_arr.push("[\u94FE\u63A5\u5206\u4EAB]");
          log_message_arr.push(`<<\u94FE\u63A5\u5206\u4EAB:${i.data.url}>`);
          ToString_arr.push(`{share:${i.data.url}}`);
          break;
        case "gift":
          message.push({ type: "gift", ...i.data });
          raw_message_arr.push("[\u793C\u7269]");
          log_message_arr.push(`<\u793C\u7269:${i.data.id}>`);
          ToString_arr.push(`{gift:${i.data.id}}`);
          break;
        case "markdown":
          message.push({ type: "markdown", ...i.data });
          raw_message_arr.push("[markdown]");
          log_message_arr.push(`<markdown:${i.data}>`);
          ToString_arr.push(`{markdown:${i.data}}`);
          break;
        case "button":
          message.push({ type: "button", ...i.data });
          raw_message_arr.push("[button]");
          log_message_arr.push(`<button:${i.data}>`);
          ToString_arr.push(`{button:${i.data}}`);
          break;
        case "keyboard":
          message.push({ type: "keyboard", ...i.data });
          raw_message_arr.push("[keyboard]");
          log_message_arr.push(`<keyboard:${i.data}>`);
          ToString_arr.push(`{keyboard:${i.data}}`);
          break;
        default:
          message.push({ type: i.type, ...i.data });
          i = JSON.stringify(i);
          raw_message_arr.push(i);
          log_message_arr.push(i);
          ToString_arr.push(i);
          break;
      }
    }
    const ToString = ToString_arr.join("").trim();
    const raw_message = raw_message_arr.join("").trim();
    const log_message = log_message_arr.join(" ").trim();
    return { message, ToString, raw_message, log_message, source, file };
  }
  async getGroupMsgHistory(data, message_seq, count) {
    const msgs = (await data.bot.sendApi("get_group_msg_history", {
      group_id: data.group_id,
      message_seq,
      message_id: message_seq,
      count
    })).data?.messages;
    for (const i of Array.isArray(msgs) ? msgs : [msgs]) {
      if (i?.message) i.message = (await this.parseMsg(i.message, data, false)).message;
      if (!i?.group_name) i.group_name = data?.group_name || data?.group_id;
    }
    return msgs;
  }
  async getFriendMsgHistory(data, message_seq, count) {
    const msgs = (await data.bot.sendApi("get_friend_msg_history", {
      user_id: data.user_id,
      message_seq,
      message_id: message_seq,
      count
    })).data?.messages;
    for (const i of Array.isArray(msgs) ? msgs : [msgs]) {
      if (i?.message) i.message = (await this.parseMsg(i.message, data, false)).message;
    }
    return msgs;
  }
  async getForwardMsg(data, message_id) {
    const msgs = (await data.bot.sendApi("get_forward_msg", {
      message_id,
      id: message_id
    })).data?.messages;
    for (const i of Array.isArray(msgs) ? msgs : [msgs])
      if (i?.message) i.message = (await this.parseMsg(i.message || i.content, data)).message;
    return msgs;
  }
  async makeForwardMsg(msg) {
    const msgs = [];
    for (const i of msg) {
      const [content, forward] = await this.makeMsg(i.message);
      if (forward.length) msgs.push(...await this.makeForwardMsg(forward));
      if (content.length)
        msgs.push({
          type: "node",
          data: {
            name: i.nickname || "\u533F\u540D\u6D88\u606F",
            uin: String(Number(i.user_id) || 8e7),
            content,
            time: i.time
          }
        });
    }
    return msgs;
  }
  async sendFriendForwardMsg(data, msg) {
    stdlog_default.info(`${data.self_id} => ${data.user_id}`, `\u53D1\u9001\u597D\u53CB\u8F6C\u53D1\u6D88\u606F\uFF1A${this.makeLog(msg)}`);
    return data.bot.sendApi("send_private_forward_msg", {
      user_id: data.user_id,
      messages: await this.makeForwardMsg(msg)
    });
  }
  async sendGroupForwardMsg(data, msg) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, `\u53D1\u9001\u7FA4\u8F6C\u53D1\u6D88\u606F\uFF1A${this.makeLog(msg)}`);
    return data.bot.sendApi("send_group_forward_msg", {
      group_id: data.group_id,
      messages: await this.makeForwardMsg(msg)
    });
  }
  async getFriendArray(data) {
    return (await data.bot.sendApi("get_friend_list")).data || [];
  }
  async getFriendList(data) {
    const array = [];
    for (const { user_id } of await this.getFriendArray(data)) array.push(user_id);
    return array;
  }
  async getFriendMap(data) {
    const map = /* @__PURE__ */ new Map();
    for (const i of await this.getFriendArray(data)) map.set(i.user_id, i);
    data.bot.fl = map;
    return map;
  }
  getFriendInfo(data) {
    return data.bot.sendApi("get_stranger_info", {
      user_id: data.user_id
    });
  }
  async getGroupArray(data) {
    const array = (await data.bot.sendApi("get_group_list")).data;
    try {
      for (const guild of await this.getGuildArray(data))
        for (const channel of await this.getGuildChannelArray({
          ...data,
          guild_id: guild.guild_id
        }))
          array.push({
            guild,
            channel,
            group_id: `${guild.guild_id}-${channel.channel_id}`,
            group_name: `${guild.guild_name}-${channel.channel_name}`
          });
    } catch (err) {
    }
    return array;
  }
  async getGroupList(data) {
    const array = [];
    for (const { group_id } of await this.getGroupArray(data)) array.push(group_id);
    return array;
  }
  async getGroupMap(data) {
    const map = /* @__PURE__ */ new Map();
    for (const i of await this.getGroupArray(data)) map.set(i.group_id, i);
    data.bot.gl = map;
    return map;
  }
  getGroupInfo(data) {
    return data.bot.sendApi("get_group_info", {
      group_id: data.group_id
    });
  }
  async getMemberArray(data) {
    return (await data.bot.sendApi("get_group_member_list", {
      group_id: data.group_id
    })).data || [];
  }
  async getMemberList(data) {
    const array = [];
    for (const { user_id } of await this.getMemberArray(data)) array.push(user_id);
    return array;
  }
  async getMemberMap(data) {
    const map = /* @__PURE__ */ new Map();
    for (const i of await this.getMemberArray(data)) map.set(i.user_id, i);
    data.bot.gml.set(data.group_id, map);
    return map;
  }
  async getGroupMemberMap(data) {
    for (const [group_id, group2] of await this.getGroupMap(data)) {
      if (group2.guild) continue;
      await this.getMemberMap({ ...data, group_id });
    }
  }
  getMemberInfo(data) {
    return data.bot.sendApi("get_group_member_info", {
      group_id: data.group_id,
      user_id: data.user_id
    });
  }
  async getGuildArray(data) {
    return (await data.bot.sendApi("get_guild_list")).data || [];
  }
  getGuildInfo(data) {
    return data.bot.sendApi("get_guild_meta_by_guest", {
      guild_id: data.guild_id
    });
  }
  async getGuildChannelArray(data) {
    return (await data.bot.sendApi("get_guild_channel_list", {
      guild_id: data.guild_id
    })).data || [];
  }
  async getGuildChannelMap(data) {
    const map = /* @__PURE__ */ new Map();
    for (const i of await this.getGuildChannelArray(data)) map.set(i.channel_id, i);
    return map;
  }
  async getGuildMemberArray(data) {
    const array = [];
    let next_token = "";
    while (true) {
      const list = (await data.bot.sendApi("get_guild_member_list", {
        guild_id: data.guild_id,
        next_token
      })).data;
      if (!list) break;
      for (const i of list.members)
        array.push({
          ...i,
          user_id: i.tiny_id
        });
      if (list.finished) break;
      next_token = list.next_token;
    }
    return array;
  }
  async getGuildMemberList(data) {
    const array = [];
    for (const { user_id } of await this.getGuildMemberArray(data)) array.push(user_id);
    return array.push;
  }
  async getGuildMemberMap(data) {
    const map = /* @__PURE__ */ new Map();
    for (const i of await this.getGuildMemberArray(data)) map.set(i.user_id, i);
    data.bot.gml.set(data.group_id, map);
    return map;
  }
  getGuildMemberInfo(data) {
    return data.bot.sendApi("get_guild_member_profile", {
      guild_id: data.guild_id,
      user_id: data.user_id
    });
  }
  setProfile(data, profile) {
    stdlog_default.info(data.self_id, `\u8BBE\u7F6E\u8D44\u6599\uFF1A${tools_default.String(profile)}`);
    return data.bot.sendApi("set_qq_profile", profile);
  }
  async setAvatar(data, file) {
    stdlog_default.info(data.self_id, `\u8BBE\u7F6E\u5934\u50CF\uFF1A${file}`);
    return data.bot.sendApi("set_qq_avatar", {
      file: await this.makeFile(file)
    });
  }
  sendLike(data, times) {
    stdlog_default.info(`${data.self_id} => ${data.user_id}`, `\u70B9\u8D5E\uFF1A${times}\u6B21`);
    return data.bot.sendApi("send_like", {
      user_id: data.user_id,
      times
    });
  }
  setGroupName(data, group_name) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, `\u8BBE\u7F6E\u7FA4\u540D\uFF1A${group_name}`);
    return data.bot.sendApi("set_group_name", {
      group_id: data.group_id,
      group_name
    });
  }
  async setGroupAvatar(data, file) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, `\u8BBE\u7F6E\u7FA4\u5934\u50CF\uFF1A${file}`);
    return data.bot.sendApi("set_group_portrait", {
      group_id: data.group_id,
      file: await this.makeFile(file)
    });
  }
  setGroupAdmin(data, user_id, enable) {
    stdlog_default.info(
      `${data.self_id} => ${data.group_id}`,
      `${enable ? "\u8BBE\u7F6E" : "\u53D6\u6D88"}\u7FA4\u7BA1\u7406\u5458\uFF1A${user_id}`
    );
    return data.bot.sendApi("set_group_admin", {
      group_id: data.group_id,
      user_id,
      enable
    });
  }
  setGroupCard(data, user_id, card) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `\u8BBE\u7F6E\u7FA4\u540D\u7247\uFF1A${card}`);
    return data.bot.sendApi("set_group_card", {
      group_id: data.group_id,
      user_id,
      card
    });
  }
  setGroupTitle(data, user_id, special_title, duration) {
    stdlog_default.info(
      `${data.self_id} => ${data.group_id}, ${user_id}`,
      `\u8BBE\u7F6E\u7FA4\u5934\u8854\uFF1A${special_title} ${duration}`
    );
    return data.bot.sendApi("set_group_special_title", {
      group_id: data.group_id,
      user_id,
      special_title,
      duration
    });
  }
  sendGroupSign(data) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, "\u7FA4\u6253\u5361");
    return data.bot.sendApi("send_group_sign", {
      group_id: data.group_id
    });
  }
  setGroupBan(data, user_id, duration) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `\u7981\u8A00\u7FA4\u6210\u5458\uFF1A${duration}\u79D2`);
    return data.bot.sendApi("set_group_ban", {
      group_id: data.group_id,
      user_id,
      duration
    });
  }
  setGroupWholeKick(data, enable) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, `${enable ? "\u5F00\u542F" : "\u5173\u95ED"}\u5168\u5458\u7981\u8A00`);
    return data.bot.sendApi("set_group_whole_ban", {
      group_id: data.group_id,
      enable
    });
  }
  setGroupKick(data, user_id, reject_add_request) {
    stdlog_default.info(
      `${data.self_id} => ${data.group_id}, ${user_id}`,
      `\u8E22\u51FA\u7FA4\u6210\u5458${reject_add_request ? "\u62D2\u7EDD\u518D\u6B21\u52A0\u7FA4" : ""}`
    );
    return data.bot.sendApi("set_group_kick", {
      group_id: data.group_id,
      user_id,
      reject_add_request
    });
  }
  setGroupLeave(data, is_dismiss) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, is_dismiss ? "\u89E3\u6563" : "\u9000\u7FA4");
    return data.bot.sendApi("set_group_leave", {
      group_id: data.group_id,
      is_dismiss
    });
  }
  downloadFile(data, url, thread_count, headers) {
    return data.bot.sendApi("download_file", {
      url,
      thread_count,
      headers
    });
  }
  async sendFriendFile(data, file, name = path.basename(file.slice(0, 16))) {
    stdlog_default.info(`${data.self_id} => ${data.user_id}`, `\u53D1\u9001\u597D\u53CB\u6587\u4EF6\uFF1A${name}(${file})`);
    return data.bot.sendApi("upload_private_file", {
      user_id: data.user_id,
      file: await this.makeFile(file),
      name
    });
  }
  async sendGroupFile(data, file, folder, name = path.basename(file.slice(0, 16))) {
    stdlog_default.info(
      `${data.self_id} => ${data.group_id}`,
      `\u53D1\u9001\u7FA4\u6587\u4EF6\uFF1A${folder || ""}/${name}(${file})`
    );
    return data.bot.sendApi("upload_group_file", {
      group_id: data.group_id,
      folder,
      file: await this.makeFile(file),
      name
    });
  }
  deleteGroupFile(data, file_id, busid) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, `\u5220\u9664\u7FA4\u6587\u4EF6\uFF1A${file_id}(${busid})`);
    return data.bot.sendApi("delete_group_file", {
      group_id: data.group_id,
      file_id,
      busid
    });
  }
  createGroupFileFolder(data, name) {
    stdlog_default.info(`${data.self_id} => ${data.group_id}`, `\u521B\u5EFA\u7FA4\u6587\u4EF6\u5939\uFF1A${name}`);
    return data.bot.sendApi("create_group_file_folder", {
      group_id: data.group_id,
      name
    });
  }
  getGroupFileSystemInfo(data) {
    return data.bot.sendApi("get_group_file_system_info", {
      group_id: data.group_id
    });
  }
  getGroupFiles(data, folder_id) {
    if (folder_id)
      return data.bot.sendApi("get_group_files_by_folder", {
        group_id: data.group_id,
        folder_id
      });
    return data.bot.sendApi("get_group_root_files", {
      group_id: data.group_id
    });
  }
  getGroupFileUrl(data, file_id, busid) {
    return data.bot.sendApi("get_group_file_url", {
      group_id: data.group_id,
      file_id,
      busid
    });
  }
  getGroupFs(data) {
    return {
      upload: (file, folder, name) => this.sendGroupFile(data, file, folder, name),
      rm: (file_id, busid) => this.deleteGroupFile(data, file_id, busid),
      mkdir: (name) => this.createGroupFileFolder(data, name),
      df: () => this.getGroupFileSystemInfo(data),
      ls: (folder_id) => this.getGroupFiles(data, folder_id),
      download: (file_id, busid) => this.getGroupFileUrl(data, file_id, busid)
    };
  }
  setFriendAddRequest(data, flag, approve, remark) {
    return data.bot.sendApi("set_friend_add_request", {
      flag,
      approve,
      remark
    });
  }
  setGroupAddRequest(data, flag, sub_type, approve, reason) {
    return data.bot.sendApi("set_group_add_request", {
      flag,
      sub_type,
      approve,
      reason
    });
  }
  pickFriend(data, user_id) {
    const i = {
      ...data.bot.fl.get(user_id),
      ...data,
      user_id
    };
    return {
      ...i,
      sendMsg: (msg) => this.sendFriendMsg(i, msg),
      getMsg: (message_id) => this.getMsg(i, message_id),
      recallMsg: (message_id) => this.recallMsg(i, message_id),
      getForwardMsg: (message_id) => this.getForwardMsg(i, message_id),
      getChatHistory: (seq, cnt) => this.getFriendMsgHistory(i, seq, cnt),
      sendForwardMsg: (msg) => this.sendFriendForwardMsg(i, msg),
      sendFile: (file, name) => this.sendFriendFile(i, file, name),
      getInfo: () => this.getFriendInfo(i),
      getAvatarUrl: () => i.avatar || `https://q.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
      thumbUp: (times) => this.sendLike(i, times)
    };
  }
  pickMember(data, group_id, user_id) {
    if (typeof group_id === "string" && group_id.match("-")) {
      const guild_id = group_id.split("-");
      const i2 = {
        ...data,
        guild_id: guild_id[0],
        channel_id: guild_id[1],
        user_id
      };
      return {
        ...this.pickGroup(i2, group_id),
        ...i2,
        getInfo: () => this.getGuildMemberInfo(i2),
        getAvatarUrl: async () => (await this.getGuildMemberInfo(i2)).avatar_url
      };
    }
    const i = {
      ...data.bot.fl.get(user_id),
      ...data.bot.gml.get(group_id)?.get(user_id),
      ...data,
      group_id,
      user_id
    };
    return {
      ...this.pickFriend(i, user_id),
      ...i,
      getInfo: () => this.getMemberInfo(i),
      getAvatarUrl: () => i.avatar || `https://q.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
      poke: () => this.sendGroupMsg(i, { type: "poke", qq: user_id, id: String(user_id) }),
      mute: (duration) => this.setGroupBan(i, i.user_id, duration),
      kick: (reject_add_request) => this.setGroupKick(i, i.user_id, reject_add_request),
      get is_friend() {
        return data.bot.fl.has(user_id);
      },
      get is_owner() {
        return i.role === "owner";
      },
      get is_admin() {
        return i.role === "admin";
      }
    };
  }
  pickGroup(data, group_id) {
    if (typeof group_id === "string" && group_id.match("-")) {
      const guild_id = group_id.split("-");
      const i2 = {
        ...data.bot.gl.get(group_id),
        ...data,
        guild_id: guild_id[0],
        channel_id: guild_id[1]
      };
      return {
        ...i2,
        sendMsg: (msg) => this.sendGuildMsg(i2, msg),
        getMsg: (message_id) => this.getMsg(i2, message_id),
        recallMsg: (message_id) => this.recallMsg(i2, message_id),
        getForwardMsg: (message_id) => this.getForwardMsg(i2, message_id),
        getInfo: () => this.getGuildInfo(i2),
        getChannelArray: () => this.getGuildChannelArray(i2),
        getChannelList: () => this.getGuildChannelMap(i2),
        getChannelMap: () => this.getGuildChannelMap(i2),
        getMemberArray: () => this.getGuildMemberArray(i2),
        getMemberList: () => this.getGuildMemberList(i2),
        getMemberMap: () => this.getGuildMemberMap(i2),
        pickMember: (user_id) => this.pickMember(i2, group_id, user_id)
      };
    }
    const i = {
      ...data.bot.gl.get(group_id),
      ...data,
      group_id
    };
    return {
      ...i,
      sendMsg: (msg) => this.sendGroupMsg(i, msg),
      getMsg: (message_id) => this.getMsg(i, message_id),
      recallMsg: (message_id) => this.recallMsg(i, message_id),
      getForwardMsg: (message_id) => this.getForwardMsg(i, message_id),
      sendForwardMsg: (msg) => this.sendGroupForwardMsg(i, msg),
      sendFile: (file, name) => this.sendGroupFile(i, file, void 0, name),
      getInfo: () => this.getGroupInfo(i),
      getAvatarUrl: () => i.avatar || `https://p.qlogo.cn/gh/${group_id}/${group_id}/0`,
      getChatHistory: (seq, cnt) => this.getGroupMsgHistory(i, seq, cnt),
      getMemberArray: () => this.getMemberArray(i),
      getMemberList: () => this.getMemberList(i),
      getMemberMap: () => this.getMemberMap(i),
      pickMember: (user_id) => this.pickMember(i, group_id, user_id),
      pokeMember: (qq2) => this.sendGroupMsg(i, { type: "poke", qq: qq2 }),
      setName: (group_name) => this.setGroupName(i, group_name),
      setAvatar: (file) => this.setGroupAvatar(i, file),
      setAdmin: (user_id, enable) => this.setGroupAdmin(i, user_id, enable),
      setCard: (user_id, card) => this.setGroupCard(i, user_id, card),
      setTitle: (user_id, special_title, duration) => this.setGroupTitle(i, user_id, special_title, duration),
      sign: () => this.sendGroupSign(i),
      muteMember: (user_id, duration) => this.setGroupBan(i, user_id, duration),
      muteAll: (enable) => this.setGroupWholeKick(i, enable),
      kickMember: (user_id, reject_add_request) => this.setGroupKick(i, user_id, reject_add_request),
      quit: (is_dismiss) => this.setGroupLeave(i, is_dismiss),
      fs: this.getGroupFs(i),
      get is_owner() {
        return data.bot.gml.get(group_id)?.get(data.self_id)?.role === "owner";
      },
      get is_admin() {
        return data.bot.gml.get(group_id)?.get(data.self_id)?.role === "admin";
      }
    };
  }
  async connect(data, ws) {
    if (!data.self_id) stdlog_default.warn("Onebotv11", "\u672A\u627E\u5230self_id!");
    Bot[data.self_id] = {
      adapter: this.name,
      ws,
      sendApi: (action, params) => this.sendApi(data, ws, action, params),
      stat: {
        start_time: data.time,
        stat: {},
        get lost_pkt_cnt() {
          return this.stat.packet_lost;
        },
        get lost_times() {
          return this.stat.lost_times;
        },
        get recv_msg_cnt() {
          return this.stat.message_received;
        },
        get recv_pkt_cnt() {
          return this.stat.packet_received;
        },
        get sent_msg_cnt() {
          return this.stat.message_sent;
        },
        get sent_pkt_cnt() {
          return this.stat.packet_sent;
        }
      },
      model: botInfo.BOT_NAME,
      info: {
        user_id: data.self_id,
        nickname: data.nickname
      },
      self_id: data.self_id,
      uin: data.self_id,
      get nickname() {
        return this.info.nickname ?? data.self_id;
      },
      get avatar() {
        return `https://q.qlogo.cn/g?b=qq&s=0&nk=${this.uin}`;
      },
      setProfile: (profile) => this.setProfile(data, profile),
      setNickname: (nickname) => this.setProfile(data, { nickname }),
      setAvatar: (file) => this.setAvatar(data, file),
      pickFriend: (user_id) => this.pickFriend(data, user_id),
      sendPrivateMsg: (user_id, msg) => this.pickFriend(data, user_id).sendMsg(msg),
      get pickUser() {
        return this.pickFriend;
      },
      getFriendArray: () => this.getFriendArray(data),
      getFriendList: () => this.getFriendList(data),
      getFriendMap: () => this.getFriendMap(data),
      fl: /* @__PURE__ */ new Map(),
      pickMember: (group_id, user_id) => this.pickMember(data, group_id, user_id),
      pickGroup: (group_id) => this.pickGroup(data, group_id),
      sendGroupMsg: (group_id, msg) => this.pickGroup(data, group_id).sendMsg(msg),
      getGroupArray: () => this.getGroupArray(data),
      getGroupList: () => this.getGroupList(data),
      getGroupMap: () => this.getGroupMap(data),
      getGroupMemberMap: () => this.getGroupMemberMap(data),
      gl: /* @__PURE__ */ new Map(),
      gml: /* @__PURE__ */ new Map(),
      request_list: [],
      getSystemMsg: () => data.bot.request_list,
      makeForwardMsg: (msg) => this.makeForwardMsg(msg),
      setFriendAddRequest: (flag, approve, remark) => this.setFriendAddRequest(data, flag, approve, remark),
      setGroupAddRequest: (flag, sub_type, approve, reason) => this.setGroupAddRequest(data, flag, sub_type, approve, reason)
    };
    data.bot = Bot[data.self_id];
    if (!Bot.adapter) Bot.adapter = [];
    if (!Bot.adapter?.includes(data.self_id)) Bot.adapter.push(data.self_id);
    data.bot.sendApi("_set_model_show", {
      model: data.bot.model,
      model_show: data.bot.model
    }).catch(() => {
    });
    data.bot.info = (await data.bot.sendApi("get_login_info").catch((i) => i.error)).data;
    data.bot.guild_info = (await data.bot.sendApi("get_guild_service_profile").catch((i) => i.error)).data;
    data.bot.clients = (await data.bot.sendApi("get_online_clients").catch((i) => i.error)).clients;
    data.bot.version = {
      ...(await data.bot.sendApi("get_version_info").catch((i) => i.error)).data,
      id: this.id,
      name: this.name,
      get version() {
        return this.app_full_name || `${this.app_name} v${this.app_version}`;
      }
    };
    data.bot.getFriendMap();
    data.bot.getGroupMemberMap();
    stdlog_default.mark(
      data.self_id,
      `${this.name}(${this.id}) ${data.bot.version.version} \u8FDE\u63A5\u6210\u529F\uFF0C\u534F\u8BAE\u901A\u8FC7\uFF0C\u6267\u884C\u6D88\u606F\u5904\u7406...`
    );
    tools_default.$emit(`connect.${data.self_id}`, data);
    tools_default.$emit("system.online", data.bot);
  }
  async sendReplyMsg(data, msg, quote, option) {
    if (typeof msg == "string") {
      msg = [{ type: "text", data: { text: msg } }];
    }
    if (!Array.isArray(msg)) {
      msg = [msg];
    }
    if (quote && data.message_id) {
      msg.unshift({ type: "reply", data: { id: String(data.message_id) } });
    }
    if (option?.at) {
      msg.unshift({ type: "at", data: { qq: String(data.user_id) } });
    }
    if (option?.recallMsg || option?.recallMsg === 0) {
      setTimeout(async () => {
        await this.recallMsg(data, data.message_id);
      }, option.recallMsg * 1e3);
    }
    if (data.group_id) return await data.bot.sendGroupMsg(data.group_id, msg);
    return await data.bot.sendPrivateMsg(data.user_id, msg);
  }
  async makeMessage(data) {
    const { message, ToString, log_message, source, file } = await this.parseMsg(
      data.message,
      data
    );
    data.message = message;
    data.uin = this.id;
    data.log_message = log_message;
    data.toString = () => ToString;
    if (!data.reply)
      data.reply = async (msg, quote, option) => await this.sendReplyMsg(data, msg, quote, option);
    if (!data.getAvatarUrl)
      data.getAvatarUrl = (size = 0) => data.avatar || `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${data.user_id}`;
    if (!data.recall) data.recall = async () => await this.recallMsg(data, data.message_id);
    if (file) data.file = file;
    if (source) data.source = source;
    switch (data.message_type) {
      case "private": {
        const name = data.sender?.card || data.sender?.nickname || data.bot.fl.get(data.user_id)?.nickname;
        stdlog_default.info(
          `${data.self_id} <= ${data.user_id}`,
          `\u597D\u53CB\u6D88\u606F\uFF1A${name ? `[${name}] ` : ""}${log_message}`
        );
        break;
      }
      case "group": {
        if (!data.group_name) data.group_name = data.bot.gl.get(data.group_id)?.group_name;
        const group_name = data.group_name;
        let user_name = data.sender?.card || data.sender?.nickname;
        if (!user_name) {
          const user = data.bot.gml.get(data.group_id)?.get(data.user_id) || data.bot.fl.get(data.user_id);
          if (user) user_name = user?.card || user?.nickname;
        }
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
          `\u7FA4\u6D88\u606F\uFF1A${user_name ? group_name ? "[\u7FA4\uFF1A" + group_name + "][\u6210\u5458\uFF1A" + user_name + "]" : "" : ""}${log_message}`
        );
        break;
      }
      case "guild":
        data.message_type = "group";
        data.group_id = `${data.guild_id}-${data.channel_id}`;
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
          `\u9891\u9053\u6D88\u606F\uFF1A[${data.sender.nickname}] ${log_message}`
        );
        Object.defineProperty(data, "friend", {
          get() {
            return this.member || {};
          }
        });
        break;
      default:
        stdlog_default.warn(data.self_id, `\u672A\u77E5\u6D88\u606F\uFF1A${data.raw}`);
    }
    tools_default.$emit(`${data.post_type}.${data.message_type}.${data.sub_type}`, data);
  }
  async makeNotice(data) {
    switch (data.notice_type) {
      case "friend_recall":
        stdlog_default.info(`${data.self_id} <= ${data.user_id}`, `\u597D\u53CB\u6D88\u606F\u64A4\u56DE\uFF1A${data.message_id}`);
        break;
      case "group_recall":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}`,
          `\u7FA4\u6D88\u606F\u64A4\u56DE\uFF1A${data.operator_id} => ${data.user_id} ${data.message_id}`
        );
        break;
      case "group_increase":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}`,
          `\u7FA4\u6210\u5458\u589E\u52A0\uFF1A${data.operator_id} => ${data.user_id} ${data.sub_type}`
        );
        if (data.user_id === data.self_id) data.bot.getGroupMemberMap();
        else data.bot.pickGroup(data.group_id).getMemberMap();
        break;
      case "group_decrease":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}`,
          `\u7FA4\u6210\u5458\u51CF\u5C11\uFF1A${data.operator_id} => ${data.user_id} ${data.sub_type}`
        );
        if (data.user_id === data.self_id) data.bot.getGroupMemberMap();
        else data.bot.pickGroup(data.group_id).getMemberMap();
        break;
      case "group_admin":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
          `\u7FA4\u7BA1\u7406\u5458\u53D8\u52A8\uFF1A${data.sub_type}`
        );
        data.set = data.sub_type === "set";
        break;
      case "group_upload":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
          `\u7FA4\u6587\u4EF6\u4E0A\u4F20\uFF1A${tools_default.String(data.file)}`
        );
        break;
      case "group_ban":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}`,
          `\u7FA4\u7981\u8A00\uFF1A${data.operator_id} => ${data.user_id} ${data.sub_type} ${data.duration}\u79D2`
        );
        break;
      case "friend_add":
        stdlog_default.info(`${data.self_id} <= ${data.user_id}`, "\u597D\u53CB\u6DFB\u52A0");
        data.bot.getFriendMap();
        break;
      case "notify":
        if (data.group_id) data.notice_type = "group";
        else data.notice_type = "friend";
        switch (data.sub_type) {
          case "poke":
            data.operator_id = data.user_id;
            if (data.group_id)
              stdlog_default.info(
                `${data.self_id} <= ${data.group_id}`,
                `\u7FA4\u6233\u4E00\u6233\uFF1A${data.operator_id} => ${data.target_id}`
              );
            else stdlog_default.info(data.self_id, `\u597D\u53CB\u6233\u4E00\u6233\uFF1A${data.operator_id} => ${data.target_id}`);
            break;
          case "honor":
            stdlog_default.info(
              `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
              `\u7FA4\u8363\u8A89\uFF1A${data.honor_type}`
            );
            break;
          case "title":
            stdlog_default.info(
              `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
              `\u7FA4\u5934\u8854\uFF1A${data.title}`
            );
            break;
          default:
            stdlog_default.warn(data.self_id, `\u672A\u77E5\u901A\u77E5\uFF1A${data.raw}`);
        }
        break;
      case "group_card":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
          `\u7FA4\u540D\u7247\u66F4\u65B0\uFF1A${data.card_old} => ${data.card_new}`
        );
        break;
      case "offline_file":
        stdlog_default.info(`${data.self_id} <= ${data.user_id}`, `\u79BB\u7EBF\u6587\u4EF6\uFF1A${tools_default.String(data.file)}`);
        break;
      case "client_status":
        stdlog_default.info(
          data.self_id,
          `\u5BA2\u6237\u7AEF${data.online ? "\u4E0A\u7EBF" : "\u4E0B\u7EBF"}\uFF1A${tools_default.String(data.client)}`
        );
        data.clients = (await data.bot.sendApi("get_online_clients")).clients;
        data.bot.clients = data.clients;
        break;
      case "essence":
        data.notice_type = "group_essence";
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}`,
          `\u7FA4\u7CBE\u534E\u6D88\u606F\uFF1A${data.operator_id} => ${data.sender_id} ${data.sub_type} ${data.message_id}`
        );
        break;
      case "guild_channel_recall":
        stdlog_default.info(
          `${data.self_id} <= ${data.guild_id}-${data.channel_id}`,
          `\u9891\u9053\u6D88\u606F\u64A4\u56DE\uFF1A${data.operator_id} => ${data.user_id} ${data.message_id}`
        );
        break;
      case "message_reactions_updated":
        data.notice_type = "guild_message_reactions_updated";
        stdlog_default.info(
          `${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`,
          `\u9891\u9053\u6D88\u606F\u8868\u60C5\u8D34\uFF1A${data.message_id} ${tools_default.String(data.current_reactions)}`
        );
        break;
      case "channel_updated":
        data.notice_type = "guild_channel_updated";
        stdlog_default.info(
          `${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`,
          `\u5B50\u9891\u9053\u66F4\u65B0\uFF1A${tools_default.String(data.old_info)} => ${tools_default.String(data.new_info)}`
        );
        break;
      case "channel_created":
        data.notice_type = "guild_channel_created";
        stdlog_default.info(
          `${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`,
          `\u5B50\u9891\u9053\u521B\u5EFA\uFF1A${tools_default.String(data.channel_info)}`
        );
        data.bot.getGroupMap();
        break;
      case "channel_destroyed":
        data.notice_type = "guild_channel_destroyed";
        stdlog_default.info(
          `${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`,
          `\u5B50\u9891\u9053\u5220\u9664\uFF1A${tools_default.String(data.channel_info)}`
        );
        data.bot.getGroupMap();
        break;
      default:
        stdlog_default.warn(data.self_id, `\u672A\u77E5\u901A\u77E5\uFF1A${data.raw}`);
    }
    let notice2 = data.notice_type.split("_");
    data.notice_type = notice2.shift();
    notice2 = notice2.join("_");
    if (notice2) data.sub_type = notice2;
    if (data.guild_id && data.channel_id) {
      data.group_id = `${data.guild_id}-${data.channel_id}`;
      Object.defineProperty(data, "friend", {
        get() {
          return this.member || {};
        }
      });
    }
    tools_default.$emit(`${data.post_type}.${data.notice_type}.${data.sub_type}`, data);
  }
  makeRequest(data) {
    switch (data.request_type) {
      case "friend":
        stdlog_default.info(
          `${data.self_id} <= ${data.user_id}`,
          `\u52A0\u597D\u53CB\u8BF7\u6C42\uFF1A${data.comment}(${data.flag})`
        );
        data.sub_type = "add";
        data.approve = (approve) => data.bot.setFriendAddRequest(data.flag, approve);
        break;
      case "group":
        stdlog_default.info(
          `${data.self_id} <= ${data.group_id}, ${data.user_id}`,
          `\u52A0\u7FA4\u8BF7\u6C42\uFF1A${data.sub_type} ${data.comment}(${data.flag})`
        );
        data.approve = (approve) => data.bot.setGroupAddRequest(data.flag, data.sub_type, approve);
        break;
      default:
        stdlog_default.warn(data.self_id, `\u672A\u77E5\u8BF7\u6C42\uFF1A${data.raw}`);
    }
    data.bot.request_list.push(data);
    tools_default.$emit(`${data.post_type}.${data.request_type}.${data.sub_type}`, data);
  }
  heartbeat(data) {
    stdlog_default.debug(data.self_id, `\u6536\u5230\u5FC3\u8DF3\uFF1A${data.status}`);
    if (data.status) Object.assign(data.bot.stat, data.status);
  }
  makeMeta(data, ws) {
    switch (data.meta_event_type) {
      case "heartbeat":
        this.heartbeat(data);
        break;
      case "lifecycle":
        this.id = data.self_id;
        this.connect(data, ws);
        break;
      default:
        stdlog_default.warn(data.self_id, `\u672A\u77E5\u6D88\u606F\uFF1A${data.raw}`);
    }
  }
  async message(data, ws) {
    try {
      data = {
        ...JSON.parse(data),
        raw: tools_default.String(data)
      };
    } catch (err) {
      return stdlog_default.error(data.self_id, "\u89E3\u6790\u6570\u636E\u5931\u8D25", data, err);
    }
    if (data.post_type) {
      if (data.meta_event_type !== "lifecycle" && !Bot[data.self_id]) {
        stdlog_default.warn(data.self_id, `\u627E\u4E0D\u5230\u5BF9\u5E94Bot\uFF0C\u5FFD\u7565\u6D88\u606F\uFF1A${data.raw}`);
        return false;
      }
      data.bot = Bot[data.self_id];
      switch (data.post_type) {
        case "meta_event":
          this.makeMeta(data, ws);
          break;
        case "message":
          await this.makeMessage(data);
          break;
        case "notice":
          this.makeNotice(data);
          break;
        case "request":
          this.makeRequest(data);
          break;
        case "message_sent":
          data.post_type = "message";
          await this.makeMessage(data);
          break;
        default:
          stdlog_default.warn(data.self_id, `\u672A\u77E5\u6D88\u606F\uFF1A${data.raw}`);
      }
    } else if (data.echo && this.echo[data.echo]) {
      if (![0, 1].includes(data.retcode))
        this.echo[data.echo].reject(Object.assign(this.echo[data.echo].request, { error: data }));
      else
        this.echo[data.echo].resolve(
          data.data ? new Proxy(data, {
            get: (target, prop) => target.data[prop] ?? target[prop]
          }) : data
        );
      clearTimeout(this.echo[data.echo].timeout);
      delete this.echo[data.echo];
    } else {
      stdlog_default.info(data.self_id, `\u672A\u77E5\u6D88\u606F\uFF1A${data.raw}`);
    }
  }
};
var OnebotV11_default = OnebotV11;

// src/backend/server/app/webui/chat/index.ts
import { randomUUID as randomUUID3 } from "crypto";
var Screenchat = class {
  clients;
  plugins;
  constructor(ws) {
    this.clients = /* @__PURE__ */ new Map();
    this.plugins = [];
    this.init(ws);
  }
  use(plugin3) {
    this.plugins.push(plugin3);
  }
  init(ws) {
    const ClientId = randomUUID3();
    ws.send(JSON.stringify({ params: ClientId, action: "meta", type: "message" }));
    try {
      Bot?.on?.("message", async (e) => {
        await this.listen(e);
      });
    } catch (err) {
      console.warn(err);
    }
    this.clients.set(ClientId, ws);
    ws.on("message", async (message) => {
      logger.info(logger.blue(`[micro-webui]\u6536\u5230\u6D88\u606F\uFF1A${message}`));
      const data = JSON.parse(message);
      for (const plugin3 of this.plugins) {
        await plugin3(data, {
          sendMsg: (params, action, type = "message") => {
            ws.send(JSON.stringify({ type, params, action }));
          }
        });
      }
    });
    ws.on("close", () => {
      logger.info(logger.blue(`[micro-webui]\u5DF2\u65AD\u5F00\u8FDE\u63A5`));
      this.clients.delete(ClientId);
    });
    ws.on("error", (err) => {
      logger.error("[micro-webui]\u8FDE\u63A5\u9519\u8BEF:", err);
      this.clients.delete(ClientId);
    });
  }
  async listen(e) {
    const { msg, message, group_name, group_id, sender } = e;
    if (!sender.user_id) {
      sender.user_id = e.user_id;
    }
    this.sendMsg({ msg, message, group_name, group_id, sender }, "e_info");
    return true;
  }
  sendMsg(params, action, type = "message", clientId = null) {
    if (clientId) {
      try {
        this.clients.get(clientId).send(JSON.stringify({ type, params, action }));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}`, error);
        this.clients.delete(clientId);
      }
      return;
    }
    for (const [key, ws] of this.clients.entries()) {
      try {
        ws.send(JSON.stringify({ params, action, type }));
      } catch (error) {
        console.error(`Error sending message to client ${key}`, error);
        this.clients.delete(key);
      }
    }
  }
};
var chat_default = Screenchat;

// src/backend/server/app/webui/stdout/index.ts
import { randomUUID as randomUUID4 } from "crypto";
var { uin } = config_default.getConfig("protocol").stdin;
var logger2 = await Logger();
var StdoutWs = class _StdoutWs {
  static clients = /* @__PURE__ */ new Map();
  name = "[micro-stdout]";
  disposeListener = () => {
  };
  clientID;
  constructor(ws) {
    this.clientID = randomUUID4();
    _StdoutWs.clients.set(this.clientID, ws);
    this.init(ws);
  }
  init(ws) {
    const success = logger2.blue(`${this.name}\u5BA2\u6237\u7AEF\u8FDE\u63A5\uFF01`);
    logger2.info(success);
    ws.send(JSON.stringify({ type: "log", data: success }));
    this.disposeListener = addStdoutListener((buf) => {
      ws.send(JSON.stringify({ type: "log", data: buf.toString() }));
    });
    ws.on("message", (message) => {
      const msg = JSON.parse(message.toString());
      if (msg.type === "cmd") {
        if (Bot["stdin"] && Bot["stdin"]?.adapter) {
          Bot["stdin"].adapter.message(msg.data);
        } else if (uin && Bot[uin]) {
          Bot[uin].mockTextMsgEvent?.(msg.data);
        }
      }
    });
    ws.on("close", () => {
      logger2.info(logger2.blue(`${this.name}\u5DF2\u65AD\u5F00\u8FDE\u63A5`));
      this.close();
      this.disposeListener();
    });
    ws.on("error", (err) => {
      logger2.error(`${this.name}\u8FDE\u63A5\u9519\u8BEF:`, err);
      this.close();
      this.disposeListener();
    });
  }
  close() {
    _StdoutWs.clients.delete(this.clientID);
    this.disposeListener();
  }
};
var stdout_default = StdoutWs;

// src/backend/server/app/webui/terminal/index.ts
import Chalk from "chalk";
import { spawn } from "child_process";
import { randomUUID as randomUUID5 } from "crypto";
import { EventEmitter } from "events";
import iconvLite from "iconv-lite";
import os4 from "os";
import querystring from "querystring";
var logger3 = await Logger();
var TerminalSession = class extends EventEmitter {
  process = null;
  currentPath = process.cwd();
  isWindows = os4.platform() === "win32";
  clientId;
  shellType;
  constructor(clientId, initialPath) {
    super();
    this.clientId = clientId;
    this.currentPath = initialPath || process.cwd();
    this.shellType = this.isWindows ? "powershell" : "bash";
    this.initShell();
  }
  initShell() {
    const shell = this.isWindows ? "powershell.exe" : "bash";
    const args = this.isWindows ? [] : ["-i"];
    this.process = spawn(shell, args, {
      cwd: this.currentPath,
      env: {
        ...process.env,
        TERM: "xterm-256color",
        LANG: this.isWindows ? "chcp 65001" : "zh_CN.UTF-8"
      },
      stdio: ["pipe", "pipe", "pipe"]
    });
    const stdoutHandler = (data) => {
      const decoded = this.isWindows ? iconvLite.decode(data, "gbk") : data.toString();
      this.emit("data", decoded);
    };
    const stderrHandler = (data) => {
      const decoded = this.isWindows ? iconvLite.decode(data, "gbk") : data.toString();
      this.emit("data", decoded);
    };
    this.process.stdout.on("data", stdoutHandler);
    this.process.stderr.on("data", stderrHandler);
    this.process.on("close", (code) => {
      this.emit("close", `Process exited with code ${code}`);
      this.process = null;
    });
    this.process.on("error", (err) => {
      this.emit("error", err.message);
    });
    setTimeout(() => {
      if (!this.isWindows) {
        this.write('export PS1="\\u@\\h:\\w$ "\n');
      }
    }, 100);
  }
  write(command) {
    if (!this.process || this.process.killed) {
      this.initShell();
      setTimeout(() => this.write(command), 200);
      return;
    }
    if (command.trim().toLowerCase() === "exit") {
      this.close();
      return;
    }
    this.process.stdin.write(command + "\n");
  }
  changeDirectory(path2) {
    this.currentPath = path2;
    if (this.process && !this.process.killed) {
      const cdCommand = this.isWindows ? `cd "${path2}"` : `cd "${path2}" && pwd`;
      this.process.stdin.write(cdCommand + "\n");
    }
  }
  getCurrentPath() {
    return this.currentPath;
  }
  close() {
    if (this.process && !this.process.killed) {
      this.process.kill("SIGTERM");
    }
    this.removeAllListeners();
  }
  resize(cols, rows) {
    if (this.process && !this.process.killed) {
      this.process.stdout.on("resize", () => {
      });
    }
  }
};
var TerminalWs = class _TerminalWs {
  constructor(ws, url) {
    this.url = url;
    if (!_TerminalWs.clients) _TerminalWs.clients = /* @__PURE__ */ new Map();
    this.init(ws);
  }
  static clients = null;
  sshStream;
  name = "[micro-terminal]";
  mode = "spawn";
  sshConfig;
  sshClient;
  init(ws) {
    const clientId = randomUUID5();
    if (this.url.includes("ssh")) {
      const params = querystring.parse(this.url.split("?")[1]);
      if (!params) return;
      this.mode = "ssh";
      const { host, port, username, password } = params;
      this.sshConfig = {
        isOpen: true,
        host,
        port: Number(port),
        username,
        password
      };
      ws.send(
        JSON.stringify({
          params: clientId,
          action: "meta",
          type: "ssh"
        })
      );
      this.ssh(ws);
    } else {
      this.mode = "spawn";
      ws.send(
        JSON.stringify({
          params: clientId,
          action: "meta",
          type: "exec"
        })
      );
      const session = new TerminalSession(clientId);
      _TerminalWs.clients.set(clientId, { ws, session });
      session.on("data", (data) => {
        ws.send(
          JSON.stringify({
            type: "exec",
            action: "stdout",
            params: data
          })
        );
      });
      session.on("close", (message) => {
        ws.send(
          JSON.stringify({
            type: "exec",
            action: "stdout",
            params: message
          })
        );
      });
      session.on("error", (error) => {
        ws.send(
          JSON.stringify({
            type: "exec",
            action: "stderr",
            params: error
          })
        );
      });
    }
    ws.on("message", async (message) => {
      const data = JSON.parse(message.toString());
      if (data?.type === "ssh") {
        this.sshStream?.write(data.params?.cmd?.trim() + "\n");
      } else {
        const client = _TerminalWs.clients.get(clientId);
        if (!client) return;
        const { session } = client;
        session.write(data.params?.cmd);
      }
    });
    ws.on("close", () => {
      const client = _TerminalWs.clients.get(clientId);
      if (client) {
        client.session.close();
        _TerminalWs.clients.delete(clientId);
      }
      if (this.mode == "ssh") {
        this.sshClient?.end()?.destroy();
      }
      logger3.info(logger3.blue(`${this.name}\u5BA2\u6237\u7AEF\u65AD\u5F00\u8FDE\u63A5`));
    });
    ws.on("error", (err) => {
      logger3.error(`${this.name}\u8FDE\u63A5\u9519\u8BEF:`, err);
      const client = _TerminalWs.clients.get(clientId);
      if (client) {
        client.session.close();
        _TerminalWs.clients.delete(clientId);
      }
      if (this.mode == "ssh") {
        this.sshClient?.end()?.destroy();
      }
    });
    logger3.info(logger3.blue(`${this.name}\u5BA2\u6237\u7AEF\u5DF2\u8FDE\u63A5\uFF01`));
  }
  async ssh(ws) {
    let Client;
    try {
      Client = (await import("ssh2")).Client;
    } catch (err) {
      logger3.error("[Micro]\u672A\u6210\u529F\u5B89\u88C5ssh2\uFF0C\u65E0\u6CD5\u4F7F\u7528ssh\u8FDE\u63A5\u529F\u80FD\uFF1A" + err.message);
      return;
    }
    if (!this.sshConfig) return new Error("[Micro]SSH\u672A\u914D\u7F6E\uFF01");
    const sendStdout = (data) => {
      ws.send(JSON.stringify({ type: "ssh", action: "stdout", params: data }));
    };
    this.sshClient = new Client();
    this.sshClient.on("ready", () => {
      console.log("SSH Connection :: ready");
      sendStdout(Chalk.blueBright("SSH Connection :: ready") + "\n");
      this.sshClient.shell((err, stream) => {
        this.sshStream = stream;
        if (err) logger3.error(err);
        stream.on("close", () => {
          console.log("SSH Stream :: close");
          sendStdout(Chalk.yellow("SSH Stream :: close") + "\n");
          this.sshClient.end();
        }).on("data", function(data) {
          console.log("SSH Stream :: STDOUT: " + data);
          sendStdout(data.toString());
        }).on("exit", (code) => {
          sendStdout("SSH Shell \u9000\u51FA\u4E8B\u4EF6\uFF0C\u9000\u51FA\u7801\uFF1A" + Chalk.red(code) + "\n");
        }).stderr.on("data", function(data) {
          console.error("SSH Stream :: STDERR: " + data);
          sendStdout(Chalk.red("SSH Stream :: STDERR: ") + "\n" + data.toString());
        });
      });
    }).on("error", (err) => {
      console.error("SSH Connection :: error:", err.message);
      sendStdout("\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8FDE\u6216\u68C0\u67E5\u4E3B\u673A\u5BC6\u7801\u662F\u5426\u6B63\u786E\uFF1A\n" + err.stack || err.message + "\n");
    }).on("close", () => {
      console.error("SSH Connection :: close:\n");
      sendStdout("SSH \u4F1A\u8BDD\u88AB\u5173\u95ED~");
    }).connect({
      host: this.sshConfig.host,
      port: this.sshConfig.port || 22,
      username: this.sshConfig.username,
      password: this.sshConfig.password
      // 或者使用privateKey
    });
  }
};
var terminal_default = TerminalWs;

// src/backend/server/app/ws.ts
var MicroWs = class {
  cfg;
  constructor() {
    this.cfg = config_default.getConfig("protocol");
    this.openStdin();
    this.openForwardWs();
  }
  async openStdin() {
    if (this.cfg.stdin.disabled == false && !/trss|Trss|TRSS/.test(botInfo.BOT_NAME)) {
      const Stdin = (await import("./Stdin-CFMVPNIJ.js")).default;
      Stdin();
    }
  }
  onOpen(ws, req) {
    if (req.url.startsWith("/micro/webui/chat")) {
      const screenchat = new chat_default(ws);
      screenchat.use(handleReplyMsg);
    } else if (req.url.startsWith("/micro/webui/term")) {
      new terminal_default(ws, req.url);
    } else if (req.url.startsWith("/micro/webui/stdout")) {
      new stdout_default(ws);
    } else if (req.url.startsWith(this.cfg.onebotv11.url)) {
      if (this.cfg.onebotv11.disabled == true) return logger.warn("\u8BE5\u534F\u8BAE\u5DF2\u7981\u7528\uFF0C\u8BF7\u5728\u914D\u7F6E\u4E2D\u6253\u5F00\uFF01");
      new OnebotV11_default(ws);
    } else {
      logger.warn(`\u4E0D\u652F\u6301\u8BE5\u8FDE\u63A5(${req.url})\uFF01\u8BF7\u534F\u8BAE\u7AEF\u68C0\u67E5ws\u8DEF\u5F84\u662F\u5426\u6B63\u786E\uFF01`);
      ws.close();
    }
  }
  onUpgrade(ws, req, socket, head) {
    ws.handleUpgrade(req, socket, head, (conn) => {
      conn.rid = `${req.socket.remoteAddress}:${req.socket.remotePort}-${req.headers["sec-websocket-key"]}`;
      conn.sid = `ws://${req.headers["x-forwarded-host"] || req.headers.host || `${req.socket.localAddress}:${req.socket.localPort}`}${req.url}`;
      stdlog_default.mark(`${conn.sid} <=> ${conn.rid}`, "\u5EFA\u7ACB\u8FDE\u63A5", req.headers);
      conn.on("error", (...args) => stdlog_default.error(`${conn.sid} <=> ${conn.rid}`, args));
      conn.on("close", () => stdlog_default.mark(`${conn.sid} <\u2260> ${conn.rid}`, "\u65AD\u5F00\u8FDE\u63A5"));
      conn.sendMsg = (msg) => {
        if (!Buffer.isBuffer(msg)) msg = tools_default.String(msg);
        stdlog_default.debug(`${conn.sid} => ${conn.rid}`, "\u6D88\u606F", msg);
        return conn.send(msg);
      };
    });
  }
  async openForwardWs() {
    if (this.cfg.onebotv11.disabled == false && this.cfg.onebotv11.address?.length > 0) {
      this.cfg.onebotv11.address.forEach((path2) => {
        const v11Ws = new WebSocket(path2);
        v11Ws.on("open", () => {
          new OnebotV11_default(v11Ws);
        });
      });
    }
  }
};

// src/backend/server/index.ts
import { WebSocketServer } from "ws";
var wss;
var microWs = new MicroWs();
var startServer = (port) => {
  wss = new WebSocketServer({ server: app_default });
  wss.on("connection", (ws, req) => {
    microWs.onOpen(ws, req);
  });
  return new Promise((resolve, reject) => {
    app_default.listen(port, async (err) => {
      if (err) {
        reject(err);
      } else {
        const { local, remote } = await getAllWebAddress();
        logger.info(chalk.cyanBright("------------------------"));
        logger.info(
          chalk.cyanBright(`\u5FAE\u4EE3\u7801\u5F00\u53D1\u670D\u52A1\u5668\u542F\u52A8\u6210\u529F\uFF01\u60A8\u53EF\u5C1D\u8BD5\u9009\u62E9\u8BBF\u95EE\u4EE5\u4E0B\u5730\u5740\u8FDB\u884C\u5F00\u53D1\u7BA1\u7406\uFF1A`)
        );
        logger.info(chalk.cyanBright(`\u516C\u7F51\u5730\u5740\uFF1A${remote[0]}`));
        logger.info(chalk.cyanBright(`\u5185\u7F51\u5730\u5740\uFF1A${local[0]}`));
        logger.info(chalk.cyanBright(`\u56DE\u73AF\u5730\u5740\uFF1Ahttp://127.0.0.1:${port}`));
        logger.info(chalk.cyanBright("------------------------"));
        if (!config_default.masterQQ || config_default.masterQQ.length == 0) {
          logger.mark("[Micro]\u672A\u627E\u5230\u4E3B\u4EBAQQ\uFF0C\u8BF7\u786E\u5B9A\u662F\u5426\u5DF2\u914D\u7F6E");
        }
        try {
          Bot && await Bot?.pickFriend(Number(config_default.masterQQ[0]))?.sendMsg(
            `\u5F00\u53D1\u670D\u52A1\u5668\u542F\u52A8\u6210\u529F\uFF0C\u60A8\u53EF\u6253\u5F00\u6D4F\u89C8\u5668\u8FDB\u5165\u4EE5\u4E0B\u5730\u5740\u5F00\u53D1\u7BA1\u7406\uFF1A
\u516C\u7F51\u5730\u5740\uFF1A${remote[0]}
\u5185\u7F51\u5730\u5740\uFF1A${local[0]}\u4F60\u4E5F\u53EF\u4EE5\u4E0B\u8F7DMicro Panel\u7684\u5B89\u5353APP\u6765\u5BF9\u673A\u5668\u4EBA\u8FDB\u884C\u7BA1\u7406Micro Panel\u4E0B\u8F7D\u5730\u5740\uFF1Ahttps://tianstudio.lanzoub.com/b004iib74j\uFF08\u5BC6\u7801\uFF1Amicro\uFF09`
          );
        } catch (error) {
          logger.mark("[Micro]" + error.message);
        }
        resolve("ok");
      }
    });
  });
};
var stopServer = () => {
  return new Promise((resolve, reject) => {
    if (wss) {
      wss.close((err) => {
        if (err) {
          reject(err);
        }
        if (app_default) {
          app_default.close((err2) => {
            if (err2) {
              reject(err2);
            }
            resolve("ok");
          });
        } else {
          resolve("ok");
        }
      });
    } else {
      resolve("ok");
    }
  });
};
var restartServer = async (port) => {
  await stopServer();
  await startServer(port);
};

// src/backend/apps.ts
var apps_exports = {};
__export(apps_exports, {
  RunPlugin: () => RunPlugin,
  Settings: () => Settings
});

// src/backend/apps/message.ts
import chokidar from "chokidar";
import schedule from "node-schedule";
import { copyFileSync as copyFileSync3, existsSync as existsSync6, mkdirSync as mkdirSync6, readFileSync as readFileSync5, rmSync as rmSync3, writeFileSync as writeFileSync3 } from "fs";
import { join as join11 } from "path";
var plugin = await Plugin();
var segment = await Segment();
var puppeteer2 = await Puppeteer();
var bot3 = await Bot2();
var loader2 = await Loader();
var indexPath = join11(pluginInfo.DATA_PATH, "regs.json");
var pluginsPath = join11(pluginInfo.DATA_PATH, "plugins");
var pluginsList = [];
var cronTask = {};
var isTrss = /trss|Trss|TRSS/.test(botInfo.BOT_NAME);
init();
var RunPlugin = class extends plugin {
  constructor() {
    super({
      name: "\u6D88\u606F\u5904\u7406",
      event: "message"
    });
    this.priority = 4e3;
    this.rule = [
      {
        reg: /小微指令列表(.*)/,
        fnc: "viewPluginsList"
      },
      {
        reg: /小微删除指令(.*)/,
        fnc: "deletePlugin",
        permission: "master"
      }
    ];
  }
  /**
   * 接收plugin事件
   * @param e
   * @returns
   */
  async accept(e) {
    if (!isTrss) return;
    await sendMessage(e);
  }
  /**
   * 存储插件列表
   * @param value 插件对象
   * @returns
   */
  async setPluginsList(value) {
    writeFileSync3(indexPath, JSON.stringify(value, null, 2), "utf-8");
  }
  /**
   * 查看指令列表
   * @returns
   */
  async viewPluginsList() {
    let pageNo = 1;
    if (!/小微指令列表(\d+)/.test(this.e.msg)) {
      pageNo = 1;
    } else {
      pageNo = Number(/.*小微指令列表(\d+)/.exec(this.e.msg)[1]);
    }
    const pluginList = JSON.parse(JSON.stringify(pluginsList));
    const pagerInstance = new Pager(pluginList, pageNo, 40);
    if (pagerInstance.records.length == 0) {
      this.e.reply("\u8D85\u51FA\u9875\u6570\u5566\uFF01");
    }
    const orderList = [];
    pagerInstance.records.forEach((plugin3, index) => {
      const msgType = plugin3.message.map((msg) => msg.type);
      const order = {
        id: index,
        reg: plugin3.reg,
        msgType: "[" + msgType.join(",") + "]",
        createTime: formatTime(plugin3.id)
      };
      orderList.push(order);
    });
    const img = await puppeteer2.screenshot("micro-plugin/orders", {
      saveId: "order",
      tplFile: join11(pluginInfo.PUBLIC_PATH, "html", "orders.html"),
      pluginInfo,
      botInfo,
      orderList
    });
    this.e.reply(img);
  }
  /**
   * 删除指令
   * @returns
   */
  async deletePlugin() {
    if (!/.*小微删除指令(\d+)/.test(this.e.msg)) {
      this.e.reply("\u8BF7\u53D1\u9001\u6709\u6548\u6307\u4EE4id\uFF01");
      return;
    }
    const pluginId = Number(/.*小微删除指令(\d+)/.exec(this.e.msg)[1]) || 0;
    if (pluginId >= pluginsList.length) {
      this.e.reply("\u4E0D\u5B58\u5728\u8BE5\u5E8F\u53F7\uFF0C\u5F53\u524D\u5171" + pluginsList.length + "\u6761\u6307\u4EE4\uFF01");
      return;
    }
    const pluginPath = join11(pluginsPath, pluginsList[pluginId].id);
    if (existsSync6(pluginPath)) {
      rmSync3(pluginPath, { recursive: true, force: true });
    }
    pluginsList.splice(pluginId, 1);
    this.setPluginsList(pluginsList);
    this.e.reply("\u5220\u9664\u6210\u529F\uFF01");
  }
};
function formatTime(timeStr) {
  const pattern = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/;
  const match = timeStr.match(pattern);
  if (match) {
    const [fullMatch, year, month, day, hour, minute, second] = match;
    const formattedTime = `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")} ${hour}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
    return formattedTime;
  } else {
    return timeStr;
  }
}
function getPluginsList() {
  return JSON.parse(readFileSync5(indexPath, "utf8"));
}
async function sendMessage(e = { taskId: "" }) {
  if (!e.message && !e.taskId) return false;
  let msg = "1145145141314521";
  if (e.message) {
    if (!e.msg) {
      msg = e.message.reduce((prev, next) => {
        if (next.type === "text") {
          return prev + next.text;
        }
      }, "");
    }
  }
  const msgQueue = [];
  const pluginList = JSON.parse(JSON.stringify(pluginsList));
  for (const plugin3 of pluginList) {
    if (!checkAuth(plugin3, e)) continue;
    const regexp = new RegExp(plugin3.reg, plugin3.flag);
    const pluginPath = join11(pluginsPath, plugin3.id);
    if (e.taskId == plugin3.id || regexp.test(e.msg ? e.msg : msg)) {
      const { message } = plugin3;
      const msgSegList = [];
      for (const item of message) {
        switch (item.type) {
          case "code":
            const codeString = readFileSync5(join11(pluginPath, item.hash + ".code.js"), "utf-8");
            const asyncCodeString = `
                            return (async () => { 
                                try {    
                                    ${codeString}       
                                } catch (error) {    
                                    throw error;    
                                }    
                            })()
                        `;
            const dynamicAsyncFunction = new Function(
              "e",
              "Bot",
              "segment",
              "puppeteer",
              "logger",
              "loader",
              asyncCodeString
            );
            try {
              const startTime = Date.now();
              await dynamicAsyncFunction(e, bot3, segment, puppeteer2, logger, loader2);
              const endTime = Date.now();
              logger.info(`[micro]\u6267\u884C[${plugin3.id}]\u4EE3\u7801\u6210\u529F\uFF0C\u8017\u65F6${endTime - startTime}ms!`);
            } catch (err) {
              logger.error(`[micro]\u6267\u884C[${plugin3.id}]\u4EE3\u7801\u51FA\u9519\uFF1A`);
              logger.error(err);
            }
            return;
          // 文本
          case "text":
            try {
              const compileText = new Function("e", "Bot", "return `" + item.data + "`");
              msgSegList.push({ type: "text", text: compileText(e, bot3) });
            } catch (err) {
              logger.error(err);
            }
            break;
          // 图片
          case "image":
            if (item.url) {
              msgSegList.push(segment.image(item.url));
            } else {
              const img = await puppeteer2.screenshot("micro-plugin/plugins", {
                saveId: item.hash,
                tplFile: join11(pluginPath, item.hash + ".html"),
                quality: 100,
                e,
                Bot: Bot2
              });
              msgSegList.push(img);
            }
            break;
          // 音频
          case "record":
            if (item.url) {
              msgSegList.push(segment.record(item.url));
            }
            break;
          // 视频
          case "video":
            if (item.url) {
              msgSegList.push({
                type: "video",
                file: await tools_default.Buffer(item.url, { http: true }),
                url: item.url
              });
            }
            break;
          // 表情
          case "face":
            msgSegList.push({ type: "face", id: Number(item.data) });
            break;
          // 骰子
          case "dice":
            msgSegList.push({ type: "dice", id: item.data });
            break;
          // 猜拳
          case "rps":
            msgSegList.push({ type: "rps", id: item.data });
            break;
          // 戳一戳(窗口抖动)
          case "poke":
            msgSegList.push({ type: "poke", id: Number(item.data) });
            break;
          // md
          case "markdown":
            const mdPath = join11(pluginPath, "markdown.json");
            if (existsSync6(mdPath)) {
              const mdContent = JSON.parse(readFileSync5(mdPath, "utf8"));
              if (mdContent.content != "") {
                delete mdContent.params;
                msgSegList.push({ type: "markdown", content: mdContent });
              } else {
                delete mdContent.content;
                mdContent.params = mdContent.params.map((item2) => {
                  delete item2.tempString;
                  return item2;
                });
                msgSegList.push({ type: "markdown", content: mdContent, params: mdContent.params });
              }
            }
            break;
          // 按钮
          case "button":
            if (existsSync6(join11(pluginPath, "button.json"))) {
              const btnContent = JSON.parse(readFileSync5(join11(pluginPath, "button.json"), "utf8"));
              msgSegList.push({ type: "button", content: btnContent });
            }
            break;
          default:
            logger.warn("\u6682\u4E0D\u652F\u6301\u8BE5\u6D88\u606F\u7C7B\u578B\uFF01");
        }
      }
      msgQueue.push(Object.assign(plugin3, { message: msgSegList }));
    }
  }
  if (msgQueue.length == 0) return false;
  const sendMsgs = async (e2, msg2) => {
    if (e2.reply) {
      await e2.reply(msg2.message, msg2.isQuote, { at: msg2.isAt });
    } else {
      if (e2.taskId) {
        if (msg2.isGlobal === false) {
          const bots = [];
          for (const key in bot3) {
            if (bot3[key]?.pickGroup || bot3[key]?.pickFriend) {
              bots.push(key);
            }
          }
          for (const bot_id of bots) {
            try {
              for (const g_id of msg2.groups) {
                await bot3[bot_id].pickGroup(g_id).sendMsg(msg2.message);
              }
              for (const f_id of msg2.friends) {
                await bot3[bot_id].pickFriend(f_id).sendMsg(msg2.message);
              }
            } catch (err) {
              logger.mark(`[Micro\u5B9A\u65F6\u4EFB\u52A1][${bot_id}]${err.message}`);
            }
          }
        }
      } else {
        if (e2.group_id) {
          await bot3[e2.self_id].pickGroup(e2.group_id).sendMsg(msg2.message);
        } else {
          await bot3[e2.self_id].pickFriend(e2.user_id).sendMsg(msg2.message);
        }
      }
    }
  };
  for (const msg2 of msgQueue) {
    if (msg2.delayTime) {
      if (typeof msg2.delayTime != "number") {
        msg2.delayTime = Number(msg2.delayTime);
      }
      setTimeout(async () => {
        await sendMsgs(e, msg2);
      }, msg2.delayTime);
    } else {
      await sendMsgs(e, msg2);
    }
  }
  return true;
}
function checkAuth(plugin3, e) {
  if (plugin3.reg == "" && plugin3.cron == "") return false;
  if (plugin3.isGlobal) {
    if (e.group_id) {
      if (plugin3.groups.includes(String(e.group_id))) return false;
    } else {
      if (plugin3.friends.includes(String(e.user_id))) return false;
    }
  } else {
    if (e.group_id) {
      if (!plugin3.groups.includes(String(e.group_id))) return false;
    } else if (e.user_id) {
      if (!plugin3.friends.includes(String(e.user_id))) return false;
    } else if (e.taskId) {
      return true;
    }
  }
  return true;
}
async function init() {
  if (!existsSync6(pluginsPath)) {
    mkdirSync6(pluginsPath, { recursive: true });
  }
  if (!existsSync6(indexPath)) {
    const defaultRegsPath = join11(pluginInfo.PUBLIC_PATH, "help", "regs.json");
    copyFileSync3(defaultRegsPath, indexPath);
    copyDirectory(
      join11(pluginInfo.PUBLIC_PATH, "help", "micro-help"),
      join11(pluginsPath, "micro-help")
    );
  }
  pluginsList = getPluginsList() || [];
  if (!isTrss) {
    bot3.on?.("message", async (e) => {
      await sendMessage(e);
    });
  }
  pluginsList.forEach((plugin3) => {
    if (plugin3 && plugin3?.cron) {
      cronTask[plugin3.id] = schedule.scheduleJob(plugin3.cron, async () => {
        try {
          logger.mark(`\u6267\u884C\u5B9A\u65F6\u4EFB\u52A1\uFF1A${plugin3.id}`);
          await sendMessage({ taskId: plugin3.id });
        } catch (error) {
          logger.error(
            `\u5B9A\u65F6\u4EFB\u52A1\u62A5\u9519\uFF1A
\u4EFB\u52A1Id: ${plugin3.id}
\u6B63\u5219\u8868\u8FBE\u5F0F\uFF1A${plugin3.reg}
cron\u8868\u8FBE\u5F0F\uFF1A${plugin3.reg}
\u63A8\u9001\u7FA4\uFF1A${plugin3.groups.toString()}
\u63A8\u9001\u597D\u53CB\uFF1A${plugin3.friends.toString()}`
          );
          logger.error(error);
        }
      });
    }
  });
  const watcher = chokidar.watch(indexPath);
  watcher.on("change", () => {
    pluginsList = getPluginsList();
    logger.mark(`[Micro][\u66F4\u6539\u6307\u4EE4\u5217\u8868][\u5F53\u524D${pluginsList.length}\u6761\u6307\u4EE4]`);
    Object.keys(cronTask).forEach((key) => {
      cronTask[key].cancel();
      delete cronTask[key];
    });
    pluginsList.forEach((plugin3) => {
      if (plugin3 && plugin3?.cron) {
        cronTask[plugin3.id] = schedule.scheduleJob(plugin3.cron, async () => {
          try {
            logger.mark(`\u6267\u884C\u5B9A\u65F6\u4EFB\u52A1\uFF1A${plugin3.id}`);
            await sendMessage({ taskId: plugin3.id });
          } catch (error) {
            logger.error(
              `\u5B9A\u65F6\u4EFB\u52A1\u62A5\u9519\uFF1A
\u4EFB\u52A1Id: ${plugin3.id}
\u6B63\u5219\u8868\u8FBE\u5F0F\uFF1A${plugin3.reg}
cron\u8868\u8FBE\u5F0F\uFF1A${plugin3.reg}
\u63A8\u9001\u7FA4\uFF1A${plugin3.groups.toString()}
\u63A8\u9001\u597D\u53CB\uFF1A${plugin3.friends.toString()}`
            );
            logger.error(error);
          }
        });
      }
    });
  });
}

// src/backend/apps/settings.ts
var plugin2 = await Plugin();
var Settings = class extends plugin2 {
  constructor() {
    super({
      name: "\u8BBE\u7F6E",
      event: "message"
    });
    this.priority = 500;
    this.rule = [
      {
        reg: /小微(开启|关闭)std/,
        fnc: "switchStdin",
        permission: "master"
      },
      {
        reg: /小微设置面板Ip(.*)/,
        fnc: "setWebIp",
        permission: "master"
      },
      {
        reg: /小微设置面板端口(.*)/,
        fnc: "setWebPort",
        permission: "master"
      },
      {
        reg: /小微开启面板服务/,
        fnc: "startWeb",
        permission: "master"
      },
      {
        reg: /小微关闭面板服务/,
        fnc: "closeWeb",
        permission: "master"
      },
      {
        reg: /小微重启面板服务/,
        fnc: "reStartWeb",
        permission: "master"
      }
    ];
  }
  async switchStdin() {
    if (/小微开启std/.test(this.e.msg)) {
      config_default.setConfig(false, ["stdin", "disabled"], "protocol");
      this.e.reply("\u5F00\u542F\u6210\u529F\uFF0C\u91CD\u542F\u540E\u751F\u6548\uFF01");
    } else if (/小微关闭std/.test(this.e.msg)) {
      config_default.setConfig(true, ["stdin", "disabled"], "protocol");
      this.e.reply("\u5173\u95ED\u6210\u529F\uFF0C\u91CD\u542F\u540E\u751F\u6548\uFF01");
    }
  }
  async setWebIp() {
    let ip = "";
    ip = this.e.msg.replace(/.*小微设置面板Ip/, "");
    if (ip == "") {
      this.e.reply("\u8BF7\u52A0\u4E0AIP\u5730\u5740");
      return;
    }
    try {
      config_default.setConfig(ip, ["server", "host"], "server");
      this.e.reply("\u8BBE\u7F6E\u6210\u529F\uFF0C\u66F4\u65B0\u4E3A" + ip);
    } catch (err) {
      this.e.reply(JSON.stringify(err));
    }
  }
  async setWebPort() {
    let port = 23306;
    if (/小微设置面板端口(\d+)/.test(this.e.msg)) {
      port = Number(this.e.msg.replace(/.*小微设置面板端口/, ""));
      if (port < 5e3 || port > 65535) {
        this.e.reply("\u8303\u56F4\u8BF7\u9009\u62E9\u30105000~65535\u3011");
        return;
      }
    } else {
      this.e.reply("\u8303\u56F4\u8BF7\u9009\u62E9\u30105000~65535\u3011");
      return;
    }
    try {
      config_default.setConfig(port, ["server", "port"], "server");
      this.e.reply("\u7AEF\u53E3\u53F7\u8BBE\u7F6E\u6210\u529F\uFF0C\u66F4\u65B0\u4E3A" + port);
    } catch (err) {
      this.e.reply(JSON.stringify(err));
    }
  }
  async startWeb() {
    try {
      const port = config_default.getConfig("server").server.port;
      await startServer(port);
      this.e.reply("\u5C0F\u5FAE\u63D2\u4EF6\u9762\u677F\u670D\u52A1\u542F\u52A8\u6210\u529F\uFF01");
    } catch (err) {
      this.e.reply(JSON.stringify(err));
    }
  }
  async reStartWeb() {
    try {
      this.e.reply("\u5F00\u59CB\u91CD\u542F\u9762\u677F\u8BF7\u7A0D\u7B49...");
      const port = config_default.getConfig("server").server.port;
      const startDate = Date.now();
      await restartServer(port);
      this.e.reply("\u5C0F\u5FAE\u63D2\u4EF6\u9762\u677F\u670D\u52A1\u91CD\u542F\u6210\u529F\uFF01\u8017\u65F6" + (Date.now() - startDate) + "ms");
    } catch (err) {
      this.e.reply(JSON.stringify(err));
    }
  }
  async closeWeb() {
    try {
      await stopServer();
      this.e.reply("\u5C0F\u5FAE\u63D2\u4EF6\u9762\u677F\u670D\u52A1\u5173\u95ED\u6210\u529F\uFF01");
    } catch (err) {
      this.e.reply(JSON.stringify(err));
    }
  }
};

// src/backend/index.ts
var startMicro = async () => {
  const logger4 = await Logger();
  const { PLUGIN_NAME, PLUGIN_AUTHOR, PLUGIN_DESC, PLUGIN_VERSION } = pluginInfo;
  const Port = config_default.getConfig("server").server.port;
  logger4.info(chalk2.cyanBright("-------Welcome\u200B~(\u2220\u30FB\u03C9< )\u2312\u2606\u200B-------"));
  logger4.info(`${PLUGIN_NAME} & v${PLUGIN_VERSION} \u521D\u59CB\u5316...`);
  logger4.info(`${PLUGIN_DESC}`);
  logger4.info("bug\u79EF\u7D2F\u4E2D...\u545C\u545C\u51FA\u9519\u5220\u6389\u4E0D\u8981\u9A82\u6211(\u02F5\xAF\u0352\u3030\xAF\u0352\u02F5)");
  logger4.info(`Created By ${PLUGIN_AUTHOR}`);
  logger4.info(`\u611F\u8C22\u6296M\u5929\u624D\u5A01\u73A9\u6E38\u620F\u63D0\u4F9B\u7684Micro Panel\u5B89\u5353APP`);
  logger4.info(chalk2.cyanBright("-----------------------------------"));
  startServer(Port);
  return apps_exports;
};
export {
  startMicro
};
