import{a as I,q as S,ab as c,k as f,c as U,i as a,w as r,u as t,r as d,f as k,m as B,o as E,aH as N,aI as F,ae as H,y as $,aJ as g,B as q,C as K,b as w,_ as P}from"./index-a06f622c.js";import{g as R}from"./time-e3645d07.js";const h=l=>(q("data-v-fcbe03e7"),l=l(),K(),l),T={class:"login_container"},z=h(()=>w("h1",null,"Hello",-1)),J=h(()=>w("h2",null,"Wecome to the development management platform!",-1)),L=I({__name:"index",setup(l){let v=S(),y=k(),x=B(),s=c({username:"admin",password:"111111"}),n=f(!1),m=f();const V=c({username:[{trigger:"change",validator:(i,e,o)=>{e.length>=5&&e.length<=10?o():o(new Error("账号长度5-10位"))}}],password:[{trigger:"change",validator:(i,e,o)=>{e.length>=5&&e.length<=10?o():o(new Error("密码长度5-10位"))}}]}),_=async()=>{await m.value.validate(),n.value=!0;try{await v.userLogin(s),y.push({path:x.query.redirect||"/"}),g({type:"success",message:"欢迎回来",title:`Hi,${R()}好`}),n.value=!1}catch(i){n.value=!1,g({type:"error",message:i.message})}};return(i,e)=>{const o=d("el-input"),u=d("el-form-item"),b=d("el-button"),C=d("el-form");return E(),U("div",T,[a(C,{class:"login_form",model:t(s),rules:V,ref_key:"loginForms",ref:m},{default:r(()=>[z,J,a(u,{prop:"username"},{default:r(()=>[a(o,{"prefix-icon":t(N),modelValue:t(s).username,"onUpdate:modelValue":e[0]||(e[0]=p=>t(s).username=p)},null,8,["prefix-icon","modelValue"])]),_:1}),a(u,{prop:"password"},{default:r(()=>[a(o,{"prefix-icon":t(F),"show-password":"",type:"password",modelValue:t(s).password,"onUpdate:modelValue":e[1]||(e[1]=p=>t(s).password=p),onKeydown:H(_,["enter"])},null,8,["prefix-icon","modelValue"])]),_:1}),a(u,null,{default:r(()=>[a(b,{loading:t(n),class:"login_btn",type:"primary",size:"default",onClick:_},{default:r(()=>[$(" login ")]),_:1},8,["loading"])]),_:1})]),_:1},8,["model","rules"])])}}});const G=P(L,[["__scopeId","data-v-fcbe03e7"]]);export{G as default};
