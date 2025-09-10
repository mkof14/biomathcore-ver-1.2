import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

type AnswerPayload = { questionId: string; value: any };

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json().catch(() => ({}));
    const answers: AnswerPayload[] = Array.isArray(body?.answers) ? body.answers : [];

    const q = await prisma.questionnaire.findUnique({
      where: { slug },
      include: { sections: { include: { questions: true } } },
    });
    if (!q) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const session = await getServerSession(authOptions);
    const email = session?.user?.email || null;

    if (q.visibility === "LOGGED_IN" || q.visibility === "PLAN_GATED") {
      if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
      if (q.visibility === "PLAN_GATED") {
        const user = await prisma.user.findUnique({
          where: { email },
          include: { subscriptions: { where: { status: "active" } } },
        });
        const plans = new Set((user?.subscriptions || []).map(s => s.plan).filter(Boolean) as string[]);
        const reqPlans = (q.requiredPlans || "").split(",").map(s => s.trim()).filter(Boolean);
        const ok = reqPlans.length === 0 || reqPlans.some(p => plans.has(p));
        if (!ok) return NextResponse.json({ error: "Required plan not active" }, { status: 403 });
      }
    }

    if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const instance = await prisma.questionnaireInstance.create({
      data: { questionnaireId: q.id, userId: user.id, status: "IN_PROGRESS" },
    });

    const validQIds = new Set(q.sections.flatMap(s => s.questions.map(qq => qq.id)));
    const createAnswers = answers
      .filter(a => a && a.questionId && validQIds.has(a.questionId))
      .map(a => ({
        instanceId: instance.id,
        questionId: a.questionId,
        value: JSON.stringify(a.value ?? null),
      }));

    if (createAnswers.length > 0) {
      await prisma.answer.createMany({ data: createAnswers });
      await prisma.questionnaireInstance.update({
        where: { id: instance.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      });
    }

    return NextResponse.json({ ok: true, instanceId: instance.id, saved: createAnswers.length });
  } catch (error: any) {
    console.error("Submit failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
