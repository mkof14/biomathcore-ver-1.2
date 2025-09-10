"use client";
import React, { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

/** Заготовка для статуса системы (можно подключить реальные healthchecks позже). */
export default function StatusPage() {
  const [now, setNow] = useState<string>("");
  useEffect(() => { setNow(new Date().toISOString()); }, []);
  return (
    <SectionCard title="System Status" descr="Текущие показатели и uptime (stub)">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="admin-card p-3">
          <div className="kicker">Server time</div>
          <div className="text-lg font-semibold">{now || "—"}</div>
        </div>
        <div className="admin-card p-3">
          <div className="kicker">Uptime</div>
          <div className="text-lg font-semibold">stub</div>
        </div>
        <div className="admin-card p-3">
          <div className="kicker">Next build</div>
          <div className="text-lg font-semibold">stub</div>
        </div>
      </div>
    </SectionCard>
  );
}
