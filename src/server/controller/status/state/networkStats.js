import { si, getFileSize } from "./utils.js";
export default async function getNetwork() {
    return (await si.get({
        networkStats: "rx_bytes,tx_bytes,iface"
    })).networkStats.map((item) => ({
        rx_bytes: getFileSize(item.rx_bytes),
        tx_bytes: getFileSize(item.tx_bytes),
        iface: item.iface
    }));
}
