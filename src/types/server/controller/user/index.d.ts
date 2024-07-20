declare class UserController {
    login(ctx: any): Promise<void>;
    logOut(ctx: any): Promise<void>;
    userInfo(ctx: any): Promise<void>;
    getPort(ctx: any): Promise<void>;
}
declare const _default: UserController;
export default _default;
