'use client';

import React, { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

/**  audit.log ( ~500 ). */
export default function LogsPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/logs");
        const txt = await (res.ok ? res.text() : Promise.reject(res.statusText));
        setLines(txt.split("\n").filter(Boolean).slice(-500));
      } catch (e:any) {
        setErr(String(e || "Failed to load"));
      }
    })();
  }, []);

  return (
    <SectionCard title="Audit Logs" descr="  (//   .)">
      {err ? <div className="small text-red-600">{err}</div> : (
        <pre className="admin-card p-3 text-xs overflow-auto max-h-[60vh] whitespace-pre-wrap">
{lines.join("\n")}
        </pre>
      )}
    </SectionCard>
  );
}
