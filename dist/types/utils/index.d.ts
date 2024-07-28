/// <reference types="node" />
import formatDuration from './formatDuration.js';
import common from './common.js';
import logger from './logger.js';
import Pager from './pager.js';
import Stdlog from './stdlog.js';
import { getAllWebAddress } from './ipAddress.js';
declare function path2URI(path?: string): string;
declare function sleep(ms: number): Promise<any>;
declare function execSync(cmd: string): Promise<unknown>;
declare function makeMd5(data: string | Buffer): string;
export { Pager, logger, common, Stdlog, path2URI, formatDuration, sleep, makeMd5, execSync, getAllWebAddress };
