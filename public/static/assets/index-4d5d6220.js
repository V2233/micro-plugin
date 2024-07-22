import{a7 as h,a as He,k as r,a8 as se,a5 as Ke,A as Je,c as k,p as T,v as oe,u,i as o,w as n,a9 as Ge,r as y,aa as We,o as d,b as f,x as B,h as M,y as x,e as R,z as Ze,t as E,ab as Qe,ac as N,F as Xe,g as Ye,ad as V,n as re,_ as et}from"./index-3c62a863.js";import{E as tt}from"./codeEditor-54f404ea.js";const lt=i=>h.get("/fs/listdir/?path="+i),at=(i,c)=>h.get("/fs/filesize?path="+i+"&type="+c),nt=i=>h.get("/fs/mkdir/?path="+i),it=i=>h.get("/fs/open/?path="+i),I=i=>h.get("/fs/media?path="+i,{responseType:"blob"}),st=i=>h.delete("/fs/rmfile/?path="+i),ot=i=>h.delete("/fs/rmdir/?path="+i),ue=(i,c)=>h.post("/fs/savefile/?path="+i,{content:c}),rt=(i,c)=>h.get("/fs/movefile/?path="+i+"&newPath="+c),ut=(i,c)=>h.get("/fs/copyfile/?path="+i+"&newPath="+c),dt=(i,c)=>h.get("/fs/copydir/?path="+i+"&newPath="+c),ct=(i,c)=>h.get("/fs/renamefile/?path="+i+"&newPath="+c),pt=(i,c)=>h.get("/fs/search/?path="+i+"&keyWord="+c),mt=i=>h.get("/fs/download?path="+i,{responseType:"blob"}),vt={class:"search_bar"},ft={style:{width:"100%","margin-right":"10px"}},ht={class:"search_file"},_t={class:"handle_tabbar",style:{"margin-top":"10px"}},gt=["onContextmenu"],yt=["onClick"],kt=["onContextmenu"],xt={key:0},bt=["onClick"],Ct=["onContextmenu"],Ft={key:0,class:"file_upload_box"},Mt={key:1},Rt={key:2,style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}},Dt=["src"],Ut={key:3,style:{width:"100","max-height":"100%"}},zt=["src"],Vt=["src"],St=He({__name:"index",setup(i){const c=r(!1),H=r(""),K=r(""),J=r(""),L=r(""),de=r(!1),F=r(!1),b=r(""),G=r(),ce=r(),pe=r();let W=se({path:""}),j=se({name:"",mtime:"",type:"",size:"",path:"",isBlur:!1,isRightClicked:!1}),me=r([{name:"删除"},{name:"上传"},{name:"移动"},{name:"下载"},{name:"复制"},{name:"命名"}]),s=r("0"),_=r([]),D=r(!1),S=r("name"),U=r(!1),$=r(""),P=r(""),z=r(!1),m=r([]),w=r({}),Z=r(""),ve=r(""),O=r([]);const C=async(e="0")=>{c.value=!0;let t=await lt(e);t.code==200&&(_.value=t.data.children,s.value=t.data.path,c.value=!1)},fe=async e=>{let t=await at(e.path,e.type);t.code==200&&(e.size=t.data)},he=Ke(()=>{let e=[];if(S.value=="name"){let t=[],a=[];_.value.forEach(v=>{v.type=="file"?a.push(v):t.push(v)}),e=[...t,...a]}else S.value=="time"?e=_.value.slice().sort((t,a)=>{const v=new Date(t.mtime).getTime(),g=new Date(a.mtime).getTime();return v-g}):e=_.value;return U.value?e.reverse():e}),Q=e=>{e=="name"?S.value=="name"?U.value=!U.value:(S.value="name",U.value=!1):e=="time"&&(S.value=="time"?U.value=!U.value:(S.value="time",U.value=!1))},_e=()=>{let e=s.value.lastIndexOf("/");e==-1&&(e=s.value.lastIndexOf("\\")),s.value=s.value.slice(0,e),C(s.value)},ge=()=>{C(s.value)},ye=async()=>{let e=await pt(s.value,$.value);$.value="",e.code==200&&(_.value=e.data)},ke=e=>{const t=e.lastIndexOf(".");return t===-1?"js":e.substring(t+1)},xe=async e=>{if(e.type=="file"){if(Object.assign(j,e),/\.(png|jpg|jpeg|gif|bmp|tiff|webp|svg)$/.test(e.name)){let a=await I(e.path);K.value=URL.createObjectURL(a),b.value="viewImage",F.value=!0;return}if(/\.(mp3|wav|aac|m4a|ogg|flac|wma|ape|alac|amr|awb|aiff|caf|mka|opus|ra|rm|spx|tta|voc|wavpack|xm|mod|s3m|it|xmf|mid|midi|kar|rmi)$/.test(e.name)){let a=await I(e.path);J.value=URL.createObjectURL(a),b.value="viewAudio",F.value=!0;return}if(/\.(mp4|avi|mov|wmv|mpeg|flv|mkv|vob|3gp|webm|m4v)$/.test(e.name)){let a=await I(e.path);L.value=URL.createObjectURL(a),b.value="viewVideo",F.value=!0;return}let t=await it(e.path);t.code==200&&(z.value=!0,P.value=t.data,H.value=ke(e.name));return}C(e.path)},be=async e=>{(await ue(j.path,e.toString())).code==200&&(V.success("保存成功！"),z.value=!1,P.value="")},Ce=e=>{e=="文件"?_.value.unshift({name:"",mtime:"",type:"file",size:"",path:s.value,isBlur:!0}):e=="目录"&&_.value.unshift({name:"",mtime:"",type:"directory",size:"",path:s.value,isBlur:!0});let t=_.value.find(a=>a.isBlur==!0);re(()=>{w.value[t.name.replace(/\./g,"")+t.type].focus()})},Fe=(e,t)=>{const a=new Set;for(let v=0;v<e.length;v++){const g=e[v][t];if(a.has(g))return!0;a.add(g)}return!1},X=async(e,t="blur",a="create")=>{if(e.isBlur=!1,t=="enter")return;if(e.name||(e.name="新建标题"),Fe(_.value,"name")){V.error("该标题已存在！！"),C(s.value);return}let g;e.handlerMode=="命名"&&(a="rename"),a=="create"?e.type=="file"?g=await ue(s.value+"/"+e.name,""):g=await nt(s.value+"/"+e.name):a=="rename"&&(g=await ct(s.value+"/"+Z.value,s.value+"/"+e.name),e.handlerMode==""),g.code==200&&C(s.value)},Me=async e=>{let t;e.type=="file"?t=await st(e.path):t=await ot(e.path),t.code==200&&(console.log(t),C(s.value))},Y=async e=>{m.value.push(e)},Re=async()=>{for(let e=0;e<m.value.length;e++){let t=m.value[e],a;t.handlerMode=="移动"?a=await rt(t.path,s.value+"/"+t.name):t.handlerMode=="复制"?t.type=="file"?a=await ut(t.path,s.value+"/"+t.name):a=await dt(t.path,s.value+"/"+t.name):V.error("请选择右侧操作"),a.code==200&&V.success("粘贴成功！")}m.value=[],C(s.value)},De=e=>{Z.value=e.name,e.isBlur=!0,re(()=>{w.value[e.name.replace(/\./g,"")+e.type].focus()})},A=e=>{for(let t=0;t<_.value.length;t++)_.value[t].isRightClicked=!1;e.isRightClicked=!0},Ue=()=>{for(let e=0;e<_.value.length;e++)_.value[e].isRightClicked=!1},ee=()=>{W.path=s.value,b.value="upload",F.value=!0},te=(e,t)=>{switch(e.isRightClicked=!1,t.name){case"删除":Me(e);break;case"移动":e.handlerMode="移动",Y(e);break;case"复制":e.handlerMode="复制",Y(e);break;case"命名":e.handlerMode="命名",De(e);break;case"上传":e.handlerMode="上传",ee();break;case"下载":e.handlerMode="下载",Be(e);break;default:V.error("右键相关操作出错了")}},ze=e=>{m.value.some(a=>!!a.handlerMode)||(m.value=JSON.parse(JSON.stringify(e)))},le=e=>{for(let t=0;t<m.value.length;t++)m.value[t].handlerMode=e},Ve=e=>{ve.value=e.url,F.value=!0},Se=e=>{console.log(e),C(s.value)},$e=()=>{G.value.submit(),F.value=!1},Be=async e=>{if(console.log(e),e.type=="file"){let t=await mt(e.path);V.success("开始下载...");const a=document.createElement("a");a.href=URL.createObjectURL(t),a.download=e.name,document.body.appendChild(a),a.click(),document.body.removeChild(a)}else V.warning("请下载文件或压缩包")},Ee=()=>{de.value=!1},Oe=e=>{};return Je(()=>{C("0")}),(e,t)=>{const a=y("el-button"),v=y("el-input"),g=y("el-popover"),ae=y("el-option"),qe=y("el-select"),q=y("el-table-column"),Le=y("el-popconfirm"),je=y("el-table"),ne=y("el-card"),Pe=y("el-upload"),we=y("el-image"),Ae=y("el-dialog"),Te=We("loading");return d(),k("div",null,[T(o(ne,{class:"box-card"},{default:n(()=>[f("div",vt,[f("div",ft,[o(v,{modelValue:u(s),"onUpdate:modelValue":t[0]||(t[0]=l=>B(s)?s.value=l:s=l),style:{"max-width":"600px",width:"100%","min-width":"200px"},class:"input-with-select"},{prepend:n(()=>[o(a,{icon:"Back",onClick:_e})]),append:n(()=>[o(a,{icon:"DArrowRight",onClick:ge})]),_:1},8,["modelValue"])]),f("div",ht,[o(g,{placement:"bottom",title:"搜索",width:300,trigger:"hover"},{reference:n(()=>[o(a,{icon:"Search",circle:""})]),default:n(()=>[o(v,{modelValue:u($),"onUpdate:modelValue":t[1]||(t[1]=l=>B($)?$.value=l:$=l),placeholder:"输入搜索文件或目录"},{append:n(()=>[o(a,{icon:"Search",onClick:ye})]),_:1},8,["modelValue"])]),_:1})])]),f("div",_t,[o(a,{size:"small",style:{"margin-right":"5px"},icon:u(D)?"ArrowLeftBold":"ArrowRightBold",onClick:t[2]||(t[2]=l=>B(D)?D.value=!u(D):D=!u(D))},null,8,["icon"]),o(qe,{size:"small",placeholder:"新建",style:{width:"60px"},onChange:Ce},{default:n(()=>[o(ae,{label:"目录",value:"目录"}),o(ae,{label:"文件",value:"文件"})]),_:1}),u(m).length>0&&u(m).every(l=>l.handlerMode)?(d(),M(a,{key:0,type:"primary",onClick:t[3]||(t[3]=l=>Re()),size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 粘贴 ")]),_:1})):R("",!0),o(a,{onClick:ee,size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 上传 ")]),_:1}),u(m).length>0?(d(),M(a,{key:1,disabled:u(m).every(l=>l.handlerMode=="复制"),type:"primary",onClick:t[4]||(t[4]=l=>le("复制")),size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 复制 ")]),_:1},8,["disabled"])):R("",!0),u(m).length>0?(d(),M(a,{key:2,disabled:u(m).every(l=>l.handlerMode=="移动"),type:"primary",onClick:t[5]||(t[5]=l=>le("移动")),size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 移动 ")]),_:1},8,["disabled"])):R("",!0)]),T((d(),M(je,{style:{margin:"10px 0"},data:he.value,"max-height":"450",onSelectionChange:ze,onClick:Ue},{default:n(()=>[u(D)?(d(),M(q,{key:0,type:"selection",align:"center"})):R("",!0),o(q,{label:"文件名称"},{header:n(()=>[f("div",{class:"title-active",onClick:t[6]||(t[6]=l=>Q("name"))}," 文件名称 ")]),default:n(({row:l,$index:ie})=>[o(g,{placement:"bottom",title:l.type=="file"?"文件操作":"文件夹操作",width:150,trigger:"contextmenu",visible:l.isRightClicked},{reference:n(()=>[f("div",{onContextmenu:N(p=>A(l),["prevent"])},[f("i",{class:Ze(`iconfont icon-file 
                                            icon-${l.type=="file"?l.name.split(".").at(-1):"yellowFolder"}
                                        `),style:{"font-size":"20px"}},null,2),x("   "),l.isBlur?(d(),M(v,{key:1,ref:p=>{u(w)[l.name.replace(/\./g,"")+l.type]=p},onBlur:p=>X(l,"blur"),onKeyup:Qe(p=>X(l,"enter"),["enter"]),modelValue:l.name,"onUpdate:modelValue":p=>l.name=p},null,8,["onBlur","onKeyup","modelValue","onUpdate:modelValue"])):(d(),k("a",{key:0,onClick:p=>xe(l)},E(l.name),9,yt))],40,gt)]),default:n(()=>[(d(!0),k(Xe,null,Ye(u(me),(p,Ne)=>(d(),k("span",{class:"pop_menu",key:Ne},[p.name=="删除"?(d(),M(Le,{key:0,title:`您即将删除路径【${l.path}】,是否继续？`,onConfirm:Ie=>te(l,p)},{reference:n(()=>[o(a,null,{default:n(()=>[x(E(p.name),1)]),_:2},1024)]),_:2},1032,["title","onConfirm"])):(d(),M(a,{key:1,onClick:Ie=>te(l,p)},{default:n(()=>[x(E(p.name),1)]),_:2},1032,["onClick"]))]))),128))]),_:2},1032,["title","visible"])]),_:1}),o(q,{label:"大小",width:"80px"},{default:n(({row:l,$index:ie})=>[f("div",{onContextmenu:N(p=>A(l),["prevent"]),style:{"font-size":"12px"}},[l.size?(d(),k("span",xt,E(l.size),1)):(d(),k("a",{key:1,onClick:p=>fe(l)},"计算",8,bt))],40,kt)]),_:1}),o(q,{label:"修改时间"},{header:n(()=>[f("div",{class:"title-active",onClick:t[7]||(t[7]=l=>Q("time"))}," 修改时间 ")]),default:n(({row:l,$index:ie})=>[f("div",{onContextmenu:N(p=>A(l),["prevent"]),style:{"font-size":"12px"}},E(l.mtime.replace(/T/," ").replace(/\.\d{3}Z/,"")),41,Ct)]),_:1})]),_:1},8,["data"])),[[Te,c.value]])]),_:1},512),[[oe,!u(z)]]),T(o(ne,null,{default:n(()=>[o(a,{style:{"margin-bottom":"5px"},onClick:t[8]||(t[8]=l=>B(z)?z.value=!1:z=!1)},{default:n(()=>[x(" 返回 ")]),_:1}),o(tt,{code:u(P),ext:H.value,onGetCode:be},null,8,["code","ext"])]),_:1},512),[[oe,u(z)]]),o(Ae,{modelValue:F.value,"onUpdate:modelValue":t[10]||(t[10]=l=>F.value=l),title:u(j).name},Ge({default:n(()=>[b.value=="upload"?(d(),k("div",Ft,[o(Pe,{class:"file_uploader",action:"/api/fs/upload",multiple:"",ref_key:"uploadRef",ref:G,"file-list":u(O),"onUpdate:fileList":t[9]||(t[9]=l=>B(O)?O.value=l:O=l),data:u(W),"show-file-list":!0,"on-preview":Ve,"on-success":Se,"before-upload":Oe,"auto-upload":!1},{trigger:n(()=>[o(a,{type:"primary"},{default:n(()=>[x("选择文件")]),_:1})]),_:1},8,["file-list","data"])])):R("",!0),b.value=="viewImage"?(d(),k("div",Mt,[o(we,{src:K.value,lazy:""},null,8,["src"])])):R("",!0),b.value=="viewAudio"?(d(),k("div",Rt,[f("audio",{ref_key:"audioElement",ref:ce,controls:"",src:J.value,style:{width:"100%"},onEnded:Ee},null,40,Dt)])):R("",!0),b.value=="viewVideo"?(d(),k("div",Ut,[f("video",{controls:"",ref_key:"videoElement",ref:pe,style:{width:"100%",height:"100%","object-fit":"cover"}},[f("source",{src:L.value,type:"video/mp4"},null,8,zt),f("source",{src:L.value,type:"video/ogg"},null,8,Vt)],512)])):R("",!0)]),_:2},[b.value=="upload"?{name:"footer",fn:n(()=>[o(a,{type:"primary",size:"default",onClick:$e},{default:n(()=>[x(" 确认提交 ")]),_:1})]),key:"0"}:void 0]),1032,["modelValue","title"])])}}});const Et=et(St,[["__scopeId","data-v-61717d20"]]);export{Et as default};