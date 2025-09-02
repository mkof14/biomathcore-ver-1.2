"use client";
// src/components/member/ProtectedGate.tsx
import React, { useEffect, useState } from "react";

export default function ProtectedGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ok, setOk] = useState<null | boolean>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Very naive check: if subscription endpoint is accessible while logged in,
        // consider user "member". Replace with your own logic (NextAuth session + role/tier).
        const res = await fetch("/api/user/subscription");
        setOk(alive ? res.status !== 401 : null);
      } catch {
        setOk(alive ? false : null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (ok === null) return <p>Loading…</p>;
  if (!ok) return <p>Access denied. Please sign in and subscribe.</p>;
  return <>{children}</>;
}
