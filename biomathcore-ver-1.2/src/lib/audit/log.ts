import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function auditLogOptional(
  userId: string | null | undefined,
  action: string,
  meta?: Prisma.InputJsonValue
) {
  if (!userId) return;
  await prisma.accessLog.create({
    data: { userId, action, meta: meta ?? undefined },
  });
}
