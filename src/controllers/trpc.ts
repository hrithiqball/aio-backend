import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()
const p = t.procedure

export const router = t.router({
  // TODO: fix this issue
  greet: p
    // .input(
    //   z.object({
    //     bro: z.string()
    //   })
    // )
    .mutation(async (opts) => {
      const { rawInput } = opts
      console.log(rawInput.input)
      return `Hello ${rawInput.input || 'world'}`
    })
})
