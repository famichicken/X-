import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.warn("DATABASE_URL not set, database features disabled");
      return null;
    }
    const adapter = new PrismaLibSQL({ url });
    return new PrismaClient({ adapter });
  } catch (e) {
    console.warn("Failed to initialize Prisma:", e);
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma;
