import path from "node:path"
import { randomUUID } from 'crypto'
import { Stdlog } from "#utils"
import { botInfo } from "#env"
import BotAPI from '../tools.js'

class OnebotV11 {
  id: string
  name: string
  path: string
  echo: any
  timeout: number
  
  constructor(public bot:typeof Bot.prototype) {
    this.id = "114514"
    this.name = "OneBotv11"
    this.path = this.name
    this.echo = {}
    this.timeout = 60000
    

    /** 监听事件 */
    bot.on('message', (data) => {
      this.message(data, bot)
    })
    // 监听错误
    bot.on('error', async (error:Error) => logger.error(error))
    /** 监听连接关闭事件 */
    bot.on('close', () => Stdlog.info('Onebotv11', '${this.id} 连接已断开!'))

    Stdlog.info('Onebotv11', '载入成功！')
  }

  /**
   * 处理base64
   * @param msg 
   * @returns 
   */
  makeLog(msg) {
    return BotAPI.String(msg).replace(/base64:\/\/.*?(,|]|")/g, "base64://...$1")
  }

  /**
   * 发送动作
   * @param data 数据
   * @param ws ws实例
   * @param action 动作
   * @param params 动作参数
   * @returns 
   */
  sendApi(data, ws, action, params = {}) {
    const echo = randomUUID()
    const request = { action, params, echo }
    ws.send(JSON.stringify(request))
    return new Promise((resolve, reject) =>
      this.echo[echo] = {
        request, resolve, reject,
        timeout: setTimeout(() => {
          reject(Object.assign(request, { timeout: this.timeout }))
          delete this.echo[echo]
          Stdlog.error(data.self_id, "请求超时", request)
          ws.terminate()
        }, this.timeout),
      }
    )
  }

  /**
   * 处理文件
   * @param file 
   * @returns 
   */
  async makeFile(file) {
    file = await BotAPI.Buffer(file, { http: true })
    if (Buffer.isBuffer(file))
      file = `base64://${file.toString("base64")}`
    return file
  }

  /**
   * 处理消息段
   * @param msg 
   * @returns 
   */
  async makeMsg(msg) {
    if (!Array.isArray(msg))
      msg = [msg]
    const msgs = []
    const forward = []
    for (let i of msg) {
      if (typeof i !== "object") {
        i = { type: "text", data: { text: i }}
      } else if (!i.data) {
        i = { type: i.type, data: { ...i, type: undefined }}
      }
      
      switch (i.type) {
        case "at":
          i.data.qq = String(i.data.qq)
          break
        case "face":
          i.data.id = String(i.data.id)
            break
        case "reply":
          i.data.id = String(i.data.id)
          break
        case "button":
          continue
        case "node":
          forward.push(...i.data)
          continue
        case "raw":
          i = i.data
          break
      }

      if (i.data.file)
        i.data.file = await this.makeFile(i.data.file)

      msgs.push(i)
    }
    return [msgs, forward]
  }

  /**
   * 通用消息发送
   * @param msg 
   * @param send 
   * @param sendForwardMsg 
   * @returns 
   */
  async sendMsg(msg, send, sendForwardMsg) {
    const [message, forward] = await this.makeMsg(msg)

    const ret = []

    if (forward.length) {
      const data = await sendForwardMsg(forward)
      if (Array.isArray(data))
        ret.push(...data)
      else
        ret.push(data)
    }

    if (message.length)
      ret.push(await send(message))
    if (ret.length === 1) return ret[0]

    const message_id = []
    for (const i of ret) if (i?.message_id)
      message_id.push(i.message_id)
    return { data: ret, message_id }
  }

  /**
   * 发送私聊
   * @param data 
   * @param msg 
   * @returns 
   */
  sendFriendMsg(data, msg) {
    return this.sendMsg(msg, message => {
      Stdlog.info(`${data.self_id} => ${data.user_id}`,`发送好友消息：${this.makeLog(message)}`)
      data.bot.sendApi("send_private_msg", {
        user_id: data.user_id,
        message,
      })
    }, msg => this.sendFriendForwardMsg(data, msg))
  }

  /**
   * 发送群聊
   * @param data 
   * @param msg 
   * @returns 
   */
  sendGroupMsg(data, msg) {
    return this.sendMsg(msg, message => {
      Stdlog.info(`${data.self_id} => ${data.group_id}`, `发送群消息：${this.makeLog(message)}`)
      return data.bot.sendApi("send_group_msg", {
        group_id: data.group_id,
        message,
      })
    }, msg => this.sendGroupForwardMsg(data, msg))
  }

  /**
   * 发送频道
   * @param data 
   * @param msg 
   * @returns 
   */
  sendGuildMsg(data, msg) {
    return this.sendMsg(msg, message => {
      Stdlog.info(`${data.self_id}] => ${data.guild_id}-${data.channel_id}`, `发送频道消息：${this.makeLog(message)}`)
      return data.bot.sendApi("send_guild_channel_msg", {
        guild_id: data.guild_id,
        channel_id: data.channel_id,
        message,
      })
    }, msg => Bot.sendForwardMsg(msg => this.sendGuildMsg(data, msg), msg))
  }

  /**
   * 撤回消息
   * @param data 
   * @param message_id 
   * @returns 
   */
  async recallMsg(data, message_id) {
    Stdlog.info(data.self_id, `撤回消息：${message_id}`)
    if (!Array.isArray(message_id))
      message_id = [message_id]
    const msgs = []
    for (const i of message_id)
      msgs.push(await data.bot.sendApi("delete_msg", { message_id: i }))
    return msgs
  }

  /**
   * 转segment
   * @param msg 
   * @returns 
   */
  parseMsg(msg) {
    const array = []
    for (const i of Array.isArray(msg) ? msg : [msg])
      if (typeof i === "object")
        array.push({ ...i.data, type: i.type })
      else
        array.push({ type: "text", text: String(i) })
    return array
  }

  /**
   * 获取消息
   * @param data 
   * @param message_id 
   * @returns 
   */
  async getMsg(data, message_id) {
    const msg = (await data.bot.sendApi("get_msg", { message_id })).data
    if (msg?.message)
      msg.message = this.parseMsg(msg.message)
    return msg
  }

  /**
   * 获取群历史消息
   * @param data 
   * @param message_seq 
   * @param count 
   * @returns 
   */
  async getGroupMsgHistory(data, message_seq, count) {
    const msgs = (await data.bot.sendApi("get_group_msg_history", {
      group_id: data.group_id,
      message_seq,
      count,
    })).data?.messages

    for (const i of Array.isArray(msgs) ? msgs : [msgs])
      if (i?.message)
        i.message = this.parseMsg(i.message)
    return msgs
  }

  /**
   * 获取转发
   * @param data 
   * @param message_id 
   * @returns 
   */
  async getForwardMsg(data, message_id) {
    const msgs = (await data.bot.sendApi("get_forward_msg", {
      message_id,
    })).data?.messages

    for (const i of Array.isArray(msgs) ? msgs : [msgs])
      if (i?.message)
        i.message = this.parseMsg(i.message || i.content)
    return msgs
  }

  /**
   * 制作转发
   * @param msg 
   * @returns 
   */
  async makeForwardMsg(msg) {
    const msgs = []
    for (const i of msg) {
      const [content, forward] = await this.makeMsg(i.message)
      if (forward.length)
        msgs.push(...await this.makeForwardMsg(forward))
      if (content.length)
        msgs.push({ type: "node", data: {
          name: i.nickname || "匿名消息",
          uin: String(Number(i.user_id) || 80000000),
          content,
          time: i.time,
        }})
    }
    return msgs
  }

  /**
   * 转发好友
   * @param data 
   * @param msg 
   * @returns 
   */
  async sendFriendForwardMsg(data, msg) {
    Stdlog.info(`${data.self_id} => ${data.user_id}`, `发送好友转发消息：${this.makeLog(msg)}`)
    return data.bot.sendApi("send_private_forward_msg", {
      user_id: data.user_id,
      messages: await this.makeForwardMsg(msg),
    })
  }

  /**
   * 转发好友
   * @param data 
   * @param msg 
   * @returns 
   */
  async sendPrivateForwardMsg(data, msg) {
    return this.sendFriendForwardMsg(data, msg)
  }

  /**
   * 转发群
   * @param data 
   * @param msg 
   * @returns 
   */
  async sendGroupForwardMsg(data, msg) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `发送群转发消息：${this.makeLog(msg)}`)
    return data.bot.sendApi("send_group_forward_msg", {
      group_id: data.group_id,
      messages: await this.makeForwardMsg(msg),
    })
  }

  /**
   * 获取好友列表
   * @param data 
   * @returns 
   */
  async getFriendArray(data) {
    return (await data.bot.sendApi("get_friend_list")).data || []
  }

  /**
   * 转换下
   * @param data 
   * @returns 
   */
  async getFriendList(data) {
    const array = []
    for (const { user_id } of await this.getFriendArray(data))
      array.push(user_id)
    return array
  }

  /**
   * 好友map
   * @param data 
   * @returns 
   */
  async getFriendMap(data) {
    const map = new Map
    for (const i of await this.getFriendArray(data))
      map.set(i.user_id, i)
    data.bot.fl = map
    return map
  }

  /**
   * 获取用户信息
   * @param data 
   * @returns 
   */
  getFriendInfo(data) {
    return data.bot.sendApi("get_stranger_info", {
      user_id: data.user_id,
    })
  }

  /**
   * 获取群数组
   * @param data 
   * @returns 
   */
  async getGroupArray(data) {
    const array = (await data.bot.sendApi("get_group_list")).data
    try { for (const guild of await this.getGuildArray(data))
      for (const channel of await this.getGuildChannelArray({
        ...data,
        guild_id: guild.guild_id,
      }))
        array.push({
          guild,
          channel,
          group_id: `${guild.guild_id}-${channel.channel_id}`,
          group_name: `${guild.guild_name}-${channel.channel_name}`,
        })
    } catch (err) {
      //Stdlog.info("error", ["获取频道列表错误", err])
    }
    return array
  }

  /**
   * 获取群列表
   * @param data 
   * @returns 
   */
  async getGroupList(data) {
    const array = []
    for (const { group_id } of await this.getGroupArray(data))
      array.push(group_id)
    return array
  }

  /**
   * 获取群map
   * @param data 
   * @returns 
   */
  async getGroupMap(data) {
    const map = new Map
    for (const i of await this.getGroupArray(data))
      map.set(i.group_id, i)
    data.bot.gl = map
    return map
  }

  /**
   * 获取群信息
   * @param data 
   * @returns 
   */
  getGroupInfo(data) {
    return data.bot.sendApi("get_group_info", {
      group_id: data.group_id,
    })
  }

  /**
   * 成员数组
   * @param data 
   * @returns 
   */
  async getMemberArray(data) {
    return (await data.bot.sendApi("get_group_member_list", {
      group_id: data.group_id,
    })).data || []
  }

  /**
   * 获取成员列表
   * @param data 
   * @returns 
   */
  async getMemberList(data) {
    const array = []
    for (const { user_id } of await this.getMemberArray(data))
      array.push(user_id)
    return array
  }

  /**
   * 获取成员map
   * @param data 
   * @returns 
   */
  async getMemberMap(data) {
    const map = new Map
    for (const i of await this.getMemberArray(data))
      map.set(i.user_id, i)
    data.bot.gml.set(data.group_id, map)
    return map
  }

  /**
   * 获取群成员map
   * @param data 
   */
  async getGroupMemberMap(data) {
    for (const [group_id, group] of await this.getGroupMap(data)) {
      if (group.guild) continue
      await this.getMemberMap({ ...data, group_id })
    }
  }

  /**
   * 获取成员信息
   * @param data 
   * @returns 
   */
  getMemberInfo(data) {
    return data.bot.sendApi("get_group_member_info", {
      group_id: data.group_id,
      user_id: data.user_id,
    })
  }

  /**
   * 获取频道数组
   * @param data 
   * @returns 
   */
  async getGuildArray(data) {
    return (await data.bot.sendApi("get_guild_list")).data || []
  }

  /**
   * 获取频道信息
   * @param data 
   * @returns 
   */
  getGuildInfo(data) {
    return data.bot.sendApi("get_guild_meta_by_guest", {
      guild_id: data.guild_id,
    })
  }

  /**
   * 获取子频道数组
   * @param data 
   * @returns 
   */
  async getGuildChannelArray(data) {
    return (await data.bot.sendApi("get_guild_channel_list", {
      guild_id: data.guild_id,
    })).data || []
  }

  /**
   * 获取子频道map
   * @param data 
   * @returns 
   */
  async getGuildChannelMap(data) {
    const map = new Map
    for (const i of await this.getGuildChannelArray(data))
      map.set(i.channel_id, i)
    return map
  }

  /**
   * 获取频道成员数组
   * @param data 
   * @returns 
   */
  async getGuildMemberArray(data) {
    const array = []
    let next_token = ""
    while (true) {
      const list = (await data.bot.sendApi("get_guild_member_list", {
        guild_id: data.guild_id,
        next_token,
      })).data
      if (!list) break

      for (const i of list.members)
        array.push({
          ...i,
          user_id: i.tiny_id,
        })
      if (list.finished) break
      next_token = list.next_token
    }
    return array
  }

  /**
   * 获取频道成员列表
   * @param data 
   * @returns 
   */
  async getGuildMemberList(data) {
    const array = []
    for (const { user_id } of await this.getGuildMemberArray(data))
      array.push(user_id)
    return array.push
  }

  /**
   * 获取频道成员map
   * @param data 
   * @returns 
   */
  async getGuildMemberMap(data) {
    const map = new Map
    for (const i of await this.getGuildMemberArray(data))
      map.set(i.user_id, i)
    data.bot.gml.set(data.group_id, map)
    return map
  }

  /**
   * 获取频道成员信息
   * @param data 
   * @returns 
   */
  getGuildMemberInfo(data) {
    return data.bot.sendApi("get_guild_member_profile", {
      guild_id: data.guild_id,
      user_id: data.user_id,
    })
  }


  /**
   * 设置值资料
   * @param data 、
   * @param profile 
   * @returns 
   */
  setProfile(data, profile) {
    Stdlog.info(data.self_id, `设置资料：${BotAPI.String(profile)}`)
    return data.bot.sendApi("set_qq_profile", profile)
  }

  /**
   * 设置头像
   * @param data 
   * @param file 
   * @returns 
   */
  async setAvatar(data, file) {
    Stdlog.info(data.self_id, `设置头像：${file}`)
    return data.bot.sendApi("set_qq_avatar", {
      file: await this.makeFile(file),
    })
  }

  /**
   * 点赞
   * @param data 
   * @param times 
   * @returns 
   */
  sendLike(data, times) {
    Stdlog.info(`${data.self_id} => ${data.user_id}`, `点赞：${times}次`)
    return data.bot.sendApi("send_like", {
      user_id: data.user_id,
      times,
    })
  }

  /**
   * 获取群昵称
   * @param data 
   * @param group_name 
   * @returns 
   */
  setGroupName(data, group_name) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `设置群名：${group_name}`)
    return data.bot.sendApi("set_group_name", {
      group_id: data.group_id,
      group_name,
    })
  }

  /**
   * 设置群头像
   * @param data 
   * @param file 
   * @returns 
   */
  async setGroupAvatar(data, file) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `设置群头像：${file}`)
    return data.bot.sendApi("set_group_portrait", {
      group_id: data.group_id,
      file: await this.makeFile(file),
    })
  }

  /**
   * 设置群管
   * @param data 
   * @param user_id 
   * @param enable 
   * @returns 
   */
  setGroupAdmin(data, user_id, enable) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `${enable ? "设置" : "取消"}群管理员：${user_id}`)
    return data.bot.sendApi("set_group_admin", {
      group_id: data.group_id,
      user_id,
      enable,
    })
  }

  /**
   * 设置群名片
   * @param data 
   * @param user_id 
   * @param card 
   * @returns 
   */
  setGroupCard(data, user_id, card) {
    Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `设置群名片：${card}`)
    return data.bot.sendApi("set_group_card", {
      group_id: data.group_id,
      user_id,
      card,
    })
  }

  /**
   * 设置群头衔
   * @param data 
   * @param user_id 
   * @param special_title 
   * @param duration 
   * @returns 
   */
  setGroupTitle(data, user_id, special_title, duration) {
    Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `设置群头衔：${special_title} ${duration}`)
    return data.bot.sendApi("set_group_special_title", {
      group_id: data.group_id,
      user_id,
      special_title,
      duration,
    })
  }

  /**
   * 群打卡
   * @param data 
   * @returns 
   */
  sendGroupSign(data) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, "群打卡")
    return data.bot.sendApi("send_group_sign", {
      group_id: data.group_id,
    })
  }

  /**
   * 禁言
   * @param data 
   * @param user_id 
   * @param duration 
   * @returns 
   */
  setGroupBan(data, user_id, duration) {
    Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `禁言群成员：${duration}秒`)
    return data.bot.sendApi("set_group_ban", {
      group_id: data.group_id,
      user_id,
      duration,
    })
  }

  /**
   * 全员禁言
   * @param data 
   * @param enable 
   * @returns 
   */
  setGroupWholeKick(data, enable) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `${enable ? "开启" : "关闭"}全员禁言`)
    return data.bot.sendApi("set_group_whole_ban", {
      group_id: data.group_id,
      enable,
    })
  }

  /**
   * 踢出成员
   * @param data 
   * @param user_id 
   * @param reject_add_request 
   * @returns 
   */
  setGroupKick(data, user_id, reject_add_request) {
    Stdlog.info(`${data.self_id} => ${data.group_id}, ${user_id}`, `踢出群成员${reject_add_request ? "拒绝再次加群" : ""}`)
    return data.bot.sendApi("set_group_kick", {
      group_id: data.group_id,
      user_id,
      reject_add_request,
    })
  }

  /**
   * 解散或退群
   * @param data 
   * @param is_dismiss 
   * @returns 
   */
  setGroupLeave(data, is_dismiss) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, is_dismiss ? "解散" : "退群")
    return data.bot.sendApi("set_group_leave", {
      group_id: data.group_id,
      is_dismiss,
    })
  }

  /**
   * 下载文件到本地
   * @param data 
   * @param url 
   * @param thread_count 
   * @param headers 
   * @returns 
   */
  downloadFile(data, url, thread_count, headers) {
    return data.bot.sendApi("download_file", {
      url,
      thread_count,
      headers,
    })
  }

  /**
   * 向好友发送文件
   * @param data 
   * @param file 
   * @param name 
   * @returns 
   */
  async sendFriendFile(data, file, name = path.basename(file.slice(0,16))) {
    Stdlog.info(`${data.self_id} => ${data.user_id}`, `发送好友文件：${name}(${file})`)
    return data.bot.sendApi("upload_private_file", {
      user_id: data.user_id,
      file: await this.makeFile(file),
      name,
    })
  }

  /**
   * 向群聊发送文件
   * @param data 
   * @param file 
   * @param folder 
   * @param name 
   * @returns 
   */
  async sendGroupFile(data, file, folder, name = path.basename(file.slice(0,16))) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `发送群文件：${folder||""}/${name}(${file})`)
    return data.bot.sendApi("upload_group_file", {
      group_id: data.group_id,
      folder,
      file: await this.makeFile(file),
      name,
    })
  }

  /**
   * 删除群文件
   * @param data 
   * @param file_id 
   * @param busid 
   * @returns 
   */
  deleteGroupFile(data, file_id, busid) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `删除群文件：${file_id}(${busid})`)
    return data.bot.sendApi("delete_group_file", {
      group_id: data.group_id,
      file_id,
      busid,
    })
  }

  /**
   * 创建文件夹
   * @param data 
   * @param name 
   * @returns 
   */
  createGroupFileFolder(data, name) {
    Stdlog.info(`${data.self_id} => ${data.group_id}`, `创建群文件夹：${name}`)
    return data.bot.sendApi("create_group_file_folder", {
      group_id: data.group_id,
      name,
    })
  }

  /**
   * 获取群文件信息
   * @param data 
   * @returns 
   */
  getGroupFileSystemInfo(data) {
    return data.bot.sendApi("get_group_file_system_info", {
      group_id: data.group_id,
    })
  }

  /**
   * 获取群文件夹
   * @param data 、
   * @param folder_id 
   * @returns 
   */
  getGroupFiles(data, folder_id) {
    if (folder_id)
      return data.bot.sendApi("get_group_files_by_folder", {
        group_id: data.group_id,
        folder_id,
      })
    return data.bot.sendApi("get_group_root_files", {
      group_id: data.group_id,
    })
  }

  /**
   * 获取群文件地址
   * @param data 
   * @param file_id 
   * @param busid 
   * @returns 
   */
  getGroupFileUrl(data, file_id, busid) {
    return data.bot.sendApi("get_group_file_url", {
      group_id: data.group_id,
      file_id,
      busid,
    })
  }

  /**
   * 获取群文件操作
   * @param data 
   * @returns 
   */
  getGroupFs(data) {
    return {
      upload: (file, folder, name) => this.sendGroupFile(data, file, folder, name),
      rm: (file_id, busid) => this.deleteGroupFile(data, file_id, busid),
      mkdir: name => this.createGroupFileFolder(data, name),
      df: () => this.getGroupFileSystemInfo(data),
      ls: folder_id => this.getGroupFiles(data, folder_id),
      download: (file_id, busid) => this.getGroupFileUrl(data, file_id, busid),
    }
  }

  /**
   * 好友添加请求
   * @param data 
   * @param flag 
   * @param approve 
   * @param remark 
   * @returns 
   */
  setFriendAddRequest(data, flag, approve, remark) {
    return data.bot.sendApi("set_friend_add_request", {
      flag,
      approve,
      remark,
    })
  }

  /**
   * 加群请求
   * @param data 
   * @param flag 
   * @param sub_type 
   * @param approve 
   * @param reason 
   * @returns 
   */
  setGroupAddRequest(data, flag, sub_type, approve, reason) {
    return data.bot.sendApi("set_group_add_request", {
      flag,
      sub_type,
      approve,
      reason,
    })
  }

  /**
   * 获取好友实例
   * @param data 
   * @param user_id 
   * @returns 
   */
  pickFriend(data, user_id) {
    const i = {
      ...data.bot.fl.get(user_id),
      ...data,
      user_id,
    }
    return {
      ...i,
      sendMsg: msg => this.sendFriendMsg(i, msg),
      getMsg: message_id => this.getMsg(i, message_id),
      recallMsg: message_id => this.recallMsg(i, message_id),
      getForwardMsg: message_id => this.getForwardMsg(i, message_id),
      sendForwardMsg: msg => this.sendFriendForwardMsg(i, msg),
      sendFile: (file, name) => this.sendFriendFile(i, file, name),
      getInfo: () => this.getFriendInfo(i),
      getAvatarUrl: () => i.avatar || `https://q.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
      thumbUp: times => this.sendLike(i, times),
    }
  }

  /**
   * 获取成员实例
   * @param data 
   * @param group_id 
   * @param user_id 
   * @returns 
   */
  pickMember(data, group_id, user_id) {
    if (typeof group_id === "string" && group_id.match("-")) {
      const guild_id = group_id.split("-")
      const i = {
        ...data,
        guild_id: guild_id[0],
        channel_id: guild_id[1],
        user_id,
      }
      return {
        ...this.pickGroup(i, group_id),
        ...i,
        getInfo: () => this.getGuildMemberInfo(i),
        getAvatarUrl: async () => (await this.getGuildMemberInfo(i)).avatar_url,
      }
    }

    const i = {
      ...data.bot.fl.get(user_id),
      ...data.bot.gml.get(group_id)?.get(user_id),
      ...data,
      group_id,
      user_id,
    }
    return {
      ...this.pickFriend(i, user_id),
      ...i,
      getInfo: () => this.getMemberInfo(i),
      getAvatarUrl: () => i.avatar || `https://q.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
      poke: () => this.sendGroupMsg(i, { type: "poke", qq: user_id }),
      mute: duration => this.setGroupBan(i, i.user_id, duration),
      kick: reject_add_request => this.setGroupKick(i, i.user_id, reject_add_request),
      get is_friend() { return data.bot.fl.has(user_id) },
      get is_owner() { return i.role === "owner" },
      get is_admin() { return i.role === "admin" },
    }
  }

  /**
   * 获取群实例
   * @param data 
   * @param group_id 
   * @returns 
   */
  pickGroup(data, group_id) {
    if (typeof group_id === "string" && group_id.match("-")) {
      const guild_id = group_id.split("-")
      const i = {
        ...data.bot.gl.get(group_id),
        ...data,
        guild_id: guild_id[0],
        channel_id: guild_id[1],
      }
      return {
        ...i,
        sendMsg: msg => this.sendGuildMsg(i, msg),
        getMsg: message_id => this.getMsg(i, message_id),
        recallMsg: message_id => this.recallMsg(i, message_id),
        getForwardMsg: message_id => this.getForwardMsg(i, message_id),
        getInfo: () => this.getGuildInfo(i),
        getChannelArray: () => this.getGuildChannelArray(i),
        getChannelList: () => this.getGuildChannelMap(i),
        getChannelMap: () => this.getGuildChannelMap(i),
        getMemberArray: () => this.getGuildMemberArray(i),
        getMemberList: () => this.getGuildMemberList(i),
        getMemberMap: () => this.getGuildMemberMap(i),
        pickMember: user_id => this.pickMember(i, group_id, user_id),
      }
    }

    const i = {
      ...data.bot.gl.get(group_id),
      ...data,
      group_id,
    }
    return {
      ...i,
      sendMsg: msg => this.sendGroupMsg(i, msg),
      getMsg: message_id => this.getMsg(i, message_id),
      recallMsg: message_id => this.recallMsg(i, message_id),
      getForwardMsg: message_id => this.getForwardMsg(i, message_id),
      sendForwardMsg: msg => this.sendGroupForwardMsg(i, msg),
      sendFile: (file, name) => this.sendGroupFile(i, file, undefined, name),
      getInfo: () => this.getGroupInfo(i),
      getAvatarUrl: () => i.avatar || `https://p.qlogo.cn/gh/${group_id}/${group_id}/0`,
      getChatHistory: (seq, cnt) => this.getGroupMsgHistory(i, seq, cnt),
      getMemberArray: () => this.getMemberArray(i),
      getMemberList: () => this.getMemberList(i),
      getMemberMap: () => this.getMemberMap(i),
      pickMember: user_id => this.pickMember(i, group_id, user_id),
      pokeMember: qq => this.sendGroupMsg(i, { type: "poke", qq }),
      setName: group_name => this.setGroupName(i, group_name),
      setAvatar: file => this.setGroupAvatar(i, file),
      setAdmin: (user_id, enable) => this.setGroupAdmin(i, user_id, enable),
      setCard: (user_id, card) => this.setGroupCard(i, user_id, card),
      setTitle: (user_id, special_title, duration) => this.setGroupTitle(i, user_id, special_title, duration),
      sign: () => this.sendGroupSign(i),
      muteMember: (user_id, duration) => this.setGroupBan(i, user_id, duration),
      muteAll: enable => this.setGroupWholeKick(i, enable),
      kickMember: (user_id, reject_add_request) => this.setGroupKick(i, user_id, reject_add_request),
      quit: is_dismiss => this.setGroupLeave(i, is_dismiss),
      fs: this.getGroupFs(i),
      get is_owner() { return data.bot.gml.get(group_id)?.get(data.self_id)?.role === "owner" },
      get is_admin() { return data.bot.gml.get(group_id)?.get(data.self_id)?.role === "admin" },
    }
  }

  /**
   * 处理连接
   * @param data 
   * @param ws 
   */
  async connect(data, ws) {
    if(!data.self_id) Stdlog.warn('Onebotv11','未找到self_id!')
    Bot[data.self_id] = {
      adapter: this,
      ws: ws,
      sendApi: (action, params) => this.sendApi(data, ws, action, params),
      stat: {
        start_time: data.time,
        stat: {},
        get lost_pkt_cnt() { return this.stat.packet_lost },
        get lost_times() { return this.stat.lost_times },
        get recv_msg_cnt() { return this.stat.message_received },
        get recv_pkt_cnt() { return this.stat.packet_received },
        get sent_msg_cnt() { return this.stat.message_sent },
        get sent_pkt_cnt() { return this.stat.packet_sent },
      },
      model: botInfo.BOT_NAME,

      info: {},
      get uin() { return this.info.user_id },
      get nickname() { return this.info.nickname },
      get avatar() { return `https://q.qlogo.cn/g?b=qq&s=0&nk=${this.uin}` },

      setProfile: profile => this.setProfile(data, profile),
      setNickname: nickname => this.setProfile(data, { nickname }),
      setAvatar: file => this.setAvatar(data, file),

      pickFriend: user_id => this.pickFriend(data, user_id),
      get pickUser() { return this.pickFriend },
      getFriendArray: () => this.getFriendArray(data),
      getFriendList: () => this.getFriendList(data),
      getFriendMap: () => this.getFriendMap(data),
      fl: new Map,

      pickMember: (group_id, user_id) => this.pickMember(data, group_id, user_id),
      pickGroup: group_id => this.pickGroup(data, group_id),
      getGroupArray: () => this.getGroupArray(data),
      getGroupList: () => this.getGroupList(data),
      getGroupMap: () => this.getGroupMap(data),
      getGroupMemberMap: () => this.getGroupMemberMap(data),
      gl: new Map,
      gml: new Map,

      request_list: [],
      getSystemMsg: () => data.bot.request_list,
      setFriendAddRequest: (flag, approve, remark) => this.setFriendAddRequest(data, flag, approve, remark),
      setGroupAddRequest: (flag, sub_type, approve, reason) => this.setGroupAddRequest(data, flag, sub_type, approve, reason),
    }
    data.bot = Bot[data.self_id]

    if (!Bot.adapter.includes(data.self_id))
      Bot.adapter.push(data.self_id)

    data.bot.sendApi("_set_model_show", {
      model: data.bot.model,
      model_show: data.bot.model,
    }).catch(() => {})

    data.bot.info = (await data.bot.sendApi("get_login_info").catch(i => i.error)).data
    data.bot.guild_info = (await data.bot.sendApi("get_guild_service_profile").catch(i => i.error)).data
    data.bot.clients = (await data.bot.sendApi("get_online_clients").catch(i => i.error)).clients
    data.bot.version = {
      ...(await data.bot.sendApi("get_version_info").catch(i => i.error)).data,
      id: this.id,
      name: this.name,
      get version() {
        return this.app_full_name || `${this.app_name} v${this.app_version}`
      },
    }

    data.bot.getFriendMap()
    data.bot.getGroupMemberMap()

    Stdlog.mark(data.self_id, `${this.name}(${this.id}) ${data.bot.version.version} 连接成功，协议通过，执行消息处理...`)
    BotAPI.$emit(`connect.${data.self_id}`, data)
  }

  /**
   * 解析打印消息
   * @param data 
   */
  makeMessage(data) {
    data.message = this.parseMsg(data.message)
    switch (data.message_type) {
      case "private": {
        const name = data.sender.card || data.sender.nickname || data.bot.fl.get(data.user_id)?.nickname
        Stdlog.info(`${data.self_id} <= ${data.user_id}`, `好友消息：${name ? `[${name}] ` : ""}${BotAPI.String(data.message)}`)
        break
      } case "group": {
        const group_name = data.group_name || data.bot.gl.get(data.group_id)?.group_name
        let user_name = data.sender.card || data.sender.nickname
        if (!user_name) {
          const user = data.bot.gml.get(data.group_id)?.get(data.user_id) || data.bot.fl.get(data.user_id)
          if (user) user_name = user?.card || user?.nickname
        }
        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群消息：${user_name ? `[${group_name ? `${group_name}, ` : ""}${user_name}] ` : ""}${BotAPI.String(data.message)}`)
        break
      } case "guild":
        data.message_type = "group"
        data.group_id = `${data.guild_id}-${data.channel_id}`
        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `频道消息：[${data.sender.nickname}] ${BotAPI.String(data.message)}`)
        Object.defineProperty(data, "friend", { get() { return this.member || {}}})
        break
      default:
        Stdlog.info(data.self_id, `未知消息：${logger.warn(data.raw)}`)
    }

    BotAPI.$emit(`${data.post_type}.${data.message_type}.${data.sub_type}`, data)
  }

  /**
   * 制作通知
   * @param data 
   */
  async makeNotice(data) {
    switch (data.notice_type) {
      case "friend_recall":
        Stdlog.info(`${data.self_id} <= ${data.user_id}`, `好友消息撤回：${data.message_id}`)
        break
      case "group_recall":
        Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群消息撤回：${data.operator_id} => ${data.user_id} ${data.message_id}`)
        break
      case "group_increase":
        Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群成员增加：${data.operator_id} => ${data.user_id} ${data.sub_type}`)
        if (data.user_id === data.self_id)
          data.bot.getGroupMemberMap()
        else
          data.bot.pickGroup(data.group_id).getMemberMap()
        break
      case "group_decrease":
        Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群成员减少：${data.operator_id} => ${data.user_id} ${data.sub_type}`)
        if (data.user_id === data.self_id)
          data.bot.getGroupMemberMap()
        else
          data.bot.pickGroup(data.group_id).getMemberMap()
        break
      case "group_admin":
        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群管理员变动：${data.sub_type}`)
        data.set = data.sub_type === "set"
        break
      case "group_upload":
        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群文件上传：${BotAPI.String(data.file)}`)
        break
      case "group_ban":
        Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群禁言：${data.operator_id} => ${data.user_id} ${data.sub_type} ${data.duration}秒`)
        break
      case "friend_add":
        Stdlog.info(`${data.self_id} <= ${data.user_id}`, "好友添加")
        data.bot.getFriendMap()
        break
      case "notify":
        if (data.group_id)
          data.notice_type = "group"
        else
          data.notice_type = "friend"
        switch (data.sub_type) {
          case "poke":
            data.operator_id = data.user_id
            if (data.group_id)
              Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群戳一戳：${data.operator_id} => ${data.target_id}`)
            else
              Stdlog.info(data.self_id, `好友戳一戳：${data.operator_id} => ${data.target_id}`)
            break
          case "honor":
            Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群荣誉：${data.honor_type}`, )
            break
          case "title":
            Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群头衔：${data.title}`, )
            break
          default:
            Stdlog.info(data.self_id, `未知通知：${logger.warn(data.raw)}`)
        }
        break
      case "group_card":
        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `群名片更新：${data.card_old} => ${data.card_new}`)
        break
      case "offline_file":
        Stdlog.info(`${data.self_id} <= ${data.user_id}`, `离线文件：${BotAPI.String(data.file)}`)
        break
      case "client_status":
        Stdlog.info(data.self_id, `客户端${data.online ? "上线" : "下线"}：${BotAPI.String(data.client)}`)
        data.clients = (await data.bot.sendApi("get_online_clients")).clients
        data.bot.clients = data.clients
        break
      case "essence":
        data.notice_type = "group_essence"
        Stdlog.info(`${data.self_id} <= ${data.group_id}`, `群精华消息：${data.operator_id} => ${data.sender_id} ${data.sub_type} ${data.message_id}`)
        break
      case "guild_channel_recall":
        Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}`, `频道消息撤回：${data.operator_id} => ${data.user_id} ${data.message_id}`)
        break
      case "message_reactions_updated":
        data.notice_type = "guild_message_reactions_updated"
        Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `频道消息表情贴：${data.message_id} ${BotAPI.String(data.current_reactions)}`)
        break
      case "channel_updated":
        data.notice_type = "guild_channel_updated"
        Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `子频道更新：${BotAPI.String(data.old_info)} => ${BotAPI.String(data.new_info)}`)
        break
      case "channel_created":
        data.notice_type = "guild_channel_created"
        Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `子频道创建：${BotAPI.String(data.channel_info)}`)
        data.bot.getGroupMap()
        break
      case "channel_destroyed":
        data.notice_type = "guild_channel_destroyed"
        Stdlog.info(`${data.self_id} <= ${data.guild_id}-${data.channel_id}, ${data.user_id}`, `子频道删除：${BotAPI.String(data.channel_info)}`)
        data.bot.getGroupMap()
        break
      default:
        Stdlog.warn(data.self_id, `未知通知：${logger.warn(data.raw)}`)
    }

    let notice = data.notice_type.split("_")
    data.notice_type = notice.shift()
    notice = notice.join("_")
    if (notice)
      data.sub_type = notice

    if (data.guild_id && data.channel_id) {
      data.group_id = `${data.guild_id}-${data.channel_id}`
      Object.defineProperty(data, "friend", { get() { return this.member || {}}})
    }

    BotAPI.$emit(`${data.post_type}.${data.notice_type}.${data.sub_type}`, data)
  }

  /**
   * 制作请求
   * @param data 
   */
  makeRequest(data) {
    switch (data.request_type) {
      case "friend":
        Stdlog.info(`${data.self_id} <= ${data.user_id}`, `加好友请求：${data.comment}(${data.flag})`)
        data.sub_type = "add"
        data.approve = approve => data.bot.setFriendAddRequest(data.flag, approve)
        break
      case "group":
        Stdlog.info(`${data.self_id} <= ${data.group_id}, ${data.user_id}`, `加群请求：${data.sub_type} ${data.comment}(${data.flag})`)
        data.approve = approve => data.bot.setGroupAddRequest(data.flag, data.sub_type, approve)
        break
      default:
        Stdlog.info(data.self_id, `未知请求：${logger.warn(data.raw)}`)
    }

    data.bot.request_list.push(data)
    BotAPI.$emit(`${data.post_type}.${data.request_type}.${data.sub_type}`, data)
  }

  /**
   * 心跳
   * @param data 
   */
  heartbeat(data) {
    if (data.status)
      Object.assign(data.bot.stat, data.status)
  }

  /**
   * 制作元信息
   * @param data 
   * @param ws 
   */
  makeMeta(data, ws) {
    switch (data.meta_event_type) {
      case "heartbeat":
        this.heartbeat(data)
        break
      case "lifecycle":
        this.id = data.self_id
        this.connect(data, ws)
        break
      default:
        Stdlog.warn(data.self_id, `未知消息：${logger.warn(data.raw)}`)
    }
  }

  /**
   * 消息解析
   * @param data 
   * @param ws 
   * @param args 
   * @returns 
   */
  message(data, ws) {
    try {
      data = {
        ...JSON.parse(data),
        raw: BotAPI.String(data),
      }
    } catch (err) {
      return Stdlog.error(data.self_id, "解码数据失败", data, err)
    }

    if (data.post_type) {
      if (data.meta_event_type !== "lifecycle" && !Bot[data.self_id]) {
        Stdlog.warn(data.self_id, `找不到对应Bot，忽略消息：${logger.warn(data.raw)}`)
        return false
      }
      data.bot = Bot[data.self_id]

      switch (data.post_type) {
        case "meta_event":
          this.makeMeta(data, ws)
          break
        case "message":
          this.makeMessage(data)
          break
        case "notice":
          this.makeNotice(data)
          break
        case "request":
          this.makeRequest(data)
          break
        case "message_sent":
          data.post_type = "message"
          this.makeMessage(data)
          break
        default:
          Stdlog.warn(data.self_id, `未知消息：${logger.warn(data.raw)}`)
      }
    } else if (data.echo && this.echo[data.echo]) {
      if (![0, 1].includes(data.retcode))
        this.echo[data.echo].reject(Object.assign(
          this.echo[data.echo].request, { error: data }
        ))
      else
        this.echo[data.echo].resolve(data.data ? new Proxy(data, {
          get: (target, prop) => target.data[prop] ?? target[prop],
        }) : data)
      clearTimeout(this.echo[data.echo].timeout)
      delete this.echo[data.echo]
    } else {
      Stdlog.info(data.self_id, `未知消息：${logger.warn(data.raw)}`)
    }
    
  }

}

export default OnebotV11