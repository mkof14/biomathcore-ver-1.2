import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  image: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
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

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad(400, "INVALID_JSON");
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return bad(400, "INVALID_INPUT", { issues: parsed.error.issues });
  }

  const { name, image } = parsed.data;

  const user = await prisma.user.update({
    where: { email: session.user.email.toLowerCase() },
    data: { name, image: image ?? undefined },
    select: { id: true, email: true, name: true, image: true },
  });

  return ok({ ok: true, user });
}

export {};
