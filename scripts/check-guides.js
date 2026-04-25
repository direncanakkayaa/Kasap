const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const guides = await prisma.meatGuide.findMany();
  console.log(JSON.stringify(guides, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
