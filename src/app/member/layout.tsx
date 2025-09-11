'use client';

import React from 'react';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </div>
    </div>
  );
}
