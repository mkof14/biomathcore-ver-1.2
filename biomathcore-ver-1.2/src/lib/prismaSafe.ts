/**
 * Safe prisma import that won't throw in environments where @prisma/client
 * is not generated yet. Do not rely on this for migrations; only for counts.
 */
let prismaSafe: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client");
  prismaSafe = new PrismaClient();
} catch {
  prismaSafe = {
    user: { count: async () => 0 },
  };
}
export { prismaSafe };
