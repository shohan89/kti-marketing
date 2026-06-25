// Patch generated Prisma client to use the smaller WASM query compiler.
// The "fast" compiler (4.7 MB base64) exceeds the Cloudflare Workers free plan limit.
// The "small" compiler (2.4 MB base64) compresses to ~750 KB, staying within budget.
// This script runs automatically after `prisma generate` via the postgenerate hook.
const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '../src/generated/prisma/internal/class.ts')
let content = fs.readFileSync(file, 'utf8')
const patched = content.replaceAll('query_compiler_fast_bg', 'query_compiler_small_bg')
if (patched === content) {
  console.log('[patch-prisma] Already patched or pattern not found — nothing to do.')
} else {
  fs.writeFileSync(file, patched)
  console.log('[patch-prisma] Switched query compiler: fast → small')
}
