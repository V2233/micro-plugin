import formatDuration from './formatDuration.js';
import common from './common.js';
import logger from './logger.js';
import Pager from './pager.js';
import { getAllWebAddress } from './ipAddress.js';
declare function path2URI(path?: string): string;
declare function sleep(ms: number): Promise<any>;
declare function execSync(cmd: string): Promise<unknown>;
export { logger, common, Pager, path2URI, formatDuration, sleep, execSync, getAllWebAddress };
