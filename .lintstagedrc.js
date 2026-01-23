// const { ESLint } = require('eslint');
// const removeIgnoredFiles = async files => {
//   const eslint = new ESLint();
//   const ignoredFiles = await Promise.all(files.map(file => eslint.isPathIgnored(file)));
//   const filteredFiles = files.filter((_, i) => !ignoredFiles[i]);
//   return filteredFiles.join(' ');
// };

/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,mjs,cjs,ts,tsx,mts,cts}': [`prettier --write`, `eslint --fix`],
  '*.{json,yml,yaml,css,scss,less,vue}': [`prettier --write`],
};
