import{a7 as t}from"./index-6b89b52f.js";const s=()=>t.get("/bot/info"),o=()=>t.get("/bot/URI"),u=()=>t.get("/plugins/get"),i=e=>t.post("/plugins/add",e),g=e=>t.delete("/plugins/delete?index="+e),a=(e,n)=>t.put("/plugins/put?index="+e,n),l=(e,n)=>t.get("/plugins/imgJSON?id="+e+"&hash="+n);export{o as a,l as b,i as c,a as d,u as e,g as f,s as r};
