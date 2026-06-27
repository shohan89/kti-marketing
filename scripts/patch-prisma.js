// Patch generated Prisma client after `prisma generate`.
// Runs automatically via the postinstall / postgenerate hooks.
const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '../src/generated/prisma/internal/class.ts')
let content = fs.readFileSync(file, 'utf8')
let changed = false

// 1. Switch query compiler: fast (4.7 MB) → small (2.4 MB)
//    The fast compiler exceeds the Cloudflare Workers free-plan 3 MiB limit.
const patched1 = content.replaceAll('query_compiler_fast_bg', 'query_compiler_small_bg')
if (patched1 !== content) {
  content = patched1
  changed = true
  console.log('[patch-prisma] Switched query compiler: fast → small')
} else {
  console.log('[patch-prisma] Compiler already set to small — skipping')
}

// 2. Fix WASM instantiation for Cloudflare Workers.
//    Cloudflare Workers blocks synchronous `new WebAssembly.Module(buffer)` at
//    request time. `WebAssembly.compile(buffer)` is the async equivalent and is
//    always allowed. The surrounding function is already async so this is safe.
const patched2 = content.replace(
  'return new WebAssembly.Module(wasmArray)',
  'return WebAssembly.compile(wasmArray)'
)
if (patched2 !== content) {
  content = patched2
  changed = true
  console.log('[patch-prisma] Replaced new WebAssembly.Module → WebAssembly.compile')
} else {
  console.log('[patch-prisma] WebAssembly fix already applied — skipping')
}

if (changed) {
  fs.writeFileSync(file, content)
  console.log('[patch-prisma] Done')
} else {
  console.log('[patch-prisma] Nothing to do')
}
