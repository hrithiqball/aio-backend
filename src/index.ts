import { env } from 'bun'
import { Elysia } from 'elysia'
import { apollo } from '@elysiajs/apollo'
import { typeDefs, resolvers } from './controllers/graphqlController'
import { Context } from './types/context'
import prisma from './libs/prisma'

const PORT = env.PORT

if (!PORT) {
  console.error('❌ Please provide a PORT in .env file')
  process.exit(1)
}

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(
    apollo({
      typeDefs,
      resolvers,
      context: async (): Promise<Context> => ({ prisma }),
      enablePlayground: true
    })
  )
  .listen(PORT)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
