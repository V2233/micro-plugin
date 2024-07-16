import { si, initDependence } from "./utils.js";
import { Logger } from '#bot';
const logger = await Logger();
let isGPU = false;
(async function initGetIsGPU() {
    if (!await initDependence())
        return;
    const { controllers } = await si.graphics();
    if (controllers?.find(item => item.memoryUsed && item.memoryFree && item.utilizationGpu)) {
        isGPU = true;
    }
})();
export default async function getGPU() {
    if (!isGPU)
        return false;
    try {
        const { controllers } = await si.graphics();
        let graphics = controllers?.find(item => item.memoryUsed && item.memoryFree && item.utilizationGpu);
        if (!graphics) {
            logger.warn("GPU数据异常：\n", controllers);
            return false;
        }
        let { vendor, temperatureGpu, utilizationGpu, memoryTotal, memoryUsed, model } = graphics;
        temperatureGpu && (temperatureGpu = temperatureGpu + "℃");
        return {
            inner: Math.round(utilizationGpu) / 100,
            title: "GPU",
            info: {
                used: (memoryUsed / 1024).toFixed(2),
                total: (memoryTotal / 1024).toFixed(2),
                vendor,
                model,
                temperatureGpu
            }
        };
    }
    catch (e) {
        logger.warn("获取GPU失败");
        return false;
    }
}
