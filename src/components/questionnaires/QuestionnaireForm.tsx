"use client";
import { useMemo, useState } from "react";

type Question = {
  id: string;
  text: string;
  questionType: "TEXT"|"TEXTAREA"|"NUMBER"|"DATE"|"BOOLEAN"|"SINGLE_CHOICE"|"MULTI_CHOICE";
  isRequired: boolean;
  options?: string | null;
  order: number;
};

type Section = {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  questions: Question[];
};

export default function QuestionnaireForm({ slug, sections }: { slug: string; sections: Section[]; }) {
  const parsed = useMemo(() => {
    return sections.map(s => ({
      ...s,
      questions: s.questions
        .slice()
        .sort((a,b)=>a.order-b.order)
        .map(q => ({ ...q, _choices: q.options ? JSON.parse(q.options) as string[] : [] }))
    }));
  }, [sections]);

  const [values, setValues] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function setValue(qid: string, v: any) {
    setValues(prev => ({ ...prev, [qid]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const answers = Object.entries(values).map(([questionId, value]) => ({ questionId, value }));
      const res = await fetch(`/api/questionnaires/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to submit");
      setMsg("Saved. Thank you!");
    } catch (err: any) {
      setMsg(err.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {parsed.map((s) => (
        <section key={s.id} className="rounded-2xl border p-4 space-y-3">
          <div>
            <h3 className="font-medium">{s.title}</h3>
            {s.description && <p className="text-sm text-gray-600 dark:text-gray-400">{s.description}</p>}
          </div>
          <div className="space-y-4">
            {s.questions.map(q => (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-medium">{q.text}{q.isRequired ? " *" : ""}</label>
                {q.questionType === "TEXT" && (
                  <input className="w-full border rounded-lg px-3 py-2" onChange={e=>setValue(q.id, e.target.value)} />
                )}
                {q.questionType === "TEXTAREA" && (
                  <textarea className="w-full border rounded-lg px-3 py-2" rows={4} onChange={e=>setValue(q.id, e.target.value)} />
                )}
                {q.questionType === "NUMBER" && (
                  <input type="number" className="w-full border rounded-lg px-3 py-2" onChange={e=>setValue(q.id, e.target.valueAsNumber)} />
                )}
                {q.questionType === "DATE" && (
                  <input type="date" className="w-full border rounded-lg px-3 py-2" onChange={e=>setValue(q.id, e.target.value)} />
                )}
                {q.questionType === "BOOLEAN" && (
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" onChange={e=>setValue(q.id, e.target.checked)} />
                    <span className="text-sm">Yes</span>
                  </label>
                )}
                {q.questionType === "SINGLE_CHOICE" && (
                  <div className="space-y-1">
                    {q._choices?.map((c: string) => (
                      <label key={c} className="flex items-center gap-2">
                        <input type="radio" name={q.id} value={c} onChange={()=>setValue(q.id, c)} />
                        <span className="text-sm">{c}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.questionType === "MULTI_CHOICE" && (
                  <div className="space-y-1">
                    {q._choices?.map((c: string) => {
                      const list: string[] = values[q.id] || [];
                      const checked = list.includes(c);
                      return (
                        <label key={c} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e)=> {
                              const next = new Set(list);
                              e.target.checked ? next.add(c) : next.delete(c);
                              setValue(q.id, Array.from(next));
                            }}
                          />
                          <span className="text-sm">{c}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      <button disabled={busy} className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50">
        {busy ? "Saving..." : "Save"}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
