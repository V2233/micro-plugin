import{b as g,c as y}from"./index-56582fe2.js";import{S as i}from"./single-d6061217.js";import{a as x,k as C,A as b,r as l,o as c,h as k,w as n,e as w,i as t,y as d,c as _,b as u,ah as h,_ as B}from"./index-629e8f85.js";const N={style:{width:"100%",display:"flex"}},S={key:0},V={key:1},q=x({__name:"index",setup(E){const e=C({}),f=async()=>{let o=await g();o.code==200&&(e.value=o.data)},p=async()=>{(await y(e.value)).code==200&&h.success("保存成功！")};return b(()=>{f()}),(o,a)=>{const v=l("el-button"),r=l("el-divider"),m=l("el-card");return c(),k(m,null,{default:n(()=>[w("div",N,[t(v,{type:"primary",style:{"margin-left":"auto"},onClick:p},{default:n(()=>[d("保存配置")]),_:1})]),t(r,null,{default:n(()=>[d("Stdin")]),_:1}),e.value.stdin?(c(),_("div",S,[t(i,{cfg:e.value.stdin,"onUpdate:cfg":a[0]||(a[0]=s=>e.value.stdin=s)},null,8,["cfg"])])):u("",!0),t(r,null,{default:n(()=>[d("onebotv11")]),_:1}),e.value.onebotv11?(c(),_("div",V,[t(i,{cfg:e.value.onebotv11,"onUpdate:cfg":a[1]||(a[1]=s=>e.value.onebotv11=s)},null,8,["cfg"])])):u("",!0)]),_:1})}}});const A=B(q,[["__scopeId","data-v-239f6cc4"]]);export{A as default};
