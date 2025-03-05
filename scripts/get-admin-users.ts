import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log('Admin users:')
    console.log(JSON.stringify(adminUsers, null, 2))
  } catch (error) {
    console.error('Error fetching admin users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
