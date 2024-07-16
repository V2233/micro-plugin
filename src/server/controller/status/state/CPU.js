import { si } from "./utils.js";
export default async function getCpuInfo() {
    let { currentLoad: { currentLoad }, cpu, fullLoad } = await si.get({
        currentLoad: "currentLoad",
        cpu: "manufacturer,speed,cores",
        fullLoad: "*"
    });
    let { manufacturer, speed, cores } = cpu;
    if (currentLoad == null || currentLoad == undefined)
        return false;
    fullLoad = Math.round(fullLoad);
    manufacturer = manufacturer?.split(" ")?.[0] ?? "unknown";
    return {
        inner: Math.round(currentLoad) / 100,
        title: "CPU",
        info: [
            `${manufacturer}`,
            `${cores}核 ${speed}GHz`,
            `CPU满载率 ${fullLoad}%`
        ]
    };
}
