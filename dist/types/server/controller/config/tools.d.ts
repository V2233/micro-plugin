export declare function customizer(objValue: any, srcValue: any): any;
export declare function getNestedProperty(obj: any, path: string): {
    isTrue: boolean;
    value?: undefined;
} | {
    isTrue: boolean;
    value: any;
};
