import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

let _client: PrismaClient | undefined

function getClient(): PrismaClient {
  if (_client) return _client
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  _client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as never)
  return _client
}

// Lazy proxy: the real PrismaClient is instantiated on first property access,
// which happens inside a request handler (after Cloudflare env vars are in process.env).
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getClient() as object, prop)
  },
})
