"use client";
import React, { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

/** Страница проверки переменных окружения: показывает present/missing и умеет экспортировать .env */
export default function EnvHealthPage() {
  const [env, setEnv] = useState<{present:string[];missing:string[];total:number;checkedAt:string}|null>(null);
  const [envFilename, setEnvFilename] = useState(".env.local");

  const load = async () => {
    const h = await fetch("/api/admin/health/env").then(r => r.json());
    setEnv(h);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <SectionCard title="Env Health" descr="Отмечаем обязательные переменные окружения">
        {!env ? <div className="kicker">Checking…</div> : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="admin-card p-3">
                <div className="font-medium mb-2">Present ({env.present.length}/{env.total})</div>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {env.present.map(k => <li key={k} className="tag tag-ok">{k}</li>)}
                </ul>
              </div>
              <div className="admin-card p-3">
                <div className="font-medium mb-2">Missing ({env.missing.length}/{env.total})</div>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {env.missing.length ? env.missing.map(k => <li key={k} className="tag tag-bad">{k}</li>) : <li>—</li>}
                </ul>
              </div>
            </div>

            <div className="admin-card p-3 mt-4">
              <div className="font-medium mb-2">Export .env</div>
              <div className="flex gap-2 items-center">
                <input
                  aria-label="ENV filename to export"
                  title="Имя файла для экспорта (.env.local / .env.production / ...)"
                  className="px-3 py-2 rounded-xl border border-black/10"
                  value={envFilename}
                  onChange={e=>setEnvFilename(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  aria-label="Download .env file generated from secrets"
                  title="Соберёт .env из текущих секретов и скачает файл"
                  onClick={async ()=>{
                    const res = await fetch(`/api/admin/secrets/export?filename=${encodeURIComponent(envFilename)}`);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = envFilename || ".env.local";
                    document.body.appendChild(a); a.click(); a.remove();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export
                </button>
              </div>
              <div className="small mt-2">
                offline-способ: <code>node scripts/env-from-secrets.js .env.local</code>
              </div>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
