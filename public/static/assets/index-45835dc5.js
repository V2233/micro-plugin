import{ac as e}from"./index-cda25469.js";const s=()=>e.get("/bot/info"),o=()=>e.get("/bot/URI"),u=()=>e.get("/plugins/get"),g=t=>e.post("/plugins/add",t),i=t=>e.delete("/plugins/delete?index="+t),a=(t,n)=>e.put("/plugins/put?index="+t,n),l=(t,n)=>e.get("/plugins/imgJSON?id="+t+"&hash="+n),p=t=>e.post("/plugins/btnJSON",t);export{o as a,l as b,g as c,a as d,p as e,u as f,i as g,s as r};
