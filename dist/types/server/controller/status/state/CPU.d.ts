export default function getCpuInfo(): Promise<false | {
    inner: number;
    title: string;
    info: string[];
}>;
