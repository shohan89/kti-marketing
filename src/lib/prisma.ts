import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { Pool as PgPool, PoolConfig } from 'pg'
// pg-cloudflare ships no type declarations; borrow pg's types for type safety.
// At runtime this uses cloudflare:sockets (native TCP) instead of Node.js net/tls.
import pgCloudflare from 'pg-cloudflare'
const CloudflarePool = pgCloudflare as unknown as new (config: PoolConfig) => PgPool

let _client: PrismaClient | undefined

function getClient(): PrismaClient {
  if (_client) return _client
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  const pool = new CloudflarePool({ connectionString })
  _client = new PrismaClient({ adapter: new PrismaPg(pool) } as never)
  return _client
}

// Lazy proxy: the real PrismaClient is instantiated on first property access,
// which happens inside a request handler (after Cloudflare env vars are in process.env).
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getClient() as object, prop)
  },
})
