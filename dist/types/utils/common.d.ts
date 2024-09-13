declare const _default: {
    getPermission(e: any, permission?: string, role?: string, { groupObj }?: {
        groupObj?: any;
    }): true | "❎ Bot权限不足，需要群主权限" | "❎ Bot权限不足，需要管理员权限" | "❎ 该命令仅限主人可用" | "❎ 该命令仅限群主可用" | "❎ 该命令仅限管理可用";
    checkPermission(e: any, ...args: any[]): boolean;
    limit(userId: any, key: any, maxlimit: any): Promise<boolean>;
    getck(data: any, bot: import("icqq").Client, transformation: any): {};
    checkIfEmpty(data: any, omits?: any[]): any;
};
export default _default;
