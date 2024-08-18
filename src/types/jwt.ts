import { JWTPayload } from 'jose'

export type JWT = {
  data: JWTPayload
  exp?: string
}
