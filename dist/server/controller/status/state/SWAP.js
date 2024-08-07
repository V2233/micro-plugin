import { si, getFileSize } from './utils.js';

async function getSwapInfo() {
    const swapData = await si.get({
        mem: "swaptotal,swapused,swapfree"
    });
    const { mem: { swaptotal, swapused } } = swapData;
    const swapUsagePercentage = (swapused / swaptotal) * 100;
    const formatSwaptotal = getFileSize(swaptotal);
    const formatSwapused = getFileSize(swapused);
    return {
        inner: `${Math.round(swapUsagePercentage)}%`,
        percentage: Math.round(swapUsagePercentage),
        title: "SWAP",
        info: [formatSwapused, formatSwaptotal]
    };
}

export { getSwapInfo as default };
