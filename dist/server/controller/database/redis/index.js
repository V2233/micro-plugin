function classifyKeys(keys, sep = ':') {
    const root = { name: '', path: '', children: [] };
    const nodeMap = { '': root };
    keys.forEach(key => {
        const parts = key.split(sep);
        let currentNode = root;
        let path = '';
        parts.forEach((part, index) => {
            path += `${path ? sep : ''}${part}`;
            if (nodeMap[path]) {
                currentNode = nodeMap[path];
            }
            else {
                const newNode = { name: part, path: path, children: [] };
                currentNode.children.push(newNode);
                currentNode = newNode;
                nodeMap[path] = currentNode;
            }
            if (index < parts.length - 1) {
                currentNode.path = path;
            }
        });
    });
    return root.children;
}

export { classifyKeys };
