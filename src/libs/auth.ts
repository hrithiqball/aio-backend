import { env } from 'bun'
import * as jose from 'jose'
import { JWT } from '../types/jwt'

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY || 'secret')

export const sign = async ({ data, exp = '7d' }: JWT) =>
  await new jose.SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(SECRET_KEY)

export const verify = async (jwt: string) => (await jose.jwtVerify(jwt, SECRET_KEY)).payload
