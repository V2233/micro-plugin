import getCpuInfo from './state/CPU.js';
import getGPU from './state/GPU.js';
import getNetwork from './state/networkStats.js';
import getSwapInfo from './state/SWAP.js';
import getMemUsage from './state/RAM.js';
import getNodeInfo from './state/NodeInfo.js';
import getOtherInfo from './state/OtherInfo.js';
import { getFsSize } from './state/FsSize.js';

class StateController {
    async sysInfo(ctx) {
        let cpuInfo = await getCpuInfo();
        let gpuInfo = await getGPU();
        let swapInfo = await getSwapInfo();
        let ramInfo = await getMemUsage();
        let diskSizeInfo = await getFsSize();
        let nodeInfo = await getNodeInfo();
        let otherInfo = await getOtherInfo();
        let networkInfo = await getNetwork();
        ctx.body = {
            code: 200,
            message: 'success',
            data: {
                cpuInfo,
                gpuInfo,
                swapInfo,
                ramInfo,
                diskSizeInfo,
                nodeInfo,
                networkInfo,
                otherInfo
            }
        };
    }
}
var StateController$1 = new StateController();

export { StateController$1 as default };
