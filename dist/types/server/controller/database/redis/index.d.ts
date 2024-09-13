interface KeysNode {
    name: string;
    path: string;
    children: KeysNode[];
}
export declare function classifyKeys(keys: string[], sep?: string): KeysNode[];
export {};
