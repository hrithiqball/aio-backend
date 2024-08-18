import { authMiddleware } from '@/middleware/auth'
import { createBookSchema, updateBookSchema } from '@/validation/bookSchema'
import { Elysia } from 'elysia'
import { ObjectId } from 'mongodb'
import { db } from '@/libs/mongo'

export const bookController = (app: Elysia) => {
  const booksCollection = db.collection('books')

  app.group('/api/books', (app) =>
    app
      .post('/', async ({ body }) => {
        const parsed = createBookSchema.safeParse(body)
        if (!parsed.success) {
          return { success: false, errors: parsed.error.format() }
        }

        const result = await booksCollection.insertOne(parsed.data)
        return { success: true, id: result.insertedId }
      })
      .get(
        '/',
        async () => {
          const books = await booksCollection.find().toArray()
          return books
        },
        {
          beforeHandle: async (c) => {
            await authMiddleware({
              headers: c.headers,
              set: { status: c.set.status, headers: c.set.headers },
              request: c.request
            })
          }
        }
      )
      .get('/:id', async ({ params }) => {
        const book = await booksCollection.findOne({ _id: new ObjectId(params.id) })
        return book
      })
      .put('/:id', async ({ params, body }) => {
        const parsed = updateBookSchema.safeParse(body)
        if (!parsed.success) {
          return { success: false, errors: parsed.error.format() }
        }

        await booksCollection.updateOne({ _id: new ObjectId(params.id) }, { $set: parsed.data })
        return { success: true }
      })
      .delete('/:id', async ({ params }) => {
        await booksCollection.deleteOne({ _id: new ObjectId(params.id) })
        return { success: true }
      })
  )

  return app
}
