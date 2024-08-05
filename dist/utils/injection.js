const instancesMap = new Map();
const proxyMap = new Map();
function autowired(instanceName) {
    if (!instanceName) {
        throw new Error('instanceName is required');
    }
    if (!proxyMap.has(instanceName)) {
        proxyMap.set(instanceName, createProxy(instanceName));
    }
    return proxyMap.get(instanceName);
}
function createProxy(instanceName) {
    return new Proxy({}, {
        get(target, propKey) {
            let instance = instancesMap.get(instanceName);
            if (instance) {
                let prop = instance[propKey];
                if (typeof prop === 'function') {
                    return prop.bind(instance);
                }
                return prop;
            }
            throw new Error(`${instanceName} is not found`);
        },
    });
}

export { autowired, instancesMap };
