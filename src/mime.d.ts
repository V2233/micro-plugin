// mime.d.ts  
declare module 'mime' {
    interface MimeModule {
        /**  
         * 获取给定文件路径的 MIME 类型。  
         * @param path 文件路径或文件扩展名  
         * @returns 文件的 MIME 类型字符串  
         */
        getType(path: string): string;

    }

    const mime: MimeModule;
    export = mime;
}