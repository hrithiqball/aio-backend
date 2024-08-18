import { gql } from '@elysiajs/apollo'
import { Context } from '../types/context'

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
    posts: [Post]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createPost(title: String!, content: String!, userId: Int!): Post
  }
`

export const resolvers = {
  Query: {
    users: async (_parent: any, _args: any, context: Context) => {
      return context.prisma.user.findMany()
    },
    posts: async (_parent: any, _args: any, context: Context) => {
      return context.prisma.post.findMany()
    }
  },

  Mutation: {
    createUser: async (_parent: any, args: any, context: Context) => {
      return context.prisma.user.create({
        data: {
          name: args.name,
          email: args.email
        }
      })
    },
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
