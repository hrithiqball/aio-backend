import { apollo } from '@elysiajs/apollo'
import { cors } from '@elysiajs/cors'
import { env } from 'bun'
import { Elysia } from 'elysia'
import { resolvers, typeDefs } from './controllers/graphqlController'
import { connectToMongo } from './libs/mongo'
import prisma from './libs/prisma'
import { Context } from './types/context'
import bookController from './controllers/mongo/bookController'

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
      context: async (): Promise<Context> => ({ prisma })
    })
  )
  .use(bookController)
  .listen(PORT)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
