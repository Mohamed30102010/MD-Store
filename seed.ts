import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { seedDatabase } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");
  const result = await seedDatabase(prisma);
  console.log(`✅ Done. Products: ${result.productsCount} — Admin: ${result.adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
