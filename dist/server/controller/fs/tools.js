import { mkdirSync, readdirSync, statSync, copyFileSync, stat } from 'fs';
import { join } from 'path';
import dirTree from 'directory-tree';

function getDir(path, depth = 1) {
    if (depth) {
        return dirTree(path, { attributes: ['mtime', 'type'], depth: depth });
    }
    else if (depth == null) {
        return dirTree(path, { attributes: ['mtime', 'type'] });
    }
}
function unlinkedPath(path) {
    let lastSepIndex = path.lastIndexOf('/');
    if (lastSepIndex == -1) {
        lastSepIndex = path.lastIndexOf('\\');
    }
    return path.slice(0, lastSepIndex);
}
function copyDirectory(src, dest) {
    mkdirSync(dest, { recursive: true });
    const files = readdirSync(src);
    files.forEach(file => {
        const srcFile = join(src, file);
        const destFile = join(dest, file);
        const stats = statSync(srcFile);
        if (stats.isDirectory()) {
            copyDirectory(srcFile, destFile);
        }
        else {
            copyFileSync(srcFile, destFile);
        }
    });
}
function fuzzyMatchInDirectoryTree(dirPath, keyword) {
    const matchedItems = [];
    function traverseTree(path) {
        const node = getDir(path);
        if (node.name.includes(keyword)) {
            if (node.type == 'directory') {
                let tempNode = JSON.parse(JSON.stringify(node));
                delete tempNode.children;
                matchedItems.push(tempNode);
            }
            else {
                matchedItems.push(node);
            }
        }
        if (node.type == 'directory') {
            node.children.forEach(child => {
                traverseTree(child.path);
            });
        }
    }
    traverseTree(dirPath);
    return matchedItems;
}
function filterDirectoryTree(tree, extension) {
    function containsFileWithExtension(node) {
        if (node.type === 'file' && node.name.includes(`${extension}`)) {
            return true;
        }
        if (node.type === 'directory' && node.children) {
            for (const child of node.children) {
                if (containsFileWithExtension(child)) {
                    return true;
                }
            }
        }
        return false;
    }
    if (tree.type === 'directory' && !containsFileWithExtension(tree)) {
        return undefined;
    }
    if (tree.children) {
        tree.children = tree.children.filter(child => {
            const filteredChild = filterDirectoryTree(child, extension);
            return filteredChild !== undefined;
        });
    }
    return tree;
}
function calculateFileSize(filePath) {
    return new Promise((resolve, reject) => {
        stat(filePath, (err, stats) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(stats.isFile() ? stats.size : 0);
            }
        });
    });
}
async function calculateTotalSize(tree) {
    let totalSize = 0;
    async function traverse(node) {
        if (node.type === 'file') {
            const fileSize = await calculateFileSize(node.path);
            totalSize += fileSize;
        }
        else if (node.type === 'directory') {
            for (const child of node.children) {
                await traverse(child);
            }
        }
    }
    for (const node of tree.children) {
        await traverse(node);
    }
    return totalSize;
}
function formatFileSize(size) {
    if (size < 1024)
        return `${size} B`;
    if (size < 1024 * 1024)
        return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024)
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export { calculateFileSize, calculateTotalSize, copyDirectory, filterDirectoryTree, formatFileSize, fuzzyMatchInDirectoryTree, getDir, unlinkedPath };
