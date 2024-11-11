import { pathToFileURL } from 'url';
import { join } from 'path';
import { botInfo } from '../env.js';

const { WORK_PATH } = botInfo;
async function Plugin() {
    try {
        return global.plugin;
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
        try {
            const puppeteer = (await import(join(WORK_PATH, 'lib/puppeteer/puppeteer.js'))).default;
            return puppeteer;
        }
        catch (error) {
            const puppeteer = (await import(pathToFileURL(join(WORK_PATH, 'lib/puppeteer/puppeteer.js')).toString())).default;
            return puppeteer;
        }
    }
    catch (err) {
        const { puppeteer } = await import('yunzaijs');
        return puppeteer;
    }
}
async function Segment() {
    try {
        return global.segment;
    }
    catch (err) {
        const { Segment } = await import('yunzaijs');
        return Segment;
    }
}
async function Loader() {
    try {
        try {
            const loader = (await import(join(WORK_PATH, "lib/plugins/loader.js"))).default;
            return loader;
        }
        catch (error) {
            const loader = (await import(pathToFileURL(join(WORK_PATH, "lib/plugins/loader.js")).toString())).default;
            return loader;
        }
    }
    catch (err) {
        const { Loader } = await import('yunzaijs');
        return Loader;
    }
}
async function Bot() {
    return global.Bot;
}
async function Logger() {
    return global.logger;
}
async function Redis() {
    return global.redis;
}

export { Bot, Loader, Logger, Plugin, Puppeteer, Redis, Segment };
