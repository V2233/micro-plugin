import{E as y,n as C}from"./codeEditor-644d51e2.js";import{a as V}from"./index-449a38a7.js";import{a as h,k as r,A as w,h as u,w as a,r as t,o as d,i as l,y as m,e as N,ad as B}from"./index-02828706.js";const F=h({__name:"index",setup(E){const o=r(""),n=r(""),s=r(""),i=async()=>{if(console.log(o.value),o.value==""){B.error("筛选条件为空！");return}let e=await C(s.value+"/plugins",o.value);e.code==200&&(console.log(e.data),n.value=e.data)},_=async()=>{let e=await V();e.code==200&&(s.value=e.data.replace(/^file:\/\/\//,""))};return w(()=>{_()}),(e,c)=>{const p=t("el-form-item"),f=t("el-form"),v=t("el-input"),x=t("el-button"),g=t("el-card");return d(),u(g,{style:{margin:"10px 0"}},{default:a(()=>[l(f,null,{default:a(()=>[l(p,null,{default:a(()=>[m("实验性...")]),_:1})]),_:1}),l(v,{modelValue:o.value,"onUpdate:modelValue":c[0]||(c[0]=k=>o.value=k)},null,8,["modelValue"]),l(x,{onClick:i,style:{"margin-top":"10px"}},{default:a(()=>[m(" 点击筛选包含特定关键词的文件分支 ")]),_:1}),n.value?(d(),u(y,{key:0,code:n.value,ext:"json"},null,8,["code"])):N("",!0)]),_:1})}}});export{F as default};
