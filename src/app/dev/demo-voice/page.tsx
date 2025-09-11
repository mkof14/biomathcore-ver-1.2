'use client';

// @ts-nocheck
import { useState, useRef } from "react";
import EndpointBadge from "@/components/EndpointBadge";
import ActionBar from "@/components/ActionBar";

export default function DemoVoice() {
  const [text, setText] = useState("Hello from Voice mock");
  const audioRef = useRef<HTMLAudioElement>(null);

  async function play() {
    const res = await fetch("/api/voice/speak", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ text }) });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
  }

  return (
    <div className="p-6 space-y-4">
      <ActionBar title="Demo — Voice" extra={<EndpointBadge path="/api/voice/speak" />} />
      <div className="max-w-2xl space-y-2">
        <input className="w-full px-3 py-2 rounded border border-neutral-700 bg-black" value={text} onChange={e=>setText(e.target.value)} />
        <div className="flex items-center gap-2">
          <button onClick={play} className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800">Speak</button>
          <EndpointBadge path="/api/voice/health" />
        </div>
        <audio ref={audioRef} controls className="mt-2" />
      </div>
    </div>
  );
}
