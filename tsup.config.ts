import { dirname, resolve } from 'path';
import { defineConfig } from 'tsup';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ['src/backend/index.ts'],
  format: ['esm'],
  target: ['esnext'],
  platform: 'node',
  outDir: 'dist/backend',
  dts: false,
  bundle: true,
  tsconfig: './src/backend/tsconfig.json',
  skipNodeModulesBundle: true,
  treeshake: false,
  esbuildOptions(options) {
    options.alias = {
      '@': resolve(__dirname, 'src/backend'),
    };
  },
});
