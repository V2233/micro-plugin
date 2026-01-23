import http from 'http';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import url from 'url';

// ==================== 配置部分 ====================
const PORT = 3000;
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'static'); // 静态资源目录

// MIME 类型映射表
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
};

// ==================== 核心服务器逻辑 ====================
const server = http.createServer(async (req, res) => {
  try {
    // 1. 解析请求路径
    const parsedUrl = url.parse(req.url);
    console.log(parsedUrl.pathname);
    // 防止路径遍历攻击：确保请求路径在 PUBLIC_DIR 内
    let requestPath = path.join(PUBLIC_DIR, parsedUrl.pathname);

    // 安全检查：请求路径必须在 PUBLIC_DIR 目录下
    if (!requestPath.startsWith(PUBLIC_DIR)) {
      sendError(res, 403, '禁止访问');
      return;
    }

    // 2. 获取文件信息
    let stats;
    try {
      stats = await fs.stat(requestPath);
    } catch (err) {
      // 文件不存在
      sendError(res, 404, '文件未找到');
      return;
    }

    // 3. 处理目录请求
    if (stats.isDirectory()) {
      // 如果目录下有 index.html，则提供它
      const indexPath = path.join(requestPath, 'index.html');
      try {
        await fs.access(indexPath);
        requestPath = indexPath;
      } catch {
        // 没有 index.html，生成目录列表（可选功能）
        if (req.url.endsWith('/')) {
          const files = await fs.readdir(requestPath);
          const listing = generateDirectoryListing(req.url, files);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(listing);
          return;
        } else {
          // 重定向到以 / 结尾的 URL
          res.writeHead(301, { Location: req.url + '/' });
          res.end();
          return;
        }
      }
    }

    // 4. 读取并发送文件
    const fileExt = path.extname(requestPath).toLowerCase();
    const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

    // 设置缓存头（可选，提升性能）
    const cacheControl = 'public, max-age=3600'; // 缓存1小时

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'Content-Length': stats.size,
    });

    // 使用流式传输以提高大文件性能
    const fileStream = createReadStream(requestPath);
    fileStream.pipe(res);

    // 处理流错误
    fileStream.on('error', err => {
      console.error('文件流错误:', err);
      if (!res.headersSent) {
        sendError(res, 500, '内部服务器错误');
      }
    });
  } catch (err) {
    console.error('服务器错误:', err);
    if (!res.headersSent) {
      sendError(res, 500, '内部服务器错误');
    }
  }
});

// ==================== 工具函数 ====================
/**
 * 发送错误响应
 */
function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>${statusCode} ${message}</title></head>
    <body>
      <h1>${statusCode} - ${message}</h1>
      <p>服务器无法处理此请求。</p>
    </body>
    </html>
  `);
}

/**
 * 生成目录列表页面（简易版）
 */
function generateDirectoryListing(currentPath, files) {
  const fileItems = files
    .map(file => `<li><a href="${path.join(currentPath, file)}">${file}</a></li>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>目录索引: ${currentPath}</title>
      <style>
        body { font-family: sans-serif; margin: 2rem; }
        ul { list-style: none; padding: 0; }
        li { margin: 0.5rem 0; }
        a { text-decoration: none; color: #0366d6; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>目录: ${currentPath}</h1>
      <ul>${fileItems}</ul>
    </body>
    </html>
  `;
}

// ==================== 启动服务器 ====================
server.listen(PORT, () => {
  console.log(`✅ 静态资源服务器已启动`);
  console.log(`📁 服务目录: ${PUBLIC_DIR}`);
  console.log(`🌐 访问地址: http://localhost:${PORT}`);
  console.log(`🛑 停止服务: Ctrl + C`);
});

// 优雅关闭处理
// process.on('SIGINT', () => {
//   console.log('\n🛑 正在关闭服务器...')
//   server.close(() => {
//     console.log('服务器已关闭')
//     process.exit(0)
//   })
// })
