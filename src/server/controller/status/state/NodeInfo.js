import os from "os";
import { getFileSize } from "./utils.js";
export default async function getNodeInfo() {
    let memory = process.memoryUsage();
    let rss = getFileSize(memory.rss);
    let heapTotal = getFileSize(memory.heapTotal);
    let heapUsed = getFileSize(memory.heapUsed);
    let occupy = Number((memory.rss / (os.totalmem() - os.freemem())).toFixed(2));
    return {
        inner: Math.round(occupy * 100),
        title: "Node",
        info: {
            rss,
            heapTotal,
            heapUsed,
            occupy
        }
    };
}
