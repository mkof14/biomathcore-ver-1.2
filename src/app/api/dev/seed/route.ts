import { createAIRun } from "@/lib/repos/aiRepo";
import { createVoice } from "@/lib/repos/voiceRepo";
import { createDG } from "@/lib/repos/drugGeneRepo";

export const runtime = "nodejs";

function backFill(fn: (i:number)=>Promise<any>, count:number) {
  const now = Date.now();
  const day = 24*60*60*1000;
  const tasks: Promise<any>[] = [];
  for (let i=0;i<count;i++){
    // растянем по времени: часть — сегодня, часть — прошлые дни
    const offsetDays = Math.floor(Math.random()*10);
    const at = new Date(now - offsetDays*day - Math.floor(Math.random()*day));
    tasks.push(fn(i).then((row:any)=>{ row.createdAt = at; row.updatedAt = at; return row; }));
  }
  return Promise.all(tasks);
}

export async function POST() {
  await backFill(()=>createAIRun({ model: "gpt", status: "ok" }), 22);
  await backFill(()=>createVoice({ status: "ok" }), 15);
  await backFill(()=>createDG({ status: "match" }), 18);
  return Response.json({ ok:true });
}

export {};
