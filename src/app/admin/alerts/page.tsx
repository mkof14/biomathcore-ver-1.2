"use client";
import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { Panel } from "@/components/admin/NasaUI";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Alerts" desc="Policy-driven alerts and escalations." />
      <Panel title="Current Alerts" tone="amber">
        <div className="text-sm text-neutral-300">No active alerts.</div>
      </Panel>
    </div>
  );
}
