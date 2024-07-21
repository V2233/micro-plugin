export interface messageType {
    type: string;
    data?: string | number;
    url?: string;
    json?: string;
    hash?: string;
    content?: any;
}
export type pluginType = {
    id: string;
    event: string;
    reg: string;
    cron: string;
    delayTime: number;
    flag: string;
    isGlobal: boolean;
    isAt: boolean;
    isQuote: boolean;
    groups: string[];
    friends: string[];
    message: messageType[];
};
