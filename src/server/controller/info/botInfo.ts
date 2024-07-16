import { createRequire } from "module"
import moment from "moment"
import { formatDuration } from "#utils"
const require = createRequire(import.meta.url)
import { Bot, Redis } from "#bot"

const robot = await Bot()
const redis = await Redis()

export default async function getBotInfo(selfId: number) {
  const botList = _getBotList(selfId)
  const dataPromises = botList.map(async (i) => {
    const bot = robot[i]
    if (!bot?.uin) return false

    const { nickname = "未知", status = 11, apk, version } = bot

    // 头像
    const avatarUrl = bot.avatar ?? (Number(bot.uin) ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot.uin}` : "default")

    const verKey = "version"
    const platform = apk
      ? `${apk.display} v${apk[verKey]}`
      : version?.version ?? "未知"

    const messageCount = await getMessageCount(bot)

    const countContacts = getCountContacts(bot)

    const botRunTime = formatDuration(Date.now() / 1000 - bot.stat?.start_time, "dd天hh:mm:ss", true)

    const botVersion = version
      ? `${version.name}${apk ? ` ${version.version}` : ""}`
      : `ICQQ v${require("icqq/package.json").version}`

    return {
      avatarUrl,
      nickname,
      botRunTime,
      status,
      platform,
      botVersion,
      messageCount,
      countContacts
    }
  })

  return Promise.all(dataPromises).then(r => r.filter(Boolean))
}

async function getMessageCount(bot) {
  const nowDate = moment().format("MMDD")
  const keys = [
    `Yz:count:send:msg:bot:${bot.uin}:total`,
    `Yz:count:receive:msg:bot:${bot.uin}:total`,
    `Yz:count:send:image:bot:${bot.uin}:total`,
    `Yz:count:screenshot:day:${nowDate}`
  ]

  const values = await redis.mGet(keys) || []

  const sent = values[0] || bot.stat?.sent_msg_cnt || 0
  const recv = values[1] || bot.stat?.recv_msg_cnt || 0
  const screenshot = values[2] || values[3] || 0

  return {
    sent,
    recv,
    screenshot
  }
}

function getCountContacts(bot) {
  const friend = bot.fl?.size || 0
  const group = bot.gl?.size || 0
  const groupMember = Array.from(bot.gml?.values() || []).reduce((acc, curr: any) => acc + curr.size, 0)
  return {
    friend,
    group,
    groupMember
  }
}

function _getBotList(selfId) {
  /** bot列表 */
  let BotList = [selfId]

  if (Array.isArray((robot)?.uin)) {
    BotList = robot.uin
  } else if (robot?.adapter && robot.adapter.includes(selfId)) {
    BotList = robot.adapter
  }

  return BotList
}
