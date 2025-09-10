export function getDevUserIdFromHeaders(req: Request): string | null {
  try {
    const raw = req.headers.get("cookie") || "";
    if (!raw) return null;
    for (const kv of raw.split(/;\s*/)) {
      const i = kv.indexOf("=");
      if (i === -1) continue;
      const k = kv.slice(0, i);
      const v = kv.slice(i + 1);
      if (k === "bmc_dev_user") return decodeURIComponent(v || "");
    }
    return null;
  } catch {
    return null;
  }
}
