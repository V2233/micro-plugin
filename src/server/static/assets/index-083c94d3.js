import{d as W,a as y,u as a,s as N,o,c as p,b as _,t as b,e as f,_ as w,f as M,r as l,g as T,F as h,h as i,w as n,i as e,j as x,k as V,l as X,T as Y,n as Z,m as E,p as ee,v as te,q as B,x as ne,y as I,z}from"./index-9cab0b24.js";let oe=W("SettingStore",{state:()=>({fold:!1,refresh:!1})});const $=oe,le={key:0,class:"logo"},ae=["src"],se={name:"Logo"},ce=y({...se,setup(g){let u=$();return(s,c)=>a(N).logoHidden==!1?(o(),p("div",le,[_("img",{src:a(N).logo},null,8,ae),_("p",null,b(a(u).fold?"":a(N).title),1)])):f("",!0)}});const _e=w(ce,[["__scopeId","data-v-37fe93f4"]]),re={name:"Menu"},ue=y({...re,props:["menuList"],setup(g){let u=M();const s=c=>{u.push(c.index)};return(c,m)=>{const r=l("el-icon"),d=l("el-menu-item"),v=l("Menu"),k=l("el-sub-menu");return o(!0),p(h,null,T(g.menuList,t=>(o(),p(h,{key:t.path},[t.children?f("",!0):(o(),p(h,{key:0},[t.meta.hidden?f("",!0):(o(),i(d,{key:0,index:t.path,onClick:s},{title:n(()=>[_("span",null,b(t.meta.title),1)]),default:n(()=>[e(r,null,{default:n(()=>[(o(),i(x(t.meta.icon)))]),_:2},1024)]),_:2},1032,["index"]))],64)),t.children&&t.children.length==1?(o(),p(h,{key:1},[t.children[0].meta.hidden?f("",!0):(o(),i(d,{key:0,index:t.children[0].path,onClick:s},{title:n(()=>[_("span",null,b(t.children[0].meta.title),1)]),default:n(()=>[e(r,null,{default:n(()=>[(o(),i(x(t.children[0].meta.icon)))]),_:2},1024)]),_:2},1032,["index"]))],64)):f("",!0),t.children&&t.children.length>1?(o(),p(h,{key:2},[t.meta.hidden?f("",!0):(o(),i(k,{key:0,index:t.path},{title:n(()=>[e(r,null,{default:n(()=>[(o(),i(x(t.meta.icon)))]),_:2},1024),_("span",null,b(t.meta.title),1)]),default:n(()=>[e(v,{menuList:t.children},null,8,["menuList"])]),_:2},1032,["index"]))],64)):f("",!0)],64))),128)}}}),de={class:"com"},ie={name:"Main"},pe=y({...ie,setup(g){let u=$(),s=V(!0);return X(()=>u.refresh,()=>{s.value=!1,Z(()=>{s.value=!0})}),(c,m)=>{const r=l("router-view");return o(),i(r,null,{default:n(({Component:d})=>[e(Y,{name:"fade"},{default:n(()=>[_("div",de,[a(s)?(o(),i(x(d),{key:0})):f("",!0)])]),_:2},1024)]),_:1})}}});const me=w(pe,[["__scopeId","data-v-d6118171"]]),fe={style:{margin:"0px 2px"}},he={name:"Breadcrumb"},ge=y({...he,setup(g){let u=E(),s=$();const c=()=>{s.fold=!s.fold};return(m,r)=>{const d=l("el-icon"),v=l("el-breadcrumb-item"),k=l("el-breadcrumb");return o(),p(h,null,[e(d,{style:{"margin-right":"10px"},onClick:c},{default:n(()=>[(o(),i(x(a(s).fold?"Fold":"Expand")))]),_:1}),e(k,{"separator-icon":"ArrowRight"},{default:n(()=>[(o(!0),p(h,null,T(a(u).matched,(t,R)=>ee((o(),i(v,{key:R,to:t.path},{default:n(()=>[e(d,{style:{margin:"0px 2px"}},{default:n(()=>[(o(),i(x(t.meta.icon)))]),_:2},1024),_("span",fe,b(t.meta.title),1)]),_:2},1032,["to"])),[[te,t.meta.title]])),128))]),_:1})],64)}}}),ve=["src"],ye={class:"el-dropdown-link"},be={name:"Setting"},xe=y({...be,setup(g){let u=M(),s=E(),c=$(),m=B(),r=V(!1);const d=()=>{c.refresh=!c.refresh},v=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()},k=async()=>{await m.logOut(),u.push({path:"/login",query:{redirect:s.path}})},t=V("rgba(255, 69, 0, 0.68)"),R=V(["#ff4500","#ff8c00","#ffd700","#90ee90","#00ced1","#1e90ff","#c71585","rgba(255, 69, 0, 0.68)","rgb(255, 120, 0)","hsv(51, 100, 98)","hsva(120, 40, 94, 0.5)","hsl(181, 100%, 37%)","hsla(209, 100%, 56%, 0.73)","#c7158577"]),D=()=>{let S=document.documentElement;r.value?S.className="dark":S.className=""},U=()=>{document.documentElement.style.setProperty("--el-color-primary",t.value)};return(S,C)=>{const q=l("el-button"),O=l("el-color-picker"),F=l("el-form-item"),Q=l("el-switch"),j=l("el-form"),A=l("el-popover"),H=l("arrow-down"),P=l("el-icon"),G=l("el-dropdown-item"),J=l("el-dropdown-menu"),K=l("el-dropdown");return o(),p(h,null,[e(q,{type:"primary",size:"small",icon:"Refresh",circle:"",onClick:d}),e(q,{type:"primary",size:"small",icon:"FullScreen",circle:"",onClick:v}),e(A,{placement:"bottom",title:"主题设置",width:300,trigger:"hover"},{reference:n(()=>[e(q,{size:"small",icon:"Setting",circle:""})]),default:n(()=>[e(j,null,{default:n(()=>[e(F,{label:"主题颜色"},{default:n(()=>[e(O,{onChange:U,modelValue:t.value,"onUpdate:modelValue":C[0]||(C[0]=L=>t.value=L),size:"small","show-alpha":"",predefine:R.value},null,8,["modelValue","predefine"])]),_:1}),e(F,{label:"暗黑模式"},{default:n(()=>[e(Q,{onChange:D,modelValue:a(r),"onUpdate:modelValue":C[1]||(C[1]=L=>ne(r)?r.value=L:r=L),class:"mt-2",style:{"margin-left":"24px"},"inline-prompt":"","active-icon":"MoonNight","inactive-icon":"Sunny"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),_("img",{class:"avatar",src:a(m).avatar?a(m).avatar:`https://q1.qlogo.cn/g?b=qq&s=0&nk=${a(m).masterQQ}`},null,8,ve),e(K,null,{dropdown:n(()=>[e(J,null,{default:n(()=>[e(G,{onClick:k},{default:n(()=>[I("退出登录")]),_:1})]),_:1})]),default:n(()=>[_("span",ye,[I(b(a(m).username)+" ",1),e(P,{class:"el-icon--right"},{default:n(()=>[e(H)]),_:1})])]),_:1})],64)}}});const ke=w(xe,[["__scopeId","data-v-72ae8bd4"]]),Se={class:"tabbar"},we={class:"tabbar_left"},$e={class:"tabbar_right"},Ce={name:"Tabbar"},Le=y({...Ce,setup(g){return(u,s)=>(o(),p("div",Se,[_("div",we,[e(ge)]),_("div",$e,[e(ke)])]))}});const Ve=w(Le,[["__scopeId","data-v-d77f91a0"]]),Re={class:"layout_container"},qe={name:"Layout"},Ne=y({...qe,setup(g){let u=E(),s=B(),c=$();return(m,r)=>{const d=l("el-menu"),v=l("el-scrollbar");return o(),p("div",Re,[_("div",{class:z(["layout_slider",{fold:!!a(c).fold}])},[e(_e),e(v,{class:"scrollbar"},{default:n(()=>[e(d,{collapse:!!a(c).fold,"default-active":a(u).path,"background-color":"#001529","text-color":"white","active-text-color":"yellowgreen"},{default:n(()=>[e(ue,{menuList:a(s).menuRoutes},null,8,["menuList"])]),_:1},8,["collapse","default-active"])]),_:1})],2),_("div",{class:z(["layout_tabbar",{fold:!!a(c).fold}])},[e(Ve)],2),_("div",{class:z(["layout_main",{fold:!!a(c).fold}])},[e(me)],2)])}}});const Ee=w(Ne,[["__scopeId","data-v-7b8a4811"]]);export{Ee as default};
