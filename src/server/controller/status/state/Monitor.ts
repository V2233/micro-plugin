import _ from "lodash"
import { si, initDependence } from "./utils.js"

export default new class Monitor {
  _network: any
  _fsStats: any
  chartData: any
  valueObject: any
  chartDataKey: string
  constructor() {
    // 网络
    this._network = null
    // 读写速率
    this._fsStats = null
    // 记录60条数据一分钟记录一次
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
    }
    this.valueObject = {
      networkStats: "rx_bytes,tx_bytes,iface",
      currentLoad: "currentLoad",
      mem: "active",
    }

    this.init()
  }

  set network(value) {
    if (_.isNumber(value[0]?.tx_bytes) && _.isNumber(value[0]?.rx_bytes)) {
      this._network = value
      this._addData(this.chartData.network.upload, [Date.now(), value[0].tx_bytes])
      this._addData(this.chartData.network.download, [Date.now(), value[0].rx_bytes])
    }
  }

  get network() {
    return this._network
  }

  set fsStats(value) {
    if (_.isNumber(value?.wx_bytes) && _.isNumber(value?.rx_bytes)) {
      this._fsStats = value
      this._addData(this.chartData.fsStats.writeSpeed, [Date.now(), value.wx_bytes])
      this._addData(this.chartData.fsStats.readSpeed, [Date.now(), value.rx_bytes])
    }
  }

  get fsStats() {
    return this._fsStats
  }

  async init() {
    if (!await initDependence()) return

    this.getData()
  }

  async getData() {
    const data = await si.get(this.valueObject)

    const {
      networkStats,
      mem: { active },
      currentLoad: { currentLoad }
    } = data

    this.network = networkStats
    if (_.isNumber(active)) {
      this._addData(this.chartData.ram, [Date.now(), active])
    }
    if (_.isNumber(currentLoad)) {
      this._addData(this.chartData.cpu, [Date.now(), currentLoad])
    }

    return data
  }

  /**
   * 向数组中添加数据，如果数组长度超过允许的最大值，则删除最早添加的数据
   * @param {Array} arr - 要添加数据的数组
   * @param {*} data - 要添加的新数据
   * @param {number} [maxLen] - 数组允许的最大长度，默认值为60
   * @returns {void}
   */
  _addData(arr:any, data:any, maxLen = 60) {
    if (data === null || data === undefined) return
    // 如果数组长度超过允许的最大值，删除第一个元素
    if (arr.length >= maxLen) {
      _.pullAt(arr, 0)
    }
    // 添加新数据
    arr.push(data)
  }
}()
