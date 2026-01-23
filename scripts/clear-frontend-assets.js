//@ts-check

import { existsSync, rmSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

const frontendAssetsDir = resolve(_dirname, '..', 'public', 'static', 'assets');

if (existsSync(frontendAssetsDir)) {
  rmSync(frontendAssetsDir, { recursive: true });
  console.log(`清理assets完成：(${frontendAssetsDir})`);
}
