import{a as I,k as A,l as B,r as s,o as n,h as o,w as d,c as v,F as f,g as V,e as y,t as b,b as r,i as T,y as z,_ as F}from"./index-d15366db.js";const S={class:"sub-title"},D={key:3},Y=I({__name:"single",props:["cfg"],emits:["update:cfg"],setup(x,{emit:C}){const U=x,u=C,t=A();B(()=>U.cfg,p=>{t.value=p},{immediate:!0,deep:!0});const k=(p,a)=>{p&&Array.isArray(p)?t.value[a].value.push(t.value[a].cur):t.value[a].value=[t.value[a].cur]};return(p,a)=>{const m=s("el-input"),_=s("el-input-number"),i=s("el-switch"),$=s("el-button"),w=s("el-tag"),N=s("el-form-item"),h=s("el-form");return n(),o(h,null,{default:d(()=>[(n(!0),v(f,null,V(t.value,(e,c,E)=>(n(),o(N,{key:c,lable:e.desc},{default:d(()=>[y("div",S,b(e.desc),1),e.type=="string"?(n(),o(m,{key:0,modelValue:e.value,"onUpdate:modelValue":l=>e.value=l,onInput:a[0]||(a[0]=l=>u("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):r("",!0),e.type=="number"?(n(),o(_,{key:1,modelValue:e.value,"onUpdate:modelValue":l=>e.value=l,onInput:a[1]||(a[1]=l=>u("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):r("",!0),e.type=="boolean"?(n(),o(i,{key:2,modelValue:e.value,"onUpdate:modelValue":l=>e.value=l,class:"ml-2","inline-prompt":"",style:{"--el-switch-on-color":"#13ce66"},"active-text":"Y","inactive-text":"N",onChange:a[2]||(a[2]=l=>u("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):r("",!0),e.type=="array"?(n(),v("div",D,[e.subType=="string"?(n(),o(m,{key:0,modelValue:e.cur,"onUpdate:modelValue":l=>e.cur=l,size:"small",onInput:a[3]||(a[3]=l=>u("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):r("",!0),e.subType=="number"?(n(),o(_,{key:1,modelValue:e.cur,"onUpdate:modelValue":l=>e.cur=l,onInput:a[4]||(a[4]=l=>u("update:cfg",t.value)),size:"small"},null,8,["modelValue","onUpdate:modelValue"])):r("",!0),e.subType=="boolean"?(n(),o(i,{key:2,value:e.cur,class:"ml-2","inline-prompt":"",style:{"--el-switch-on-color":"#13ce66"},"active-text":"Y","inactive-text":"N",onChange:l=>(t.value[c].cur=l,u("update:cfg",t.value))},null,8,["value","onChange"])):r("",!0),T($,{size:"small",icon:"Plus",onClick:l=>(k(e.value,c),u("update:cfg",t.value)),style:{"margin-left":"5px"}},null,8,["onClick"]),y("span",null,[(n(!0),v(f,null,V(e.value,(l,g)=>(n(),o(w,{key:g,class:"mx-1",closable:"",onClose:L=>(t.value[c].value.splice(g,1),u("update:cfg",t.value)),style:{"margin-left":"5px"}},{default:d(()=>[z(b(l),1)]),_:2},1032,["onClose"]))),128))])])):r("",!0)]),_:2},1032,["lable"]))),128))]),_:1})}}});const j=F(Y,[["__scopeId","data-v-3152656e"]]);export{j as S};