export default function getMemUsage(): Promise<{
    inner: string;
    title: string;
    info: string[];
    buffcache: {
        isBuff: boolean;
    };
}>;
