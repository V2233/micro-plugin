import 'child_process';
import { botInfo } from '../env.js';
import './common.js';
export { default as logger } from './logger.js';
export { getAllWebAddress } from './ipAddress.js';

function path2URI(path = botInfo.WORK_PATH) {
    return `file:///${path}/`;
}

export { path2URI };
