import{d as W,a as y,u as l,s as q,o as n,c as u,b as f,e as d,t as b,_ as w,f as I,r as a,g as T,F as h,h as p,w as o,i as e,j as x,k as L,l as X,T as Y,n as Z,m as z,p as ee,v as te,q as B,x as oe,y as F,z as N}from"./index-9f9cad39.js";let ne=W("SettingStore",{state:()=>({foldMode:2,refresh:!1})});const $=ne,le={key:0,class:"logo"},ae=["src"],se={name:"Logo"},ce=y({...se,setup(g){let r=$();return(s,c)=>l(q).logoHidden==!1?(n(),u("div",le,[l(r).foldMode!=0?(n(),u("img",{key:0,src:l(q).logo},null,8,ae)):f("",!0),d("p",null,b(l(r).foldMode==2?l(q).title:""),1)])):f("",!0)}});const re=w(ce,[["__scopeId","data-v-6d5537f1"]]),_e={name:"Menu"},de=y({..._e,props:["menuList"],setup(g){let r=I();const s=c=>{r.push(c.index)};return(c,m)=>{const _=a("el-icon"),i=a("el-menu-item"),v=a("Menu"),k=a("el-sub-menu");return n(!0),u(h,null,T(g.menuList,t=>(n(),u(h,{key:t.path},[t.children?f("",!0):(n(),u(h,{key:0},[t.meta.hidden?f("",!0):(n(),p(i,{key:0,index:t.path,onClick:s},{title:o(()=>[d("span",null,b(t.meta.title),1)]),default:o(()=>[e(_,null,{default:o(()=>[(n(),p(x(t.meta.icon)))]),_:2},1024)]),_:2},1032,["index"]))],64)),t.children&&t.children.length==1?(n(),u(h,{key:1},[t.children[0].meta.hidden?f("",!0):(n(),p(i,{key:0,index:t.children[0].path,onClick:s},{title:o(()=>[d("span",null,b(t.children[0].meta.title),1)]),default:o(()=>[e(_,null,{default:o(()=>[(n(),p(x(t.children[0].meta.icon)))]),_:2},1024)]),_:2},1032,["index"]))],64)):f("",!0),t.children&&t.children.length>1?(n(),u(h,{key:2},[t.meta.hidden?f("",!0):(n(),p(k,{key:0,index:t.path},{title:o(()=>[e(_,null,{default:o(()=>[(n(),p(x(t.meta.icon)))]),_:2},1024),d("span",null,b(t.meta.title),1)]),default:o(()=>[e(v,{menuList:t.children},null,8,["menuList"])]),_:2},1032,["index"]))],64)):f("",!0)],64))),128)}}}),ue={class:"com"},ie={name:"Main"},pe=y({...ie,setup(g){let r=$(),s=L(!0);return X(()=>r.refresh,()=>{s.value=!1,Z(()=>{s.value=!0})}),(c,m)=>{const _=a("router-view");return n(),p(_,null,{default:o(({Component:i})=>[e(Y,{name:"fade"},{default:o(()=>[d("div",ue,[l(s)?(n(),p(x(i),{key:0})):f("",!0)])]),_:2},1024)]),_:1})}}});const me=w(pe,[["__scopeId","data-v-d6118171"]]),fe={style:{margin:"0px 2px"}},he={name:"Breadcrumb"},ge=y({...he,setup(g){let r=z(),s=$();const c=()=>{if(s.foldMode>=2){s.foldMode=0;return}s.foldMode++};return(m,_)=>{const i=a("el-icon"),v=a("el-breadcrumb-item"),k=a("el-breadcrumb");return n(),u(h,null,[e(i,{style:{"margin-right":"10px"},onClick:c},{default:o(()=>[(n(),p(x(l(s).foldMode==2?"Expand":"Fold")))]),_:1}),e(k,{"separator-icon":"ArrowRight"},{default:o(()=>[(n(!0),u(h,null,T(l(r).matched,(t,V)=>ee((n(),p(v,{key:V,to:t.path},{default:o(()=>[e(i,{style:{margin:"0px 2px"}},{default:o(()=>[(n(),p(x(t.meta.icon)))]),_:2},1024),d("span",fe,b(t.meta.title),1)]),_:2},1032,["to"])),[[te,t.meta.title]])),128))]),_:1})],64)}}}),ve=["src"],ye={class:"el-dropdown-link"},be={name:"Setting"},xe=y({...be,setup(g){let r=I(),s=z(),c=$(),m=B(),_=L(!1);const i=()=>{c.refresh=!c.refresh},v=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()},k=async()=>{await m.logOut(),r.push({path:"/login",query:{redirect:s.path}})},t=L("rgba(255, 69, 0, 0.68)"),V=L(["#ff4500","#ff8c00","#ffd700","#90ee90","#00ced1","#1e90ff","#c71585","rgba(255, 69, 0, 0.68)","rgb(255, 120, 0)","hsv(51, 100, 98)","hsva(120, 40, 94, 0.5)","hsl(181, 100%, 37%)","hsla(209, 100%, 56%, 0.73)","#c7158577"]),D=()=>{let S=document.documentElement;_.value?S.className="dark":S.className=""},U=()=>{document.documentElement.style.setProperty("--el-color-primary",t.value)};return(S,M)=>{const R=a("el-button"),O=a("el-color-picker"),E=a("el-form-item"),Q=a("el-switch"),j=a("el-form"),A=a("el-popover"),H=a("arrow-down"),P=a("el-icon"),G=a("el-dropdown-item"),J=a("el-dropdown-menu"),K=a("el-dropdown");return n(),u(h,null,[e(R,{type:"primary",size:"small",icon:"Refresh",circle:"",onClick:i}),e(R,{type:"primary",size:"small",icon:"FullScreen",circle:"",onClick:v}),e(A,{placement:"bottom",title:"主题设置",width:300,trigger:"hover"},{reference:o(()=>[e(R,{size:"small",icon:"Setting",circle:""})]),default:o(()=>[e(j,null,{default:o(()=>[e(E,{label:"主题颜色"},{default:o(()=>[e(O,{onChange:U,modelValue:t.value,"onUpdate:modelValue":M[0]||(M[0]=C=>t.value=C),size:"small","show-alpha":"",predefine:V.value},null,8,["modelValue","predefine"])]),_:1}),e(E,{label:"暗黑模式"},{default:o(()=>[e(Q,{onChange:D,modelValue:l(_),"onUpdate:modelValue":M[1]||(M[1]=C=>oe(_)?_.value=C:_=C),class:"mt-2",style:{"margin-left":"24px"},"inline-prompt":"","active-icon":"MoonNight","inactive-icon":"Sunny"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),d("img",{class:"avatar",src:l(m).avatar?l(m).avatar:`https://q1.qlogo.cn/g?b=qq&s=0&nk=${l(m).masterQQ}`},null,8,ve),e(K,null,{dropdown:o(()=>[e(J,null,{default:o(()=>[e(G,{onClick:k},{default:o(()=>[F("退出登录")]),_:1})]),_:1})]),default:o(()=>[d("span",ye,[F(b(l(m).username)+" ",1),e(P,{class:"el-icon--right"},{default:o(()=>[e(H)]),_:1})])]),_:1})],64)}}});const ke=w(xe,[["__scopeId","data-v-72ae8bd4"]]),Se={class:"tabbar"},we={class:"tabbar_left"},$e={class:"tabbar_right"},Me={name:"Tabbar"},Ce=y({...Me,setup(g){return(r,s)=>(n(),u("div",Se,[d("div",we,[e(ge)]),d("div",$e,[e(ke)])]))}});const Le=w(Ce,[["__scopeId","data-v-d77f91a0"]]),Ve={class:"layout_container"},Re={name:"Layout"},qe=y({...Re,setup(g){let r=z(),s=B(),c=$();return(m,_)=>{const i=a("el-menu"),v=a("el-scrollbar");return n(),u("div",Ve,[d("div",{class:N(["layout_slider",{fold:l(c).foldMode==1,hidden:l(c).foldMode==0}])},[e(re),e(v,{class:"scrollbar"},{default:o(()=>[e(i,{collapse:l(c).foldMode==1,"default-active":l(r).path,"background-color":"#001529","text-color":"white","active-text-color":"yellowgreen"},{default:o(()=>[e(de,{menuList:l(s).menuRoutes},null,8,["menuList"])]),_:1},8,["collapse","default-active"])]),_:1})],2),d("div",{class:N(["layout_tabbar",{fold:l(c).foldMode==1,hidden:l(c).foldMode==0}])},[e(Le)],2),d("div",{class:N(["layout_main",{fold:l(c).foldMode==1,hidden:l(c).foldMode==0}])},[e(me)],2)])}}});const ze=w(qe,[["__scopeId","data-v-73baa0d5"]]);export{ze as default};
