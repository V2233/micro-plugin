const CopyBot = Bot

const botMethods = {
  pickGroup,
  pickFriend,
  pickMember,
  pickUser: pickFriend
}

Bot = new Proxy({}, {
  get (target, prop, receiver) {
    if (prop in botMethods) return botMethods[prop]
    if (prop in target) return target[prop]
    return Reflect.get(CopyBot, prop, receiver)
  }
})

/**
 * 得到一个群对象, 通常不会重复创建、调用
 * @param gid 群号
 * @param strict 严格模式，若群不存在会抛出异常
 * @returns 一个`Group`对象
 */
function pickGroup (gid, strict) {
  gid = Number(gid) || String(gid)
  const group = Bot.gl.get(gid)
  if (group) return Bot[group.uin || Bot.uin].pickGroup(gid, strict)
  if (Number(gid)) return Bot[Bot.uin].pickGroup(gid, strict)
  logger.error(`获取群对象错误：找不到群 ${logger.red(gid)}`)
}

/**
 * 得到一个好友对象, 通常不会重复创建、调用
 * @param uid 好友账号
 * @param strict 严格模式，若好友不存在会抛出异常
 * @returns 一个`Friend`对象
 */
function pickFriend (uid, strict) {
  uid = Number(uid) || String(uid)
  const user = Bot.fl.get(uid)
  if (user) return Bot[user.uin || Bot.uin].pickFriend(uid, strict)
  if (Number(uid)) return Bot[Bot.uin].pickFriend(uid, strict)
  logger.error(`获取好友对象错误：找不到好友 ${logger.red(uid)}`)
}

/**
 * 得到一个群员对象, 通常不会重复创建、调用
 * @param gid 群员所在的群号
 * @param uid 群员的账号
 * @param strict 严格模式，若群员不存在会抛出异常
 * @returns 一个`Member`对象
 */
function pickMember (gid, uid, strict) {
  if (uid == 88888) {
    let nickname = 'Yunzai-Bot'
    return {
      group_id: gid,
      user_id: uid,
      nickname,
      card: nickname,
      sex: 'female',
      age: 6,
      join_time: '',
      last_sent_time: '',
      level: 1,
      role: 'member',
      title: '',
      title_expire_time: '',
      shutup_time: 0,
      update_time: '',
      area: '南极洲',
      rank: '潜水'
    }
  }
  const group = Bot.pickGroup(gid, strict)
  if (group) return group.pickMember(uid)
  logger.error(`获取群员对象错误：从群 ${logger.red(gid)} 中找不到群员 ${logger.red(uid)}`)
}