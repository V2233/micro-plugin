import { createHash } from 'node:crypto';
import '../../../utils/index.js';
import { join, extname } from 'path';
import { botInfo, pluginInfo } from '../../../env.js';
import { readFile, rename, writeFile } from 'fs/promises';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import '../../../config/index.js';
import { getLoader } from '../../../utils/getLoader.js';
import Cfg from '../../../config/config.js';
import { getAllWebAddress } from '../../../utils/ipAddress.js';

class SandboxController {
    async getPluginsLoader(ctx) {
        const pkgs = await getLoader();
        ctx.body = {
            code: 200,
            message: 'success',
            data: pkgs
        };
    }
    async uploadFile(ctx) {
        const { filepath, originalFilename } = ctx.request.files.file;
        const fileHostPath = join(botInfo.WORK_PATH, 'temp', 'fileHost');
        const fileBuffer = await readFile(filepath);
        const hash = createHash('md5');
        hash.update(fileBuffer);
        const md5Hash = hash.digest('hex');
        const fileExt = extname(originalFilename);
        const newFilename = `${md5Hash}${fileExt}`;
        const newPath = join(fileHostPath, newFilename);
        console.log('【micro-plugin】上传文件：');
        console.log(ctx.request.body);
        await rename(filepath, newPath);
        let address = '';
        const { port, host } = Cfg.getConfig('server').server;
        if (host === 'auto') {
            const { remote } = await getAllWebAddress();
            address = `http://${remote[0]}:${port}/api/File/${newFilename}`;
        }
        else {
            address = `http://${host}:${port}/api/File/${newFilename}`;
        }
        ctx.body = {
            code: 200,
            message: 'ok',
            data: address
        };
    }
    async getOnebot11Data(ctx) {
        const sandboxPath = join(pluginInfo.DATA_PATH, 'sandbox');
        if (!existsSync(sandboxPath)) {
            mkdirSync(sandboxPath, { recursive: true });
        }
        const onebotv11Json = join(sandboxPath, 'onebotv11.json');
        if (!existsSync(onebotv11Json)) {
            ctx.body = {
                code: 200,
                message: 'onebotv11.json not existed!',
                data: null
            };
        }
        else {
            ctx.body = {
                code: 200,
                message: 'ok',
                data: JSON.parse(await readFile(onebotv11Json, 'utf-8'))
            };
        }
    }
    async setOnebot11Data(ctx) {
        const sandboxPath = join(pluginInfo.DATA_PATH, 'sandbox');
        if (!existsSync(sandboxPath)) {
            mkdirSync(sandboxPath, { recursive: true });
        }
        const onebotv11Json = join(sandboxPath, 'onebotv11.json');
        await writeFile(onebotv11Json, JSON.stringify(ctx.request.body));
        ctx.body = {
            code: 200,
            message: 'ok',
            data: {}
        };
    }
    async reSetOnebot11Data(ctx) {
        const onebotv11Json = join(pluginInfo.DATA_PATH, 'sandbox', 'onebotv11.json');
        if (existsSync(onebotv11Json)) {
            unlinkSync(onebotv11Json);
            ctx.body = {
                code: 200,
                message: 'ok',
                data: {}
            };
        }
        else {
            ctx.body = {
                code: 500,
                message: '数据已删除',
                data: {}
            };
        }
    }
}
var SandboxController$1 = new SandboxController();

export { SandboxController$1 as default };
