import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

let _client: PrismaClient | undefined

function getClient(): PrismaClient {
  if (_client) return _client
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  // nodejs_compat (compatibility_date >= 2024-09-23) provides native TLS for
  // outbound TCP in Cloudflare Workers. ssl.rejectUnauthorized=false bypasses
  // CA chain verification which may not be available in the Workers runtime.
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  _client = new PrismaClient({ adapter: new PrismaPg(pool) } as never)
  return _client
}

// Lazy proxy: PrismaClient is instantiated on first property access inside a
// request handler, after Cloudflare env vars are available in process.env.
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getClient() as object, prop)
  },
})
