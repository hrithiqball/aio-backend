import { z } from 'zod'

export const createJobSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string().optional()
})
