import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const users = [
    { email: 'admin@example.nl', password: 'admin123' },
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
