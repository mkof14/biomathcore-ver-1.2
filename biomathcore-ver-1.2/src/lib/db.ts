// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

/**
 * Single PrismaClient instance for Next.js dev with HMR.
 * Not strictly required yet (we don't persist Black Box cases in this batch),
 * but ready for future use.
 */

declare global {
  // eslint-disable-next-line no-var
  var __PRISMA__: PrismaClient | undefined;
}

export const prisma =
  global.__PRISMA__ ??
  new PrismaClient({
    log: ["error", "warn"], // add "query" if you need debugging
  });

if (process.env.NODE_ENV !== "production") {
  global.__PRISMA__ = prisma;
}
