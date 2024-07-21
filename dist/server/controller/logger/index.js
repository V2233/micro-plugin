import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { botInfo } from '../../../env.js';
import { getLatestLog } from './logs.js';

class LogController {
    async logger(ctx) {
        const { id } = ctx.request.query;
        const logs = readdirSync(join(botInfo.WORK_PATH, 'logs'));
        let logText = '';
        let curLog = '';
        if (logs.length == 0) {
            logText = '当前日志为空，请机器人发送消息后刷新日志！';
        }
        else {
            if (id == '0' || !id) {
                curLog = getLatestLog(logs);
                logText = readFileSync(join(botInfo.WORK_PATH, 'logs', curLog), 'utf8');
            }
            else {
                logText = readFileSync(join(botInfo.WORK_PATH, 'logs', id), 'utf8');
                curLog = id;
            }
        }
        ctx.body = {
            code: 200,
            message: 'ok',
            data: {
                logList: logs,
                logText,
                curLog
            }
        };
    }
}
var LogController$1 = new LogController();

export { LogController$1 as default };
