interface dataType {
    type: string;
    action?: string;
    params: any;
}
type SendMsgType = (params: any, action: string, type?: 'message' | string, clientId?: string) => void;
interface methodType {
    sendMsg: SendMsgType;
}
export declare function handleReplyMsg(data: dataType, mt: methodType): Promise<void>;
export {};
