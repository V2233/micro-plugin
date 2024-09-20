import _ from 'lodash';
import { initDependence, si } from './utils.js';

var Monitor = new class Monitor {
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
        this.getData();
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
        return data;
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

export { Monitor as default };
