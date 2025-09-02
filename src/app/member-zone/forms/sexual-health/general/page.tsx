"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section, Label, Input, Textarea, Select, Chip, Segmented } from "../../_components/FormUI";

export default function SexualGeneral() {
  const router = useRouter();
  const [saving, setSaving] = useState<"idle"|"saving">("idle");
  const [units, setUnits] = useState<"metric"|"imperial">("metric");

  const [data, setData] = useState<Record<string, any>>({
    consent: "", ageGroup:"", sexAtBirth: "",
    relationship:"", activityFreq:"", partnersCount:"",
    protection: [] as string[], stiHistory: [] as string[], lastSTIScreenMonths:"",
    concerns:"", painDuring:"", libido:"", erectionMorning:"", fantasiesChange:"", intercourseChange:"",
    hairPresence: [] as string[], hairDensityChange:"", muscleLoss:"", devices:"", notes:"",
  });

  const required = ["consent","ageGroup","sexAtBirth"];
  const missing = required.filter(k => !data[k]);
  const progress = Math.round(((required.length - missing.length)/required.length)*100);

  function setField(k:string, v:any){ setData(d=>({...d,[k]:v})); }
  function toggleArr(k:string, v:string){ setData(d=>{ const s = new Set<string>(d[k]??[]); s.has(v)?s.delete(v):s.add(v); return {...d,[k]:[...s]}; }); }

  async function submit() {
    setSaving("saving");
    const res = await fetch("/api/sexual-health/general/submit",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({answers:data, units})});
    await res.json();
    setSaving("idle");
    alert("Saved (dev).");
  }

  const showMaleSpecific = data.sexAtBirth === "Male";
  const showFemaleSpecific = data.sexAtBirth === "Female";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between mb-5">
        <button onClick={()=>router.back()} className="text-sm text-violet-700 hover:text-violet-600 underline underline-offset-4">← Back</button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-600">Units:</span>
          <Segmented value={units} onChange={(v)=>setUnits(v as any)} options={[{value:"metric",label:"Metric"},{value:"imperial",label:"Imperial"}]} />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-50">Sexual Health — General</h1>
      <div className="mt-3 h-2 rounded-full bg-neutral-200 overflow-hidden"><div className="h-full bg-violet-600" style={{width:`${progress}%`}}/></div>
      <div className="mt-1 text-xs text-neutral-600">{progress}% completed</div>

      <div className="mt-5 space-y-5">
        <Section title="Consent & Profile" icon="🔒" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label required>Consent to answer sensitive questions</Label>
              <Select value={data.consent} onChange={e=>setField("consent", e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option><option>No</option>
              </Select>
            </div>
            <div>
              <Label required>Age group</Label>
              <Select value={data.ageGroup} onChange={e=>setField("ageGroup", e.target.value)}>
                <option value="">Select…</option>
                <option>18–24</option><option>25–34</option><option>35–44</option><option>45–54</option><option>55–64</option><option>65+</option>
              </Select>
            </div>
            <div>
              <Label required>Sex at birth</Label>
              <Select value={data.sexAtBirth} onChange={e=>setField("sexAtBirth", e.target.value)}>
                <option value="">Select…</option><option>Female</option><option>Male</option><option>Intersex</option><option>Prefer not to say</option>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Activity & Safety" icon="❤️" tone="mint">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Relationship status</Label>
              <Select value={data.relationship} onChange={e=>setField("relationship", e.target.value)}>
                <option value="">Select…</option><option>Single</option><option>Monogamous</option><option>Open relationship</option><option>Prefer not to say</option>
              </Select>
            </div>
            <div>
              <Label>Activity frequency</Label>
              <Select value={data.activityFreq} onChange={e=>setField("activityFreq", e.target.value)}>
                <option value="">Select…</option><option>Rare</option><option>Monthly</option><option>Weekly</option><option>Daily</option>
              </Select>
            </div>
            <div>
              <Label>Number of partners (last 12 months)</Label>
              <Input inputMode="numeric" value={data.partnersCount} onChange={e=>setField("partnersCount", e.target.value.replace(/[^\d]/g,""))}/>
            </div>
            <div>
              <Label>Protection</Label>
              <div className="flex flex-wrap gap-2">
                {["Condoms","IUD","Pill","None"].map(o=>(
                  <Chip key={o} active={(data.protection||[]).includes(o)} onClick={()=>toggleArr("protection",o)}>{o}</Chip>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="STIs & Screening" icon="🧪" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>History of STIs</Label>
              <div className="flex flex-wrap gap-2">
                {["Chlamydia","Gonorrhea","Syphilis","HPV","HSV","HIV","Other","No history"].map(o=>(
                  <Chip key={o} active={(data.stiHistory||[]).includes(o)} onClick={()=>toggleArr("stiHistory",o)}>{o}</Chip>
                ))}
              </div>
            </div>
            <div>
              <Label>Last STI screening (months ago)</Label>
              <Input inputMode="numeric" value={data.lastSTIScreenMonths} onChange={e=>setField("lastSTIScreenMonths", e.target.value.replace(/[^\d]/g,""))}/>
            </div>
            <div className="md:col-span-2">
              <Label>Current concerns (free text)</Label>
              <Textarea value={data.concerns} onChange={e=>setField("concerns", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="Symptoms & Changes" icon="🩺" tone="neutral">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Pain/discomfort during activity</Label>
              <Select value={data.painDuring} onChange={e=>setField("painDuring", e.target.value)}>
                <option value="">Select…</option><option>Never</option><option>Sometimes</option><option>Often</option>
              </Select>
            </div>
            <div>
              <Label>Libido</Label>
              <Select value={data.libido} onChange={e=>setField("libido", e.target.value)}>
                <option value="">Select…</option><option>Low</option><option>Normal</option><option>High</option>
              </Select>
            </div>

            {showMaleSpecific && (
              <>
                <div>
                  <Label>Changes in morning/night erections (frequency)</Label>
                  <Select value={data.erectionMorning} onChange={e=>setField("erectionMorning", e.target.value)}>
                    <option value="">Select…</option><option>Decreased</option><option>No change</option><option>Increased</option>
                  </Select>
                </div>
                <div>
                  <Label>Changes in sexual thoughts/fantasies</Label>
                  <Select value={data.fantasiesChange} onChange={e=>setField("fantasiesChange", e.target.value)}>
                    <option value="">Select…</option><option>Decreased</option><option>No change</option><option>Increased</option>
                  </Select>
                </div>
                <div>
                  <Label>Changes in frequency of intercourse</Label>
                  <Select value={data.intercourseChange} onChange={e=>setField("intercourseChange", e.target.value)}>
                    <option value="">Select…</option><option>Decreased</option><option>No change</option><option>Increased</option>
                  </Select>
                </div>
                <div>
                  <Label>Changes in muscle mass</Label>
                  <Select value={data.muscleLoss} onChange={e=>setField("muscleLoss", e.target.value)}>
                    <option value="">Select…</option><option>Loss</option><option>No change</option><option>Gain</option>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Body hair changes (presence/density)</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Legs","Arms","Chest","Back","Face"].map(o=>(
                      <Chip key={o} active={(data.hairPresence||[]).includes(o)} onClick={()=>toggleArr("hairPresence",o)}>{o}</Chip>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Select value={data.hairDensityChange} onChange={e=>setField("hairDensityChange", e.target.value)}>
                      <option value="">Density change…</option><option>Lower</option><option>No change</option><option>Higher</option>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {showFemaleSpecific && (
              <div className="md:col-span-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                If you experience cycle-related symptoms, you can add notes below (optional).
              </div>
            )}

            <div className="md:col-span-2">
              <Label>Additional notes</Label>
              <Textarea value={data.notes} onChange={e=>setField("notes", e.target.value)} />
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
