'use client';

// AUTO-FIX: wrap useSearchParams() with <Suspense>
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Content() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Checkout success</h1>
      <p className="mt-2">session_id: {sessionId ?? '—'}</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Content />
    </Suspense>
  );
}
