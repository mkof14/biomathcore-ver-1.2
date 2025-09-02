// src/app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getServerSessionSafe, requireAuthRedirectURL } from "@/lib/auth";

const prisma = new PrismaClient();

function fmtDate(d?: Date | null) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));
  } catch {
    return d.toString();
  }
}

export default async function DashboardPage() {
  const session = await getServerSessionSafe();
  if (!session?.user?.email) {
    redirect(requireAuthRedirectURL());
  }

  const email = session.user!.email!.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/sign-in?reason=user-missing");
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      plan: true,
      status: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      currentPeriodEnd: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const currentPlan = subscription?.plan ?? "—";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Welcome back, {user?.name ?? user?.email}.
      </p>

      <section className="mt-6 rounded-xl border border-zinc-800/60 bg-black/40 p-6">
        <h2 className="text-lg font-medium">Subscription</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-zinc-400">Current Plan</div>
            <div className="text-base">{currentPlan}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Status</div>
            <div className="text-base">{subscription?.status ?? "—"}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Renews / Ends</div>
            <div className="text-base">
              {fmtDate(subscription?.currentPeriodEnd)}
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Stripe Subscription</div>
            <div className="text-base">
              {subscription?.stripeSubscriptionId ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <form action="/api/billing/portal" method="post">
            <button
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
              type="submit"
            >
              Manage Subscription
            </button>
          </form>
          <Link
            href="/pricing"
            className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
          >
            Change Plan
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800/60 bg-black/40 p-6">
        <h2 className="text-lg font-medium">Account</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-zinc-400">Email</div>
            <div className="text-base">{user?.email}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">User ID</div>
            <div className="text-base">{user?.id}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Created</div>
            <div className="text-base">{fmtDate(user?.createdAt)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
