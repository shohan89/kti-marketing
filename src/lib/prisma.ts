import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { Pool as PgPool, PoolConfig } from 'pg'
// pg-cloudflare ships no TypeScript declarations.
// Its CommonJS module.exports = { Pool, Client, ... }, so the ESM default import
// gives us the whole exports object — Pool lives at .Pool, not on the default itself.
import pgCloudflare from 'pg-cloudflare'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CloudflarePool = (pgCloudflare as any).Pool as new (config: PoolConfig) => PgPool

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
