"use client";
import React, { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

/** Главная панель: быстрый обзор состояния */
export default function AdminDashboard() {
  const [env, setEnv] = useState<{present:string[];missing:string[];total:number;checkedAt:string}|null>(null);
  const [secretsCount, setSecretsCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        // Запрашиваем текущее состояние env-ключей
        const e = await fetch("/api/admin/health/env").then(r => r.json());
        setEnv(e);
      } catch {}
      try {
        // Считаем секреты (значения маскированы на бэке)
        const s = await fetch("/api/admin/secrets").then(r => r.json());
        setSecretsCount((s.items || []).length);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Secrets" descr="Общее количество управляемых ключей">
          <div className="text-2xl font-semibold">{secretsCount}</div>
          <div className="small mt-1">Total managed keys</div>
        </SectionCard>

        <SectionCard title="Env Present" descr="Сколько обязательных переменных окружения на месте">
          <div className="text-2xl font-semibold">{env ? env.present.length : "—"} / {env ? env.total : "—"}</div>
          <div className="small mt-1">Checked {env ? new Date(env.checkedAt).toLocaleString() : "—"}</div>
        </SectionCard>

        <SectionCard title="Quick Actions" descr="Частые переходы для админ-операций">
          <div className="mt-2 text-sm">
            <a href="/admin/secrets" className="underline">Manage Secrets</a> ·{" "}
            <a href="/admin/env" className="underline">Env Health</a> ·{" "}
            <a href="/admin/integrations" className="underline">Integrations</a>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Notes" descr="Лучшие практики безопасности">
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Никогда не храните полные номера карт и банковские пароли — используйте Stripe и токены.</li>
          <li>Регулярная ротация ключей. Минимальные привилегии для каждого интеграционного ключа.</li>
          <li>Для продакшена: облачный Secrets Manager + WebAuthn / TOTP, аудит в БД.</li>
        </ul>
      </SectionCard>
    </div>
  );
}
