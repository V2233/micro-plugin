import{g as I}from"./time-e3645d07.js";import{r as q}from"./index-3bb8db9f.js";import{a as y,q as B,k as S,A as k,c as P,i as t,w as e,F as T,r as l,o as V,e as _,u as c,t as s,y as n,B as F,C as L,_ as N}from"./index-6012d839.js";const R=d=>(F("data-v-26ae39af"),d=d(),L(),d),U={class:"box"},$=["src"],M={class:"bottom"},Q={class:"title"},A=R(()=>_("p",{class:"subtitle"},"这里是低代码开发管理平台",-1)),D=["src"],E=y({__name:"index",setup(d){let u=B(),p=S([]);k(()=>{g()});const g=async()=>{let r=await q();r.code==200&&(p.value=r.data)};return(r,G)=>{const f=l("el-card"),i=l("el-table-column"),o=l("el-tag"),b=l("ChatLineRound"),m=l("el-icon"),x=l("Promotion"),h=l("Picture"),v=l("el-table");return V(),P(T,null,[t(f,null,{default:e(()=>[_("div",U,[_("img",{src:c(u).avatar?c(u).avatar:`https://q1.qlogo.cn/g?b=qq&s=0&nk=${c(u).masterQQ}`,class:"avatar"},null,8,$),_("div",M,[_("h4",Q,s(c(I)())+"好！"+s(c(u).username),1),A])])]),_:1}),t(f,{style:{"margin-top":"20px"}},{default:e(()=>[t(v,{class:"bot_list",data:c(p)},{default:e(()=>[t(i,{label:"昵称",prop:"nickname",width:"80px"}),t(i,{label:"头像",width:"60px"},{default:e(({row:a,$index:C})=>[_("img",{class:"bot_avatar",src:a.avatarUrl},null,8,D)]),_:1}),t(i,{label:"Tag",prop:"countContacts"},{default:e(({row:a,$index:C})=>[t(o,{class:"bot_tag mx-1"},{default:e(()=>[n(" Friends "+s(a.countContacts.friend),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[n(" Groups "+s(a.countContacts.group),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[n(" Users "+s(a.countContacts.groupMember),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[t(m,null,{default:e(()=>[t(b)]),_:1}),n(" "+s(a.messageCount.recv),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[t(m,null,{default:e(()=>[t(x)]),_:1}),n(" "+s(a.messageCount.sent),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[t(m,null,{default:e(()=>[t(h)]),_:1}),n(" "+s(a.messageCount.screenshot),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[n(" 协议： "+s(a.botVersion),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[n(" 平台： "+s(a.platform),1)]),_:2},1024),t(o,{class:"bot_tag mx-1"},{default:e(()=>[n(" 运行时长： "+s(a.botRunTime),1)]),_:2},1024)]),_:1})]),_:1},8,["data"])]),_:1})],64)}}});const J=N(E,[["__scopeId","data-v-26ae39af"]]);export{J as default};
