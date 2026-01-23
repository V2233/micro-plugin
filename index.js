let apps = {};

// TODO
// console.log(process.env?.BOT_ENV, process.env?.MICRO_ENV);
// process.exit(0);

try {
  if (process.env?.BOT_ENV == 'yunzaijs') {
    await import('./yunzaijs.js');
  } else {
    if (process.env?.MICRO_ENV == 'development') {
      // ts环境
      apps = await (await import('./src/backend/index'))?.startMicro?.();
    } else {
      // js环境
      apps = await (await import('./dist/backend/index.js'))?.startMicro?.();
    }
  }
} catch (err) {
  console.warn('[micro-plugin]', err);
}

export { apps };
