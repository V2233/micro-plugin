import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'; 
// import { terser } from '@rollup/plugin-terser'
/**
 * @type {import("rollup").RollupOptions[]}
 */
export default [
  {
    // 输入
    input: './src/index.ts',
    output: {
      // 输出
      file: './src/index.js',
      format: 'es',
      sourcemap: false
    },
    plugins: [
      typescript({
        compilerOptions: {
          declaration: true,
          declarationDir: 'types'
        }
      }),
      alias({  
        entries: [  
          { find: '#cfg', replacement: 'src/config/index.js' }, // 将 '#cfg' 替换为你的实际路径  
          { find: '#env', replacement: 'src/env.js' },
          { find: '#bot', replacement: 'src/adapter/index.js' }, 
          { find: '#utils', replacement: 'src/utils/index.js' }, 
        ]  
      }),  
      
      // 开启代码压缩
      // terser()
    ],
    onwarn: (warning, warn) => {
      // 忽略与无法解析the导入相关the警告信息
      if (warning.code === 'UNRESOLVED_IMPORT') return
      // 继续使用默认the警告处理
      warn(warning)
    }
  }
]