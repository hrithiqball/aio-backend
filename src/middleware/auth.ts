import { verify } from '@/libs/auth'
import prisma from '@/libs/prisma'
import { StatusMap } from 'elysia'

export const authMiddleware = async (c: {
  headers: Record<string, string | undefined>
  set: { status: number | keyof StatusMap | undefined; headers: Record<string, string | undefined> }
  request: Request
}) => {
  let token: string | undefined

  if (c.headers.authorization && c.headers.authorization.startsWith('Bearer')) {
    try {
      token = c.headers.authorization.split(' ')[1]
      const decoded = await verify(token)

      if (!decoded || !decoded.id) {
        c.set.status = 401
        console.log('no decoded')
        throw new Error('Not authorized, Invalid token!')
      }

      const user = await prisma.user.findFirst({ where: { id: decoded.id } })

      if (!user) {
        c.set.status = 401
        throw new Error('Not authorized, Invalid token!')
      }

      c.request.headers.set('userId', user.id.toString())
    } catch (error) {
      c.set.status = 401
      throw new Error('Not authorized, Invalid token!')
    }
  } else {
    c.set.status = 401
    throw new Error('Not authorized, Invalid token!')
  }
}
