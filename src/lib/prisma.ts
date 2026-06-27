import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import Pool from 'pg-cloudflare'

let _client: PrismaClient | undefined

function getClient(): PrismaClient {
  if (_client) return _client
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  // Use pg-cloudflare Pool so Cloudflare Workers uses cloudflare:sockets (native TCP)
  // instead of relying on pg's Node.js net/tls modules being polyfilled by nodejs_compat.
  // pg-cloudflare falls back to standard pg behaviour in local Node.js dev.
  const pool = new Pool({ connectionString })
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
