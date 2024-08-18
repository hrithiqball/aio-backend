import { env } from 'bun'
import { MongoClient } from 'mongodb'

const MONGO_URI = env.MONGO_URI

if (!MONGO_URI) {
  console.error('❌ Please provide a MONGO_URI in .env file')
  process.exit(1)
}

const client = new MongoClient(MONGO_URI)

export const connectToMongo = async () => {
  try {
    await client.connect()
    console.log('🦊 Connected to MongoDB')
  } catch (error) {
    console.error('❌ Error connecting to MongoDB: ', error)
    process.exit(1)
  }
}

export const db = client.db(env.MONGO_DB_NAME)
