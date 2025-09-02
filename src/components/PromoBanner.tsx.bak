"use client";
import AskAiButton from "@/components/AskAiButton";
import React from "react";

type PromoBannerProps = {
  id?: string;
  className?: string;
};

/**
 * PromoBanner
 * - Darker theme version
 * - Uses AskAiButton for consistent assistant trigger
 */
export default function PromoBanner({ id, className }: PromoBannerProps) {
  return (
    <section
      id={id}
      className={[
        // layout
        "mx-auto max-w-7xl px-4 sm:px-6 mb-10",
        // wrapper
        "rounded-2xl overflow-hidden border",
        // darker gradient background
        "bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900",
        "border-white/10",
        // shadow
        "shadow-[0_10px_30px_rgba(0,0,0,0.6)]",
        className || "",
      ].join(" ")}
      aria-label="AI Assistant promo"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 sm:p-6">
        {/* Text block */}
        <div className="text-center md:text-left">
          <h3 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
            Get answers in seconds — try the AI Health Assistant
          </h3>
          <p className="text-white/80 text-sm sm:text-base mt-1">
            Ask anything about sleep, training, nutrition, recovery, and more.
            Practical, actionable, and fast.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center md:justify-end">
          <AskAiButton />
        </div>
      </div>
    </section>
  );
}
