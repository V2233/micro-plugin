import{a7 as e}from"./index-85ec3edf.js";const s=()=>e.get("/bot/info"),o=()=>e.get("/bot/URI"),u=()=>e.get("/plugins/get"),i=t=>e.post("/plugins/add",t),g=t=>e.delete("/plugins/delete?index="+t),l=(t,r)=>e.put("/plugins/put?index="+t,r);export{o as a,i as b,l as c,u as d,g as e,s as r};