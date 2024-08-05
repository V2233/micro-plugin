import { pathToFileURL } from 'url';
import { join } from 'path';
import { botInfo } from '../env.js';

const { WORK_PATH } = botInfo;
async function Plugin() {
    try {
        const { Plugin } = await import('yunzai');
        return Plugin;
    }
    catch (err) {
        try {
            const plugin = (await import(join(WORK_PATH, 'lib/plugins/plugin.js'))).default;
            return plugin;
        }
        catch (error) {
            const plugin = (await import(pathToFileURL(join(WORK_PATH, 'lib/plugins/plugin.js')).toString())).default;
            return plugin;
        }
    }
}
async function Puppeteer() {
    try {
        const { puppeteer } = await import('yunzai');
        return puppeteer;
    }
    catch (err) {
        try {
            const puppeteer = (await import(join(WORK_PATH, 'lib/puppeteer/puppeteer.js'))).default;
            return puppeteer;
        }
        catch (error) {
            const puppeteer = (await import(pathToFileURL(join(WORK_PATH, 'lib/puppeteer/puppeteer.js')).toString())).default;
            return puppeteer;
        }
    }
}
async function Segment() {
    try {
        const Segment = global.segment;
        return Segment;
    }
    catch (err) {
        const { Segment } = await import('yunzai');
        return Segment;
    }
}
async function Loader() {
    try {
        const { Loader } = await import('yunzai');
        return Loader;
    }
    catch (err) {
        try {
            const loader = (await import(join(WORK_PATH, "lib/plugins/loader.js"))).default;
            return loader;
        }
        catch (error) {
            const loader = (await import(pathToFileURL(join(WORK_PATH, "lib/plugins/loader.js")).toString())).default;
            return loader;
        }
    }
}
async function Bot() {
    try {
        const bot = global.Bot;
        return bot;
    }
    catch (err) {
        const { Bot } = await import('yunzai');
        return Bot;
    }
}
async function Logger() {
    try {
        const logger = global.logger;
        return logger;
    }
    catch (err) {
    }
}
async function Redis() {
    try {
        const redis = global.redis;
        return redis;
    }
    catch (err) {
        const { Redis } = await import('yunzai');
        return Redis;
    }
}

export { Bot, Loader, Logger, Plugin, Puppeteer, Redis, Segment };
