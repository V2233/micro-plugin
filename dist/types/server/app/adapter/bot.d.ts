declare const CopyBot: any;
declare const botMethods: {
    pickGroup: typeof pickGroup;
    pickFriend: typeof pickFriend;
    pickMember: typeof pickMember;
    pickUser: typeof pickFriend;
};
declare function pickGroup(gid: any, strict: any): any;
declare function pickFriend(uid: any, strict: any): any;
declare function pickMember(gid: any, uid: any, strict: any): any;
