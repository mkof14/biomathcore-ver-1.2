import { NextResponse } from "next/server";
import { isDevMock } from "@/lib/dev";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (isDevMock(req)) {
    const now = Date.now();
    const rows = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now - i * 1000*60*60*24*30);
      return {
        id: `inv_${String(1000+i)}`,
        amountCents: 1999,
        currency: "USD",
        status: i === 0 ? "open" : "paid",
        createdAt: d.toISOString(),
        hostedInvoiceUrl: `http://localhost:3000/member-zone/billing/invoice/${1000+i}`,
        invoicePdf: `http://localhost:3000/member-zone/billing/invoice/${1000+i}.pdf`,
      };
    });
    return NextResponse.json({ ok: true, data: rows }, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
