import { Application, applicationOptions, defineConfig } from 'yunzaijs';

//@TODO
// const entry =
//   process.env?.MICRO_ENV == 'development' ? './src/backend/index' : './dist/backend/index.js';

const entry = './src/backend/index';

const apps = await (await import(entry))?.startMicro?.();

const Micro = () => {
  /**
   * @type {{reg: RegExp | string; key: string; }[]}
   */
  const rules = [];
  return applicationOptions({
    async create() {
      for (const key in apps) {
        /**
         * @type {typeof Application.prototype}
         */
        const app = new apps[key]();
        // 用  reg 和 key 连接起来。
        for (const rule of app.rule) {
          rules.push({
            reg: rule.reg,
            key: key,
          });
        }
      }
    },
    mounted(e) {
      // 存储
      const data = [];
      // 如果key不存在
      const cache = {};
      // 使用event以确保得到正常类型
      if (e['msg']) {
        for (const item of rules) {
          // 匹配正则
          // 存在key
          // 第一次new
          if (new RegExp(item.reg).test(e['msg']) && apps[item.key] && !cache[item.key]) {
            cache[item.key] = true;
            data.push(new apps[item.key]());
          }
        }
      }
      // back
      return data;
    },
  });
};

export default defineConfig({
  applications: [Micro()],
});
