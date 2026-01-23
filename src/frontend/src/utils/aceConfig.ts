// ace配置，使用动态加载来避免第一次加载开销
import ace from 'ace-builds';

// 导入不同的主题模块，并设置对应 URL
import themeGithubUrl from 'ace-builds/src-noconflict/theme-github?url';
ace.config.setModuleUrl('ace/theme/github', themeGithubUrl);

import themeMonokaiUrl from 'ace-builds/src-noconflict/theme-monokai?url';
ace.config.setModuleUrl('ace/theme/monokai', themeMonokaiUrl);

import themeSolarized_darkUrl from 'ace-builds/src-noconflict/theme-solarized_dark?url';
ace.config.setModuleUrl('ace/theme/solarized_dark', themeSolarized_darkUrl);

import themeOne_darkUrl from 'ace-builds/src-min-noconflict/theme-one_dark?url';
ace.config.setModuleUrl('ace/theme/one_dark', themeOne_darkUrl);

// 导入不同语言的语法模式模块，并设置对应 URL (所有支持的主题和模式：node_modules/ace-builds/src-noconflict)
import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url';
ace.config.setModuleUrl('ace/mode/json', modeJsonUrl);

import modeYamlUrl from 'ace-builds/src-noconflict/mode-yaml?url';
ace.config.setModuleUrl('ace/mode/yaml', modeYamlUrl);

import modeJavaUrl from 'ace-builds/src-noconflict/mode-java?url';
ace.config.setModuleUrl('ace/mode/java', modeJavaUrl);

import modeJavascriptUrl from 'ace-builds/src-noconflict/mode-javascript?url';
ace.config.setModuleUrl('ace/mode/javascript', modeJavascriptUrl);

import modeTypescriptUrl from 'ace-builds/src-noconflict/mode-typescript?url';
ace.config.setModuleUrl('ace/mode/typescript', modeTypescriptUrl);

import modeJsxUrl from 'ace-builds/src-noconflict/mode-jsx?url';
ace.config.setModuleUrl('ace/mode/jsx', modeJsxUrl);

import modeTsxUrl from 'ace-builds/src-noconflict/mode-tsx?url';
ace.config.setModuleUrl('ace/mode/tsx', modeTsxUrl);

import modeHtmlUrl from 'ace-builds/src-noconflict/mode-html?url';
ace.config.setModuleUrl('ace/mode/html', modeHtmlUrl);

import modeVueUrl from 'ace-builds/src-noconflict/mode-vue?url';
ace.config.setModuleUrl('ace/mode/vue', modeVueUrl);

import modeCssUrl from 'ace-builds/src-noconflict/mode-css?url';
ace.config.setModuleUrl('ace/mode/css', modeCssUrl);

import modePythonUrl from 'ace-builds/src-noconflict/mode-python?url';
ace.config.setModuleUrl('ace/mode/yaml', modePythonUrl);

import modeGolangUrl from 'ace-builds/src-noconflict/mode-golang?url';
ace.config.setModuleUrl('ace/mode/golang', modeGolangUrl);

import modeMarkdownUrl from 'ace-builds/src-noconflict/mode-markdown?url';
ace.config.setModuleUrl('ace/mode/markdown', modeMarkdownUrl);

import modeShUrl from 'ace-builds/src-noconflict/mode-sh?url';
ace.config.setModuleUrl('ace/mode/sh', modeShUrl);

import modeC_cppUrl from 'ace-builds/src-noconflict/mode-c_cpp?url';
ace.config.setModuleUrl('ace/mode/c_cpp', modeC_cppUrl);

// 用于完成语法检查、代码提示、自动补全等代码编辑功能，必须注册模块 ace/mode/lang _ worker，并设置选项 useWorker: true
import workerBaseUrl from 'ace-builds/src-noconflict/worker-base?url';
ace.config.setModuleUrl('ace/mode/base', workerBaseUrl);

import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'; // for vite
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

import workerYamlUrl from 'ace-builds/src-noconflict/worker-yaml?url';
ace.config.setModuleUrl('ace/mode/yaml_worker', workerYamlUrl);

import workerJavascriptUrl from 'ace-builds/src-noconflict/worker-javascript?url';
ace.config.setModuleUrl('ace/mode/javascript_worker', workerJavascriptUrl);

import workerHtmlUrl from 'ace-builds/src-noconflict/worker-html?url';
ace.config.setModuleUrl('ace/mode/html_worker', workerHtmlUrl);

import workerCssUrl from 'ace-builds/src-noconflict/worker-css?url';
ace.config.setModuleUrl('ace/mode/css_worker', workerCssUrl);

// 导入不同语言的代码片段，提供代码自动补全和代码块功能
import snippetsJsonUrl from 'ace-builds/src-noconflict/snippets/json?url';
ace.config.setModuleUrl('ace/snippets/json', snippetsJsonUrl);

import snippetsYamlUrl from 'ace-builds/src-noconflict/snippets/yaml?url';
ace.config.setModuleUrl('ace/snippets/yaml', snippetsYamlUrl);

import snippetsJavaUrl from 'ace-builds/src-noconflict/snippets/java?url';
ace.config.setModuleUrl('ace/snippets/java', snippetsJavaUrl);

import snippetsJsUrl from 'ace-builds/src-noconflict/snippets/javascript?url';
ace.config.setModuleUrl('ace/snippets/javascript', snippetsJsUrl);

import snippetsTsUrl from 'ace-builds/src-noconflict/snippets/typescript?url';
ace.config.setModuleUrl('ace/snippets/typescript', snippetsTsUrl);

import snippetsJsxUrl from 'ace-builds/src-noconflict/snippets/jsx?url';
ace.config.setModuleUrl('ace/snippets/jsx', snippetsJsxUrl);

import snippetsTsxUrl from 'ace-builds/src-noconflict/snippets/tsx?url';
ace.config.setModuleUrl('ace/snippets/tsx', snippetsTsxUrl);

import snippetsHtmlUrl from 'ace-builds/src-noconflict/snippets/html?url';
ace.config.setModuleUrl('ace/snippets/html', snippetsHtmlUrl);

import snippetsVueUrl from 'ace-builds/src-noconflict/snippets/vue?url';
ace.config.setModuleUrl('ace/snippets/vue', snippetsVueUrl);

import snippetsCssUrl from 'ace-builds/src-noconflict/snippets/css?url';
ace.config.setModuleUrl('ace/snippets/css', snippetsCssUrl);

import snippetsPyhontUrl from 'ace-builds/src-noconflict/snippets/python?url';
ace.config.setModuleUrl('ace/snippets/python', snippetsPyhontUrl);

import snippetsGolangUrl from 'ace-builds/src-noconflict/snippets/golang?url';
ace.config.setModuleUrl('ace/snippets/golang', snippetsGolangUrl);

import snippetsMarkdownUrl from 'ace-builds/src-noconflict/snippets/markdown?url';
ace.config.setModuleUrl('ace/snippets/markdown', snippetsMarkdownUrl);

import snippetsShUrl from 'ace-builds/src-noconflict/snippets/sh?url';
ace.config.setModuleUrl('ace/snippets/sh', snippetsShUrl);

import snippetsC_cppUrl from 'ace-builds/src-noconflict/snippets/c_cpp?url';
ace.config.setModuleUrl('ace/snippets/c_cpp', snippetsC_cppUrl);

// 启用自动补全等高级编辑支持，
import extSearchboxUrl from 'ace-builds/src-noconflict/ext-searchbox?url';
ace.config.setModuleUrl('ace/ext/searchbox', extSearchboxUrl);

// 启用自动补全等高级编辑支持
import 'ace-builds/src-noconflict/ext-language_tools';
ace.require('ace/ext/language_tools');

// 这里注册前端选择
export const registedLangs = [
  {
    lang: 'javascript',
    ext: 'js',
  },
  {
    lang: 'html',
    ext: 'html',
  },
  {
    lang: 'css',
    ext: 'css',
  },
  {
    lang: 'typescript',
    ext: 'ts',
  },
  {
    lang: 'jsx',
    ext: 'jsx',
  },
  {
    lang: 'tsx',
    ext: 'tsx',
  },
  {
    lang: 'java',
    ext: 'java',
  },
  {
    lang: 'golang',
    ext: 'golang',
  },
  {
    lang: 'c_cpp',
    ext: 'c',
  },
  {
    lang: 'python',
    ext: 'py',
  },
  {
    lang: 'sh',
    ext: 'sh',
  },
  {
    lang: 'markdown',
    ext: 'md',
  },
  {
    lang: 'vue',
    ext: 'vue',
  },
  {
    lang: 'json',
    ext: 'json',
  },
  {
    lang: 'yaml',
    ext: 'yaml',
  },
];
