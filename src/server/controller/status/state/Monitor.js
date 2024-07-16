import _ from "lodash";
import { si, initDependence } from "./utils.js";
import { Redis } from '#bot';
const redis = await Redis();
export default new class Monitor {
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
                upload: [],
                download: []
            },
            fsStats: {
                readSpeed: [],
                writeSpeed: []
            },
            cpu: [],
            ram: []
        };
        this.valueObject = {
            networkStats: "rx_bytes,tx_bytes,iface",
            currentLoad: "currentLoad",
            mem: "active",
        };
        this.chartDataKey = "Micro:state:chartData";
        this.init();
    }
    set network(value) {
        if (_.isNumber(value[0]?.tx_bytes) && _.isNumber(value[0]?.rx_bytes)) {
            this._network = value;
            this._addData(this.chartData.network.upload, [Date.now(), value[0].tx_bytes]);
            this._addData(this.chartData.network.download, [Date.now(), value[0].rx_bytes]);
        }
    }
    get network() {
        return this._network;
    }
    set fsStats(value) {
        if (_.isNumber(value?.wx_bytes) && _.isNumber(value?.rx_bytes)) {
            this._fsStats = value;
            this._addData(this.chartData.fsStats.writeSpeed, [Date.now(), value.wx_bytes]);
            this._addData(this.chartData.fsStats.readSpeed, [Date.now(), value.rx_bytes]);
        }
    }
    get fsStats() {
        return this._fsStats;
    }
    async init() {
        if (!await initDependence())
            return;
        await this.getRedisChartData();
        this.getData();
        const Timer = setInterval(async () => {
            let data = await this.getData();
            if (_.isEmpty(data))
                clearInterval(Timer);
        }, 60000);
    }
    async getData() {
        const data = await si.get(this.valueObject);
        const { networkStats, mem: { active }, currentLoad: { currentLoad } } = data;
        this.network = networkStats;
        if (_.isNumber(active)) {
            this._addData(this.chartData.ram, [Date.now(), active]);
        }
        if (_.isNumber(currentLoad)) {
            this._addData(this.chartData.cpu, [Date.now(), currentLoad]);
        }
        this.setRedisChartData();
        return data;
    }
    async getRedisChartData() {
        let data = await redis.get(this.chartDataKey);
        if (data) {
            this.chartData = JSON.parse(data);
            return true;
        }
        return false;
    }
    async setRedisChartData() {
        try {
            await redis.set(this.chartDataKey, JSON.stringify(this.chartData), { EX: 86400 });
        }
        catch (error) {
            console.log(error);
        }
    }
    _addData(arr, data, maxLen = 60) {
        if (data === null || data === undefined)
            return;
        if (arr.length >= maxLen) {
            _.pullAt(arr, 0);
        }
        arr.push(data);
    }
}();
