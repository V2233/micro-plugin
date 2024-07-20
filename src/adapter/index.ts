
export async function Plugin() {
    try {
        const { Plugin } = await import('yunzai')
        return Plugin
    } catch (err) {
        //@ts-ignore
        // const plugin = (await import('../../../../lib/plugins/plugin.js')).default
        // return plugin
    }
}

export async function Puppeteer() {
    try {
        const { puppeteer } = await import('yunzai')
        return puppeteer
    } catch (err) {
        //@ts-ignore
        // const puppeteer = (await import('../../../../lib/puppeteer/puppeteer.js')).default
        // return puppeteer
    }
}

export async function Segment() {
    try {
        const { Segment } = await import('yunzai')
        return Segment
    } catch (err) {
        //@ts-ignore
        // const Segment = global.segment
        // return Segment
    }
}

export async function Loader() {
    try {
        const { Loader } = await import("yunzai")
        return Loader
    } catch (err) {
        //@ts-ignore
        // const loader = (await import("../../../../lib/plugins/loader.js")).default
        // return loader
    }
}

export async function Bot() {
    try {
        const { Bot } = await import('yunzai')
        return Bot
    } catch (err) {
        //@ts-ignore
        const bot = global.Bot
        return bot
    }
}

export async function Logger() {
    try {
        //@ts-ignore
        const logger = global.logger
        return logger
    } catch (err) {

    }
}

export async function Redis() {
    try {
        const { Redis } = await import('yunzai')
        return Redis
    } catch (err) {
        //@ts-ignore
        const redis = global.redis
        return redis
    }
}