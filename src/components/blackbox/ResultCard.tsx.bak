"use client";
// src/components/blackbox/ResultCard.tsx
type Props = {
  result: {
    jobId: string;
    summary: string;
    score: number;
  };
};

export default function ResultCard({ result }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-4">
      <div className="text-sm text-zinc-400">Job</div>
      <div className="text-base mb-2">{result.jobId}</div>

      <div className="text-sm text-zinc-400">Summary</div>
      <div className="text-base mb-2">{result.summary}</div>

      <div className="text-sm text-zinc-400">Score</div>
      <div className="text-base">{result.score}</div>
    </div>
  );
}
