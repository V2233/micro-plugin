import { createRequire } from "module"
import moment from "moment"
import { formatDuration } from "#utils"
const require = createRequire(import.meta.url)
import { Redis } from "#bot"

const redis = await Redis()

export default async function getBotInfo(selfId: number) {
  const botList = _getBotList(selfId);
  const dataPromises = botList.map(async (i) => {
      let bot = Bot[i];
      if(!bot) bot = {}
      if(bot?.uin == 88888 || i == 88888) bot.uin = selfId
      const nickname = bot?.nickname || bot?.uin || i
      const status = bot?.status || 11;
      const apk = bot?.apk;
      const version = bot?.version;
      const avatarUrl = bot?.avatar ?? (Number(bot?.uin) ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot?.uin}` : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot?.self_id}`);
      const verKey = "version";
      const platform = apk
          ? `${apk.display} v${apk[verKey]}`
          : version?.version ?? "未知";
      const messageCount = await getMessageCount(bot);
      const countContacts = getCountContacts(bot);
      const botRunTime = formatDuration(Date.now() / 1000 - bot?.stat?.start_time, "dd天hh:mm:ss", true);
      const botVersion = version
          ? `${version.name}${apk ? ` ${version.version}` : ""}`
          : `ICQQ v${require("icqq/package.json").version}`;
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
  return Promise.all(dataPromises)
}

async function getMessageCount(bot) {
  const nowDate = moment().format("MMDD")
  const keys = [
    `Yz:count:send:msg:bot:${bot?.uin}:total`,
    `Yz:count:receive:msg:bot:${bot?.uin}:total`,
    `Yz:count:send:image:bot:${bot?.uin}:total`,
    `Yz:count:screenshot:day:${nowDate}`
  ]

  const values = await redis.mGet(keys) || []

  const sent = values[0] || bot?.stat?.sent_msg_cnt || 0
  const recv = values[1] || bot?.stat?.recv_msg_cnt || 0
  const screenshot = values[2] || values[3] || 0

  return {
    sent,
    recv,
    screenshot
  }
}

function getCountContacts(bot) {
  const friend = bot?.fl?.size || 0
  const group = bot?.gl?.size || 0
  const groupMember = Array.from(bot?.gml?.values() || []).reduce((acc, curr: any) => acc + curr.size, 0)
  return {
    friend,
    group,
    groupMember
  }
}

function _getBotList(selfId:number) {
  /** bot列表 */
  let BotList = [selfId];

  if (Bot?.adapter) {
      BotList = Bot.adapter;
      // if (selfId && !Bot.adapter.includes(selfId)) {
      //     BotList.push(selfId)
      // } 
  }
  return BotList
}
