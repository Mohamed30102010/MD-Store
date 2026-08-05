import { PrismaClient } from "@/app/generated/prisma/client";

// Postgres — الاتصال بيتحدد من DATABASE_URL في .env، مفيش داعي لأي adapter.
function makeClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Singleton عشان ما نفتحش اتصالات كتير في وضع التطوير (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
