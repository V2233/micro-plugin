import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

function main() {
  const pkgPath = resolve(_dirname, '..', 'package.json');
  console.log(pkgPath);
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkgJson.devDependencies = {};
  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), 'utf8');
}

main();
