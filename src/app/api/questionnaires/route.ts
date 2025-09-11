import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const all = await prisma.questionnaire.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ priority: "asc" }, { title: "asc" }],
      include: {
        sections: { include: { questions: true } }
      }
    });

    const devShowAll = process.env.DEV_SHOW_ALL_QUESTIONNAIRES === "1";

    if (devShowAll) {
      return NextResponse.json(all);
    }

    if (!session || !session.user) {
      const publicOnly = all.filter(q => q.visibility === "PUBLIC");
      return NextResponse.json(publicOnly);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: { where: { status: "active" } } }
    });
    if (!user) return NextResponse.json([]);

    const userIsAdmin = user.role === "admin";
    const userPlans = user.subscriptions.map(s => s.plan).filter(Boolean) as string[];

    const allowed = all.filter(q => {
      if (userIsAdmin) return true;
      if (q.visibility === "PUBLIC") return true;
      if (q.visibility === "LOGGED_IN") return true;
      if (q.visibility === "PLAN_GATED") {
        if (!q.requiredPlans) return true;
        const req = q.requiredPlans.split(",").map(p => p.trim()).filter(Boolean);
        return req.some(r => userPlans.includes(r));
      }
      return false;
    });

    return NextResponse.json(allowed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export {};
