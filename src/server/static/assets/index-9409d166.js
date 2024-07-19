import{ad as h,a as Ke,k as o,E as oe,aa as Je,A as Ge,r as y,ae as We,o as d,c as k,p as N,v as re,u,i as r,w as n,b as f,x as B,h as R,y as x,e as M,af as H,z as Ze,t as w,I as Qe,F as Xe,g as Ye,ag as et,ah as V,n as ue,_ as tt}from"./index-45ddfb71.js";import{E as lt}from"./codeEditor-bb43f515.js";const at=i=>h.get("/fs/listdir/?path="+i),nt=(i,c)=>h.get("/fs/filesize?path="+i+"&type="+c),it=i=>h.get("/fs/mkdir/?path="+i),st=i=>h.get("/fs/open/?path="+i),I=i=>h.get("/fs/media?path="+i,{responseType:"blob"}),ot=i=>h.delete("/fs/rmfile/?path="+i),rt=i=>h.delete("/fs/rmdir/?path="+i),de=(i,c)=>h.post("/fs/savefile/?path="+i,{content:c}),ut=(i,c)=>h.get("/fs/movefile/?path="+i+"&newPath="+c),dt=(i,c)=>h.get("/fs/copyfile/?path="+i+"&newPath="+c),ct=(i,c)=>h.get("/fs/copydir/?path="+i+"&newPath="+c),pt=(i,c)=>h.get("/fs/renamefile/?path="+i+"&newPath="+c),mt=(i,c)=>h.get("/fs/search/?path="+i+"&keyWord="+c),vt=i=>h.get("/fs/download?path="+i,{responseType:"blob"}),ft={class:"search_bar"},ht={style:{width:"100%","margin-right":"10px"}},gt={class:"search_file"},_t={class:"handle_tabbar",style:{"margin-top":"10px"}},yt=["onContextmenu"],kt=["onClick"],xt=["onContextmenu"],bt={key:0},Ct=["onClick"],Ft=["onContextmenu"],Rt={key:0,class:"file_upload_box"},Mt={key:1},zt={key:2,style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}},Dt=["src"],Ut={key:3,style:{width:"100","max-height":"100%"}},Vt=["src"],St=["src"],$t=Ke({__name:"index",setup(i){const c=o(window.innerHeight-210);window.onresize=()=>{c.value=window.innerHeight-210};const q=o(!1),K=o(""),J=o(""),G=o(""),L=o(""),ce=o(!1),F=o(!1),b=o(""),W=o(),pe=o(),me=o();let Z=oe({path:""}),j=oe({name:"",mtime:"",type:"",size:"",path:"",isBlur:!1,isRightClicked:!1}),ve=o([{name:"删除"},{name:"上传"},{name:"移动"},{name:"下载"},{name:"复制"},{name:"命名"}]),s=o("0"),g=o([]),z=o(!1),S=o("name"),D=o(!1),$=o(""),P=o(""),U=o(!1),m=o([]),A=o({}),Q=o(""),fe=o(""),E=o([]);const C=async(e="0")=>{q.value=!0;let t=await at(e);t.code==200&&(g.value=t.data.children,s.value=t.data.path,q.value=!1)},he=async e=>{let t=await nt(e.path,e.type);t.code==200&&(e.size=t.data)},ge=Je(()=>{let e=[];if(S.value=="name"){let t=[],a=[];g.value.forEach(v=>{v.type=="file"?a.push(v):t.push(v)}),e=[...t,...a]}else S.value=="time"?e=g.value.slice().sort((t,a)=>{const v=new Date(t.mtime).getTime(),_=new Date(a.mtime).getTime();return v-_}):e=g.value;return D.value?e.reverse():e}),X=e=>{e=="name"?S.value=="name"?D.value=!D.value:(S.value="name",D.value=!1):e=="time"&&(S.value=="time"?D.value=!D.value:(S.value="time",D.value=!1))},_e=()=>{let e=s.value.lastIndexOf("/");e==-1&&(e=s.value.lastIndexOf("\\")),s.value=s.value.slice(0,e),C(s.value)},ye=()=>{C(s.value)},ke=async()=>{let e=await mt(s.value,$.value);$.value="",e.code==200&&(g.value=e.data)},xe=e=>{const t=e.lastIndexOf(".");return t===-1?"js":e.substring(t+1)},be=async e=>{if(e.type=="file"){if(Object.assign(j,e),/\.(png|jpg|jpeg|gif|bmp|tiff|webp|svg)$/.test(e.name)){let a=await I(e.path);J.value=URL.createObjectURL(a),b.value="viewImage",F.value=!0;return}if(/\.(mp3|wav|aac|m4a|ogg|flac|wma|ape|alac|amr|awb|aiff|caf|mka|opus|ra|rm|spx|tta|voc|wavpack|xm|mod|s3m|it|xmf|mid|midi|kar|rmi)$/.test(e.name)){let a=await I(e.path);G.value=URL.createObjectURL(a),b.value="viewAudio",F.value=!0;return}if(/\.(mp4|avi|mov|wmv|mpeg|flv|mkv|vob|3gp|webm|m4v)$/.test(e.name)){let a=await I(e.path);L.value=URL.createObjectURL(a),b.value="viewVideo",F.value=!0;return}let t=await st(e.path);t.code==200&&(U.value=!0,P.value=t.data,K.value=xe(e.name));return}C(e.path)},Ce=async e=>{(await de(j.path,e.toString())).code==200&&(V.success("保存成功！"),U.value=!1,P.value="")},Fe=e=>{e=="文件"?g.value.unshift({name:"",mtime:"",type:"file",size:"",path:s.value,isBlur:!0}):e=="目录"&&g.value.unshift({name:"",mtime:"",type:"directory",size:"",path:s.value,isBlur:!0});let t=g.value.find(a=>a.isBlur==!0);ue(()=>{A.value[t.name.replace(/\./g,"")+t.type].focus()})},Re=(e,t)=>{const a=new Set;for(let v=0;v<e.length;v++){const _=e[v][t];if(a.has(_))return!0;a.add(_)}return!1},Y=async(e,t="blur",a="create")=>{if(e.isBlur=!1,t=="enter")return;if(e.name||(e.name="新建标题"),Re(g.value,"name")){V.error("该标题已存在！！"),C(s.value);return}let _;e.handlerMode=="命名"&&(a="rename"),a=="create"?e.type=="file"?_=await de(s.value+"/"+e.name,""):_=await it(s.value+"/"+e.name):a=="rename"&&(_=await pt(s.value+"/"+Q.value,s.value+"/"+e.name),e.handlerMode==""),_.code==200&&C(s.value)},Me=async e=>{let t;e.type=="file"?t=await ot(e.path):t=await rt(e.path),t.code==200&&(console.log(t),C(s.value))},ee=async e=>{m.value.push(e)},ze=async()=>{for(let e=0;e<m.value.length;e++){let t=m.value[e],a;t.handlerMode=="移动"?a=await ut(t.path,s.value+"/"+t.name):t.handlerMode=="复制"?t.type=="file"?a=await dt(t.path,s.value+"/"+t.name):a=await ct(t.path,s.value+"/"+t.name):V.error("请选择右侧操作"),a.code==200&&V.success("粘贴成功！")}m.value=[],C(s.value)},De=e=>{Q.value=e.name,e.isBlur=!0,ue(()=>{A.value[e.name.replace(/\./g,"")+e.type].focus()})},T=e=>{for(let t=0;t<g.value.length;t++)g.value[t].isRightClicked=!1;e.isRightClicked=!0},Ue=()=>{for(let e=0;e<g.value.length;e++)g.value[e].isRightClicked=!1},te=()=>{Z.path=s.value,b.value="upload",F.value=!0},le=(e,t)=>{switch(e.isRightClicked=!1,t.name){case"删除":Me(e);break;case"移动":e.handlerMode="移动",ee(e);break;case"复制":e.handlerMode="复制",ee(e);break;case"命名":e.handlerMode="命名",De(e);break;case"上传":e.handlerMode="上传",te();break;case"下载":e.handlerMode="下载",we(e);break;default:V.error("右键相关操作出错了")}},Ve=e=>{m.value.some(a=>!!a.handlerMode)||(m.value=JSON.parse(JSON.stringify(e)))},ae=e=>{for(let t=0;t<m.value.length;t++)m.value[t].handlerMode=e},Se=e=>{fe.value=e.url,F.value=!0},$e=e=>{console.log(e),C(s.value)},Be=()=>{W.value.submit(),F.value=!1},we=async e=>{if(console.log(e),e.type=="file"){let t=await vt(e.path);V.success("开始下载...");const a=document.createElement("a");a.href=URL.createObjectURL(t),a.download=e.name,document.body.appendChild(a),a.click(),document.body.removeChild(a)}else V.warning("请下载文件或压缩包")},Ee=()=>{ce.value=!1},Oe=e=>{};return Ge(()=>{C("0")}),(e,t)=>{const a=y("el-button"),v=y("el-input"),_=y("el-popover"),ne=y("el-option"),qe=y("el-select"),O=y("el-table-column"),Le=y("el-popconfirm"),je=y("el-table"),ie=y("el-card"),Pe=y("el-upload"),Ae=y("el-image"),Te=y("el-dialog"),Ne=We("loading");return d(),k("div",null,[N(r(ie,{class:"box-card",ref:"cardRef"},{default:n(()=>[f("div",ft,[f("div",ht,[r(v,{modelValue:u(s),"onUpdate:modelValue":t[0]||(t[0]=l=>B(s)?s.value=l:s=l),style:{"max-width":"600px",width:"100%","min-width":"200px"},class:"input-with-select"},{prepend:n(()=>[r(a,{icon:"Back",onClick:_e})]),append:n(()=>[r(a,{icon:"DArrowRight",onClick:ye})]),_:1},8,["modelValue"])]),f("div",gt,[r(_,{placement:"bottom",title:"搜索",width:300,trigger:"hover"},{reference:n(()=>[r(a,{icon:"Search",circle:""})]),default:n(()=>[r(v,{modelValue:u($),"onUpdate:modelValue":t[1]||(t[1]=l=>B($)?$.value=l:$=l),placeholder:"输入搜索文件或目录"},{append:n(()=>[r(a,{icon:"Search",onClick:ke})]),_:1},8,["modelValue"])]),_:1})])]),f("div",_t,[r(a,{size:"small",style:{"margin-right":"5px"},icon:u(z)?"ArrowLeftBold":"ArrowRightBold",onClick:t[2]||(t[2]=l=>B(z)?z.value=!u(z):z=!u(z))},null,8,["icon"]),r(qe,{size:"small",placeholder:"新建",style:{width:"60px"},onChange:Fe},{default:n(()=>[r(ne,{label:"目录",value:"目录"}),r(ne,{label:"文件",value:"文件"})]),_:1}),u(m).length>0&&u(m).every(l=>l.handlerMode)?(d(),R(a,{key:0,type:"primary",onClick:t[3]||(t[3]=l=>ze()),size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 粘贴 ")]),_:1})):M("",!0),r(a,{onClick:te,size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 上传 ")]),_:1}),u(m).length>0?(d(),R(a,{key:1,disabled:u(m).every(l=>l.handlerMode=="复制"),type:"primary",onClick:t[4]||(t[4]=l=>ae("复制")),size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 复制 ")]),_:1},8,["disabled"])):M("",!0),u(m).length>0?(d(),R(a,{key:2,disabled:u(m).every(l=>l.handlerMode=="移动"),type:"primary",onClick:t[5]||(t[5]=l=>ae("移动")),size:"small",style:{"margin-left":"5px"}},{default:n(()=>[x(" 移动 ")]),_:1},8,["disabled"])):M("",!0)]),N((d(),R(je,{style:{margin:"10px 0"},data:ge.value,"max-height":c.value,onSelectionChange:Ve,onClick:Ue},{default:n(()=>[u(z)?(d(),R(O,{key:0,type:"selection",align:"center"})):M("",!0),r(O,{label:"文件名称"},{header:n(()=>[f("div",{class:"title-active",onClick:t[6]||(t[6]=l=>X("name"))}," 文件名称 ")]),default:n(({row:l,$index:se})=>[r(_,{placement:"bottom",title:l.type=="file"?"文件操作":"文件夹操作",width:150,trigger:"contextmenu",visible:l.isRightClicked},{reference:n(()=>[f("div",{onContextmenu:H(p=>T(l),["prevent"])},[f("i",{class:Ze(`iconfont icon-file 
                                            icon-${l.type=="file"?l.name.split(".").at(-1):"yellowFolder"}
                                        `),style:{"font-size":"20px"}},null,2),x("   "),l.isBlur?(d(),R(v,{key:1,ref:p=>{u(A)[l.name.replace(/\./g,"")+l.type]=p},onBlur:p=>Y(l,"blur"),onKeyup:Qe(p=>Y(l,"enter"),["enter"]),modelValue:l.name,"onUpdate:modelValue":p=>l.name=p},null,8,["onBlur","onKeyup","modelValue","onUpdate:modelValue"])):(d(),k("a",{key:0,onClick:p=>be(l)},w(l.name),9,kt))],40,yt)]),default:n(()=>[(d(!0),k(Xe,null,Ye(u(ve),(p,He)=>(d(),k("span",{class:"pop_menu",key:He},[p.name=="删除"?(d(),R(Le,{key:0,title:`您即将删除路径【${l.path}】,是否继续？`,onConfirm:Ie=>le(l,p)},{reference:n(()=>[r(a,null,{default:n(()=>[x(w(p.name),1)]),_:2},1024)]),_:2},1032,["title","onConfirm"])):(d(),R(a,{key:1,onClick:Ie=>le(l,p)},{default:n(()=>[x(w(p.name),1)]),_:2},1032,["onClick"]))]))),128))]),_:2},1032,["title","visible"])]),_:1}),r(O,{label:"大小",width:"80px"},{default:n(({row:l,$index:se})=>[f("div",{onContextmenu:H(p=>T(l),["prevent"]),style:{"font-size":"12px"}},[l.size?(d(),k("span",bt,w(l.size),1)):(d(),k("a",{key:1,onClick:p=>he(l)},"计算",8,Ct))],40,xt)]),_:1}),r(O,{label:"修改时间"},{header:n(()=>[f("div",{class:"title-active",onClick:t[7]||(t[7]=l=>X("time"))}," 修改时间 ")]),default:n(({row:l,$index:se})=>[f("div",{onContextmenu:H(p=>T(l),["prevent"]),style:{"font-size":"12px"}},w(l.mtime.replace(/T/," ").replace(/\.\d{3}Z/,"")),41,Ft)]),_:1})]),_:1},8,["data","max-height"])),[[Ne,q.value]])]),_:1},512),[[re,!u(U)]]),N(r(ie,null,{default:n(()=>[r(a,{style:{"margin-bottom":"5px"},onClick:t[8]||(t[8]=l=>B(U)?U.value=!1:U=!1)},{default:n(()=>[x(" 返回 ")]),_:1}),r(lt,{code:u(P),ext:K.value,onGetCode:Ce},null,8,["code","ext"])]),_:1},512),[[re,u(U)]]),r(Te,{modelValue:F.value,"onUpdate:modelValue":t[10]||(t[10]=l=>F.value=l),title:u(j).name},et({default:n(()=>[b.value=="upload"?(d(),k("div",Rt,[r(Pe,{class:"file_uploader",action:"/api/fs/upload",multiple:"",ref_key:"uploadRef",ref:W,"file-list":u(E),"onUpdate:fileList":t[9]||(t[9]=l=>B(E)?E.value=l:E=l),data:u(Z),"show-file-list":!0,"on-preview":Se,"on-success":$e,"before-upload":Oe,"auto-upload":!1},{trigger:n(()=>[r(a,{type:"primary"},{default:n(()=>[x("选择文件")]),_:1})]),_:1},8,["file-list","data"])])):M("",!0),b.value=="viewImage"?(d(),k("div",Mt,[r(Ae,{src:J.value,lazy:""},null,8,["src"])])):M("",!0),b.value=="viewAudio"?(d(),k("div",zt,[f("audio",{ref_key:"audioElement",ref:pe,controls:"",src:G.value,style:{width:"100%"},onEnded:Ee},null,40,Dt)])):M("",!0),b.value=="viewVideo"?(d(),k("div",Ut,[f("video",{controls:"",ref_key:"videoElement",ref:me,style:{width:"100%",height:"100%","object-fit":"cover"}},[f("source",{src:L.value,type:"video/mp4"},null,8,Vt),f("source",{src:L.value,type:"video/ogg"},null,8,St)],512)])):M("",!0)]),_:2},[b.value=="upload"?{name:"footer",fn:n(()=>[r(a,{type:"primary",size:"default",onClick:Be},{default:n(()=>[x(" 确认提交 ")]),_:1})]),key:"0"}:void 0]),1032,["modelValue","title"])])}}});const Et=tt($t,[["__scopeId","data-v-73335e83"]]);export{Et as default};
