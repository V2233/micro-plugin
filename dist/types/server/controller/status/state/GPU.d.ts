export default function getGPU(): Promise<false | {
    inner: number;
    title: string;
    info: {
        used: string;
        total: string;
        vendor: any;
        model: any;
        temperatureGpu: any;
    };
}>;
