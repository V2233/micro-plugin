export declare function getLatestLog(logs: string[]): string;
export declare function parseLog(log: string): {
    time: string;
    level: string;
    detail: string;
};
