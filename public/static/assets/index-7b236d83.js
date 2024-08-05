var d=Object.defineProperty;var a=(r,s,t)=>s in r?d(r,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[s]=t;var i=(r,s,t)=>(a(r,typeof s!="symbol"?s+"":s,t),t);import{ai as n}from"./index-6012d839.js";class l{constructor(s="/micro/webui/chat"){i(this,"ws");i(this,"url");i(this,"msgQueue");i(this,"clientId");i(this,"reConnectSum");i(this,"address");this.address={publicAddress:"",privateAddress:""},this.ws=null,this.url=s,this.msgQueue=[],this.clientId="",this.reConnectSum=0}async openWs(s="",t=null){!this.address.privateAddress&&!this.address.publicAddress&&await this.getServerPort(),this.ws=new WebSocket((s||this.address.publicAddress)+this.url),this.ws.addEventListener("open",e=>{console.log("ws连接成功！"+e.target),t&&t()}),this.ws.addEventListener("message",e=>{this.msgQueue.push(JSON.parse(e.data)),e.data.action=="meta"&&(this.clientId=e.data.params)}),this.ws.addEventListener("close",e=>{console.log("ws服务端关闭！"+JSON.stringify(e)),this.clientId=""}),this.ws.addEventListener("error",async e=>{console.log("ws出错！"+JSON.stringify(e)),await this.openWs(this.address.privateAddress)})}async getServerPort(){let s=await n();s.code==200&&(this.address=s.data)}closeWs(){this.ws&&this.ws.close(),console.log("ws关闭成功！")}sendWs(s){this.ws&&this.ws.send(this.clientId?{...s,ClientId:this.clientId}:s)}}export{l as W};
