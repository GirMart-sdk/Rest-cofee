import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.menuItem.count();
  console.log(`count: ${count}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());