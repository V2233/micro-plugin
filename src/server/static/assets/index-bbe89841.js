import{b as Y,c as G}from"./index-2379a562.js";import{a as H,k as m,A as K,r as a,o as s,c as g,i as t,w as o,b as f,y as V,t as h,F as U,g as N,h as v,e as x,u as Q,x as W,ah as k,B as X,C as Z,_ as ee}from"./index-de339125.js";const le=b=>(X("data-v-af86109f"),b=b(),Z(),b),te={class:"top_bar"},ae=le(()=>f("div",{class:"sub-title"},"用户权限",-1)),oe={style:{"font-size":"12px"}},ne={class:"sub-title"},ue={key:3},se=H({__name:"index",setup(b){const I=m([{route:"Status",title:"状态"},{route:"Logs",title:"日志"},{route:"Fs",title:"文件"},{route:"Plugin",title:"开发"},{route:"Bot",title:"Bot配置"},{route:"Plugins",title:"其它配置"},{route:"Permission",title:"权限管理"},{route:"About",title:"关于"}]);let d=m(!1);const u=m([]),A=m(0),C=m("add"),c=m({}),w=async()=>{let l=await Y();l.code==200&&(u.value=l.data)},L=()=>{C.value="add";const l=JSON.parse(JSON.stringify(u.value[0]));l.username.value="",l.password.value="",l.avatar.value="",c.value=l,d.value=!0},P=(l,_)=>{C.value="update",c.value=l,A.value=_,d.value=!0},z=(l,_)=>{const i=new Set;for(let r=0;r<l.length;r++){const y=l[r][_].value;if(i.has(y))return!0;i.add(y)}return!1},S=async()=>{let l=await G(u.value);console.log(l),l.code==200&&(k.success("保存成功！"),w(),d.value=!1)},D=l=>{if(u.value.length<=1){k.error("不可清空！");return}u.value.splice(l,1),console.log(u.value),S()},E=()=>{if(C.value=="add"){if(!c.value.password.value){k.error("密码不能为空！");return}if(u.value.push(c.value),z(u.value,"username")){k.error("已存在相同账号！"),w();return}}else u.value[A.value]=c.value;d.value=!1,S()};return K(()=>{w()}),(l,_)=>{const i=a("el-button"),r=a("el-table-column"),y=a("el-popconfirm"),F=a("el-table"),M=a("el-card"),O=a("el-input"),q=a("el-input-number"),J=a("el-switch"),$=a("el-checkbox"),j=a("el-checkbox-group"),R=a("el-form-item"),T=a("el-dialog");return s(),g(U,null,[t(M,null,{default:o(()=>[f("div",te,[ae,f("div",null,[t(i,{type:"primary",icon:"Plus",onClick:L},{default:o(()=>[V(" 添加 ")]),_:1})])]),t(F,{data:u.value},{default:o(()=>[t(r,{type:"index",label:"#"}),t(r,{label:"账号"},{default:o(({row:e,$index:p})=>[V(h(e.username.value),1)]),_:1}),t(r,{label:"描述"},{default:o(({row:e,$index:p})=>[f("span",oe,h(e.desc.value),1)]),_:1}),t(r,{label:"操作",fixed:"right","min-width":"120px"},{default:o(({row:e,$index:p})=>[t(i,{type:"primary",size:"small",icon:"Edit",onClick:B=>P(e,p)},null,8,["onClick"]),t(y,{title:"删除后不可恢复，您确定吗？",onConfirm:B=>D(p)},{reference:o(()=>[t(i,{type:"primary",size:"small",icon:"Delete"})]),_:2},1032,["onConfirm"])]),_:1})]),_:1},8,["data"])]),_:1}),t(T,{modelValue:Q(d),"onUpdate:modelValue":_[0]||(_[0]=e=>W(d)?d.value=e:d=e),title:c.value.desc?c.value.desc.value:"新增管理员"},{default:o(()=>[t(i,{type:"primary",onClick:E},{default:o(()=>[V(" 保存 ")]),_:1}),(s(!0),g(U,null,N(c.value,(e,p,B)=>(s(),v(R,{key:p,lable:e.desc},{default:o(()=>[f("div",ne,h(e.desc),1),e.type=="string"?(s(),v(O,{key:0,modelValue:e.value,"onUpdate:modelValue":n=>e.value=n},null,8,["modelValue","onUpdate:modelValue"])):x("",!0),e.type=="number"?(s(),v(q,{key:1,modelValue:e.value,"onUpdate:modelValue":n=>e.value=n},null,8,["modelValue","onUpdate:modelValue"])):x("",!0),e.type=="boolean"?(s(),v(J,{key:2,modelValue:e.value,"onUpdate:modelValue":n=>e.value=n,class:"ml-2","inline-prompt":"",style:{"--el-switch-on-color":"#13ce66"},"active-text":"Y","inactive-text":"N"},null,8,["modelValue","onUpdate:modelValue"])):x("",!0),e.type=="array"?(s(),g("div",ue,[t(j,{modelValue:e.value,"onUpdate:modelValue":n=>e.value=n},{default:o(()=>[(s(!0),g(U,null,N(I.value,n=>(s(),v($,{key:n.route,value:n.route},{default:o(()=>[V(h(n.title),1)]),_:2},1032,["value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])])):x("",!0)]),_:2},1032,["lable"]))),128))]),_:1},8,["modelValue","title"])],64)}}});const re=ee(se,[["__scopeId","data-v-af86109f"]]);export{re as default};
