import { PrismaClient, User } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
  request: Request
  user: User | null
}
