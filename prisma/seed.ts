import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@viva-eularia.nl' },
    update: {},
    create: {
      email: 'admin@viva-eularia.nl',
      password: adminPassword,
      role: 'admin'
    }
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create example tour
  const tour = await prisma.tour.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Historische Stadswandeling',
      description: 'Ontdek de rijke geschiedenis van de stad tijdens deze boeiende wandeltour langs historische gebouwen en monumenten.',
      price: 25.0,
      duration: 2,
      location: 'Grote Markt, Amsterdam',
      maxPeople: 15,
      stops: {
        create: [
          {
            title: 'Koninklijk Paleis',
            description: 'Bezoek het prachtige Koninklijk Paleis op de Dam, een van de vier paleizen in Nederland die ter beschikking staan van de koning.',
            location: 'Dam, Amsterdam',
            startTime: '10:00',
            endTime: '10:30',
            order: 1
          },
          {
            title: 'Oude Kerk',
            description: 'De oudste nog bestaande gebouw van Amsterdam, gesticht rond 1213.',
            location: 'Oudekerksplein, Amsterdam',
            startTime: '10:45',
            endTime: '11:10',
            order: 2
          },
          {
            title: 'Begijnhof',
            description: 'Een van de oudste hofjes van Amsterdam, oorspronkelijk gesticht voor de begijnen, een katholieke zusterorde.',
            location: 'Begijnhof, Amsterdam',
            startTime: '11:25',
            endTime: '11:45',
            order: 3
          }
        ]
      }
    }
  })
  console.log(`Created example tour: ${tour.title}`)

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error('Error during seeding:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
