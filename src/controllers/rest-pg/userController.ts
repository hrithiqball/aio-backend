import prisma from '@/libs/prisma'
import { loginSchema, signupSchema } from '@/validation/authSchema'
import argon2 from 'argon2'
import { env } from 'bun'
import { Elysia } from 'elysia'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY || 'secret')

export const authController = (app: Elysia) => {
  app.group('/api', (app) =>
    app
      .post('/signup', async ({ body }) => {
        const parsed = signupSchema.safeParse(body)
        if (!parsed.success) {
          return { success: false, errors: parsed.error.format() }
        }

        const { email, password, name } = parsed.data
        const passwordHash = await argon2.hash(password)

        const result = await prisma.user.create({
          data: {
            email,
            passwordHash,
            name
          }
        })

        return { success: true, id: result.id }
      })
      .post('/login', async ({ body }) => {
        const parsed = loginSchema.safeParse(body)
        if (!parsed.success) {
          return { success: false, errors: parsed.error.format() }
        }

        const { email, password } = parsed.data
        const user = await prisma.user.findFirst({ where: { email } })

        if (!user || !(await argon2.verify(user.passwordHash, password))) {
          return { success: false, message: 'Invalid email or password' }
        }

        const token = await new SignJWT({ id: user.id })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('2h')
          .sign(SECRET_KEY)

        await prisma.session.create({
          data: {
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
          }
        })

        return { success: true, token }
      })
      .post('/logout', async ({ headers }) => {
        const token = headers.authorization?.split(' ')[1]
        if (!token) {
          return { success: false, message: 'Invalid token' }
        }

        await prisma.session.delete({ where: { token } })
      })
  )

  return app
}
