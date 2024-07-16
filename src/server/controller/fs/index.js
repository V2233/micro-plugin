import { botInfo } from "#env";
import { join, basename } from "path";
import mime from 'mime';
import { getDir, copyDirectory, fuzzyMatchInDirectoryTree, filterDirectoryTree, unlinkedPath, calculateFileSize, calculateTotalSize, formatFileSize } from './tools.js';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync, rmSync, copyFileSync, renameSync, createReadStream, existsSync } from "fs";
class FsController {
    async listDir(ctx) {
        const { path } = ctx.request.query;
        const dirInfo = getDir(path == 0 ? botInfo.WORK_PATH : path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: dirInfo
        };
    }
    async touch(ctx) {
        const { path } = ctx.request.query;
        writeFileSync(path, '', 'utf8');
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(path)
        };
    }
    async mkdir(ctx) {
        const { path } = ctx.request.query;
        mkdirSync(path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(path)
        };
    }
    async readFile(ctx) {
        const { path } = ctx.request.query;
        const content = readFileSync(path, 'utf-8');
        ctx.body = {
            code: 200,
            message: 'ok',
            data: content
        };
    }
    async readMediaFile(ctx) {
        const { path } = ctx.request.query;
        const fileBuffer = readFileSync(path);
        const contentType = mime.getType(path) || 'application/octet-stream';
        ctx.type = contentType;
        ctx.body = fileBuffer;
    }
    async rmFile(ctx) {
        const { path } = ctx.request.query;
        unlinkSync(path);
        const prePath = unlinkedPath(path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(prePath)
        };
    }
    async rmDir(ctx) {
        const { path } = ctx.request.query;
        rmSync(path, { recursive: true, force: true });
        const prePath = unlinkedPath(path);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(prePath)
        };
    }
    async saveFile(ctx) {
        const { path } = ctx.request.query;
        const { content } = ctx.request.body;
        writeFileSync(path, content, 'utf8');
        ctx.body = {
            code: 200,
            message: 'ok',
        };
    }
    async moveFile(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async moveDir(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async renameFile(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async renameDir(ctx) {
        const { path, newPath } = ctx.request.query;
        renameSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async copyFile(ctx) {
        const { path, newPath } = ctx.request.query;
        copyFileSync(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async copyDir(ctx) {
        const { path, newPath } = ctx.request.query;
        copyDirectory(path, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        };
    }
    async search(ctx) {
        const { path, keyWord } = ctx.request.query;
        const res = fuzzyMatchInDirectoryTree(path, keyWord);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: res
        };
    }
    async upload(ctx) {
        const { path } = ctx.request.body;
        const { filepath, originalFilename } = ctx.request.files.file;
        const newPath = join(path, originalFilename);
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }
        console.log('【micro-plugin】上传文件：');
        console.log(ctx.request.body);
        renameSync(filepath, newPath);
        ctx.body = {
            code: 200,
            message: 'ok',
            data: newPath
        };
    }
    async download(ctx) {
        const { path } = ctx.request.query;
        console.log(path);
        try {
            ctx.set('Content-disposition', `attachment; filename="${basename(path)}"`);
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.body = createReadStream(path);
        }
        catch (error) {
            ctx.body = {
                code: 500,
                message: JSON.stringify(error)
            };
        }
    }
    async getFilesTree(ctx) {
        let { path, ex } = ctx.request.query;
        const node = await getDir(path, null);
        if (!path) {
            path = join(botInfo.WORK_PATH, 'plugins');
        }
        let res = filterDirectoryTree(node, ex) ? node : { children: [] };
        ctx.body = {
            code: 200,
            message: 'success',
            data: Object.assign(res, {
                children: res.children.filter(item => item.type == 'directory' || (item.type == 'file' && item.name.includes(ex)))
            })
        };
    }
    async getFilesSize(ctx) {
        let { path, type } = ctx.request.query;
        const res = (type == 'file') ? await calculateFileSize(path) : (await calculateTotalSize(getDir(path, null)));
        ctx.body = {
            code: 200,
            message: 'success',
            data: formatFileSize(res)
        };
    }
}
export default new FsController();
