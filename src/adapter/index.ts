import { join } from 'path';
import { botInfo } from '#env'

const {WORK_PATH} = botInfo

export async function Plugin() {
    try {
        const plugin = (await import(join(WORK_PATH,'lib/plugins/plugin.js'))).default
        return plugin
    } catch (err) {
        const { Plugin } = await import('yunzai')
        return Plugin
    }
}

export async function Puppeteer() {
    try {
        const puppeteer = (await import(join(WORK_PATH,'lib/puppeteer/puppeteer.js'))).default
        return puppeteer
    } catch (err) {
        const { puppeteer } = await import('yunzai')
        return puppeteer
    }
}

export async function Segment() {
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
        const loader = (await import(join(WORK_PATH,"lib/plugins/loader.js"))).default
        return loader
    } catch (err) {
        const { Loader } = await import("yunzai")
        return Loader
    }
}

export async function Bot() {
    try {
        const bot = global.Bot
        return bot
    } catch (err) {
        const { Bot } = await import('yunzai')
        return Bot
    }
}

export async function Logger() {
    try {
        const logger = global.logger
        return logger
    } catch (err) {

    }
}

export async function Redis() {
    try {
        const redis = global.redis
        return redis
    } catch (err) {
        const { Redis } = await import('yunzai')
        return Redis
    }
}