// @ts-nocheck
"use client";
import { useEffect, useRef } from "react";

/** Simple polling hook. Calls fn every `ms` while `enabled` is true. */
export function usePoll(fn: () => void, ms: number, enabled = true) {
  const saved = useRef(fn);
  useEffect(() => { saved.current = fn; }, [fn]);
  useEffect(() => {
    if (!enabled || ms <= 0) return;
    const id = setInterval(() => saved.current?.(), ms);
    return () => clearInterval(id);
  }, [ms, enabled]);
}
