"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PulseIcon from "@/components/ai/PulseIcon";

export default function PulseLauncher() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    );
}
