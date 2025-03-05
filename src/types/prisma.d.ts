import { User as PrismaUser } from '@prisma/client'

declare global {
  type User = PrismaUser & {
    password: string
    role: string
  }
}
