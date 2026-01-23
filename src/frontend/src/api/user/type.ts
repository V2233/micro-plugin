// 登录接口携带
export interface loginForm {
  username: string;
  password: string;
}

// 登录接口返回
interface responseData {
  code: number;
  message: string;
  ok: boolean;
}
export interface loginResponseData extends responseData {
  data: string;
}

// 用户信息
// interface userInfo {
//     userId:number,
//     avatar:string,
//     username:string,
//     password:stirng,
//     desc:string,
//     roles: string[],
//     buttons: string[],
//     routes:string[],
//     token:string
// }
// interface user {
//     checkUser: userInfo
// }

// 服务器返回用户数据相关的数据类型
export interface userInfoResponseData extends responseData {
  data: {
    userId: number;
    avatar: string;
    username: string;
    password: string;
    desc: string;
    roles: string[];
    buttons: string[];
    routes?: string[];
    token: string;
    masterQQ?: string | number;
  };
}
