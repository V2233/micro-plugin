//@ts-check
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { viteMockServe } from 'vite-plugin-mock';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('根：', _dirname);

const env = loadEnv('development', _dirname);

// https://vite.dev/config/
export default defineConfig({
  root: _dirname,
  publicDir: path.resolve(_dirname, '../../public/static'),
  // 2. 配置构建出的 assets 目录
  build: {
    outDir: '../../public/static',
    emptyOutDir: false,
    // 将 js、css 等资源文件输出到 'public/static' 目录下
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1024,
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       element: ['element-plus'],
    //       echarts: ['echarts'],
    //       moment: ['moment'],
    //       lodash: ['lodash-es','lodash'],
    //       liquidfill: ['echarts-liquidfill'],
    //       ace: ['ace-builds'],
    //       vuerouter: ['vue-router'],
    //       axios: ['axios'],
    //       jspdf: ['jspdf'],
    //       xterm: ['@xterm/xterm'],
    //       highlight: ['highlight.js'],
    //       html2canvas: ['html2canvas'],
    //       emoji: ['emoji-mart-vue-fast'],
    //       crypto: ['crypto-js'],
    //     },
    //   }
    // }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(_dirname, 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe(),
    visualizer({
      open: true,
      gzipSize: true, // 分析图生成的文件名
      brotliSize: true, // 收集 brotli 大小并将其显示
      filename: 'stats.html', // 分析图生成的文件名
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    proxy: {
      [env.VITE_APP_BASE_API as string]: {
        target: env.VITE_SERVE,
        changeOrigin: true,
        rewrite: (path: string) => {
          console.log('请求', path);
          return path;
        },
      },
    },
  },
});
