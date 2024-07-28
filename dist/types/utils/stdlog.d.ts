declare class Stdlog {
    nickname(id: string | number): string;
    info(id: string | number, ...log: any): void;
    mark(id: string | number, ...log: any): void;
    error(id: string | number, ...log: any): void;
    warn(id: string | number, ...log: any): void;
    debug(id: string | number, ...log: any): void;
    trace(id: string | number, ...log: any): void;
    fatal(id: string | number, ...log: any): void;
}
declare const _default: Stdlog;
export default _default;
