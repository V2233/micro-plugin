import { readdirSync, readFileSync } from "fs";
import { join } from 'path'
import { botInfo } from "#env";

import { getLatestLog, parseLog } from "./logs.js";

let curLogs = []
let curLog = ''

class LogController {
    // 日志展示
    async logger(ctx: any) {
        const { id, page, size } = ctx.request.query
        const logs = readdirSync(join(botInfo.WORK_PATH, 'logs'))

        let logText = ''
        let resLogs = []
        let p = page || 0
        let pageSize = +size || 50

        if (logs.length == 0) {
            resLogs = [{
                time: '',
                level: 'WARN',
                detail: '当前日志为空，请机器人发送消息后刷新日志！',
            }]
        } else {
            if (id != curLog) {
                if (id == '0' || !id) {
                    curLog = getLatestLog(logs)
                    logText = readFileSync(join(botInfo.WORK_PATH, 'logs', curLog), 'utf8')
                } else {
                    logText = readFileSync(join(botInfo.WORK_PATH, 'logs', id), 'utf8')
                    curLog = id
                }
                curLogs = logText.split('\n')
            }

            let start = pageSize * p
            const sliceLogs = curLogs.slice(start, Math.min(start + pageSize, curLogs.length))
            resLogs = sliceLogs.map(line => parseLog(line.trim()))
        }

        ctx.body = {
            code: 200,
            message: 'ok',
            data: {
                logList: logs,
                logs: resLogs,
                curLog,
                page: p
            }
        }
    }
}

export default new LogController()