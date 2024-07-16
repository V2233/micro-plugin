// globals.d.ts  
// 防止编译此插件报错，实际类型由yunzaijs提供
declare global {
    const Bot: Bot;
    const redis: redis;
    const logger: logger
}