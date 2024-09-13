import { pathToFileURL } from 'url';
import { join } from 'path';
import { botInfo } from '#env';

const {WORK_PATH} = botInfo

export async function Plugin() {
    try {
        const { Plugin } = await import('yunzai')
        return Plugin
    } catch (err) {
        try {
            const plugin = (await import(join(WORK_PATH,'lib/plugins/plugin.js'))).default
            return plugin
        } catch(error) {
            const plugin = (await import(pathToFileURL(join(WORK_PATH,'lib/plugins/plugin.js')).toString())).default
            return plugin
        }
    }
}

export async function Puppeteer() {
    try {
        const { puppeteer } = await import('yunzai')
        return puppeteer
    } catch (err) {
        try {
            const puppeteer = (await import(join(WORK_PATH,'lib/puppeteer/puppeteer.js'))).default
            return puppeteer
        } catch(error) {
            const puppeteer = (await import(pathToFileURL(join(WORK_PATH,'lib/puppeteer/puppeteer.js')).toString())).default
            return puppeteer
        }
    }
}

export async function Segment():Promise<typeof global.segment> {
    try {
        const Segment = global.segment
        return Segment
    } catch (err) {
        const { Segment } = await import('yunzai')
        return Segment
    }
}

export async function Loader() {
    try {
        const { Loader } = await import("yunzai")
        return Loader
    } catch (err) {
        try {
            const loader = (await import(join(WORK_PATH,"lib/plugins/loader.js"))).default
            return loader
        } catch(error) {
            const loader = (await import(pathToFileURL(join(WORK_PATH,"lib/plugins/loader.js")).toString())).default
            return loader
        }
    }
}

export async function Bot():Promise<typeof global.Bot> {
    try {
        const bot = global.Bot
        return bot
    } catch (err) {
        const { Bot } = await import('yunzai')
        return Bot as typeof global.Bot
    }
}

export async function Logger():Promise<typeof global.logger> {
    try {
        const logger = global.logger
        return logger
    } catch (err) {

    }
}

export async function Redis():Promise<import("redis").RedisClientType> {
    try {
        const redis = global.redis
        return redis
    } catch (err) {
        const { Redis } = await import('yunzai')
        return Redis as import("redis").RedisClientType
    }
}