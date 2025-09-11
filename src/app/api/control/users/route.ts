import { NextResponse } from "next/server";
import { getUserCounts } from "@/lib/control/users";
import { countActiveSubscriptions } from "@/lib/control/stripe";

export async function GET() {
  try {
    const [counts, activeSubs] = await Promise.all([getUserCounts(), countActiveSubscriptions()]);
    return NextResponse.json({
      users: {
        newToday: counts.newToday,
        month: counts.month,
        year: counts.year,
        total: counts.total,
      },
      subscriptions: { active: activeSubs },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "users_error" }, { status: 500 });
  }
}

export {};
