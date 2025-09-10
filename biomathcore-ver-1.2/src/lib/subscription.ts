// src/lib/subscription.ts
import { prisma } from "@/lib/prisma";

export type SubscriptionSnapshot = {
  id: string;
  stripeSubscriptionId: string;
  stripePriceId: string | null;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

export async function getLatestSubscriptionByEmail(
  email: string,
): Promise<SubscriptionSnapshot> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      subscriptions: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          id: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          plan: true,
          status: true,
          currentPeriodEnd: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return user?.subscriptions?.[0] ?? null;
}
