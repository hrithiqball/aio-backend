import { Elysia } from 'elysia'
import { queue } from '../libs/queue'
import { createJobSchema } from '../validation/queueJob'

export const queueController = (app: Elysia) => {
  app.group('/q', (app) =>
    app.post('/jobs', async ({ body }) => {
      const parsed = createJobSchema.safeParse(body)
      if (!parsed.success) {
        return { success: false, errors: parsed.error.format() }
      }

      const { title, content } = parsed.data
      const job = await queue.add('myJob', { title, content })
      return { jobId: job.id }
    })
  )

  return app
}
