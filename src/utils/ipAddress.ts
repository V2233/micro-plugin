import os from 'os'
import fetch from 'node-fetch'
import { Cfg } from "#cfg"
import { Redis } from '#bot'

const redis = await Redis()

/**
 * 获取所有web地址，包括内网、外网
 */
export async function getAllWebAddress(auto = true) {
  const { server } = Cfg.getConfig('server')
  let host = server.host
  let port = server.port
  if(host !== 'auto' && auto == false) {
    return { 
      custom: [joinHttpPort(host, port)], 
      local: [''], 
      remote: [''] 
    }
  }
  port = Number.parseInt(port)
  port = port === 80 ? null : port
  let custom = []
  let local = getAutoIps(port, true)
  let remote = await getRemoteIps()
  if (remote && remote.length > 0) {
    remote = remote.map((i) => joinHttpPort(i, port))
  }
  if (host) {
    if (!Array.isArray(host)) {
      host = [host]
    }
    for (let h of host) {
      if (h && h !== 'auto') {
        custom.push(joinHttpPort(h, port))
      }
    }
  }
  let mountRoot = '/'
  mountRoot = mountRoot === '/' ? '' : mountRoot
  if (mountRoot) {
    custom = custom.map((i) => i + mountRoot)
    local = local.map((i) => i + mountRoot)
    remote = remote.map((i) => i + mountRoot)
  }
  return { custom, local, remote }
}

// 拼接端口号和http前缀
function joinHttpPort(ip, port) {
  ip = /^http/.test(ip) ? ip : 'http://' + ip
  return `${ip}${port ? ':' + port : ''}`
}

/**
 * 获取web地址
 * @param allIp 是否展示全部IP
 */
export function getWebAddress(allIp = false) {
  const { server } = Cfg.getConfig('server')
  let host = server.host
  let port = server.port
  port = Number.parseInt(port)
  port = port === 80 ? null : port
  let hosts = []
  if (host === 'auto') {
    hosts.push(...getAutoIps(port, allIp))
  } else {
    if (!Array.isArray(host)) {
      host = [host]
    }
    for (let item of host) {
      if (item === 'auto') {
        hosts.push(...getAutoIps(port, allIp))
      } else {
        item = /^http/.test(item) ? item : 'http://' + item
        hosts.push(`${item}${port ? ':' + port : ''}`)
      }
    }
  }
  let mountRoot = '/'
  mountRoot = mountRoot === '/' ? '' : mountRoot
  if (mountRoot) {
    hosts = hosts.map((i) => i + mountRoot)
  }
  return hosts
}

function getAutoIps(port, allIp) {
  let ips = getLocalIps(port)
  if (ips.length === 0) {
    ips.push(`localhost${port ? ':' + port : ''}`)
  }
  if (allIp) {
    return ips.map(ip => `http://${ip}`)
  } else {
    return [`http://${ips[0]}`]
  }
}

/**
 * 获取本地ip地址
 * 感谢 @吃吃吃个柚子皮
 * @param port 要拼接的端口号
 * @return {*[]}
 */
export function getLocalIps(port) {
  let ips = []
  port = port ? `:${port}` : ''
  try {
    let networks = os.networkInterfaces()
    for (let [name, wlans] of Object.entries(networks)) {
      for (let wlan of wlans) {
        /*
         * 更改过滤规则,填坑。(之前未测试Windows系统)
         * 通过掩码过滤本地IPv6
         * 通过MAC地址过滤Windows 本地回环地址（踩坑）
         * 过滤lo回环网卡（Linux要过滤'lo'），去掉会导致Linxu"::1"过滤失败（踩坑）
         * 如有虚拟网卡需自己加上过滤--技术有限
         */
        /*
         * 修复过滤，部分Linux读取不到IPv6
         * 放弃使用网段过滤，采取过滤fe、fc开头地址
         */
        // noinspection EqualityComparisonWithCoercionJS
        if (name != 'lo' && name != 'docker0' && wlan.address.slice(0, 2) != 'fe' && wlan.address.slice(0, 2) != 'fc') {
          // 过滤本地回环地址
          if (['127.0.0.1', '::1'].includes(wlan.address)) {
            continue
          }
          if (wlan.family === 'IPv6') {
            ips.push(`[${wlan.address}]${port}`)
          } else {
            ips.push(`${wlan.address}${port}`)
          }
        }
      }
    }
  } catch (e) {
    let err = e?.stack || e?.message || e
    err = err ? err.toString() : ''
    if (/Unknown system error 13/i.test(err)) {
      logger.warn('[Micro-Plugin] 由于系统限制，无法获取到IP地址，仅显示本地回环地址。该问题目前暂无方案解决，但不影响Micro-Plugin使用，您可手动配置自定义地址。')
      ips.push(`localhost${port}`)
    } else {
      logger.error(`错误：${logger.red(e)}`)
    }
  }
  if (ips.length === 0) {
    logger.warn('[Micro-Plugin] 无法获取到IP地址，仅显示本地回环地址，详情请查看以上报错。')
    ips.push(`localhost${port}`)
  }
  return ips
}

/**
 * 获取外网ip地址
 * @author @吃吃吃个柚子皮
 */
export async function getRemoteIps() {
  let redisKey = 'Yz:Micro:remote-ips:3'
  let cacheData = await redis.get(redisKey)
  let ips
  if (cacheData) {
    ips = JSON.parse(cacheData)
    if (Array.isArray(ips) && ips.length > 0) {
      return ips
    }
  }
  ips = []
  //API是免费，但不能商用。(废话)
  let apis = [
    // 返回IPv4地址
    'http://v4.ip.zxinc.org/info.php?type=json',
    // 返回IPv6地址（已失效）
    // 'http://v6.ip.zxinc.org/info.php?type=json'
  ]
  for (let api of apis) {
    let response
    try {
      response = await fetch(api)
    } catch {
      continue
    }
    if (response.status === 200) {
      let { code, data } = await response.json()
      if (code === 0) {
        ips.push(data.myip)
      }
    }
  }
  // 缓存避免过多请求，防止接口提供商检测
  // 服务器上的外网IP一般不会变，如果经常变的话就推荐使用DDNS，
  // 而家用PC一般也用不到外网IP，仍然推荐使用DDNS内网穿透。
  if (ips.length > 0) {
    redis.set(redisKey, JSON.stringify(ips), { EX: 3600 * 24 })
  }
  return ips
}