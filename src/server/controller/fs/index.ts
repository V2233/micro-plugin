import { botInfo } from "#env";
import { join, basename } from "path"
import mime from 'mime'

import {
    getDir,
    copyDirectory,
    fuzzyMatchInDirectoryTree,
    filterDirectoryTree,
    unlinkedPath,
    calculateFileSize,
    calculateTotalSize,
    formatFileSize
} from './tools.js'

import {
    readFileSync,
    writeFileSync,
    mkdirSync,
    unlinkSync,
    rmSync,
    copyFileSync,
    renameSync,
    createReadStream,
    existsSync
} from "fs";

class FsController {
    // curPath = botInfo.WORK_PATH

    // 文件列表
    async listDir(ctx: any) {
        const { path } = ctx.request.query
        // console.log(this.curPath)
        const dirInfo = getDir(path == 0 ? botInfo.WORK_PATH : path)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: dirInfo
        }
    }

    // 创建文件
    async touch(ctx: any) {
        const { path } = ctx.request.query

        writeFileSync(path, '', 'utf8')

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(path)
        }
    }

    // 创建目录
    async mkdir(ctx: any) {
        const { path } = ctx.request.query

        mkdirSync(path)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(path)
        }
    }

    // 读取文件
    async readFile(ctx: any) {
        const { path } = ctx.request.query

        const content = readFileSync(path, 'utf-8')

        ctx.body = {
            code: 200,
            message: 'ok',
            data: content
        }
    }

    // 读取媒体文件
    async readMediaFile(ctx: any) {
        // 文件路径
        const { path } = ctx.request.query

        // 读取文件内容  
        const fileBuffer = readFileSync(path);

        // 获取文件的 MIME 类型  
        const contentType = mime.getType(path) || 'application/octet-stream';

        // 设置响应的 Content-Type  
        ctx.type = contentType;

        // 发送文件内容给客户端  
        ctx.body = fileBuffer;

    }

    // 删除文件
    async rmFile(ctx: any) {
        const { path } = ctx.request.query

        unlinkSync(path)

        const prePath = unlinkedPath(path)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(prePath)
        }
    }

    // 删除目录
    async rmDir(ctx: any) {
        const { path } = ctx.request.query

        rmSync(path, { recursive: true, force: true })

        const prePath = unlinkedPath(path)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(prePath)
        }
    }

    // 保存文件
    async saveFile(ctx: any) {
        const { path } = ctx.request.query
        const { content } = ctx.request.body

        writeFileSync(path, content, 'utf8')

        ctx.body = {
            code: 200,
            message: 'ok',
        }
    }

    // 移动文件
    async moveFile(ctx: any) {
        const { path, newPath } = ctx.request.query

        renameSync(path, newPath)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        }
    }

    // 移动目录
    async moveDir(ctx: any) {
        const { path, newPath } = ctx.request.query

        renameSync(path, newPath)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        }
    }

    // 重命名文件
    async renameFile(ctx: any) {
        const { path, newPath } = ctx.request.query

        renameSync(path, newPath)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        }
    }

    // 重命名目录
    async renameDir(ctx: any) {
        const { path, newPath } = ctx.request.query

        renameSync(path, newPath)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        }
    }

    // 复制文件
    async copyFile(ctx: any) {
        const { path, newPath } = ctx.request.query

        copyFileSync(path, newPath)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        }
    }

    // 复制目录
    async copyDir(ctx: any) {
        const { path, newPath } = ctx.request.query

        copyDirectory(path, newPath)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: getDir(newPath)
        }
    }

    // 查找
    async search(ctx: any) {
        const { path, keyWord } = ctx.request.query

        const res = fuzzyMatchInDirectoryTree(path, keyWord)

        ctx.body = {
            code: 200,
            message: 'ok',
            data: res
        }
    }

    // 上传
    async upload(ctx: any) {
        const { path } = ctx.request.body
        const { filepath, originalFilename } = ctx.request.files.file
        const newPath = join(path, originalFilename)
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true })
        }
        console.log('【micro-plugin】上传文件：')
        console.log(ctx.request.body)
        renameSync(filepath, newPath)
        ctx.body = {
            code: 200,
            message: 'ok',
            data: newPath
        }
    }

    // 下载
    async download(ctx: any) {
        const { path } = ctx.request.query
        console.log(path)

        try {
            ctx.set('Content-disposition', `attachment; filename="${basename(path)}"`);
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.body = createReadStream(path)
        } catch (error) {
            ctx.body = {
                code: 500,
                message: JSON.stringify(error)
            };
        }
    }

    // 得到过滤树
    async getFilesTree(ctx) {
        let { path, ex } = ctx.request.query

        const node = await getDir(path, null)

        if (!path) {
            path = join(botInfo.WORK_PATH, 'plugins')
        }

        let res = filterDirectoryTree(node, ex) ? node : { children: [] }

        ctx.body = {
            code: 200,
            message: 'success',
            data: Object.assign(res, {
                children: res.children.filter(item => item.type == 'directory' || (item.type == 'file' && item.name.includes(ex)))
            })
        }
    }

    // 计算文件大小
    async getFilesSize(ctx) {
        let { path, type } = ctx.request.query

        const res = (type == 'file') ? (await calculateFileSize(path) as number) : (await calculateTotalSize(getDir(path, null)))

        ctx.body = {
            code: 200,
            message: 'success',
            data: formatFileSize(res)
        }
    }
}

export default new FsController()
