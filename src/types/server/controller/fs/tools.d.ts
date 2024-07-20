interface nodeType {
    name: string;
    path: string;
    mtime?: string;
    size?: string | number;
    type: string;
    children?: nodeType[];
}
export declare function getDir(path: string, depth?: number): nodeType;
export declare function unlinkedPath(path: string): string;
export declare function copyDirectory(src: string, dest: string): void;
export declare function fuzzyMatchInDirectoryTree(dirPath: string, keyword: string): any[];
export declare function filterDirectoryTree(tree: nodeType, extension: string): nodeType | undefined;
export declare function calculateFileSize(filePath: string): Promise<unknown>;
export declare function calculateTotalSize(tree: nodeType): Promise<number>;
export declare function formatFileSize(size: number): string;
export {};
