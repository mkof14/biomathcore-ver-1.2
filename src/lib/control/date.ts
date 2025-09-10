export type Range = { from: number; to: number };

function startOfUTC(unit: "day" | "month" | "year"): Date {
  const now = new Date();
  if (unit === "day") return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  if (unit === "month") return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  return new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0));
}

export function rangeUTC(unit: "day" | "month" | "year"): Range {
  const from = Math.floor(startOfUTC(unit).getTime() / 1000);
  const to = Math.floor(Date.now() / 1000);
  return { from, to };
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n / 100);
}
