/**
 * Post-build patch for Cloudflare Workers WASM restriction.
 *
 * Cloudflare Workers blocks the SYNCHRONOUS `new WebAssembly.Module(buffer)`
 * constructor at runtime (error: "Wasm code generation disallowed by embedder").
 * The ASYNCHRONOUS `WebAssembly.compile(buffer)` is permitted.
 *
 * Prisma v7's query compiler calls `new WebAssembly.Module(wasmBytes)` after
 * decoding its bundled base64 WASM. This script patches every chunk in the
 * OpenNext bundle that makes that synchronous call and replaces it with the
 * async equivalent — no extra .wasm file needed, bundle size stays the same.
 */
const fs = require('fs')
const path = require('path')

const OPEN_NEXT = path.join(__dirname, '..', '.open-next')
const CHUNKS_DIR = path.join(OPEN_NEXT, 'server-functions/default/.next/server/chunks')

// Replace: new WebAssembly.Module(<var>)
// With:    await WebAssembly.compile(<var>)
const SYNC_RE = /new WebAssembly\.Module\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)/g
const ASYNC_REPLACE = 'await WebAssembly.compile($1)'

function patchDir(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      patchDir(full)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const src = fs.readFileSync(full, 'utf8')
      if (!src.includes('new WebAssembly.Module(')) continue
      const patched = src.replace(SYNC_RE, ASYNC_REPLACE)
      fs.writeFileSync(full, patched)
      console.log('[patch-wasm] Patched:', path.relative(OPEN_NEXT, full))
    }
  }
}

patchDir(CHUNKS_DIR)
console.log('[patch-wasm] Done')
