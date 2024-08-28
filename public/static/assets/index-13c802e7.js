import{a as I}from"./index-49fce7c2.js";import{a as $,k as o,A as j,r as c,o as m,h as T,w as i,e as r,i as s,u as a,x as L,c as C,F as B,g as E,O as S,t as z,z as J,B as Q,C as X,_ as Y}from"./index-7e38c3b8.js";const ee=g=>(Q("data-v-5ba2c0ea"),g=g(),X(),g),le={class:"log_select"},oe={class:"log_title"},te=ee(()=>r("span",{style:{"margin-right":"10px"}},"日志",-1)),ae={class:"select_log"},se={class:"timestamp"},ne=$({__name:"index",setup(g){let w=o([]),R=o([]),F=o("0"),d=o(""),u=o(500),k=o(500),p=o("#c8c7c7"),A=o("#c8c7c7"),_=o(16),v=o(16);const U=o(["#c8c7c7","rgba(30, 244, 251, 1)","#ff4500","#ff8c00","#ffd700","#90ee90","#00ced1","#1e90ff","#c71585"]),V=o({STDOUT:"stdout",TRACE:"level-trace",DEBUG:"level-debug",INFO:"level-info",WARN:"level-warn",WARNING:"level-warn",ERROR:"level-error",ERRO:"level-error",FATAL:"level-fatal",MARK:"level-mark"});j(()=>{b()});const D=t=>{k.value=u.value},N=t=>{v.value=_.value},O=()=>{A.value=p.value},b=async t=>{let l;t=="0"||!t?l=await I("0"):l=await I(t),l.code==200&&(w.value=l.data.logText.split("\r").map(n=>G(n.trim())),R.value=l.data.logList,d.value=l.data.curLog)},M=t=>{b(t)},H=()=>{b(F.value)},G=t=>{const n=/^(\[\d+:\d+:\d+.\d+\])\[([A-Z]+?)\](.*)/.exec(t);if(n&&n.length>=4){const f=n[1],h=n[2],x=n[3];return{time:f,level:h,detail:x}}else return{time:"",level:"",detail:t}};return(t,l)=>{const n=c("el-color-picker"),f=c("el-button"),h=c("el-slider"),x=c("el-form-item"),W=c("el-form"),q=c("el-popover"),K=c("el-option"),P=c("el-select"),Z=c("el-card");return m(),T(Z,{class:"log_box"},{default:i(()=>[r("div",le,[r("div",oe,[te,s(n,{onChange:O,modelValue:a(p),"onUpdate:modelValue":l[0]||(l[0]=e=>L(p)?p.value=e:p=e),size:"small","show-alpha":"",predefine:U.value},null,8,["modelValue","predefine"])]),r("div",ae,[s(f,{class:"update_btn",size:"small",icon:"Refresh",circle:"",onClick:H,style:{"margin-right":"-5px"}}),s(q,{placement:"bottom",title:"日志设置",width:300,trigger:"hover"},{reference:i(()=>[s(f,{size:"small",icon:"Setting",circle:"",style:{"margin-right":"5px"}})]),default:i(()=>[s(W,null,{default:i(()=>[s(x,{label:"窗口高度"},{default:i(()=>[s(h,{modelValue:a(u),"onUpdate:modelValue":l[1]||(l[1]=e=>L(u)?u.value=e:u=e),size:"large",min:400,max:1e3,onInput:D},null,8,["modelValue"])]),_:1}),s(x,{label:"字体大小"},{default:i(()=>[s(h,{modelValue:a(_),"onUpdate:modelValue":l[2]||(l[2]=e=>L(_)?_.value=e:_=e),size:"large",min:12,max:30,onInput:N},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),s(P,{modelValue:a(d),"onUpdate:modelValue":l[3]||(l[3]=e=>L(d)?d.value=e:d=e),placeholder:"Select",size:"small",style:{width:"130px"},onChange:M},{default:i(()=>[(m(!0),C(B,null,E(a(R),(e,y)=>(m(),T(K,{key:y,label:e.replace("command.",""),value:e},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),r("div",{class:"page-logs",style:S({height:`${a(k)}px`})},[(m(!0),C(B,null,E(a(w),(e,y)=>(m(),C("div",{class:"line",key:y,style:S({fontSize:`${a(v)}px`,marginTop:`${Math.round(a(v)*.2)}px`,lineHeight:`${String(Math.round(1.5*a(v)))}px`})},[r("span",se,z(e.time),1),r("span",{class:J(V.value[e.level]?V.value[e.level]:V.value.STDOUT)}," ["+z(e.level)+"] ",3),r("span",{class:"detail",style:S({color:`${a(A)}`})},z(e.detail),5)],4))),128))],4)]),_:1})}}});const ie=Y(ne,[["__scopeId","data-v-5ba2c0ea"]]);export{ie as default};
