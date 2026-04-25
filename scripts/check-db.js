const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const products = await prisma.product.count();
    const additions = await prisma.addition.count();
    const guides = await prisma.meatGuide.count();
    console.log('--- DB STATS ---');
    console.log('Products:', products);
    console.log('Additions:', additions);
    console.log('Guides:', guides);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
