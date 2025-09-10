"use client";
// src/components/ServiceModal.tsx
import React from "react";
import { X } from "lucide-react";

type ServiceLite = {
  title: string;
  description?: string;
  icon?: string;
  [k: string]: any;
};

type Props = {
  service: ServiceLite | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ServiceModal({ service, isOpen, onClose }: Props) {
  if (!isOpen || !service) return null;

  const actions = [
    { name: "Generate", hint: "Run AI action" },
    { name: "Copy", hint: "Copy result to clipboard" },
    { name: "Print", hint: "Print current view" },
    { name: "Email", hint: "Send via email" },
    { name: "PDF", hint: "Export as PDF" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-2xl ring-1 ring-black/10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 dark:bg-white/10 text-2xl select-none">
              {service.icon ?? "🧩"}
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">
                {service.title}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Quick preview & actions
              </p>
            </div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            {service.description ?? "No description provided."}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {actions.map((a) => (
              <button
                key={a.name}
                title={a.hint}
                className="rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
                onClick={() => {
                  // Placeholder. Wire up to your real handlers or /api calls later.
                  console.log(`[ServiceModal] ${a.name} clicked`);
                }}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t border-black/10 dark:border-white/10">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
