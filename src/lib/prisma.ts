import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// 🚨 DO NOT USE PRISMA ON VERCEL
const isProd = process.env.VERCEL === "1";

export const prisma = isProd
  ? null
  : global.prisma ?? new PrismaClient();

if (!isProd && !global.prisma) {
  global.prisma = prisma;
}
