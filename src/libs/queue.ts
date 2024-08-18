import { Queue, RedisOptions, Worker } from 'bullmq'
import { Redis } from 'ioredis'

const redisConnection: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
}

const connection = new Redis(redisConnection)

export const queue = new Queue('myQueue', { connection })
export const worker = new Worker(
  'myQueue',
  async (job) => {
    console.log(job.data)
  },
  { connection }
)
