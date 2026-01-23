import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

import commitTypes from '@gitmoji/commit-types';
import gitmojiConfig from 'commitlint-config-gitmoji';
import commitlintPluginGitmoji from 'commitlint-plugin-gitmoji';

/**
 * 正确格式如下
 * ```plaintext
 * :gitmoji: type(scope?): subject
 * body?
 * footer?
 * ```
 * 示例
 * ```plaintext
 * :sparkles: feat(changelog): support chinese title
 * :bug: fix(config): fix a subject bug
 * :memo: docs: update README.md
 * :bulb: docs(plugin): update comments
 * ```
 */
const Configuration: UserConfig = {
  extends: ['gitmoji'],
  formatter: '@commitlint/format',
  parserPreset: gitmojiConfig.parserPreset,
  plugins: [
    {
      rules: {
        'start-with-gitmoji': parsed => {
          //@ts-ignore  parsed type is incompatible with the latest version of commlint
          return commitlintPluginGitmoji.rules['start-with-gitmoji'](parsed);
        },
      },
    },
  ],
  rules: {
    // gitmoji 规则
    'start-with-gitmoji': [RuleConfigSeverity.Error, 'always'],
    // 使用 Angular 的类型
    'type-enum': [RuleConfigSeverity.Error, 'always', commitTypes],
    // 内容以空行开始
    'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
    // 结尾以空行开始
    'footer-leading-blank': [RuleConfigSeverity.Error, 'always'],
    // 标题最大长度 100 个字符
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
    // Scope 永远小写
    'scope-case': [RuleConfigSeverity.Disabled],
    // Subject 永远小写
    'subject-case': [RuleConfigSeverity.Disabled],
    // 不允许标题空着
    'subject-empty': [RuleConfigSeverity.Error, 'never'],
    // 不允许使用句号
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
    // type 必须小写
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    // type 不能为空
    'type-empty': [RuleConfigSeverity.Error, 'never'],
  },
  prompt: {},
};

export default Configuration;
