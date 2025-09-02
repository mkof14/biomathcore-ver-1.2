// src/lib/logger.ts

/**
 * Tiny logger with per-request correlation id.
 * No external deps; safe for server-only usage.
 */

function randomId() {
  // 16-hex chars pseudo-uuid (good enough for logs)
  return [...crypto.getRandomValues(new Uint8Array(8))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  readonly id: string;

  constructor(id?: string) {
    this.id = id || randomId();
  }

  private fmt(level: LogLevel, msg: string, data?: unknown) {
    const base = `[req:${this.id}] [${level.toUpperCase()}] ${msg}`;
    if (data === undefined) return base;
    try {
      return `${base} :: ${JSON.stringify(data)}`;
    } catch {
      return `${base} :: <unserializable>`;
    }
  }

  debug(msg: string, data?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.fmt("debug", msg, data));
    }
  }
  info(msg: string, data?: unknown) {
    console.info(this.fmt("info", msg, data));
  }
  warn(msg: string, data?: unknown) {
    console.warn(this.fmt("warn", msg, data));
  }
  error(msg: string, data?: unknown) {
    console.error(this.fmt("error", msg, data));
  }
}

/** Factory from an incoming Request (can pick up x-request-id in future) */
export function loggerFromRequest(): Logger {
  return new Logger();
}
