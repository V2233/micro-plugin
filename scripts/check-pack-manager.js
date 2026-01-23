import fs from 'fs';
import path from 'path';

export function detectPackageManager(projectRoot = process.cwd()) {
  const lockFiles = [
    { name: 'pnpm-lock.yaml', manager: 'pnpm' },
    { name: 'yarn.lock', manager: 'yarn' },
    { name: 'package-lock.json', manager: 'npm' },
    { name: 'bun.lockb', manager: 'bun' },
  ];

  // 1. 优先级最高：检查锁文件
  for (const { name, manager } of lockFiles) {
    if (fs.existsSync(path.join(projectRoot, name))) {
      return manager;
    }
  }

  // 2. 检查 pnpm 工作区配置文件 (对Monorepo很关键)
  if (fs.existsSync(path.join(projectRoot, 'pnpm-workspace.yaml'))) {
    return 'pnpm'; // 即使没有锁文件，此配置也强烈暗示使用 pnpm
  }

  if (fs.existsSync(path.join(projectRoot, 'yarn.loc'))) {
    return 'yarn'; // 即使没有锁文件，此配置也强烈暗示使用 pnpm
  }

  // 3. 检查 package.json 中的 workspaces 字段
  const pkgPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.workspaces) {
        // 存在 workspaces，可能是 yarn 或 npm (>=7)
        // 此时可进一步检查是否有 yarn 的其他特征
        if (fs.existsSync(path.join(projectRoot, '.yarn'))) {
          return 'yarn';
        }
        if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
          return 'npm';
        }
        // 没有明确证据，保守返回未知，或可推断为 'npm/yarn'
        return '';
      }
    } catch (e) {
      // 忽略 JSON 解析错误
    }
  }

  // 4. 如果 node_modules 存在，可根据其结构推断（可选，复杂度高）
  // 此处省略具体实现...

  // 未检测到明确证据
  return '';
}
