import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import bcrypt from "bcryptjs";

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(128),
});

function ok<T>(payload: T, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    status: init?.status ?? 200,
    headers: { "Content-Type": "application/json" },
  });
}
function bad(status: number, message: string, extra?: any) {
  return ok({ ok: false, error: message, ...(extra || {}) }, { status });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad(400, "INVALID_JSON");
  }

  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) {
    return bad(400, "INVALID_INPUT", { issues: parsed.error.issues });
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true, passwordHash: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  const hasPassword = !!user.passwordHash;
  if (hasPassword) {
    const okCurrent = await bcrypt.compare(currentPassword, user.passwordHash!);
    if (!okCurrent) return bad(400, "INVALID_CURRENT_PASSWORD");
  } else {
    if (currentPassword.trim() !== "") return bad(400, "NO_PASSWORD_SET");
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hash },
  });

  return ok({ ok: true });
}

export {};
