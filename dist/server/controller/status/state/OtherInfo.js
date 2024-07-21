import fs from 'fs';
import _ from 'lodash';
import os from 'os';
import { join } from 'path';
import 'child_process';
import { botInfo } from '../../../../env.js';
import formatDuration from '../../../../utils/formatDuration.js';
import '../../../../utils/common.js';
import '../../../../utils/logger.js';
import '../../../../utils/ipAddress.js';
import { Loader } from '../../../../adapter/index.js';
import { osInfo, si } from './utils.js';

const loader = await Loader();
async function getOtherInfo(e = { isPro: false }) {
    let otherInfo = [];
    otherInfo.push({
        first: "插件",
        tail: getPluginNum(e)
    });
    otherInfo.push({
        first: "系统",
        tail: osInfo?.distro
    });
    otherInfo.push({
        first: "系统运行",
        tail: getSystime()
    });
    otherInfo.push({
        first: "环境版本",
        tail: await getEnvVersion()
    });
    return _.compact(otherInfo);
}
function getSystime() {
    return formatDuration(os.uptime(), "dd天hh小时mm分", false);
}
function getPluginNum(e = { isPro: false }) {
    const dir = botInfo.WORK_PATH + "/plugins";
    const dirArr = fs.readdirSync(dir, { withFileTypes: true });
    const exc = ["example"];
    const plugin = dirArr.filter(i => i.isDirectory() &&
        fs.existsSync(join(dir, i.name, "package.json")) &&
        !exc.includes(i.name));
    const plugins = plugin?.length;
    const jsDir = join(dir, "example");
    let js = 0;
    try {
        js = fs.readdirSync(jsDir)
            ?.filter(item => item.endsWith(".js"))
            ?.length;
    }
    catch (error) {
    }
    const pluginsStr = `${plugins ?? 0} plugins | example ${js ?? 0} js`;
    if (loader && e.isPro) {
        const { priority, task } = loader;
        const loaderStr = `${priority?.length} fnc | ${task?.length} task`;
        return `${pluginsStr} | ${loaderStr}`;
    }
    return pluginsStr;
}
async function getEnvVersion() {
    const { node, v8, git, redis } = await si.versions("node,v8,git,redis");
    return { node, v8, git, redis };
}

export { getOtherInfo as default, getEnvVersion };
