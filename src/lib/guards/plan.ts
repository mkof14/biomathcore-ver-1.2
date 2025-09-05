import { prisma } from "@/lib/prisma";

export async function ensurePlan(userId: string, type: "core" | "sexual_health" | "longevity") {
  const plan = type === "core" ? null : type === "sexual_health" ? "sexual_health" : "longevity";
  if (!plan) return true;
  const has = await prisma.subscription.findFirst({ where: { userId, plan, status: "active" } });
  return !!has;
}
