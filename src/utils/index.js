import child_process from "child_process";
import { botInfo } from "#env";
import formatDuration from './formatDuration.js';
import common from './common.js';
import logger from './logger.js';
import Pager from './pager.js';
import { getAllWebAddress } from './ipAddress.js';
function path2URI(path = botInfo.WORK_PATH) {
    return `file:///${path}/`;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function execSync(cmd) {
    return new Promise((resolve) => {
        child_process.exec(cmd, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}
export { logger, common, Pager, path2URI, formatDuration, sleep, execSync, getAllWebAddress };
