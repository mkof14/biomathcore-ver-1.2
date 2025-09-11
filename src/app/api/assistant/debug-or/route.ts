import { NextResponse } from "next/server";
export const runtime = "nodejs";
function key(){return process.env.OPENROUTER_API_KEY||""}
function model(){return process.env.OPENROUTER_MODEL||"openai/gpt-4o-mini"}
function site(){return process.env.OPENROUTER_SITE||"http://localhost:3000"}
function title(){return process.env.OPENROUTER_TITLE||"BioMath Core Dev"}
export async function GET(){
  const k=key(); if(!k) return new NextResponse("Missing OPENROUTER_API_KEY",{status:401});
  const test=[{role:"user",content:"ping"}];
  const r=await fetch("https://openrouter.ai/api/v1/chat/completions",{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${k}`,
      "Content-Type":"application/json",
      "Accept":"application/json",
      "HTTP-Referer":site(),
      "X-Title":title(),
    },
    body:JSON.stringify({model:model(),messages:test})
  });
  const text=await r.text().catch(()=> "");
  return NextResponse.json({status:r.status,ok:r.ok,body:text}, {status:200});
}

export {};
