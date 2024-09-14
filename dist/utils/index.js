import child_process from 'child_process';
import { createHash } from 'node:crypto';
import { botInfo } from '../env.js';
export { default as formatDuration } from './formatDuration.js';
export { default as common } from './common.js';
export { default as Pager } from './pager.js';
export { default as Stdlog } from './stdlog.js';
export { autowired } from './injection.js';
export { getAllWebAddress } from './ipAddress.js';
export { getLoader } from './getLoader.js';

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
function isPrivateIP(ip) {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) {
        return true;
    }
    else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
        return true;
    }
    else if (parts[0] === 192 && parts[1] === 168) {
        return true;
    }
    else if (parts[0] === 169 && parts[1] === 254) {
        return true;
    }
    return false;
}

export { execSync, isPrivateIP, makeMd5, path2URI, sleep };
