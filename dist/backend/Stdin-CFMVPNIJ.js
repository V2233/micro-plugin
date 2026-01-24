import {
  config_default,
  pluginInfo,
  stdlog_default
} from "./chunk-4A22Q7QC.js";

// src/backend/server/app/adapter/common/index.ts
import crypto from "crypto";
import fs from "fs";
import get_urls from "get-urls";
import fetch2 from "node-fetch";
import { dirname, join } from "path";
if (!Bot?.adapter) {
  Bot.adapter = Bot.uin ? [Bot.uin] : [];
} else {
  if (!Bot.adapter.includes(Bot.uin)) {
    Bot.adapter.push(Bot.uin);
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function init(key = "micro:restart") {
  let restart = await redis.get(key);
  if (!restart) return;
  redis.del(key);
  restart = JSON.parse(restart);
  const uin2 = restart?.uin || Bot.uin;
  const time = (Date.now() - (restart.time || Date.now())) / 1e3;
  const msgId = restart?.msg_id || false;
  const restartMsg = `\u91CD\u542F\u6210\u529F\uFF1A\u8017\u65F6${time.toFixed(2)}\u79D2`;
  let msg2;
  if (restart?.adapter === "QQBot" && msgId) msg2 = [{ type: "reply", id: msgId }, restartMsg];
  try {
    if (restart.isGroup) {
      Bot[uin2].pickGroup(restart.id, msgId).sendMsg(msg2);
    } else {
      Bot[uin2].pickUser(restart.id).sendMsg(msg2);
    }
  } catch (error) {
  }
}
function array(data) {
  let msg2 = [];
  if (typeof data === "object" && data?.test && data?.data?.type === "test") return data.message;
  if (data?.[0]?.data?.type === "test" || data?.[1]?.data?.type === "test") {
    msg2.push(...data?.[0].msg || data?.[1]?.msg);
  } else if (data?.data?.type === "test") {
    msg2.push(...data.msg);
  } else if (Array.isArray(data)) {
    msg2 = [].concat(
      ...data.map(
        (i) => typeof i === "string" ? [{ type: "text", text: i }] : Array.isArray(i) ? [].concat(
          ...i.map(
            (format) => typeof format === "string" ? [{ type: "text", text: format }] : typeof format === "object" && format !== null ? [format] : []
          )
        ) : typeof i === "object" && i !== null ? [i] : []
      )
    );
  } else if (data instanceof fs.ReadStream) {
    if (fs.existsSync(data.file.path)) {
      msg2.push({ type: "image", file: `file://${data.file.path}` });
    } else {
      msg2.push({ type: "image", file: `file://./${data.file.path}` });
    }
  } else if (data instanceof Uint8Array) {
    msg2.push({ type: "image", file: data });
  } else if (typeof data === "object") {
    msg2.push(data);
  } else {
    msg2.push({ type: "text", text: data });
  }
  return msg2;
}
async function makeForwardMsg(data, node = false, e = {}) {
  const message = { type: "forward" };
  const allMsg = [];
  if (!Array.isArray(data)) data = [data];
  for (let i = 0; i < data.length; i++) {
    const msg2 = data[i].message;
    if (typeof msg2 === "object" && (msg2?.data?.type === "test" || msg2?.type === "xml")) {
      data.splice(i, 1, ...msg2.msg);
      i--;
    }
  }
  for (let msg2 in data) {
    msg2 = data[msg2]?.message || data[msg2];
    if (!msg2 && msg2?.type) continue;
    if (Array.isArray(msg2)) {
      msg2.forEach((i) => {
        if (typeof i === "string") {
          allMsg.push("\n" + i.trim());
        } else {
          allMsg.push(i);
        }
      });
    } else if (typeof msg2 === "object" && /^#.*日志$/.test(e?.msg?.content)) {
      if (msg2) {
        const splitMsg = msg2.split("\n").map((i) => {
          if (!i || i.trim() === "") return {};
          return "\n" + i.substring(0, 500).trim();
        });
        allMsg.push(...splitMsg.slice(0, 50));
      }
    } else if (typeof msg2 === "object") {
      allMsg.push(msg2);
    } else if (typeof msg2 === "string") {
      allMsg.push("\n" + msg2);
    } else {
      stdlog_default.warn("", "\u672A\u517C\u5BB9\u7684\u5B57\u6BB5\uFF1A", msg2);
    }
  }
  if (node)
    allMsg.forEach((i) => {
      i.node = true;
    });
  message.text = Array.from(new Set(allMsg.map((item) => JSON.stringify(item)))).map(
    (item) => JSON.parse(item)
  );
  message.data = {
    type: "forward",
    text: "text",
    app: "com.tencent.multimsg",
    meta: { detail: { news: [{ text: "1" }] }, resid: "", uniseq: "", summary: "" }
  };
  return message;
}
async function base64(path2) {
  let file = path2;
  try {
    if (!fs.existsSync(file)) {
      file = file.replace(/^file:\/\//, "");
      if (!fs.existsSync(file)) {
        file = path2.replace(/^file:\/\/\//, "");
        if (!fs.existsSync(file)) return;
      }
    }
    return fs.readFileSync(file, { encoding: "base64" });
  } catch (err) {
  }
}
async function uploadQQ(file, uin2 = Bot.uin) {
  let base642;
  if (Buffer.isBuffer(file)) {
    base642 = file.toString("base64");
  } else if (file.startsWith("file://")) {
    base642 = fs.readFileSync(file.slice(7)).toString("base64");
  } else if (!file.startsWith("base64://") && fs.existsSync(file)) {
    base642 = fs.readFileSync(file).toString("base64");
  } else if (file.startsWith("base64://")) {
    base642 = file.slice(9);
  } else {
    throw new Error("\u4E0A\u4F20\u5931\u8D25\uFF0C\u672A\u77E5\u683C\u5F0F\u7684\u6587\u4EF6");
  }
  try {
    const { message_id: message_id2 } = await Bot[uin2].pickUser(uin2).sendMsg([segment.image(`base64://${base642}`)]);
    await Bot[uin2].pickUser(uin2).recallMsg(message_id2);
  } catch {
  }
  const md5 = crypto.createHash("md5").update(Buffer.from(base642, "base64")).digest("hex");
  return `https://gchat.qpic.cn/gchatpic_new/0/0-0-${md5.toUpperCase()}/0?term=2&is_origin=0`;
}
function getUrls(url, exclude = []) {
  let urls = [];
  url = url.replace(/[\u4e00-\u9fa5]/g, "|");
  try {
    urls = [
      ...get_urls(url, {
        exclude,
        /** 去除 WWW */
        stripWWW: false,
        /** 规范化协议 */
        normalizeProtocol: false,
        /** 移除查询参数 */
        removeQueryParameters: false,
        /** 移除唯一斜杠 */
        removeSingleSlash: false,
        /** 查询参数排序 */
        sortQueryParameters: false,
        /** 去除认证信息 */
        stripAuthentication: false,
        /** 去除文本片段 */
        stripTextFragment: false,
        /** 移除末尾斜杠 */
        removeTrailingSlash: false
      })
    ];
  } catch {
    stdlog_default.info("Micro-plugin", "\u6CA1\u6709\u5B89\u88C5 get-urls \u6A21\u5757\uFF0C\u5EFA\u8BAE\u6267\u884Cpnpm install");
    const urlRegex = /(https?:\/\/)?(([0-9a-z.-]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_#]*)?(\?[0-9a-z=&%_\-.]*)?(\\#[0-9a-z=&%_\\-]*)?/gi;
    urls = url.match(urlRegex);
    if (!urls) urls = [];
    return urls;
  }
  return urls;
}
function message_id() {
  return Buffer.from(Date.now().toString()).toString("base64");
}
function mkdirs(dirname2) {
  if (fs.existsSync(dirname2)) {
    return true;
  } else {
    if (mkdirs(dirname2(dirname2))) {
      fs.mkdirSync(dirname2);
      return true;
    }
  }
}
async function downloadFile(url, destPath, headers = {}, absolute = false) {
  const response = await fetch2(url, { headers });
  if (!response.ok) {
    throw new Error(`download file http error: status: ${response.status}`);
  }
  let dest = destPath;
  if (!absolute) {
    dest = join(pluginInfo.DATA_PATH, dest);
    const lastLevelDirPath = dirname(dest);
    mkdirs(lastLevelDirPath);
  }
  const fileStream = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve("ok");
    });
  });
  stdlog_default.info("", `File downloaded successfully! URL: ${url}, Destination: ${dest}`);
  return dest;
}
function getFile(i) {
  if (i?.url) {
    if (i?.url?.includes("gchat.qpic.cn") && !i?.url?.startsWith("https://")) {
      i = "https://" + i.url;
    } else {
      i = i.url;
    }
  } else if (typeof i === "object") {
    i = i.file;
  }
  let file;
  let type = "file";
  if (i?.type === "Buffer") {
    type = "buffer";
    file = Buffer.from(i?.data);
  } else if (i?.type === "Buffer" || i instanceof Uint8Array || Buffer.isBuffer(i?.data || i)) {
    type = "buffer";
    file = i?.data || i;
  } else if (i instanceof fs.ReadStream || i?.path) {
    if (fs.existsSync(i.path)) {
      file = `file://${i.path}`;
    } else {
      file = `file://./${i.path}`;
    }
  } else if (typeof i === "string") {
    if (fs.existsSync(i.replace(/^file:\/\//, ""))) {
      file = i;
    } else if (fs.existsSync(i.replace(/^file:\/\/\//, ""))) {
      file = i.replace(/^file:\/\/\//, "file://");
    } else if (fs.existsSync(i)) {
      file = `file://${i}`;
    } else if (/^base64:\/\//.test(i)) {
      type = "base64";
      file = i;
    } else if (/^http(s)?:\/\//.test(i)) {
      type = "http";
      file = i;
    } else {
      stdlog_default.info("Micro-ws", "\u672A\u77E5\u683C\u5F0F\uFF0C\u65E0\u6CD5\u5904\u7406\uFF1A", i);
      type = "error";
      file = i;
    }
  } else {
    stdlog_default.info("Micro-ws", "\u672A\u77E5\u683C\u5F0F\uFF0C\u65E0\u6CD5\u5904\u7406\uFF1A", i);
    type = "error";
    file = i;
  }
  return { type, file };
}
async function recvMsg(id, adapter, read = false) {
  const key = `micro:recvMsg:${adapter}:${id}`;
  if (read) {
    const msg2 = await redis.get(key);
    return msg2 || 0;
  }
  await redis.incr(key);
}
async function MsgTotal(id, adapter, type = "text", read = false) {
  const key = `micro:sendMsg:${adapter}:${id}:${type === "text" ? "text" : "image"}`;
  if (read) {
    const msg2 = await redis.get(key);
    return msg2 || 0;
  }
  await redis.incr(key);
}
function limitString(str, maxLength, addDots = true) {
  if (str.length <= maxLength) {
    return str;
  } else {
    if (addDots) {
      return str.slice(0, maxLength) + "...";
    } else {
      return str.slice(0, maxLength);
    }
  }
}
var common_default = {
  sleep,
  array,
  makeForwardMsg,
  base64,
  uploadQQ,
  getUrls,
  init,
  message_id,
  downloadFile,
  mkdirs,
  getFile,
  recvMsg,
  MsgTotal,
  limitString
};

// src/backend/server/app/adapter/protocol/Stdin/index.js
import { fileTypeFromBuffer } from "file-type";
import _ from "lodash";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { basename, join as join2 } from "path";
import { createInterface } from "readline";
var { uin, user_id, avatar, name } = config_default.getConfig("protocol").stdin;
var path = join2(pluginInfo.DATA_PATH, "stdin");
if (!existsSync(path)) {
  mkdirSync(path, { recursive: true });
}
async function Stdin() {
  const version = "0.0.1";
  Bot[uin] = {
    adapter: "stdin",
    fl: /* @__PURE__ */ new Map(),
    gl: /* @__PURE__ */ new Map(),
    gml: /* @__PURE__ */ new Map(),
    tl: /* @__PURE__ */ new Map(),
    guilds: /* @__PURE__ */ new Map(),
    id: uin,
    uin,
    name,
    nickname: name,
    avatar,
    stat: { start_time: Math.round(Date.now() / 1e3), recv_msg_cnt: 0 },
    version: {
      app_name: name,
      app_version: version,
      protocol_version: "v1",
      nt_protocol: "Terminal",
      id: uin,
      name,
      version: "v" + version
    },
    apk: {
      display: name,
      version
    },
    makeForwardMsg: (msg2) => {
      return { type: "node", data: msg2 };
    },
    pickUser: () => {
      return {
        user_id,
        nickname: name,
        sendMsg: (msg2) => sendMsg(msg2),
        recallMsg: (msg_id) => stdlog_default.info(uin, `\u64A4\u56DE\u6D88\u606F\uFF1A${msg_id}`),
        makeForwardMsg: (msg2) => {
          return { type: "node", data: msg2 };
        },
        sendForwardMsg,
        sendFile: (file, name2) => sendFile(file, name2)
      };
    },
    pickFriend: () => {
      return {
        user_id,
        nickname: name,
        sendMsg: (msg2) => sendMsg(msg2),
        recallMsg: (msg_id) => stdlog_default.info(uin, `\u64A4\u56DE\u6D88\u606F\uFF1A${msg_id}`),
        makeForwardMsg: (msg2) => {
          return { type: "node", data: msg2 };
        },
        sendForwardMsg,
        sendFile: (file, name2) => sendFile(file, name2)
      };
    },
    pickGroup: () => {
      return {
        user_id,
        nickname: name,
        sendMsg: (msg2) => sendMsg(msg2),
        recallMsg: (msg_id) => stdlog_default.info(uin, `\u64A4\u56DE\u6D88\u606F\uFF1A${msg_id}`),
        makeForwardMsg: (msg2) => {
          return { type: "node", data: msg2 };
        },
        sendForwardMsg,
        sendFile: (file, name2) => sendFile(file, name2)
      };
    },
    mockTextMsgEvent: (text) => {
      stdlog_default.info(`${uin}: <=`, `${text}`);
      const data = msg(text);
      Bot[uin].stat.recv_msg_cnt++;
      Bot.emit("message", data);
    },
    sendMsg
  };
  if (!Bot.adapter.includes(uin)) Bot.adapter.unshift(uin);
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("SIGINT", () => {
    rl.close();
    process.exit();
  });
  rl.on("close", () => process.exit());
  rl.on("line", async (input) => {
    input = input.trim();
    stdlog_default.info(`${uin}: <=`, `${input}`);
    if (!input) return false;
    const data = msg(input);
    Bot[uin].stat.recv_msg_cnt++;
    Bot.emit("message", data);
  });
  stdlog_default.info("Micro-Std", "\u6807\u51C6\u8F93\u5165\u8F93\u51FA\u52A0\u8F7D\u5B8C\u6BD5\uFF0C\u5982\u9700\u5173\u95ED\u6B64\u9879\uFF0C\u8BF7\u8F93\u5165\u3010\u5C0F\u5FAE\u5173\u95EDstd\u3011\u540E\u91CD\u542F");
}
async function makeBuffer(file) {
  if (Buffer.isBuffer(file)) return file;
  if (file.match(/^base64:\/\//)) {
    return Buffer.from(file.replace(/^base64:\/\//, ""), "base64");
  } else if (file.match(/^https?:\/\//)) {
    return Buffer.from(await (await fetch(file)).arrayBuffer());
  } else if (existsSync(file)) {
    return Buffer.from(readFileSync(file));
  }
  return file;
}
async function fileType(data) {
  const file = {
    url: "",
    buffer: Buffer.alloc(0),
    type: {
      ext: "jpg",
      mime: "image/jpeg"
    },
    path: ""
  };
  try {
    if (Buffer.isBuffer(data)) {
      file.url = "Buffer";
      file.buffer = data;
    } else {
      file.url = _.truncate(data, { length: 100 }) || "Buffer";
      file.buffer = await makeBuffer(data);
    }
    file.type = await fileTypeFromBuffer(file.buffer);
    file.path = join2(path, `${Date.now()}.${file.type.ext}`);
  } catch (err) {
    stdlog_default.error(uin, `\u6587\u4EF6\u7C7B\u578B\u68C0\u6D4B\u9519\u8BEF\uFF1A${logger.red(err)}`);
  }
  return file;
}
function msg(msg2) {
  const time = Math.round(Date.now() / 1e3);
  const e = {
    adapter: "stdin",
    bot: Bot[uin],
    message_id: common_default.message_id(),
    message_type: "private",
    post_type: "message",
    self_id: uin,
    seq: 888,
    time,
    uin,
    user_id,
    message: [{ type: "text", text: msg2 }],
    raw_message: msg2,
    isMaster: true,
    toString: () => msg2
  };
  e.sender = {
    sub_id: user_id,
    age: 1,
    sex: "unknown",
    level: 100,
    area: "\u55B5\u54AA\u55B5",
    card: name,
    nickname: name,
    user_id,
    title: "",
    role: "member"
  };
  const member = {
    info: {
      user_id,
      nickname: name,
      last_sent_time: time
    },
    getAvatarUrl: () => Bot[uin].avatar
  };
  e.member = member;
  e.friend = {
    user_id,
    nickname: name,
    sendMsg: (msg3) => sendMsg(msg3),
    recallMsg: (msg_id) => stdlog_default.info(uin, `\u64A4\u56DE\u6D88\u606F\uFF1A${msg_id}`),
    makeForwardMsg: (msg3) => {
      return { type: "node", data: msg3 };
    },
    sendForwardMsg,
    sendFile: (file, name2) => sendFile(file, name2)
  };
  e.recall = async (msg_id) => {
    return stdlog_default.info(uin, `\u64A4\u56DE\u6D88\u606F\uFF1A${msg_id}`);
  };
  e.reply = async (reply) => {
    return await sendMsg(reply);
  };
  try {
    common_default.recvMsg(e.self_id, e.adapter);
  } catch {
  }
  return e;
}
async function sendMsg(msg2) {
  if (!Array.isArray(msg2)) msg2 = [msg2];
  for (let i of msg2) {
    if (typeof i != "object") {
      i = { type: "text", data: { text: i } };
    } else if (!i.data) {
      i = { type: i.type, data: { ...i, type: void 0 } };
    }
    let file;
    if (i.data.file) {
      file = await fileType(i.data.file);
    }
    const symbol = uin + ": =>";
    switch (i.type) {
      case "text":
        i.data.text = String(i.data.text).trim();
        if (!i.data.text) break;
        if (i.data.text.match("\n")) {
          i.data.text = `
${i.data.text}`;
        }
        stdlog_default.info(symbol + " text>", `${i.data.text}`);
        break;
      case "image":
        stdlog_default.info(symbol + " image>", `${file.url}
\u6587\u4EF6\u5DF2\u4FDD\u5B58\u5230\uFF1A${logger.cyan(file.path)}`);
        writeFileSync(file.path, file.buffer);
        break;
      case "record":
        stdlog_default.info(symbol + " record>", `${file.url}
\u6587\u4EF6\u5DF2\u4FDD\u5B58\u5230\uFF1A${logger.cyan(file.path)}`);
        writeFileSync(file.path, file.buffer);
        break;
      case "video":
        stdlog_default.info(symbol + " video>", `${file.url}
\u6587\u4EF6\u5DF2\u4FDD\u5B58\u5230\uFF1A${logger.cyan(file.path)}`);
        writeFileSync(file.path, file.buffer);
        break;
      case "reply":
        break;
      case "at":
        break;
      case "node":
        sendForwardMsg(i.data);
        break;
      default:
        if (!Array.isArray(i?.data) || Object.keys(i.data).length === 0) break;
        i = JSON.stringify(i);
        if (i.match("\n")) i = `
${i}`;
        stdlog_default.info(symbol, `${i}`);
    }
  }
  try {
    await common_default.MsgTotal(this.id, "stdin");
  } catch {
  }
  return { message_id: common_default.message_id() };
}
async function sendFile(file, name2 = basename(file)) {
  const buffer = await makeBuffer(file);
  if (!Buffer.isBuffer(buffer)) {
    stdlog_default.error(uin, `\u53D1\u9001\u6587\u4EF6\u9519\u8BEF\uFF1A\u627E\u4E0D\u5230\u6587\u4EF6 ${logger.red(file)}`);
    return false;
  }
  const files = `${path}${Date.now()}-${name2}`;
  stdlog_default.info(uin, `\u53D1\u9001\u6587\u4EF6\uFF1A${file}
\u6587\u4EF6\u5DF2\u4FDD\u5B58\u5230\uFF1A${logger.cyan(files)}`);
  return writeFileSync(files, buffer);
}
function sendForwardMsg(msg2) {
  const messages = [];
  for (const { message } of msg2) {
    messages.push(sendMsg(message));
  }
  return { data: messages };
}
export {
  Stdin as default
};
