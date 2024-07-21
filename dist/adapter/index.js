import { join } from 'path';
import { botInfo } from '../env.js';

const { WORK_PATH } = botInfo;
async function Plugin() {
    try {
        const { Plugin } = await import('yunzai');
        return Plugin;
    }
    catch (err) {
        const plugin = (await import(join(WORK_PATH, 'lib/plugins/plugin.js'))).default;
        return plugin;
    }
}
async function Puppeteer() {
    try {
        const { puppeteer } = await import('yunzai');
        return puppeteer;
    }
    catch (err) {
        const puppeteer = (await import(join(WORK_PATH, 'lib/puppeteer/puppeteer.js'))).default;
        return puppeteer;
    }
}
async function Segment() {
    try {
        const { Segment } = await import('yunzai');
        return Segment;
    }
    catch (err) {
        const Segment = global.segment;
        return Segment;
    }
}
async function Loader() {
    try {
        const { Loader } = await import('yunzai');
        return Loader;
    }
    catch (err) {
        const loader = (await import(join(WORK_PATH, "lib/plugins/loader.js"))).default;
        return loader;
    }
}
async function Bot() {
    try {
        const { Bot } = await import('yunzai');
        return Bot;
    }
    catch (err) {
        const bot = global.Bot;
        return bot;
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
        const { Redis } = await import('yunzai');
        return Redis;
    }
    catch (err) {
        const redis = global.redis;
        return redis;
    }
}

export { Bot, Loader, Logger, Plugin, Puppeteer, Redis, Segment };
