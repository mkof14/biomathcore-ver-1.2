import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserPlans, isAdmin } from "@/lib/entitlements";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = isAdmin() || url.searchParams.get("admin") === "1";

  const plans = await getUserPlans("dev-user");
  const rows = await prisma.form.findMany({
    select: {
      slug:true, title:true, category:true,
      status:true, visibility:true, gates:true,
      sensitive:true, anonymousAllowed:true,
      createdAt:true, updatedAt:true
    },
    orderBy: [{ createdAt: "desc" }]
  });

  const data = admin ? rows : rows.filter(f => {
    if (f.visibility === "PUBLIC") return true;
    if (f.visibility === "PLAN_GATED") {
      const gates = f.gates || [];
      return gates.some(g => (plans as any).includes(g));
    }
    return false; // INVITE_ONLY — скрываем
  });

  return NextResponse.json({ data });
}
