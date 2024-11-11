import { pathToFileURL } from 'url';
import { join } from 'path';
import { botInfo } from '#env';

const {WORK_PATH} = botInfo

export async function Plugin() {
    try {
        return global.plugin
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
        try {
            const puppeteer = (await import(join(WORK_PATH,'lib/puppeteer/puppeteer.js'))).default
            return puppeteer
        } catch(error) {
            const puppeteer = (await import(pathToFileURL(join(WORK_PATH,'lib/puppeteer/puppeteer.js')).toString())).default
            return puppeteer
        }
    } catch (err) {
        const { puppeteer } = await import('yunzaijs')
        return puppeteer
    }
}

export async function Segment():Promise<typeof global.segment> {
    try {
        return global.segment
    } catch (err) {
        const { Segment } = await import('yunzaijs')
        return Segment
    }
}

export async function Loader() {
    try {
        
        try {
            const loader = (await import(join(WORK_PATH,"lib/plugins/loader.js"))).default
            return loader
        } catch(error) {
            const loader = (await import(pathToFileURL(join(WORK_PATH,"lib/plugins/loader.js")).toString())).default
            return loader
        }
    } catch (err) {
        const { Loader } = await import("yunzaijs")
        return Loader
    }
}

export async function Bot():Promise<typeof global.Bot> {
    return global.Bot
}

export async function Logger():Promise<typeof global.logger> {
    return global.logger
}

export async function Redis():Promise<import("redis").RedisClientType> {
    return global.redis
}