export let si: any = false
export let osInfo = null
export let colorthief = null

/**
 * 异步初始化系统信息依赖
 * 该函数尝试导入'systeminformation'模块，并获取操作系统信息。
 * 如果导入失败，将根据错误类型打印不同警告信息。
 * @returns {Promise<any>} 返回systeminformation模块的实例，如果导入失败则可能返回undefined。
 */
export async function initDependence() {
  if (si) return si
  try {
    si = await import("systeminformation")
    osInfo = await si.osInfo()
    return si
  } catch (error) {
    if (error.stack?.includes("Cannot find package")) {
      logger.warn(`缺少依赖，请运行：${logger.red("pnpm add systeminformation -w")}`)

      logger.debug(decodeURI(error.stack))
    } else {
      logger.error(`载入错误：${logger.red("systeminformation")}`)
      logger.error(decodeURI(error.stack))
    }
  }
}

await initDependence()

/**
 * 将字节大小转换成易读的文件大小格式
 * @param {number} size - 要转换的字节大小
 * @param {object} options - 转换选项
 * @param {number} options.decimalPlaces - 小数点保留位数，默认为2
 * @param {boolean} options.showByte - 是否在大小小于1KB时显示字节单位B，默认为true
 * @param {boolean} options.showSuffix - 是否在单位后面显示缩写，默认为true
 * @returns {string} 转换后的文件大小字符串
 */
export function getFileSize(size, { decimalPlaces = 2, showByte = true, showSuffix = true } = {}) {
  // 检查 size 是否为 null 或 undefined
  if (size === null || size === undefined) return 0 + "B"

  // 检查 decimalPlaces 是否为整数
  if (typeof decimalPlaces !== "number" || !Number.isInteger(decimalPlaces)) {
    throw new Error("decimalPlaces 必须是一个整数")
  }

  const units = ["B", "K", "M", "G", "T"]
  const powers = [0, 1, 2, 3, 4]
  const num = 1024.00 // byte

  // 提前计算 powers of 1024
  const precalculated = powers.map(power => Math.pow(num, power))

  let unitIndex = 0
  while (size >= precalculated[unitIndex + 1] && unitIndex < precalculated.length - 1) {
    unitIndex++
  }

  // 使用一个函数来构建返回的字符串
  const buildSizeString = (value, unit, _showSuffix = showSuffix) => {
    const suffix = ` ${unit}${_showSuffix ? "B" : ""}`
    return value.toFixed(decimalPlaces) + suffix
  }

  if (showByte && size < num) {
    return buildSizeString(size, "B", false)
  }

  return buildSizeString(size / precalculated[unitIndex], units[unitIndex])
}

