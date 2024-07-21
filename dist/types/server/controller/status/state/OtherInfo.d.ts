export default function getOtherInfo(e?: {
    isPro: boolean;
}): Promise<any>;
export declare function getEnvVersion(): Promise<{
    node: any;
    v8: any;
    git: any;
    redis: any;
}>;
