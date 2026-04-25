export {};
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Kurban Rooms...')

  const animals = [
    { breed: 'Angus', totalKg: 420 },
    { breed: 'Simental', totalKg: 380 },
    { breed: 'Yerli Kara', totalKg: 300 },
    { breed: 'Limuzin', totalKg: 450 },
  ]

  for (const a of animals) {
    const animal = await prisma.animal.create({
      data: {
        breed: a.breed,
        totalKg: a.totalKg,
        status: 'BEKLEMEDE',
      },
    })

    console.log(`Created Animal: ${animal.breed} (${animal.id})`)

    // Create 7 shares for each animal
    for (let i = 1; i <= 7; i++) {
        // First animal has 3 shares sold
        let status = 'MUSAIT'
        let customerName = null
        if (a.breed === 'Angus' && i <= 3) {
            status = 'SATILDI'
            customerName = `Örnek Müşteri ${i}`
        }
        
        // Third animal is full
        if (a.breed === 'Yerli Kara') {
            status = 'SATILDI'
            customerName = `Örnek Müşteri ${i}`
        }

      await prisma.share.create({
        data: {
          animalId: animal.id,
          shareNumber: i,
          status: status,
          customerName: customerName,
          price: (a.totalKg > 400 ? 25000 : 20000), // example price
        },
      })
    }
    console.log(`  Created 7 Shares for ${animal.breed}`)
  }

  console.log('Kurban seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
