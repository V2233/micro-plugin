import { Cfg } from "#cfg";
import getBotInfo from './botInfo.js';
import { path2URI } from '#utils';
class InfoController {
    async botInfo(ctx) {
        const botInfo = await getBotInfo(Cfg.qq);
        ctx.body = {
            code: 200,
            message: 'success',
            data: botInfo
        };
    }
    async botURI(ctx) {
        ctx.body = {
            code: 200,
            message: 'success',
            data: path2URI()
        };
    }
}
export default new InfoController();
