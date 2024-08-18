import { Context } from '@/types/context'
import { gql } from '@elysiajs/apollo'

export const typeDefs = gql`
  type User {
    id: Int!
    name: String
    email: String
  }

  type Post {
    id: Int!
    title: String
    content: String
    userId: Int
  }

  type Query {
    users: [User]
    user(id: Int!): User
    posts: [Post]
  }

  type Mutation {
    createPost(title: String!, content: String!, userId: Int!): Post
  }
`

export const resolvers = {
  Query: {
    user: async (_parent: any, args: { id: number }, context: Context) => {
      const { id } = args
      return context.prisma.user.findFirst({
        where: {
          id
        }
      })
    },
    users: async (_parent: any, _args: any, context: Context) => {
      return context.prisma.user.findMany()
    },
    posts: async (_parent: any, _args: any, context: Context) => {
      return context.prisma.post.findMany()
    }
  },

  Mutation: {
    createPost: async (_parent: any, args: any, context: Context) => {
      return context.prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          userId: args.userId
        }
      })
    }
  }
}
