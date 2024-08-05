import { Logger,Bot } from "#bot"
import chalk from "chalk"

const logger = await Logger()
const bot = await Bot()

class Stdlog {
    nickname(id: string | number) {
        let symbol = ""
        if(String(id).includes(':')) {
            const arg = String(id).split(':')
            symbol = arg[1]
            id = arg[0]
        } else {
            symbol = ">"
        }
        return chalk.hex('#00FFFF')(bot?.[id]?.nickname ? `<${bot?.[id]?.nickname}:${id}${symbol}` : (id ? `<Bot:${id}${symbol}` : ''))
    }
    info(id: string | number, ...log:any) {
        logger.info(this.nickname(id) || '', ...log)
    }
    mark(id: string | number, ...log:any) {
        logger.mark(this.nickname(id) || '', ...log)
    }
    error(id: string | number, ...log:any) {
        logger.error(this.nickname(id) || '', ...log)
    }
    warn(id: string | number, ...log:any) {
        logger.warn(this.nickname(id) || '', ...log)
    }
    debug(id: string | number, ...log:any) {
        logger.debug(this.nickname(id) || '', ...log)
    }
    trace(id: string | number, ...log:any) {
        logger.trace(this.nickname(id) || '', ...log)
    }
    fatal(id: string | number, ...log:any) {
        logger.fatal(this.nickname(id) || '', ...log)
    }
}

export default new Stdlog