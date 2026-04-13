// lib/prisma.ts
// Singleton do Prisma Client — evita múltiplas conexões em dev (hot reload).
// Em produção, cria-se apenas uma instância.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
