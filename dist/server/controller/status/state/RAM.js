import { getFileSize } from './utils.js';
import os from 'os';

async function getMemUsage() {
    const total = os.totalmem();
    const active = total - os.freemem();
    const activePercentage = (active / total).toFixed(2);
    const totalMem = getFileSize(total);
    const activeMem = getFileSize(active);
    return {
        inner: `${Math.round(Number(activePercentage) * 100)}%`,
        title: "RAM",
        info: [
            `${activeMem} / ${totalMem}`
        ]
    };
}

export { getMemUsage as default };
