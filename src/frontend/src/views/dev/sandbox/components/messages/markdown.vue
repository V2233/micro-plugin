<template>
  <div v-html="markdownToHtml" class="sandbox-markdown-body"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { marked } from 'marked';
// import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js/lib/core';

import JsonLanguage from 'highlight.js/lib/languages/json';
import XmlLanguage from 'highlight.js/lib/languages/xml';
import BashLanguage from 'highlight.js/lib/languages/bash';
import CLanguage from 'highlight.js/lib/languages/c';
import CmakeLanguage from 'highlight.js/lib/languages/cmake';
import CppLanguage from 'highlight.js/lib/languages/cpp';
import CssLanguage from 'highlight.js/lib/languages/css';
import MarkdownLanguage from 'highlight.js/lib/languages/markdown';
import GoLanguage from 'highlight.js/lib/languages/go';
import KotlinLanguage from 'highlight.js/lib/languages/kotlin';
import JavaLanguage from 'highlight.js/lib/languages/java';
import JavascriptLanguage from 'highlight.js/lib/languages/javascript';
import TypescriptLanguage from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('json', JsonLanguage);
hljs.registerLanguage('json', JsonLanguage);
hljs.registerLanguage('xml', XmlLanguage);
hljs.registerLanguage('bash', BashLanguage);
hljs.registerLanguage('c', CLanguage);
hljs.registerLanguage('cmake', CmakeLanguage);
hljs.registerLanguage('cpp', CppLanguage);
hljs.registerLanguage('css', CssLanguage);
hljs.registerLanguage('markdown', MarkdownLanguage);
hljs.registerLanguage('go', GoLanguage);
hljs.registerLanguage('java', JavaLanguage);
hljs.registerLanguage('kotlin', KotlinLanguage);
hljs.registerLanguage('javascript', JavascriptLanguage);
hljs.registerLanguage('typescript', TypescriptLanguage);

const props = defineProps(['mdContent']);

const render = new marked.Renderer();
marked.setOptions({
  renderer: render, // 这是必填项
  gfm: true, // 启动类似于Github样式的Markdown语法
  pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
  //@ts-ignore
  tables: true,
  breaks: true,
  smartLists: true,
  smartpants: false,
  // highlight: (code, lang) => hljs.highlight(code, { language: hljs.getLanguage(lang)??'plaintext' }).value,
});

const markdownToHtml = ref('');
markdownToHtml.value = marked(props.mdContent) as string;

onMounted(() => {
  hljs.highlightAll();
});
</script>

<style lang="scss">
.sandbox-markdown-body {
  pre {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  pre code {
    padding: 5px;
    border-radius: 5px;
    background-color: #eceff7c7;
  }
  img {
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    width: 100%;
  }
}
</style>
