import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const password = 'admin123' // Verander dit naar een sterk wachtwoord
  
  try {
    const hashedPassword = await hash(password, 12)
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword
      },
      create: {
        email,
        password: hashedPassword,
        role: 'admin'
      }
    })
    
    console.log(`Admin gebruiker aangemaakt/bijgewerkt: ${user.email}`)
  } catch (error) {
    console.error('Fout bij aanmaken admin gebruiker:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
