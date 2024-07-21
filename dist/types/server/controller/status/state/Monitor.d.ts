declare const _default: {
    _network: any;
    _fsStats: any;
    chartData: any;
    valueObject: any;
    chartDataKey: string;
    network: any;
    fsStats: any;
    init(): Promise<void>;
    getData(): Promise<any>;
    getRedisChartData(): Promise<boolean>;
    setRedisChartData(): Promise<void>;
    _addData(arr: any, data: any, maxLen?: number): void;
};
export default _default;
