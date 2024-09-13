// globals.d.ts  
// 防止编译此插件报错，实际类型由yunzaijs提供
import { Client } from 'icqq'
import { RedisClientType } from 'redis'

declare module 'icqq' {  
  interface Client {  
    adapter: number[];  
  }  
}

/// <reference types="yunzai/global" />
/// <reference types="yunzai/node_modules/chalk" />

