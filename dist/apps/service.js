import { Bot, Plugin } from '../adapter/index.js';
import microWs from '../server/index.js';

let bot = await Bot();
let plugin = await Plugin();
class Service extends plugin {
    constructor() {
        super({
            name: "ws服务",
            event: "message"
        });
        this.priority = 4000;
        this.init();
    }
    async init() {
        try {
            bot.on?.("message", async (e) => {
                this.e = e;
                await this.listen();
            });
        }
        catch (err) {
        }
    }
    async listen() {
        const { msg, message, group_name, group_id, sender } = this.e;
        if (!sender.user_id) {
            sender.user_id = this.e.user_id;
        }
        microWs.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info');
        return true;
    }
}

export { Service };
