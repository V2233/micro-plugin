export async function Plugin() {
    try {
        const { Plugin } = await import('yunzai/core');
        return Plugin;
    }
    catch (err) {
        const plugin = (await import('../../../../lib/plugins/plugin.js')).default;
        return plugin;
    }
}
export async function Puppeteer() {
    try {
        const { puppeteer } = await import('yunzai/utils');
        return puppeteer;
    }
    catch (err) {
        const puppeteer = (await import('../../../../lib/puppeteer/puppeteer.js')).default;
        return puppeteer;
    }
}
export async function Segment() {
    try {
        const { Segment } = await import('yunzai/core');
        return Segment;
    }
    catch (err) {
        const Segment = global.segment;
        return Segment;
    }
}
export async function Loader() {
    try {
        const { loader } = await import("yunzai/core");
        return loader;
    }
    catch (err) {
        const loader = (await import("../../../../lib/plugins/loader.js")).default;
        return loader;
    }
}
export async function Bot() {
    try {
        const { Bot } = await import('yunzai/core');
        return Bot;
    }
    catch (err) {
        const bot = global.Bot;
        return bot;
    }
}
export async function Logger() {
    try {
        const logger = global.logger;
        return logger;
    }
    catch (err) {
    }
}
export async function Redis() {
    try {
        const { Redis } = await import('yunzai/db');
        return Redis;
    }
    catch (err) {
        const redis = global.redis;
        return redis;
    }
}
