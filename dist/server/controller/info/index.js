import Cfg from '../../../config/config.js';
import 'fs';
import 'yaml';
import 'lodash';
import 'chokidar';
import getBotInfo from './botInfo.js';
import { path2URI } from '../../../utils/index.js';

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
var InfoController$1 = new InfoController();

export { InfoController$1 as default };
