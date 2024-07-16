import { statSync, readdirSync, mkdirSync, copyFileSync, stat } from 'fs'
import { join } from 'path';
import dirTree from 'directory-tree'

interface nodeType {
    name: string,
    path: string,
    mtime?: string,
    size?: string | number,
    type: string,
    children?:nodeType[]
}

/**
 * 获取目录树。
 * @param {string} path 要获取的目录路径
 * @param {number} depth 层数
 * @returns {nodeType} 
 */
export function getDir(path: string, depth = 1):nodeType {
    if (depth) {
        return dirTree(path, { attributes: ['mtime', 'type'], depth: depth }) as nodeType
    } else if (depth == null) {
        return dirTree(path, { attributes: ['mtime', 'type'] })
    }

}

/**
 * 返回上一级path。
 * @param {string} path 当前所在目录路径
 * @returns {string} 
 */
export function unlinkedPath(path: string):string {
    let lastSepIndex = path.lastIndexOf('/')
    if (lastSepIndex == -1) {
        lastSepIndex = path.lastIndexOf('\\')
    }
    return path.slice(0, lastSepIndex);
}

/**
 * 递归拷贝。
 * @param {string} src 原目录
 * @param {string} dest 目标目录
 * @returns {void}
 */
export function copyDirectory(src: string, dest: string) {
    mkdirSync(dest, { recursive: true }); // 确保目标目录存在  
    const files = readdirSync(src);
    files.forEach(file => {
        const srcFile = join(src, file);
        const destFile = join(dest, file);
        const stats = statSync(srcFile);
        if (stats.isDirectory()) {
            copyDirectory(srcFile, destFile);
        } else {
            copyFileSync(srcFile, destFile);
        }
    });
}

/**
 * 深度优先匹配搜索关机字。
 * @param {string} dirPath 要搜索的目录
 * @param {string} keyword 关键词
 * @returns {nodeType} 一层合并的树包含根节点
 */
export function fuzzyMatchInDirectoryTree(dirPath: string, keyword: string) {
    // 用来存储匹配结果的数组  
    const matchedItems = [];
    
    // 递归函数，用于遍历目录树并查找匹配项  
    function traverseTree(path:string) {
        const node = getDir(path)
        // 检查当前节点的名称是否包含关键词  
        if (node.name.includes(keyword)) {
            if(node.type == 'directory') {
                let tempNode = JSON.parse(JSON.stringify(node))
                delete tempNode.children
                matchedItems.push(tempNode); 
            } else {
                matchedItems.push(node);
            }
        }

        // 如果当前节点有子节点，则递归遍历子节点
        if (node.type == 'directory') {
            node.children.forEach(child => {
                traverseTree(child.path); 
            });
        }
    }

    // 从根节点开始遍历  
    traverseTree(dirPath);

    // 返回匹配结果  
    return matchedItems;
}  

/**  
 * 深度优先过滤目录树  
 * @param {nodeType} tree 要搜索的目录树  
 * @param {string} ex 待提取文件扩展名  
 * @returns {nodeType | undefined} 过滤后的目录树或 undefined（如果整个树被过滤掉）  
 */  
export function filterDirectoryTree(tree: nodeType, extension: string): nodeType | undefined {  
    // 辅助函数，用于递归检查子树是否包含指定扩展名的文件  
    function containsFileWithExtension(node: nodeType): boolean {  
        if (node.type === 'file' && node.name.includes(`${extension}`)) {  
            return true; // 当前文件匹配扩展名  
        }  
        if (node.type === 'directory' && node.children) {  
            for (const child of node.children) {  
                if (containsFileWithExtension(child)) {  
                    return true; // 子树中包含匹配的文件  
                }  
            }  
        }  
        return false; // 当前节点和子树中都不包含匹配的文件  
    }  
  
    // 如果当前节点不包含指定扩展名的文件，且是目录且没有子节点，则移除该目录  
    if (tree.type === 'directory' && !containsFileWithExtension(tree)) {  
        return undefined; // 表示该目录应被移除  
    }  
  
    // 如果当前节点是文件或包含至少一个匹配文件的目录，则递归处理子节点  
    if (tree.children) {  
        tree.children = tree.children.filter(child => {  
            const filteredChild = filterDirectoryTree(child, extension);  
            return filteredChild !== undefined; // 只保留有效的子节点  
        });  
  
        // 如果处理后没有子节点了，但当前节点是目录且我们不想移除整个树（即它不是根节点），则可能需要保留空目录  
        // 但在这个特定问题中，我们假设空目录也应该被移除（除非它是根节点且整个树只有一个空目录）  
        // 注意：如果根节点是一个空目录且没有其他内容，这个函数将返回 undefined  
    }  
  
    // 返回当前节点（可能是文件、包含有效子节点的目录或整个树被过滤为空时的 undefined）  
    return tree;  
}  

/**
 * 计算文件大小
 * @param {string} filePath 路径
 * @returns {number} 文件大小
 */
export function calculateFileSize(filePath:string) {  
    return new Promise((resolve, reject) => {  
        stat(filePath, (err, stats) => {  
            if (err) {  
                reject(err);  
            } else {  
                resolve(stats.isFile() ? stats.size : 0); // 如果是文件，返回其大小；如果是目录，返回0  
            }  
        });  
    });  
}  
  
/**
 * 异步遍历目录树并计算总文件大小  
 * @param {nodeType} tree 路径
 * @returns {number} 文件夹总大小
 */
export async function calculateTotalSize(tree:nodeType) {  
    let totalSize = 0;  
  
    // 递归函数，遍历目录树  
    async function traverse(node) {  
        if (node.type === 'file') {  
            // 如果是文件，累加其大小  
            const fileSize = await calculateFileSize(node.path) as number
            totalSize += fileSize;  
        } else if (node.type === 'directory') {  
            // 如果是目录，递归遍历其子节点  
            for (const child of node.children) {  
                await traverse(child);  
            }  
        }  
    }  
  
    // 开始遍历  
    for (const node of tree.children) {  
        await traverse(node);  
    }  
  
    return totalSize;   
}  

/**
 * 格式化显示
 * @param size 大小
 * @returns {string} 文件夹总大小字符串
 */
export function formatFileSize(size:number) {  
    if (size < 1024) return `${size} B`;  
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;  
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;  
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}  