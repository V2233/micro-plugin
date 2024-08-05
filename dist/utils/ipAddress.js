import os from 'os';
import fetch from 'node-fetch';
import '../config/index.js';
import { Redis, Logger } from '../adapter/index.js';
import Cfg from '../config/config.js';

const redis = await Redis();
const logger = await Logger();
async function getAllWebAddress() {
    const { server } = Cfg.getConfig('server');
    let host = server.host;
    let port = server.port;
    port = Number.parseInt(port);
    port = port === 80 ? null : port;
    let custom = [];
    let local = getAutoIps(port, true);
    let remote = await getRemoteIps();
    if (remote && remote.length > 0) {
        remote = remote.map((i) => joinHttpPort(i, port));
    }
    if (host) {
        if (!Array.isArray(host)) {
            host = [host];
        }
        for (let h of host) {
            if (h && h !== 'auto') {
                custom.push(joinHttpPort(h, port));
            }
        }
    }
    let mountRoot = '/';
    mountRoot = mountRoot === '/' ? '' : mountRoot;
    if (mountRoot) {
        custom = custom.map((i) => i + mountRoot);
        local = local.map((i) => i + mountRoot);
        remote = remote.map((i) => i + mountRoot);
    }
    return { custom, local, remote };
}
function joinHttpPort(ip, port) {
    ip = /^http/.test(ip) ? ip : 'http://' + ip;
    return `${ip}${port ? ':' + port : ''}`;
}
function getWebAddress(allIp = false) {
    const { server } = Cfg.getConfig('server');
    let host = server.host;
    let port = server.port;
    port = Number.parseInt(port);
    port = port === 80 ? null : port;
    let hosts = [];
    if (host === 'auto') {
        hosts.push(...getAutoIps(port, allIp));
    }
    else {
        if (!Array.isArray(host)) {
            host = [host];
        }
        for (let item of host) {
            if (item === 'auto') {
                hosts.push(...getAutoIps(port, allIp));
            }
            else {
                item = /^http/.test(item) ? item : 'http://' + item;
                hosts.push(`${item}${port ? ':' + port : ''}`);
            }
        }
    }
    let mountRoot = '/';
    mountRoot = mountRoot === '/' ? '' : mountRoot;
    if (mountRoot) {
        hosts = hosts.map((i) => i + mountRoot);
    }
    return hosts;
}
function getAutoIps(port, allIp) {
    let ips = getLocalIps(port);
    if (ips.length === 0) {
        ips.push(`localhost${port ? ':' + port : ''}`);
    }
    if (allIp) {
        return ips.map(ip => `http://${ip}`);
    }
    else {
        return [`http://${ips[0]}`];
    }
}
function getLocalIps(port) {
    let ips = [];
    port = port ? `:${port}` : '';
    try {
        let networks = os.networkInterfaces();
        for (let [name, wlans] of Object.entries(networks)) {
            for (let wlan of wlans) {
                if (name != 'lo' && name != 'docker0' && wlan.address.slice(0, 2) != 'fe' && wlan.address.slice(0, 2) != 'fc') {
                    if (['127.0.0.1', '::1'].includes(wlan.address)) {
                        continue;
                    }
                    if (wlan.family === 'IPv6') {
                        ips.push(`[${wlan.address}]${port}`);
                    }
                    else {
                        ips.push(`${wlan.address}${port}`);
                    }
                }
            }
        }
    }
    catch (e) {
        let err = e?.stack || e?.message || e;
        err = err ? err.toString() : '';
        if (/Unknown system error 13/i.test(err)) {
            logger.warn('[Micro-Plugin] 由于系统限制，无法获取到IP地址，仅显示本地回环地址。该问题目前暂无方案解决，但不影响Micro-Plugin使用，您可手动配置自定义地址。');
            ips.push(`localhost${port}`);
        }
        else {
            logger.error(`错误：${logger.red(e)}`);
        }
    }
    if (ips.length === 0) {
        logger.warn('[Micro-Plugin] 无法获取到IP地址，仅显示本地回环地址，详情请查看以上报错。');
        ips.push(`localhost${port}`);
    }
    return ips;
}
async function getRemoteIps() {
    let redisKey = 'Yz:Micro:remote-ips:3';
    let cacheData = await redis.get(redisKey);
    let ips;
    if (cacheData) {
        ips = JSON.parse(cacheData);
        if (Array.isArray(ips) && ips.length > 0) {
            return ips;
        }
    }
    ips = [];
    let apis = [
        'http://v4.ip.zxinc.org/info.php?type=json',
    ];
    for (let api of apis) {
        let response;
        try {
            response = await fetch(api);
        }
        catch {
            continue;
        }
        if (response.status === 200) {
            let { code, data } = await response.json();
            if (code === 0) {
                ips.push(data.myip);
            }
        }
    }
    if (ips.length > 0) {
        redis.set(redisKey, JSON.stringify(ips), { EX: 3600 * 24 });
    }
    return ips;
}

export { getAllWebAddress, getLocalIps, getRemoteIps, getWebAddress };
