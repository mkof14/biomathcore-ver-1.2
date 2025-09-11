'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Member Zone</h1>
      <p className="text-sm opacity-80">
        Demo build: главная страница зоны участника упрощена, чтобы исключить рантайм-ошибки.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><Link href="/member-zone/dashboard">Dashboard</Link></li>
        <li><Link href="/member-zone/account">Account</Link></li>
        <li><Link href="/member-zone/analytics">Analytics</Link></li>
        <li><Link href="/member-zone/voice">Voice</Link></li>
      </ul>
    </main>
  );
}
