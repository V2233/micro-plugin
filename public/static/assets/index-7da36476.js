import{a as Y,k as c,A as Z,r as i,o as l,h as t,w as n,e as a,b as o,y as _,c as p,F as f,g as x,p as T,t as v,i as h,v as j,ah as ee,B as le,C as oe,_ as te}from"./index-9f9cad39.js";import{E as ae}from"./codeEditor-048e8d08.js";import{b as se,c as ne,d as ue}from"./index-9fd0a521.js";import{a as de}from"./index-4d2ac035.js";const w=b=>(le("data-v-26cdb13e"),b=b(),oe(),b),ie={class:"top-bar"},re={key:0,class:"guoba"},ce={class:"plugins-info"},pe={class:"card-header"},_e={class:"sub-title"},me={class:"content"},ve={class:"description"},he=w(()=>a("span",{class:"lable"},"描述：",-1)),ye={class:"text"},be={class:"author"},ke=w(()=>a("span",{class:"lable"},"作者：",-1)),Ve=["href"],fe={class:"link"},xe=w(()=>a("span",{class:"lable"},"仓库：",-1)),we=["href"],ge={class:"version",style:{width:"100%",display:"flex"}},Ce=w(()=>a("span",{class:"lable"},"版本：",-1)),Pe={class:"plugin-config"},Ue={style:{display:"block",width:"100%"}},Ie={key:1,class:"config-title"},Se={key:0,class:"required"},Be={key:2,class:"config-com"},Ne={key:3,class:"bottom-desc"},qe={key:1,class:"auto-search"},ze=Y({__name:"index",setup(b){const I=c([]),g=c([]),S=c(""),k=c("guoba"),R=c([{lable:"guobaSupport",value:"guoba"},{lable:"自动匹配",value:"auto"}]);c("33%");const m=c(0),W=async(r="guoba")=>{const s=await se(r);console.log(s),s.code==200&&(I.value=s.data)},G=async(r,s="guoba")=>{S.value=r;const d=await ne(r,s);console.log(d),d.code==200&&(g.value=d.data),m.value=1},J=async(r,s="guoba")=>{const d=await ue(r,s,g.value);d.code==200&&ee.success(d.message)},B=c(""),C=c("");c("");const K=async()=>{let r=await de();r.code==200&&(C.value=r.data.replace(/^file:\/\//,""))};return Z(()=>{W()}),(r,s)=>{const d=i("el-button"),N=i("el-option"),q=i("el-select"),z=i("el-divider"),P=i("el-tag"),D=i("el-card"),V=i("el-input"),O=i("el-input-number"),Q=i("el-switch"),E=i("el-form-item"),M=i("el-form");return l(),t(D,{style:{margin:"10px 0"}},{default:n(()=>[a("div",ie,[m.value==1?(l(),t(d,{key:0,class:"button",icon:"Back",onClick:s[0]||(s[0]=e=>m.value=0)})):o("",!0),m.value==1?(l(),t(d,{key:1,class:"button",type:"primary",onClick:s[1]||(s[1]=e=>J(S.value,"guoba")),style:{"margin-left":"auto"}},{default:n(()=>[_("保存")]),_:1})):o("",!0),m.value==0?(l(),t(q,{key:2,modelValue:k.value,"onUpdate:modelValue":s[2]||(s[2]=e=>k.value=e),placeholder:"配置来源",style:{width:"150px","margin-left":"auto"}},{default:n(()=>[(l(!0),p(f,null,x(R.value,(e,y)=>(l(),t(N,{key:y,label:e.lable,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])):o("",!0)]),k.value=="guoba"?(l(),p("div",re,[T(a("div",ce,[(l(!0),p(f,null,x(I.value,(e,y)=>(l(),t(D,{class:"info-card",shadow:"hover",key:y},{default:n(()=>[a("div",pe,[a("div",_e,v(e.title??e.name),1),h(d,{class:"button",size:"small",type:"primary",onClick:U=>G(e.pluginName,"guoba")},{default:n(()=>[_("配置")]),_:2},1032,["onClick"])]),h(z),a("div",me,[a("div",ve,[he,a("span",ye,v(e.description),1)]),a("div",be,[ke,a("a",{href:e.authorLink,target:"_blank"},v(e.author),9,Ve)]),a("div",fe,[xe,a("a",{href:e.link},v(e.link),9,we)]),a("div",ge,[Ce,e.isV2?(l(),t(P,{key:0,size:"small"},{default:n(()=>[_("v2")]),_:1})):o("",!0),e.isV3?(l(),t(P,{key:1,size:"small"},{default:n(()=>[_("v3")]),_:1})):o("",!0),e.isV4?(l(),t(P,{key:2,size:"small"},{default:n(()=>[_("v4")]),_:1})):o("",!0)])])]),_:2},1024))),128))],512),[[j,m.value==0]]),T(a("div",Pe,[h(M,null,{default:n(()=>[(l(!0),p(f,null,x(g.value,(e,y)=>(l(),t(E,{key:y},{default:n(()=>{var U,$,A,F,H,L;return[a("div",Ue,[e.component=="Divider"?(l(),t(z,{key:0},{default:n(()=>[_(v(e.label),1)]),_:2},1024)):o("",!0),e.component!=="Divider"?(l(),p("div",Ie,[_(v(e.label),1),e.required?(l(),p("span",Se,"*")):o("",!0)])):o("",!0),"value"in e?(l(),p("div",Be,[e.component=="Select"?(l(),t(q,{key:0,modelValue:e.value,"onUpdate:modelValue":u=>e.value=u,style:{width:"100%"}},{default:n(()=>[(l(!0),p(f,null,x(e.componentProps.options,(u,X)=>(l(),t(N,{key:X,label:u.lable,value:u.value},null,8,["label","value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])):o("",!0),e.component=="Input"?(l(),t(V,{key:1,modelValue:e.value,"onUpdate:modelValue":u=>e.value=u,"place-holder":((U=e.componentProps)==null?void 0:U.placeholder)??""},null,8,["modelValue","onUpdate:modelValue","place-holder"])):o("",!0),e.component=="InputTextArea"?(l(),t(V,{key:2,modelValue:e.value,"onUpdate:modelValue":u=>e.value=u,"place-holder":(($=e.componentProps)==null?void 0:$.placeholder)??"",type:"textarea"},null,8,["modelValue","onUpdate:modelValue","place-holder"])):o("",!0),e.component=="InputPassword"?(l(),t(V,{key:3,modelValue:e.value,"onUpdate:modelValue":u=>e.value=u,"place-holder":((A=e.componentProps)==null?void 0:A.placeholder)??"",type:"password"},null,8,["modelValue","onUpdate:modelValue","place-holder"])):o("",!0),e.component=="InputNumber"?(l(),t(O,{key:4,modelValue:e.value,"onUpdate:modelValue":u=>e.value=u,min:((F=e.componentProps)==null?void 0:F.min)??-2147483648,max:((H=e.componentProps)==null?void 0:H.max)??2147483647,"place-holder":((L=e.componentProps)==null?void 0:L.placeholder)??"",size:"small"},null,8,["modelValue","onUpdate:modelValue","min","max","place-holder"])):o("",!0),e.component=="Switch"?(l(),t(Q,{key:5,modelValue:e.value,"onUpdate:modelValue":u=>e.value=u},null,8,["modelValue","onUpdate:modelValue"])):o("",!0)])):o("",!0),e.bottomHelpMessage?(l(),p("div",Ne,v(e.bottomHelpMessage),1)):o("",!0)])]}),_:2},1024))),128))]),_:1})],512),[[j,m.value==1]])])):o("",!0),k.value=="auto"?(l(),p("div",qe,[h(M,null,{default:n(()=>[h(E,null,{default:n(()=>[_("实验性，请跳过该模块...")]),_:1})]),_:1}),h(V,{modelValue:B.value,"onUpdate:modelValue":s[3]||(s[3]=e=>B.value=e)},null,8,["modelValue"]),h(d,{onClick:K,style:{"margin-top":"10px"}},{default:n(()=>[_(" 点击筛选包含特定关键词的文件分支 ")]),_:1}),C.value?(l(),t(ae,{key:0,code:C.value,ext:"json"},null,8,["code"])):o("",!0)])):o("",!0)]),_:1})}}});const Ae=te(ze,[["__scopeId","data-v-26cdb13e"]]);export{Ae as default};
