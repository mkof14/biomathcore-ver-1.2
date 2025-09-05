"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type QuestionType =
  | "TEXT" | "TEXTAREA" | "NUMBER" | "DATE" | "BOOLEAN"
  | "SINGLE_CHOICE" | "MULTI_CHOICE";

type Question = {
  id: string;
  text: string;
  questionType: QuestionType;
  isRequired?: boolean;
  options?: string | null; // JSON string of choices if applicable
  _choices?: string[];     // populated at runtime from options
};

type Section = {
  id: string;
  title: string;
  description?: string | null;
  questions: Question[];
};

export default function QuestionnaireForm({
  slug,
  sections,
}: {
  slug: string;
  sections: Section[];
}) {
  const router = useRouter();

  // normalize choices once
  const normalized = useMemo(() => {
    return (sections || []).map((s) => ({
      ...s,
      questions: s.questions.map((q) => ({
        ...q,
        _choices: Array.isArray(q._choices)
          ? q._choices
          : (() => {
              try {
                const parsed = q.options ? JSON.parse(q.options) : [];
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })(),
      })),
    }));
  }, [sections]);

  // store values by question id
  const [values, setValues] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const setValue = (id: string, v: any) =>
    setValues((prev) => ({ ...prev, [id]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const payload = {
        answers: Object.entries(values).map(([questionId, value]) => ({
          questionId,
          value,
        })),
      };
      const res = await fetch(`/api/questionnaires/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Submit failed (${res.status})`);
      }
      setMsg("Saved");
      // refresh list and go back
      router.push("/member-zone/questionnaires");
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Back button */}
      

      {normalized.map((s) => (
        <section
          key={s.id}
          className="rounded-2xl border bg-white/[0.05] dark:bg-white/[0.04] backdrop-blur-sm p-4 md:p-6 space-y-4"
        >
          <div>
            <h2 className="text-xl font-semibold">{s.title}</h2>
            {s.description && (
              <p className="text-sm opacity-70">{s.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {s.questions.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border bg-white/[0.06] dark:bg-white/[0.06] p-3 md:p-4"
              >
                <label className="block text-sm font-medium mb-2">
                  {q.text} {q.isRequired ? "*" : ""}
                </label>

                {q.questionType === "TEXT" && (
                  <input
                    type="text"
                    className="w-full rounded-lg border bg-white/90 text-black px-3 py-2"
                    value={values[q.id] ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.questionType === "TEXTAREA" && (
                  <textarea
                    className="w-full rounded-lg border bg-white/90 text-black px-3 py-2 min-h-[120px]"
                    value={values[q.id] ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.questionType === "NUMBER" && (
                  <input
                    type="number"
                    className="w-full rounded-lg border bg-white/90 text-black px-3 py-2"
                    value={values[q.id] ?? ""}
                    onChange={(e) => setValue(q.id, e.target.valueAsNumber)}
                  />
                )}

                {q.questionType === "DATE" && (
                  <input
                    type="date"
                    className="w-full rounded-lg border bg-white/90 text-black px-3 py-2"
                    value={values[q.id] ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.questionType === "BOOLEAN" && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!values[q.id]}
                      onChange={(e) => setValue(q.id, e.target.checked)}
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                )}

                {q.questionType === "SINGLE_CHOICE" && (
                  <div className="space-y-1">
                    {q._choices?.map((c) => (
                      <label key={c} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={q.id}
                          checked={values[q.id] === c}
                          onChange={() => setValue(q.id, c)}
                        />
                        <span className="text-sm">{c}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.questionType === "MULTI_CHOICE" && (
                  <div className="space-y-1">
                    {q._choices?.map((c) => {
                      const list: string[] = values[q.id] || [];
                      const checked = list.includes(c);
                      return (
                        <label key={c} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
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

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50"
        >
          {busy ? "Saving..." : "Save"}
        </button>
        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </div>
    </form>
  );
}
