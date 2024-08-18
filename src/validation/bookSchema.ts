import { z } from 'zod'

export const createBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  year: z.number().int().min(0)
})

export const updateBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  year: z.number().int().min(0)
})
