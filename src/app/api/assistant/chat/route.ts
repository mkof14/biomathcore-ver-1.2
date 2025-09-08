import { NextResponse } from "next/server";
export const runtime = "nodejs";
function key(){return process.env.OPENROUTER_API_KEY||""}
function model(){return process.env.OPENROUTER_MODEL||"openai/gpt-4o-mini"}
function site(){return process.env.OPENROUTER_SITE||"http://localhost:3000"}
function title(){return process.env.OPENROUTER_TITLE||"BioMath Core Dev"}
export async function POST(req:Request){
  try{
    const k=key(); if(!k) return new NextResponse("Missing OPENROUTER_API_KEY",{status:401});
    const {messages}=await req.json();
    const r=await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${k}`,
        "Content-Type":"application/json",
        "HTTP-Referer":site(),
        "X-Title":title()
      },
      body:JSON.stringify({model:model(),messages,temperature:0.3,stream:false})
    });
    const t=await r.text().catch(()=> ""); if(!r.ok) return new NextResponse(t||`Upstream error (${r.status})`,{status:r.status});
    try{const j=JSON.parse(t); const out=j?.choices?.[0]?.message?.content??""; return new Response(out,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}
    catch{return new Response(t,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}
  }catch(e:any){return new NextResponse(`Server error: ${e?.message||"unknown"}`,{status:500})}
}
