export default function getBotInfo(selfId: number): Promise<{
    avatarUrl: any;
    nickname: any;
    botRunTime: any;
    status: any;
    platform: any;
    botVersion: string;
    messageCount: {
        sent: any;
        recv: any;
        screenshot: string | number;
    };
    countContacts: {
        friend: any;
        group: any;
        groupMember: unknown;
    };
}[]>;
