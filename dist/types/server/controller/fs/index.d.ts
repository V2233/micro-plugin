declare class FsController {
    listDir(ctx: any): Promise<void>;
    touch(ctx: any): Promise<void>;
    mkdir(ctx: any): Promise<void>;
    readFile(ctx: any): Promise<void>;
    readMediaFile(ctx: any): Promise<void>;
    rmFile(ctx: any): Promise<void>;
    rmDir(ctx: any): Promise<void>;
    saveFile(ctx: any): Promise<void>;
    moveFile(ctx: any): Promise<void>;
    moveDir(ctx: any): Promise<void>;
    renameFile(ctx: any): Promise<void>;
    renameDir(ctx: any): Promise<void>;
    copyFile(ctx: any): Promise<void>;
    copyDir(ctx: any): Promise<void>;
    search(ctx: any): Promise<void>;
    upload(ctx: any): Promise<void>;
    download(ctx: any): Promise<void>;
    getFilesTree(ctx: any): Promise<void>;
    getFilesSize(ctx: any): Promise<void>;
    connectSSH(ctx: any): Promise<void>;
    closeSSH(ctx: any): Promise<void>;
}
declare const _default: FsController;
export default _default;
