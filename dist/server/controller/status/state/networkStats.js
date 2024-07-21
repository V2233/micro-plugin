import { si, getFileSize } from './utils.js';

async function getNetwork() {
    return (await si.get({
        networkStats: "rx_bytes,tx_bytes,iface"
    })).networkStats.map((item) => ({
        rx_bytes: getFileSize(item.rx_bytes),
        tx_bytes: getFileSize(item.tx_bytes),
        iface: item.iface
    }));
}

export { getNetwork as default };
