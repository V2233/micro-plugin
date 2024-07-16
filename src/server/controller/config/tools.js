import _ from 'lodash';
export function customizer(objValue, srcValue) {
    if (_.isArray(objValue) && _.isArray(srcValue)) {
        return srcValue;
    }
    return undefined;
}
