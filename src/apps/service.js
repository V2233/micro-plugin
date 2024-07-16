import { Plugin } from '#bot';
import microWs from '../server/index.js';
let plugin = await Plugin();
export class Service extends plugin {
    e;
    constructor() {
        super({
            name: "ws服务",
            event: "message"
        });
    }
    async accept() {
        const { msg, message, group_name, group_id, sender } = this.e;
        if (!sender.user_id) {
            sender.user_id = this.e.user_id;
        }
        microWs.sendMsg({ msg, message, group_name, group_id, sender }, 'e_info');
        return true;
    }
}
