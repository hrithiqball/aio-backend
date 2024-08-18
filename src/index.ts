import { resolvers, typeDefs } from '@/controllers/graphqlController'
import { bookController } from '@/controllers/mongo/bookController'
import { queueController } from '@/controllers/queueController'
import { authController } from '@/controllers/rest-pg/userController'
import { router } from '@/controllers/trpc'
import { connectToMongo } from '@/libs/mongo'
import prisma from '@/libs/prisma'
import { graphqlAuthMiddleware } from '@/middleware/auth'
import { apollo } from '@elysiajs/apollo'
import { cors } from '@elysiajs/cors'
import { trpc } from '@elysiajs/trpc'
import { env } from 'bun'
import { Elysia } from 'elysia'

const PORT = env.PORT

if (!PORT) {
  console.error('❌ Please provide a PORT in .env file')
  process.exit(1)
}

connectToMongo()

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello Elysia')
  .use(
    apollo({
      typeDefs,
      resolvers,
      context: async ({ request }) => {
        const user = await graphqlAuthMiddleware(request)
        return { prisma, request, user }
      }
    })
  )
  .use(trpc(router, { endpoint: '/trpc' }))
  .use(authController)
  .use(bookController)
  .use(queueController)
  .listen(PORT)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
