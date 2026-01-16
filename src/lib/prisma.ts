import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  process.env.VERCEL === "1"
    ? null
    : globalForPrisma.prisma ??
      new PrismaClient({
        log: ["error"],
      });

if (process.env.VERCEL !== "1") {
  globalForPrisma.prisma = prisma;
}
