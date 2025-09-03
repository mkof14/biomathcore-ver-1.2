// File: PLACEHOLDER
import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/apiResponse";
import { auth } from "@/lib/auth/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return ok({ subscription: null });

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return ok({
    subscription: sub
      ? {
          id: sub.id,
          plan: sub.plan,
          status: sub.status,
          priceId: sub.stripePriceId,
          stripeSubscriptionId: sub.stripeSubscriptionId,
          currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
        }
      : null,
  });
}
