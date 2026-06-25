/**
 * Writes .env.production from process.env so that `opennextjs-cloudflare build`
 * can embed the values into next-env.mjs (the runtime fallback bundle).
 *
 * On local machines these vars come from .env.local (already read by OpenNext).
 * On the Cloudflare CI/CD server .env.local is absent, but the CI/CD Build
 * Variables are available in process.env — this script captures them.
 */
const fs = require('fs')
const path = require('path')

const VARS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'REVALIDATION_SECRET',
]

const lines = VARS.filter(k => process.env[k]).map(k => `${k}=${process.env[k]}`)

if (lines.length === 0) {
  console.log('[generate-env] No env vars in process.env — relying on .env.local')
  process.exit(0)
}

const dest = path.join(__dirname, '..', '.env.production')
fs.writeFileSync(dest, lines.join('\n') + '\n', 'utf8')
console.log(`[generate-env] Wrote .env.production with ${lines.length} variable(s)`)
