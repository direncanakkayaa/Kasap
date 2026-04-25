const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const phone = process.argv[2];
  if (!phone) {
    console.log("Usage: node set-admin.js <phone>");
    return;
  }

  const user = await prisma.user.update({
    where: { phone },
    data: { role: 'ADMIN' },
  });

  console.log(`User ${user.name} (${user.phone}) is now an ADMIN.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
