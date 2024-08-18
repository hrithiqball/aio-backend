import { env } from 'bun'
import * as jose from 'jose'
import { JWT } from '@/types/jwt'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY || 'secret')

export const sign = async ({ data, exp = '7d' }: JWT) =>
  await new jose.SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(SECRET_KEY)

export const verify = async (jwt: string) => {
  try {
    const { payload } = await jwtVerify(jwt, SECRET_KEY)
    return payload
  } catch (error) {
    console.error(error)
    throw new Error('Invalid token')
  }
}
