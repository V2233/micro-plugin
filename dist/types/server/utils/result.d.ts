export declare class Result {
    code: number;
    result: any;
    message: string;
    httpStatus: number;
    constructor(code: number, result: any, message: string, httpStatus?: number);
    static VOID: symbol;
    static ERR_CODE_501: symbol;
    static ok(result: any, message?: string): Result;
    static error(...args: any[]): Result;
    static noLogin(): Result;
    static noAuth(): Result;
    static notFound(): Result;
    static unrealized(): Result;
    get isOk(): boolean;
    toJSON(): {
        ok: boolean;
        code: number;
        result: any;
        message: string;
    };
}
