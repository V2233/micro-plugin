import _ from "lodash";
import { getFileSize, si } from "./utils.js";
import Monitor from "./Monitor.js";
export async function getFsSize() {
    let HardDisk = _.uniqWith(await si.fsSize(), (a, b) => a.used === b.used && a.size === b.size && a.use === b.use && a.available === b.available)
        .filter(item => item.size && item.used && item.available && item.use);
    if (_.isEmpty(HardDisk))
        return false;
    return HardDisk.map(item => {
        item.percentage = +(+item.used / +item.size).toFixed(2);
        item.used = getFileSize(item.used);
        item.size = getFileSize(item.size);
        item.use = Math.round(item.use);
        return item;
    });
}
export function getDiskSpeed() {
    let fsStats = Monitor.fsStats;
    if (!fsStats || fsStats.rx_sec == null || fsStats.wx_sec == null) {
        return false;
    }
    return {
        rx_sec: getFileSize(fsStats.rx_sec, { showByte: false, showSuffix: false }),
        wx_sec: getFileSize(fsStats.wx_sec, { showByte: false, showSuffix: false })
    };
}
