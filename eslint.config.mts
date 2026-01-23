import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
    // 可按需添加
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*/map.js',
      '**/*.min.js',
      '**/*.map.js',
      '**/*.bundle.js',
      '**/*.json',
      '**/assets/**',
      '**/bin/**',
      '**/fastlane/**',
      '**/vendor/**',
      '**/benchmarks/**',
      '**/e2e/**',
      '**/__mocks__/**',
      '**/__test__/**',
      '**/__tests__/**',
      'test/**',
      'tests/**',
      'data/**',
      'temp/**',
      'resources/**',
      'logs/**',
      'docs/**',
      'config/**',
      'legacy/**',
      '!.vscode',
    ],
    plugins: { js },
    extends: [js.configs.recommended, ts.configs.recommended, eslintConfigPrettier],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // 禁止强制要求箭头函数的函数体使用特定写法
      'arrow-body-style': 'off',
      // 禁止要求使用箭头函数作为回调函数
      'prefer-arrow-callback': 'off',
      // 禁止存在未使用的表达式
      '@typescript-eslint/no-unused-expressions': 'off',
      // 禁止存在声明但未使用的变量
      '@typescript-eslint/no-unused-vars': 'off',
      // 强制要求使用 ES6 的 import 语法
      '@typescript-eslint/no-require-imports': 'off',
      // 允许使用 TypeScript 的注释指令（如 @ts-ignore, @ts-expect-error 等）
      '@typescript-eslint/ban-ts-comment': 'off',
      // 禁止使用自定义 TypeScript 模块和命名空间
      '@typescript-eslint/no-namespace': 'off',
      // 禁止非空断言
      '@typescript-eslint/no-non-null-assertion': 'off',
      // 禁止any
      '@typescript-eslint/no-explicit-any': 'off',
      // 不允许字面量空对象
      '@typescript-eslint/no-empty-object-type': 'off',
      // 禁止模糊Function类型
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // 不允许 this 赋值给其它变量
      '@typescript-eslint/no-this-alias': 'off',
      // 禁止空余的多行
      'no-unexpected-multiline': 'error',
      // 禁止不必要的转义字符
      'no-useless-escape': 'off',
      // 禁止不必要的catch
      'no-useless-catch': 'warn',
      // 禁用不安全可选链
      'no-unsafe-optional-chaining': 'warn',
      // 不允许块内声明
      'no-case-declarations': 'warn',
      // 不允许Object原型调用
      'no-prototype-builtins': 'warn',
      // 允许不用const
      'prefer-const': 'warn',
      // 全局隐式访问
      'no-undef': 'warn',
      // 不允许空块
      'no-empty': 'off',
      // 不允许多个空行
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      // 禁止打印
      'no-console': 'off',
      // 禁止断点
      'no-debugger': 'error',
    },
  },
  prettierRecommended,
]);
