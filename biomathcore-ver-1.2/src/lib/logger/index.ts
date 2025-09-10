type Level = "debug" | "info" | "warn" | "error";

function ts() { return new Date().toISOString(); }
function base(level: Level, msg: string, meta?: unknown) {
  const line = `[${ts()}] ${level.toUpperCase()} ${msg}` + (meta ? ` ${JSON.stringify(meta)}` : "");
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (msg: string, meta?: unknown) => base("debug", msg, meta),
  info:  (msg: string, meta?: unknown) => base("info",  msg, meta),
  warn:  (msg: string, meta?: unknown) => base("warn",  msg, meta),
  error: (msg: string, meta?: unknown) => base("error", msg, meta),
};
