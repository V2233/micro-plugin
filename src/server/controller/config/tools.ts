import _ from 'lodash'

/**
 * 合并对象
 * @param objValue 
 * @param srcValue 
 * @returns 
 */
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

/**
 * 判断对象中是否存在子键
 * @param obj 
 * @param path 
 * @returns 
 */
export function getNestedProperty(obj, path:string) {   
    const keys = path.split('.');  
      
    let current = obj;  
      
    for (let i = 0; i < keys.length; i++) {  
        const key = keys[i];  
        // 如果当前对象不存在或当前键不在当前对象中，则返回{isTrue: false}  
        if (!current || !(key in current)) {  
            return { isTrue: false };  
        }  
        // 否则，更新当前对象为当前键对应的值  
        current = current[key];  
            
        // 如果这是最后一个键，并且找到了值，提前返回结果  
        if (i === keys.length - 1) {  
            return { isTrue: true, value: current };  
        }  
    }
} 

