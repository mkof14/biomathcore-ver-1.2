"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";

type QType = "TEXT"|"TEXTAREA"|"NUMBER"|"DATE"|"BOOLEAN"|"SINGLE_CHOICE"|"MULTI_CHOICE";
type Question = {
  id: string; label: string; type: QType; required: boolean;
  options?: string[]; sensitivity?: string;
};
type Section = { id: string; title: string; questions: Question[] };
type FormData = { title: string; sections: Section[] };

export default function FormRenderer({ slug }: { slug: string }) {
  const { tUI, translateLabel } = useI18n();
  const router = useRouter();
  const sp = useSearchParams();
  const admin = sp.get("admin")==="1";

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData|null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<"idle"|"posting">("idle");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await fetch(`/api/forms/${slug}${admin?"?admin=1":""}`);
      const j = await r.json();
      setForm(j?.data ?? null);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const setValue = (id: string, v: any) => setAnswers(prev => ({ ...prev, [id]: v }));
  const toggleMulti = (id: string, v: string) => {
    const cur: string[] = Array.isArray(answers[id]) ? answers[id] : [];
    setAnswers(prev => ({
      ...prev,
      [id]: cur.includes(v) ? cur.filter(x=>x!==v) : [...cur, v]
    }));
  };

  const requiredMissing = useMemo(() => {
    if (!form) return [];
    const miss:string[] = [];
    form.sections.forEach(sec => sec.questions.forEach(q => {
      if (!q.required) return;
      const val = answers[q.id];
      if (val===undefined || val===null || (typeof val==="string" && val.trim()==="") || (Array.isArray(val) && val.length===0)) {
        miss.push(q.id);
      }
    }));
    return miss;
  }, [form, answers]);

  const submit = async () => {
    if (!form) return;
    setSaving("posting");
    try {
      const r = await fetch(`/api/forms/${slug}/submit${admin?"?admin=1":""}`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ answers })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Submit failed");
      router.push(`/member-zone/forms?submitted=1${admin?"&admin=1":""}`);
    } catch(e) {
      console.error(e);
      setSaving("idle");
    }
  };

  if (loading) return <div className="text-sm text-neutral-300">Loading…</div>;
  if (!form)   return <div className="text-sm text-red-300">Form not found</div>;

  return (
    <div className="forms-root max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{form.title}</h1>
      </div>

      <div className="space-y-6">
        {form.sections.map((sec, si) => (
          <div key={sec.id} className="section-card p-4">
            <div className="mb-3">
              <h2 className="text-lg font-semibold">{sec.title}</h2>
            </div>
            <div className="p-1 space-y-4">
              {sec.questions.map((q, qi) => {
                const v = answers[q.id];

                return (
                  <div key={q.id} className="flex flex-col gap-2">
                    <label className="label-soft text-sm">
                      {translateLabel(q.label)}{q.required ? " *" : ""}
                    </label>

                    {q.type==="TEXT" && (
                      <input
                        type="text" value={v||""}
                        onChange={e=>setValue(q.id,e.target.value)}
                      />
                    )}

                    {q.type==="TEXTAREA" && (
                      <textarea
                        value={v||""}
                        onChange={e=>setValue(q.id,e.target.value)}
                        rows={4}
                      />
                    )}

                    {q.type==="NUMBER" && (
                      <input
                        type="number" value={v??""}
                        onChange={e=>setValue(q.id, e.target.value==="" ? null : Number(e.target.value))}
                      />
                    )}

                    {q.type==="DATE" && (
                      <input
                        type="date" value={v||""}
                        onChange={e=>setValue(q.id, e.target.value)}
                      />
                    )}

                    {q.type==="BOOLEAN" && (
                      <select value={v??""} onChange={e=>setValue(q.id, e.target.value===""?null: e.target.value==="true")}>
                        <option value="">{tUI("Select")}</option>
                        <option value="true">{tUI("Yes")}</option>
                        <option value="false">{tUI("No")}</option>
                      </select>
                    )}

                    {q.type==="SINGLE_CHOICE" && (
                      <div className="flex flex-wrap gap-2">
                        {(q.options||[]).map(opt=>(
                          <button
                            key={opt} type="button"
                            onClick={()=>setValue(q.id,opt)}
                            className={`h-9 px-3 rounded-md border ${v===opt ? "border-violet-500 btn-primary h-10 px-4 disabled:opacity-60" : "border-neutral-300 bg-white text-black"}`}
                          >
                            {translateLabel(opt)}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type==="MULTI_CHOICE" && (
                      <div className="flex flex-wrap gap-2">
                        {(q.options||[]).map(opt=>{
                          const active = Array.isArray(v) && v.includes(opt);
                          return (
                            <button
                              key={opt} type="button"
                              onClick={()=>toggleMulti(q.id,opt)}
                              className={`h-9 px-3 rounded-md border ${active ? "border-violet-500 btn-primary h-10 px-4 disabled:opacity-60" : "border-neutral-300 bg-white text-black"}`}
                            >
                              {translateLabel(opt)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary h-10 px-4"
          >
            {tUI("Back")}
          </button>
          <button
            disabled={saving!=="idle" || requiredMissing.length>0}
            onClick={submit}
            className="btn-primary h-10 px-4 disabled:opacity-60"
            title={requiredMissing.length>0 ? tUI("Complete required") : ""}
          >
            {tUI("Submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
