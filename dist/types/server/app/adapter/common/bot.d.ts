declare const CopyBot: import("icqq").Client;
declare const botMethods: {
    pickGroup: typeof pickGroup;
    pickFriend: typeof pickFriend;
    pickMember: typeof pickMember;
    pickUser: typeof pickFriend;
};
declare function pickGroup(gid: any, strict: any): any;
declare function pickFriend(uid: any, strict: any): any;
declare function pickMember(gid: any, uid: any, strict: any): import("icqq").Member | {
    group_id: any;
    user_id: any;
    nickname: string;
    card: string;
    sex: string;
    age: number;
    join_time: string;
    last_sent_time: string;
    level: number;
    role: string;
    title: string;
    title_expire_time: string;
    shutup_time: number;
    update_time: string;
    area: string;
    rank: string;
};
