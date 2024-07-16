import { Cfg } from "#cfg";
import getBotInfo from './botInfo.js'
import { path2URI } from '#utils'

class InfoController {

    // 获取机器人基本信息
    async botInfo(ctx) {

        const botInfo = await getBotInfo(Cfg.qq)

        ctx.body = {
            code: 200,
            message: 'success',
            data: botInfo
        }
    }

    // 获取工作URI
    async botURI(ctx) {

        ctx.body = {
            code: 200,
            message: 'success',
            data: path2URI()
        }
    }

}

export default new InfoController()