import { join } from 'path';
import { readFileSync } from 'fs';
const WORK_PATH = process.cwd().replace(/\\/g, '/');
const botPackageObj = JSON.parse(readFileSync(join(WORK_PATH, 'package.json'), 'utf8'));
export const botInfo = {
    WORK_PATH,
    BOT_NAME: botPackageObj.name,
    BOT_VERSION: botPackageObj.version,
    BOT_DESC: botPackageObj.description,
    BOT_AUTHOR: botPackageObj.author
};
