import { listAIRuns } from "@/lib/repos/aiRepo";
import { listVoice } from "@/lib/repos/voiceRepo";
import { listDG } from "@/lib/repos/drugGeneRepo";

export const runtime = "nodejs";

type Point = { day: string; ai: number; voice: number; dg: number };

function dayKey(d: Date){ return d.toISOString().slice(0,10); } // YYYY-MM-DD

export async function GET() {
  const [ai, voice, dg] = await Promise.all([
    listAIRuns({ limit:1000 }),
    listVoice({ limit:1000 }),
    listDG({ limit:1000 }),
  ]);

  const map = new Map<string, Point>();
  const add = (k:string, f:keyof Point) => {
    const p = map.get(k) ?? { day:k, ai:0, voice:0, dg:0 };
    p[f] = (p[f] as number) + 1;
    map.set(k, p);
  };

  ai.forEach(r=>add(dayKey(r.createdAt), "ai"));
  voice.forEach(r=>add(dayKey(r.createdAt), "voice"));
  dg.forEach(r=>add(dayKey(r.createdAt), "dg"));

  // последние 10 дней, по возрастанию
  const out: Point[] = [];
  const end = new Date();
  for(let i=9;i>=0;i--){
    const d = new Date(end.getTime() - i*24*60*60*1000);
    const k = dayKey(d);
    out.push(map.get(k) ?? { day:k, ai:0, voice:0, dg:0 });
  }

  return Response.json({ ok:true, data: out }, { headers: { "Cache-Control":"no-store" }});
}

export {};
