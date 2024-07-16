import{r as R,a as Y}from"./index-3839df73.js";import{a as E,k as y,l as j,r as u,o as a,h as p,w as m,c as V,g as h,b as T,t as z,e as g,i as v,F as N,y as F,_ as O,A as G,ad as $}from"./index-6b89b52f.js";const L={class:"sub-title"},H={key:3},K=E({__name:"single",props:["cfg"],emits:["update:cfg"],setup(S,{emit:B}){const _=S,i=B,t=y();j(()=>_.cfg,r=>{t.value=r},{immediate:!0,deep:!0});const b=(r,s)=>{r&&Array.isArray(r)?t.value[s].value.push(t.value[s].cur):t.value[s].value=[t.value[s].cur]};return(r,s)=>{const x=u("el-input"),C=u("el-input-number"),U=u("el-switch"),A=u("el-button"),c=u("el-tag"),l=u("el-form-item"),o=u("el-form");return a(),p(o,null,{default:m(()=>[(a(!0),V(N,null,h(t.value,(e,f,k)=>(a(),p(l,{key:f,lable:e.desc},{default:m(()=>[T("div",L,z(e.desc),1),e.type=="string"?(a(),p(x,{key:0,modelValue:e.value,"onUpdate:modelValue":n=>e.value=n,onInput:s[0]||(s[0]=n=>i("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):g("",!0),e.type=="number"?(a(),p(C,{key:1,modelValue:e.value,"onUpdate:modelValue":n=>e.value=n,onInput:s[1]||(s[1]=n=>i("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):g("",!0),e.type=="boolean"?(a(),p(U,{key:2,modelValue:e.value,"onUpdate:modelValue":n=>e.value=n,class:"ml-2","inline-prompt":"",style:{"--el-switch-on-color":"#13ce66"},"active-text":"Y","inactive-text":"N",onChange:s[2]||(s[2]=n=>i("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):g("",!0),e.type=="array"?(a(),V("div",H,[e.subType=="string"?(a(),p(x,{key:0,modelValue:e.cur,"onUpdate:modelValue":n=>e.cur=n,size:"small",onInput:s[3]||(s[3]=n=>i("update:cfg",t.value))},null,8,["modelValue","onUpdate:modelValue"])):g("",!0),e.subType=="number"?(a(),p(C,{key:1,modelValue:e.cur,"onUpdate:modelValue":n=>e.cur=n,onInput:s[4]||(s[4]=n=>i("update:cfg",t.value)),size:"small"},null,8,["modelValue","onUpdate:modelValue"])):g("",!0),e.subType=="boolean"?(a(),p(U,{key:2,value:e.cur,class:"ml-2","inline-prompt":"",style:{"--el-switch-on-color":"#13ce66"},"active-text":"Y","inactive-text":"N",onChange:n=>(t.value[f].cur=n,i("update:cfg",t.value))},null,8,["value","onChange"])):g("",!0),v(A,{size:"small",icon:"Plus",onClick:n=>(b(e.value,f),i("update:cfg",t.value)),style:{"margin-left":"5px"}},null,8,["onClick"]),T("span",null,[(a(!0),V(N,null,h(e.value,(n,w)=>(a(),p(c,{key:w,class:"mx-1",closable:"",onClose:q=>(t.value[f].value.splice(w,1),i("update:cfg",t.value)),style:{"margin-left":"5px"}},{default:m(()=>[F(z(n),1)]),_:2},1032,["onClose"]))),128))])])):g("",!0)]),_:2},1032,["lable"]))),128))]),_:1})}}});const D=O(K,[["__scopeId","data-v-3152656e"]]),W={style:{width:"100%",display:"flex","justify-content":"space-between"}},X={key:0},Z={key:1},ee={style:{"margin-bottom":"10px",display:"flex"}},le=E({__name:"index",setup(S){const B=y([{title:"Bot",name:"bot"},{title:"群组",name:"group"},{title:"通知",name:"notice"},{title:"其它",name:"other"},{title:"截图工具",name:"puppeteer"},{title:"QQ",name:"qq"},{title:"Redis",name:"redis"},{title:"渲染器",name:"renderer"}]),_=y({title:"Bot",name:"bot"}),i=y(),t=y("default"),b=y(""),r=y([]);let s=1;const x=async c=>{_.value.name=c;let l=await R(c);if(l.code==200)if(c=="group"){r.value=[];for(let o in l.data)r.value.push({title:o,name:o,content:l.data[o]})}else i.value=l.data},C=()=>{if(!b.value){$.error("请输入群号！");return}if(r.value.find(o=>o.name==b.value)){$.error("该群已存在！");return}const c=`${++s}`;let l=r.value.find(o=>o.name=="default");r.value.push({title:b.value,name:b.value,content:JSON.parse(JSON.stringify(l==null?void 0:l.content))}),t.value=c},U=c=>{const l=r.value;if(c=="default"){$.error("默认配置不能删除！");return}let o=t.value;o===c&&l.forEach((e,f)=>{if(e.name===c){const k=l[f+1]||l[f-1];k&&(o=k.name)}}),t.value=o,r.value=l.filter(e=>e.name!==c)},A=async()=>{let c;_.value.name=="group"?c=r.value.reduce((o,e)=>(o[e.name]=e.content,o),{}):c=i.value,console.log(_.value.name),(await Y(_.value.name,c)).code==200&&$.success("保存成功！")};return G(()=>{x("bot")}),(c,l)=>{const o=u("el-button"),e=u("el-tooltip"),f=u("el-option"),k=u("el-select"),n=u("el-divider"),w=u("el-input"),q=u("Avatar"),J=u("el-icon"),M=u("el-tab-pane"),P=u("el-tabs"),Q=u("el-card");return a(),p(Q,null,{default:m(()=>[T("div",W,[v(e,{class:"box-item",effect:"dark",content:"注意只保存当前标签配置，切换标签会刷新配置",placement:"bottom"},{default:m(()=>[v(o,{type:"primary",onClick:A},{default:m(()=>[F("保存配置")]),_:1})]),_:1}),v(k,{modelValue:_.value.title,"onUpdate:modelValue":l[0]||(l[0]=d=>_.value.title=d),placeholder:"Select",style:{width:"100px"},onChange:x},{default:m(()=>[(a(!0),V(N,null,h(B.value,(d,I)=>(a(),p(f,{key:I,label:d.title,value:d.name},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),v(n),_.value.name!="group"?(a(),V("div",X,[v(D,{cfg:i.value,"onUpdate:cfg":l[1]||(l[1]=d=>i.value=d)},null,8,["cfg"])])):(a(),V("div",Z,[T("div",ee,[_.value.name=="group"?(a(),p(w,{key:0,modelValue:b.value,"onUpdate:modelValue":l[2]||(l[2]=d=>b.value=d),style:{width:"100%","margin-left":"5px"}},null,8,["modelValue"])):g("",!0),_.value.name=="group"?(a(),p(o,{key:1,onClick:C,icon:"Plus",style:{"margin-left":"5px"}},{default:m(()=>[v(J,null,{default:m(()=>[v(q)]),_:1})]),_:1})):g("",!0)]),v(P,{modelValue:t.value,"onUpdate:modelValue":l[3]||(l[3]=d=>t.value=d),type:"card",class:"demo-tabs",closable:"",onTabRemove:U},{default:m(()=>[(a(!0),V(N,null,h(r.value,d=>(a(),p(M,{lazy:!1,key:d.name,label:d.title,name:d.name},{default:m(()=>[v(D,{cfg:d.content,"onUpdate:cfg":I=>d.content=I},null,8,["cfg","onUpdate:cfg"])]),_:2},1032,["label","name"]))),128))]),_:1},8,["modelValue"])]))]),_:1})}}});const ae=O(le,[["__scopeId","data-v-98fe7de4"]]);export{ae as default};
