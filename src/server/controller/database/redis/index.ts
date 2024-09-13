interface KeysNode {  
    name: string;  
    path: string;
    children: KeysNode[];  
}  
  
/**
 * 转为树形结构
 * @param keys 
 * @param sep 
 * @returns 
 */
export function classifyKeys(keys: string[], sep = ':') {  
    const root: KeysNode = { name: '', path: '', children: [] };  
    const nodeMap: Record<string, KeysNode> = { '': root }; // 用于快速查找或创建节点  
  
    keys.forEach(key => {  
        const parts = key.split(sep);  
        let currentNode = root;  
        let path = '';  
  
        parts.forEach((part, index) => {  
            path += `${path ? sep : ''}${part}`; // 构建当前路径  
  
            // 如果当前路径已经在 nodeMap 中，则直接使用该节点  
            if (nodeMap[path]) {  
                currentNode = nodeMap[path];  
            } else {  
                // 否则，创建新节点并添加到当前节点的子节点列表中  
                const newNode = { name: part, path: path, children: [] };  
                currentNode.children.push(newNode);  
                currentNode = newNode;  
  
                // 在 nodeMap 中注册新路径  
                nodeMap[path] = currentNode;  
            }  
  
            // 如果不是最后一个部分，更新当前节点的path（对于根节点不需要，因为根节点的path为空）  
            if (index < parts.length - 1) {  
                currentNode.path = path;  
            }  
        });  
  
    });  
  
    return root.children;  
}

// export function classifyKeys(keys: string[], sep = ':') {  
//     const root: KeysNode = { name: '', children: [] };  
//     const nodeMap: Record<string, KeysNode> = { '': root }; // 用于快速查找或创建节点  
  
//     keys.forEach(key => {  
//         const parts = key.split(sep);  
//         let currentNode = root;  
//         let path = '';  
  
//         parts.forEach(part => {  
//             path += `${path ? sep : ''}${part}`; // 构建当前路径  
  
//             // 如果当前路径已经在 nodeMap 中，则直接使用该节点  
//             if (nodeMap[path]) {  
//                 currentNode = nodeMap[path];  
//             } else {  
//                 // 否则，创建新节点并添加到当前节点的子节点列表中  
//                 const newNode = { name: part, children: [] };  
//                 currentNode.children.push(newNode);  
//                 currentNode = newNode;  
  
//                 // 在 nodeMap 中注册新路径  
//                 nodeMap[path] = currentNode;  
//             }  
//         });  
//     });  
  
//     return root.children;  
// }

