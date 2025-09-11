import { NextResponse } from "next/server";
import { rangeUTC, formatUSD } from "@/lib/control/date";
import { sumPaymentIntents, countPaymentIntents, sumRefunds, countRefunds, countActiveSubscriptions } from "@/lib/control/stripe";

function toPct(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return (n * 100).toFixed(1) + "%";
}

function safeDiv(n: number, d: number): number {
  if (!d) return 0;
  return n / d;
}

export async function GET() {
  try {
    const d = rangeUTC("day");
    const m = rangeUTC("month");
    const y = rangeUTC("year");

    const [
      salesDay, salesMonth, salesYear,
      refundsDay, refundsMonth, refundsYear,
      ordersDay, ordersMonth,
      refundsCountDay, refundsCountMonth,
      activeSubs
    ] = await Promise.all([
      sumPaymentIntents(d),
      sumPaymentIntents(m),
      sumPaymentIntents(y),
      sumRefunds(d),
      sumRefunds(m),
      sumRefunds(y),
      countPaymentIntents(d),
      countPaymentIntents(m),
      countRefunds(d),
      countRefunds(m),
      countActiveSubscriptions(),
    ]);

    const aovMonthCents = safeDiv(salesMonth, Math.max(ordersMonth, 1));
    const refundRateMonth = safeDiv(refundsMonth, Math.max(salesMonth, 1));
    const arpuMonthCents = safeDiv(salesMonth, Math.max(activeSubs, 1));

    return NextResponse.json({
      sales: {
        day:   { cents: salesDay,   label: formatUSD(salesDay) },
        month: { cents: salesMonth, label: formatUSD(salesMonth) },
        year:  { cents: salesYear,  label: formatUSD(salesYear) },
        orders: {
          day: ordersDay,
          month: ordersMonth,
        },
      },
      refunds: {
        day:   { cents: refundsDay,   label: formatUSD(refundsDay),   count: refundsCountDay },
        month: { cents: refundsMonth, label: formatUSD(refundsMonth), count: refundsCountMonth },
        year:  { cents: refundsYear,  label: formatUSD(refundsYear) },
      },
      kpis: {
        aovMonth: { cents: aovMonthCents, label: formatUSD(aovMonthCents) },
        refundRateMonth: toPct(refundRateMonth),
        arpuMonth: { cents: arpuMonthCents, label: formatUSD(arpuMonthCents) },
        activeSubscriptions: activeSubs,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "finance_error" }, { status: 500 });
  }
}

export {};
