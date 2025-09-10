import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

function mapTypeToPlan(t: string) {
  if (t === "sexual_health") return ["sexual_health"];
  if (t === "longevity") return ["longevity","longevity_core"];
  return [];
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const ct = req.headers.get("content-type") || "";
  let type = "core";
  let payload: any = null;

  if (ct.includes("application/json")) {
    const body = await req.json().catch(()=> ({}));
    type = String(body.type || "core");
    payload = body;
  } else if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    type = String(fd.get("type") || "core");
    payload = Object.fromEntries(fd.entries());
  }

  const plans = mapTypeToPlan(type);
  if (plans.length) {
    const ok = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "active", plan: { in: plans } },
      select: { id: true },
    });
    if (!ok) return NextResponse.json({ error: "Plan required" }, { status: 403 });
  }

  const reqRow = await prisma.reportRequest.create({
    data: { userId: user.id, type, status: "QUEUED", payload: payload ? JSON.stringify(payload) : null },
  });

  const title = type === "core" ? "Critical Health Report" : type === "sexual_health" ? "General Sexual Longevity & Anti-Aging Report" : "Longevity & Anti-Aging Report";
  const markdown = `# ${title}\n\nGenerated at: ${new Date().toISOString()}\n\nUser: ${session.user.email}\nType: ${type}\n`;

  await prisma.report.create({
    data: { requestId: reqRow.id, userId: user.id, type, title, markdown },
  });

  await prisma.reportRequest.update({ where: { id: reqRow.id }, data: { status: "DONE" } });

  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/member-zone/reports", base), { status: 303 });
}
