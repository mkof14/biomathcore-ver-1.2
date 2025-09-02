"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section, Label, Input, Textarea, Select, Chip } from "../../_components/FormUI";

export default function SexualMale() {
  const router = useRouter();
  const [saving, setSaving] = useState<"idle"|"saving">("idle");
  const [data, setData] = useState<Record<string, any>>({
    consent:"", erectionsNight:"", fantasies:"", intercourseFreqChange:"", penileSymptoms:"", testicularPain:"", ejaculationIssues:"", libido:"",
    muscleMassChange:"", hairPresence:[] as string[], hairDensityChange:"", meds:"", concerns:"",
  });

  const required = ["consent"];
  const missing = required.filter(k=>!data[k]);
  const progress = Math.round(((required.length-missing.length)/required.length)*100);
  const setField=(k:string,v:any)=>setData(d=>({...d,[k]:v}));
  const toggle=(k:string,v:string)=>setData(d=>{const s=new Set<string>(d[k]??[]); s.has(v)?s.delete(v):s.add(v); return {...d,[k]:[...s]};});

  async function submit(){
    setSaving("saving");
    const res = await fetch("/api/sexual-health/male/submit",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({answers:data})});
    await res.json(); setSaving("idle"); alert("Saved (dev).");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-5"><button onClick={()=>router.back()} className="text-sm text-violet-700 hover:text-violet-600 underline underline-offset-4">← Back</button></div>
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-50">Sexual Health — Male</h1>
      <div className="mt-3 h-2 rounded-full bg-neutral-200 overflow-hidden"><div className="h-full bg-violet-600" style={{width:`${progress}%`}}/></div>

      <div className="mt-5 space-y-5">
        <Section title="Consent" icon="🔒" tone="neutral">
          <Label required>Consent to answer sensitive questions</Label>
          <Select value={data.consent} onChange={e=>setField("consent", e.target.value)}>
            <option value="">Select…</option><option>Yes</option><option>No</option>
          </Select>
        </Section>

        <Section title="Function & Libido" icon="🩺" tone="mint">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Night/morning erections — change</Label>
              <Select value={data.erectionsNight} onChange={e=>setField("erectionsNight", e.target.value)}>
                <option value="">Select…</option><option>Decreased</option><option>No change</option><option>Increased</option>
              </Select>
            </div>
            <div>
              <Label>Sexual thoughts/fantasies — change</Label>
              <Select value={data.fantasies} onChange={e=>setField("fantasies", e.target.value)}>
                <option value="">Select…</option><option>Decreased</option><option>No change</option><option>Increased</option>
              </Select>
            </div>
            <div>
              <Label>Intercourse frequency — change</Label>
              <Select value={data.intercourseFreqChange} onChange={e=>setField("intercourseFreqChange", e.target.value)}>
                <option value="">Select…</option><option>Decreased</option><option>No change</option><option>Increased</option>
              </Select>
            </div>
            <div>
              <Label>Libido</Label>
              <Select value={data.libido} onChange={e=>setField("libido", e.target.value)}>
                <option value="">Select…</option><option>Low</option><option>Normal</option><option>High</option>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Symptoms" icon="🧪" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Penile symptoms (pain/discharge/lesions)</Label>
              <Select value={data.penileSymptoms} onChange={e=>setField("penileSymptoms", e.target.value)}>
                <option value="">Select…</option><option>Yes</option><option>No</option>
              </Select>
            </div>
            <div>
              <Label>Testicular pain/swelling</Label>
              <Select value={data.testicularPain} onChange={e=>setField("testicularPain", e.target.value)}>
                <option value="">Select…</option><option>Yes</option><option>No</option>
              </Select>
            </div>
            <div>
              <Label>Ejaculation issues</Label>
              <Select value={data.ejaculationIssues} onChange={e=>setField("ejaculationIssues", e.target.value)}>
                <option value="">Select…</option><option>None</option><option>Early</option><option>Delayed</option>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Androgen Profile" icon="🧬" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Muscle mass — change</Label>
              <Select value={data.muscleMassChange} onChange={e=>setField("muscleMassChange", e.target.value)}>
                <option value="">Select…</option><option>Loss</option><option>No change</option><option>Gain</option>
              </Select>
            </div>
            <div>
              <Label>Hair presence (areas)</Label>
              <div className="flex flex-wrap gap-2">
                {["Legs","Arms","Chest","Back","Face"].map(o=>(
                  <Chip key={o} active={(data.hairPresence||[]).includes(o)} onClick={()=>toggle("hairPresence", o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Hair density — change</Label>
              <Select value={data.hairDensityChange} onChange={e=>setField("hairDensityChange", e.target.value)}>
                <option value="">Select…</option><option>Lower</option><option>No change</option><option>Higher</option>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Medications & Concerns" icon="💊" tone="neutral">
          <div className="grid gap-4">
            <div>
              <Label>Relevant medications (e.g., finasteride)</Label>
              <Input value={data.meds} onChange={e=>setField("meds", e.target.value)} />
            </div>
            <div>
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
