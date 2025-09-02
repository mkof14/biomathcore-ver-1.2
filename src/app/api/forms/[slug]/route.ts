import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserPlans, canSeeForm, isAdmin } from "@/lib/entitlements";

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // await обязателен для динамических API-роутов
  const url = new URL(req.url);
  const admin = isAdmin() || url.searchParams.get("admin") === "1";

  const userId = "dev-user"; // TODO: auth
  const plans = await getUserPlans(userId);

  const form = await prisma.form.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, category: true,
      visibility: true, gates: true, sensitive: true, anonymousAllowed: true,
      sections: {
        orderBy: { order: "asc" },
        select: {
          id: true, title: true, order: true,
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true, label: true, type: true, required: true,
              sensitivity: true, options: true,
            }
          }
        }
      }
    }
  });

  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  if (!admin && !canSeeForm(form as any, plans)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  return NextResponse.json({ data: form });
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // await обязателен
  const { answers, anonymous } = await req.json() as { answers: Record<string, any>, anonymous?: boolean };

  const userId = anonymous ? null : "dev-user"; // TODO: auth
  const plans = await getUserPlans(userId || "dev-user");

  const form = await prisma.form.findUnique({
    where: { slug },
    select: { id: true, visibility: true, gates: true, anonymousAllowed: true }
  });

  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canSeeForm(form as any, plans)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const instance = await prisma.formInstance.create({
    data: {
      formId: form.id,
      userId,
      isAnonymous: !!anonymous,
      status: "SUBMITTED",
      answers: {
        create: Object.entries(answers || {}).map(([questionId, value]) => ({ questionId, value }))
      }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, instanceId: instance.id });
}
