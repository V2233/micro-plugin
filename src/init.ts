import Stdin from './server/app/adapter/protocol/Stdin/index.js';
import OnebotV11 from './server/app/adapter/protocol/OnebotV11/index.js';
import './server/app/adapter/bot.js';
import { WebSocket } from 'ws';
import {Cfg} from '#cfg';


// 读取配置
const { stdin, onebotv11 } = Cfg.getConfig('protocol')

// 标准输入输出
if(stdin.disabled == false) {
    Stdin()
}

// 正向连接
const forwardWs = new Map()
if(onebotv11.disabled == false && onebotv11.address.length > 0) {
    onebotv11.address.forEach((path: string, index:number) => {
        const v11Ws = new WebSocket(path)
        v11Ws.on('open',() => {
            new OnebotV11(v11Ws)
        })
        forwardWs.set(`${onebotv11}-${index}`, v11Ws)
    });
}

export { forwardWs }


    
