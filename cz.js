/**
 * config/cz.js
 * This file is used to configure the commitizen prompt for commit messages.
 * It defines the types of commits, their descriptions, and other settings.
 * @see https://cz-git.qbb.sh/config/
 */

import { definePrompt } from 'czg';

export default definePrompt({
  // 最大描述长度
  maxSubjectLength: 100,
  // 跳过 scope、body、breaking、footer 三个问题
  skipQuestions: ['body', 'breaking', 'footer'],
  // 不允许空 issue 前缀
  allowEmptyIssuePrefixs: false,
  // 不允许自定义 issue 前缀
  allowCustomIssuePrefixs: false,
  // 允许使用 emoji
  userEmoji: true,
  // emoji 位于左边
  emojiAlign: 'left',
  messages: {
    type: '选择你要提交的类型(Select the type of change that you are committing):\n',
    scope:
      '填写更改的目录或文件，如 packages/ov0 多个可用逗号分隔(Denote the SCOPE of this change):\n',
    subject: '填写简短精炼的变更描述(Write a SHORT, IMPERATIVE tense description of the change):\n',
    confirmCommit:
      '是否确认提交本次commit?(Are you sure you want to proceed with the commit above?):',
  },
  types: [
    { value: ':sparkles: feat', name: '✨ feat: 新增功能、特性', emoji: '✨' },
    { value: ':bug: fix', name: '🐛 fix: 修复bug', emoji: '🐛' },
    { value: ':zap: perf', name: '⚡️ perf: 代码优化，比如提升性能、体验', emoji: '⚡️' },
    { value: ':test_tube: test', name: '🧪 test: 添加疏漏测试或已有测试改动', emoji: '🧪' },
    {
      value: ':wrench: chore',
      name: '🔧 chore: 对构建过程或辅助工具和库的更改 (不影响源文件、测试用例)',
      emoji: '🔧',
    },
    { value: ':rewind: revert', name: '⏪️ revert: 回滚 commit', emoji: '⏪️' },
    { value: ':memo: docs', name: '📝 docs: 文档变更', emoji: '📝' },
    {
      value: ':lipstick: style',
      name: '💄 style: 代码格式（仅仅修改了空格、缩进、逗号等等，不改变代码逻辑）',
      emoji: '💄',
    },
    {
      value: ':recycle: refactor',
      name: '♻️ refactor: 代码重构，没有加新功能或修复bug',
      emoji: '♻️',
    },
    {
      value: ':building_construction: build',
      name: '🏗️ build: 构建流程、外部依赖变更 (如升级 npm 包、修改打包配置等)',
      emoji: '🏗️',
    },
    {
      value: ':construction_worker: ci',
      name: '👷 ci: 修改 CI 配置，例如对k8s、docker的配置文件的修改',
      emoji: '👷',
    },
    { value: ':tada: init', name: '🎉 init: 初始化项目', emoji: '🎉' },
  ],
});
