import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { detectPackageManager } from './check-pack-manager.js';

const _dirname = dirname(fileURLToPath(import.meta.url));

function check() {
  const pkgPath = resolve(_dirname, '..', 'package.json');
  console.log(pkgPath);
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8'));

  let ok = true;
  // 合并开发依赖
  Object.keys(pkgJson.frontendDevDependencies).forEach(dep => {
    if (!pkgJson.devDependencies[dep]) {
      ok = false;
      console.warn('缺失开发依赖：', dep);
    }
  });

  if (ok) {
    console.log('[micro-plugin]开发依赖检查通过！');
  } else {
    const newPkgJson = pkgJson;
    newPkgJson.devDependencies = {
      ...(pkgJson.devDependencies || {}),
      ...pkgJson.baseDevDependencies,
      ...pkgJson.frontendDevDependencies,
    };

    writeFileSync(pkgPath, JSON.stringify(newPkgJson, null, 2), 'utf8');
    const packManager = detectPackageManager();
    console.log(
      `[micro-plugin]开发依赖已重新配置，请执行 ${packManager ? packManager + ' install' : '依赖安装命令'} 或重新启动！`
    );
    process.exit(1);
  }
}

check();
