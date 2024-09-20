import getCpuInfo from './state/CPU.js'
import getGPU from './state/GPU.js'
import getNetwork from './state/networkStats.js'
import getSwapInfo from './state/SWAP.js'
import getMemUsage from './state/RAM.js'
import getNodeInfo from './state/NodeInfo.js'
import getOtherInfo from './state/OtherInfo.js'
import { getFsSize } from './state/FsSize.js'

class StateController {

    // 系统状态
    async sysInfo(ctx: any) {
        // let cpuInfo = await getCpuInfo()
        // let gpuInfo = await getGPU()
        // let swapInfo = await getSwapInfo()
        // let ramInfo = await getMemUsage()
        // let diskSizeInfo = await getFsSize()
        // // let diskSpeedInfo = await getDiskSpeed()
        // let nodeInfo = await getNodeInfo()
        // let otherInfo = await getOtherInfo()
        // let networkInfo = await getNetwork()

        const promises = [  
            getCpuInfo(),  
            getGPU(),  
            getSwapInfo(),  
            getMemUsage(),  
            getFsSize(),  
            getNodeInfo(),  
            getOtherInfo(),  
            getNetwork()  
        ];  

        const [  
            cpuInfo,  
            gpuInfo,  
            swapInfo,  
            ramInfo,  
            diskSizeInfo,  
            nodeInfo,  
            otherInfo,  
            networkInfo  
        ] = await Promise.all(promises);

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
        }
    }
}

export default new StateController()