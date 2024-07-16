// import busboy from 'koa-busboy'
// import { botInfo } from '../../env';
// import { existsSync, mkdirSync } from 'fs'
// import { join } from 'path'

// export const upload = async (ctx: any, next: any) => {

//     const { path, type, name } = ctx.request.body

//     const target = path || join(botInfo.WORK_PATH, 'uploadDir')

//     if (!existsSync(target)) {
//         mkdirSync(target, { recursive: true });
//     }

//     return busboy({
//         dest: target,
//         fnDestFilename: (fieldname, filename) => filename
//     })

//     next()
// const bb = busboy({ headers: ctx.request.header });

// bb.on('file', async (fieldname, file, filename, encoding, mimetype) => {



//     let targetFolder = path || join(botInfo.WORK_PATH, 'uploadDir')

//     // 确保目录存在
//     if (!existsSync(targetFolder)) {
//         mkdirSync(targetFolder, { recursive: true });
//     }

//     // 构建完整的目标文件路径
//     const filePath = join(path, filename);

//     const writeStream = createWriteStream(filePath);

//     file.pipe(writeStream);

//     writeStream.on('finish', () => {
//         console.log(`File saved to ${filePath}`);
//     });

//     writeStream.on('error', (err) => {
//         ctx.throw(500, err);
//     });
// });

// bb.on('finish', () => {
//     ctx.body = {
//         code: 200,
//         message: '文件上传成功！'
//     };
//     next();
// });

// await new Promise((resolve, reject) => {
//     ctx.req.pipe(bb);
//     ctx.req.on('end', resolve);
//     ctx.req.on('error', reject);
// });
// }