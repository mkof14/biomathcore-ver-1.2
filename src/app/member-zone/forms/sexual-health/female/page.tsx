"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section, Label, Input, Textarea, Select, Chip } from "../../_components/FormUI";

export default function SexualFemale() {
  const router = useRouter();
  const [saving, setSaving] = useState<"idle"|"saving">("idle");
  const [data, setData] = useState<Record<string, any>>({
    consent:"", cycleStatus:"", lastPeriod:"", cycleLength:"", painLevel:"", flow:"", pms:"", dyspareunia:"", lubrication:"", infections:[] as string[], screeningMonths:"", contraception:[] as string[], pregnancyHistory:"", concerns:"",
  });

  const required = ["consent"];
  const missing = required.filter(k=>!data[k]);
  const progress = Math.round(((required.length-missing.length)/required.length)*100);
  const setField=(k:string,v:any)=>setData(d=>({...d,[k]:v}));
  const toggle=(k:string,v:string)=>setData(d=>{const s=new Set<string>(d[k]??[]); s.has(v)?s.delete(v):s.add(v); return {...d,[k]:[...s]};});

  async function submit(){
    setSaving("saving");
    const res = await fetch("/api/sexual-health/female/submit",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({answers:data})});
    await res.json(); setSaving("idle"); alert("Saved (dev).");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-5"><button onClick={()=>router.back()} className="text-sm text-violet-700 hover:text-violet-600 underline underline-offset-4">← Back</button></div>
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-50">Sexual Health — Female</h1>
      <div className="mt-3 h-2 rounded-full bg-neutral-200 overflow-hidden"><div className="h-full bg-violet-600" style={{width:`${progress}%`}}/></div>

      <div className="mt-5 space-y-5">
        <Section title="Consent" icon="🔒" tone="neutral">
          <Label required>Consent to answer sensitive questions</Label>
          <Select value={data.consent} onChange={e=>setField("consent", e.target.value)}>
            <option value="">Select…</option><option>Yes</option><option>No</option>
          </Select>
        </Section>

        <Section title="Cycle & Symptoms" icon="🩺" tone="mint">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Cycle status</Label>
              <Select value={data.cycleStatus} onChange={e=>setField("cycleStatus", e.target.value)}>
                <option value="">Select…</option><option>Regular</option><option>Irregular</option><option>Perimenopause</option><option>Menopause</option>
              </Select>
            </div>
            <div>
              <Label>Last period (YYYY-MM-DD)</Label>
              <Input placeholder="e.g., 2025-08-01" value={data.lastPeriod} onChange={e=>setField("lastPeriod", e.target.value)} />
            </div>
            <div>
              <Label>Cycle length (days)</Label>
              <Input inputMode="numeric" value={data.cycleLength} onChange={e=>setField("cycleLength", e.target.value.replace(/[^\d]/g,""))}/>
            </div>
            <div>
              <Label>Period pain level (1–10)</Label>
              <Input type="range" min={1} max={10} value={data.painLevel||5} onChange={e=>setField("painLevel", e.target.value)} />
            </div>
            <div>
              <Label>Flow</Label>
              <Select value={data.flow} onChange={e=>setField("flow", e.target.value)}>
                <option value="">Select…</option><option>Light</option><option>Moderate</option><option>Heavy</option>
              </Select>
            </div>
            <div>
              <Label>PMS symptoms</Label>
              <Select value={data.pms} onChange={e=>setField("pms", e.target.value)}>
                <option value="">Select…</option><option>Mild</option><option>Moderate</option><option>Severe</option>
              </Select>
            </div>
            <div>
              <Label>Pain during intercourse (dyspareunia)</Label>
              <Select value={data.dyspareunia} onChange={e=>setField("dyspareunia", e.target.value)}>
                <option value="">Select…</option><option>Never</option><option>Sometimes</option><option>Often</option>
              </Select>
            </div>
            <div>
              <Label>Lubrication issues</Label>
              <Select value={data.lubrication} onChange={e=>setField("lubrication", e.target.value)}>
                <option value="">Select…</option><option>No</option><option>Sometimes</option><option>Often</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Genital infections (history)</Label>
              <div className="flex flex-wrap gap-2">
                {["Candida","BV","UTI","No history"].map(o=>(
                  <Chip key={o} active={(data.infections||[]).includes(o)} onClick={()=>toggle("infections", o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div>
              <Label>Last gynecological screening (months ago)</Label>
              <Input inputMode="numeric" value={data.screeningMonths} onChange={e=>setField("screeningMonths", e.target.value.replace(/[^\d]/g,""))}/>
            </div>
          </div>
        </Section>

        <Section title="Contraception & History" icon="🧬" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Contraception</Label>
              <div className="flex flex-wrap gap-2">
                {["Condoms","IUD","Pill","None"].map(o=>(
                  <Chip key={o} active={(data.contraception||[]).includes(o)} onClick={()=>toggle("contraception", o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Pregnancy/childbirth history (optional)</Label>
              <Textarea value={data.pregnancyHistory} onChange={e=>setField("pregnancyHistory", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Current concerns</Label>
              <Textarea value={data.concerns} onChange={e=>setField("concerns", e.target.value)} />
            </div>
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3">
          <button onClick={()=>router.back()} className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-50 hover:bg-neutral-50">Back</button>
          <button onClick={submit} disabled={missing.length>0 || saving==="saving"}
            className={"px-5 py-2.5 rounded-lg " + ((missing.length>0||saving==="saving")?"bg-violet-400 text-white opacity-70":"bg-violet-600 text-white hover:bg-violet-500")}>
            {missing.length>0 ? `Complete ${missing.length} required` : (saving==="saving"?"Submitting…":"Submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
