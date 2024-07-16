import { getFileSize, si } from "./utils.js";
export default async function getMemUsage() {
    const { mem: { total, active, buffcache } } = await si.get({
        mem: "total,used,active,buffcache"
    });
    const activePercentage = (active / total).toFixed(2);
    const buffcacheMem = getFileSize(buffcache);
    const totalMem = getFileSize(total);
    const activeMem = getFileSize(active);
    const isBuff = buffcache && buffcache != 0;
    return {
        inner: `${Math.round(Number(activePercentage) * 100)}%`,
        title: "RAM",
        info: [
            `${activeMem} / ${totalMem}`,
            isBuff ? `缓冲区/缓存 ${buffcacheMem}` : ""
        ],
        buffcache: {
            isBuff
        }
    };
}
