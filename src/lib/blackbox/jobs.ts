// src/lib/blackbox/jobs.ts
import { randomUUID } from "crypto";

export type BlackBoxJobStatus =
  | "queued"
  | "running"
  | "done"
  | "error"
  | "canceled";

export interface BlackBoxJob {
  id: string;
  userKey: string; // opaque identifier (e.g., user id or email); we use "anon" for now
  status: BlackBoxJobStatus;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  // optional payload/result
  params?: Record<string, unknown>;
  result?: { summary: string; insights?: string[] } | null;
  error?: string | null;
}

type JobTimers = {
  runTimer?: NodeJS.Timeout;
  finishTimer?: NodeJS.Timeout;
};

const JOBS = new Map<string, BlackBoxJob>();
const TIMERS = new Map<string, JobTimers>();

// Helper to update job with timestamp
function setJob(job: BlackBoxJob) {
  job.updatedAt = Date.now();
  JOBS.set(job.id, job);
}

export function listJobs(userKey: string): BlackBoxJob[] {
  return [...JOBS.values()]
    .filter((j) => j.userKey === userKey)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getJob(id: string): BlackBoxJob | undefined {
  return JOBS.get(id);
}

export function createJob(
  userKey: string,
  params?: Record<string, unknown>,
): BlackBoxJob {
  const id = randomUUID();
  const now = Date.now();
  const job: BlackBoxJob = {
    id,
    userKey,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    params: params || {},
    result: null,
    error: null,
  };

  setJob(job);

  // Simulate async pipeline:
  //  - after 800ms → running
  //  - after 2.5s more → done with a mock result
  const runTimer = setTimeout(() => {
    const j = JOBS.get(id);
    if (!j || j.status !== "queued") return;
    j.status = "running";
    setJob(j);
  }, 800);

  const finishTimer = setTimeout(() => {
    const j = JOBS.get(id);
    if (!j || (j.status !== "running" && j.status !== "queued")) return;
    j.status = "done";
    j.result = {
      summary: "Analysis complete. Your vitals look good overall.",
      insights: [
        "HRV trending upward last 7 days",
        "Sleep & Recovery efficiency slightly below optimal on weekdays",
        "Consider increasing hydration and light exposure before noon",
      ],
    };
    setJob(j);
  }, 3300);

  TIMERS.set(id, { runTimer, finishTimer });
  return job;
}

export function cancelJob(id: string): BlackBoxJob | undefined {
  const j = JOBS.get(id);
  if (!j) return undefined;

  const timers = TIMERS.get(id);
  if (timers?.runTimer) clearTimeout(timers.runTimer);
  if (timers?.finishTimer) clearTimeout(timers.finishTimer);
  TIMERS.delete(id);

  if (j.status === "done" || j.status === "error") return j;
  j.status = "canceled";
  setJob(j);
  return j;
}

export function clearJobs(userKey: string): number {
  const ids = [...JOBS.values()]
    .filter((j) => j.userKey === userKey)
    .map((j) => j.id);
  ids.forEach((id) => cancelJob(id));
  ids.forEach((id) => JOBS.delete(id));
  return ids.length;
}
