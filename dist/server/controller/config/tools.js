import _ from 'lodash';

function customizer(objValue, srcValue) {
    if (_.isArray(objValue) && _.isArray(srcValue)) {
        return srcValue;
    }
    return undefined;
}
function getNestedProperty(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!current || !(key in current)) {
            return { isTrue: false };
        }
        current = current[key];
        if (i === keys.length - 1) {
            return { isTrue: true, value: current };
        }
    }
}

export { customizer, getNestedProperty };
