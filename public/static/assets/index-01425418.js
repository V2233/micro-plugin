import{r as M,a as Q}from"./index-da8b4292.js";import{S as V}from"./single-f27e9ead.js";import{a as R,k as m,A as j,r as n,o as u,h as _,w as i,e as w,i as c,y as z,c as g,F as C,g as h,b as B,ah as y,_ as G}from"./index-1331dde3.js";const L={style:{width:"100%",display:"flex","justify-content":"space-between"}},P={key:0},$={key:1},H={style:{"margin-bottom":"10px",display:"flex"}},K=R({__name:"index",setup(W){const T=m([{title:"Bot",name:"bot"},{title:"群组",name:"group"},{title:"通知",name:"notice"},{title:"其它",name:"other"},{title:"截图工具",name:"puppeteer"},{title:"QQ",name:"qq"},{title:"Redis",name:"redis"},{title:"渲染器",name:"renderer"}]),o=m({title:"Bot",name:"bot"}),f=m(),p=m("default"),d=m(""),s=m([]);let N=1;const k=async l=>{o.value.name=l;let e=await M(l);if(e.code==200)if(l=="group"){s.value=[];for(let t in e.data)s.value.push({title:t,name:t,content:e.data[t]})}else f.value=e.data},S=()=>{if(!d.value){y.error("请输入群号！");return}if(s.value.find(t=>t.name==d.value)){y.error("该群已存在！");return}const l=`${++N}`;let e=s.value.find(t=>t.name=="default");s.value.push({title:d.value,name:d.value,content:JSON.parse(JSON.stringify(e==null?void 0:e.content))}),p.value=l},U=l=>{const e=s.value;if(l=="default"){y.error("默认配置不能删除！");return}let t=p.value;t===l&&e.forEach((r,v)=>{if(r.name===l){const b=e[v+1]||e[v-1];b&&(t=b.name)}}),p.value=t,s.value=e.filter(r=>r.name!==l)},q=async()=>{let l;o.value.name=="group"?l=s.value.reduce((t,r)=>(t[r.name]=r.content,t),{}):l=f.value,console.log(o.value.name),(await Q(o.value.name,l)).code==200&&y.success("保存成功！")};return j(()=>{k("bot")}),(l,e)=>{const t=n("el-button"),r=n("el-tooltip"),v=n("el-option"),b=n("el-select"),A=n("el-divider"),E=n("el-input"),F=n("Avatar"),O=n("el-icon"),D=n("el-tab-pane"),I=n("el-tabs"),J=n("el-card");return u(),_(J,null,{default:i(()=>[w("div",L,[c(r,{class:"box-item",effect:"dark",content:"注意只保存当前标签配置，切换标签会刷新配置",placement:"bottom"},{default:i(()=>[c(t,{type:"primary",onClick:q},{default:i(()=>[z("保存配置")]),_:1})]),_:1}),c(b,{modelValue:o.value.title,"onUpdate:modelValue":e[0]||(e[0]=a=>o.value.title=a),placeholder:"Select",style:{width:"100px"},onChange:k},{default:i(()=>[(u(!0),g(C,null,h(T.value,(a,x)=>(u(),_(v,{key:x,label:a.title,value:a.name},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),c(A),o.value.name!="group"?(u(),g("div",P,[c(V,{cfg:f.value,"onUpdate:cfg":e[1]||(e[1]=a=>f.value=a)},null,8,["cfg"])])):(u(),g("div",$,[w("div",H,[o.value.name=="group"?(u(),_(E,{key:0,modelValue:d.value,"onUpdate:modelValue":e[2]||(e[2]=a=>d.value=a),style:{width:"100%","margin-left":"5px"}},null,8,["modelValue"])):B("",!0),o.value.name=="group"?(u(),_(t,{key:1,onClick:S,icon:"Plus",style:{"margin-left":"5px"}},{default:i(()=>[c(O,null,{default:i(()=>[c(F)]),_:1})]),_:1})):B("",!0)]),c(I,{modelValue:p.value,"onUpdate:modelValue":e[3]||(e[3]=a=>p.value=a),type:"card",class:"demo-tabs",closable:"",onTabRemove:U},{default:i(()=>[(u(!0),g(C,null,h(s.value,a=>(u(),_(D,{lazy:!1,key:a.name,label:a.title,name:a.name},{default:i(()=>[c(V,{cfg:a.content,"onUpdate:cfg":x=>a.content=x},null,8,["cfg","onUpdate:cfg"])]),_:2},1032,["label","name"]))),128))]),_:1},8,["modelValue"])]))]),_:1})}}});const ee=G(K,[["__scopeId","data-v-98fe7de4"]]);export{ee as default};
