// File: PLACEHOLDER
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ok, bad } from "@/lib/apiResponse";
import { auth } from "@/lib/auth/server";

const prisma = new PrismaClient();

export async function DELETE(
  _req: NextRequest,
  ctx: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const id = ctx.params?.id;
  if (!id) return bad(400, "MISSING_ID");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  const device = await prisma.device.findFirst({
    where: { id, userId: user.id },
  });
  if (!device) return bad(404, "NOT_FOUND");

  await prisma.device.delete({ where: { id } });
  return ok({ deleted: true });
}
