import _ from 'lodash'

export function customizer(objValue: any, srcValue: any) {
    // 如果两者都是数组，则直接返回源值（即替换目标值）  
    if (_.isArray(objValue) && _.isArray(srcValue)) {
        return srcValue;
    }
    // 对于非数组情况，让 lodash 自行处理（通常是合并）  
    // 但如果你想要非数组也进行替换，可以返回 srcValue  
    // 这里我们保持默认行为，只处理数组替换  
    return undefined; // 返回 undefined 表示使用 lodash 的默认合并逻辑  
} 