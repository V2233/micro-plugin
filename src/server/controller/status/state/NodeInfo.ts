import os from "os"
import { getFileSize } from "./utils.js"

/** 获取nodejs内存情况 */
export default async function getNodeInfo() {
  // if (Config.state.closedNodeInfo) return false
  let memory = process.memoryUsage()
  // 总共
  let rss = getFileSize(memory.rss)
  // 堆
  let heapTotal = getFileSize(memory.heapTotal)
  // 栈
  let heapUsed = getFileSize(memory.heapUsed)
  // 占用率
  let occupy = Number((memory.rss / (os.totalmem() - os.freemem())).toFixed(2))
  return {
    inner: Math.round(occupy * 100),
    title: "Node",
    info: {
      rss,
      heapTotal,
      heapUsed,
      occupy
    }
  }
}
