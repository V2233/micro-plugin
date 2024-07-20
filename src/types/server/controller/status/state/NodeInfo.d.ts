export default function getNodeInfo(): Promise<{
    inner: number;
    title: string;
    info: {
        rss: string;
        heapTotal: string;
        heapUsed: string;
        occupy: number;
    };
}>;
