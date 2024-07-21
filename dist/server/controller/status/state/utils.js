import { Logger } from '../../../../adapter/index.js';

let si = false;
let osInfo = null;
let colorthief = null;
const logger = await Logger();
async function initDependence() {
    if (si)
        return si;
    try {
        si = await import('systeminformation');
        osInfo = await si.osInfo();
        return si;
    }
    catch (error) {
        if (error.stack?.includes("Cannot find package")) {
            logger.warn(`缺少依赖，请运行：${logger.red("pnpm add systeminformation -w")}`);
            logger.debug(decodeURI(error.stack));
        }
        else {
            logger.error(`载入错误：${logger.red("systeminformation")}`);
            logger.error(decodeURI(error.stack));
        }
    }
}
await initDependence();
function getFileSize(size, { decimalPlaces = 2, showByte = true, showSuffix = true } = {}) {
    if (size === null || size === undefined)
        return 0 + "B";
    if (typeof decimalPlaces !== "number" || !Number.isInteger(decimalPlaces)) {
        throw new Error("decimalPlaces 必须是一个整数");
    }
    const units = ["B", "K", "M", "G", "T"];
    const powers = [0, 1, 2, 3, 4];
    const num = 1024.00;
    const precalculated = powers.map(power => Math.pow(num, power));
    let unitIndex = 0;
    while (size >= precalculated[unitIndex + 1] && unitIndex < precalculated.length - 1) {
        unitIndex++;
    }
    const buildSizeString = (value, unit, _showSuffix = showSuffix) => {
        const suffix = ` ${unit}${_showSuffix ? "B" : ""}`;
        return value.toFixed(decimalPlaces) + suffix;
    };
    if (showByte && size < num) {
        return buildSizeString(size, "B", false);
    }
    return buildSizeString(size / precalculated[unitIndex], units[unitIndex]);
}

export { colorthief, getFileSize, initDependence, osInfo, si };
