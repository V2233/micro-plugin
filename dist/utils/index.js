import child_process from 'child_process';
import { createHash } from 'node:crypto';
import { botInfo } from '../env.js';
export { default as formatDuration } from './formatDuration.js';
export { default as common } from './common.js';
export { default as logger } from './logger.js';
export { default as Pager } from './pager.js';
export { default as Stdlog } from './stdlog.js';
export { getAllWebAddress } from './ipAddress.js';

function path2URI(path = botInfo.WORK_PATH) {
    return `file://${path}/`;
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
function makeMd5(data) {
    return createHash("md5").update(data).digest("hex");
}

export { execSync, makeMd5, path2URI, sleep };
