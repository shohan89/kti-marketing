/**
 * Post-build patch for Cloudflare Workers WASM restriction.
 *
 * Cloudflare Workers blocks `new WebAssembly.Module(buffer)` at runtime.
 * WASM must be imported as a static ES module so Cloudflare pre-compiles it
 * at upload time.
 *
 * This script runs after `opennextjs-cloudflare build` and:
 * 1. Decodes the Prisma WASM from its base64 bundle → writes a .wasm file
 * 2. Prepends a static WASM import to worker.js, stored in globalThis
 * 3. Patches every chunk file that calls `new WebAssembly.Module(...)` to
 *    use the pre-compiled globalThis.__prismaWasmModule instead
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const OPEN_NEXT = path.join(ROOT, '.open-next')
const WORKER_JS = path.join(OPEN_NEXT, 'worker.js')
const WASM_NAME = 'prisma_query_compiler.wasm'
const WASM_OUT = path.join(OPEN_NEXT, WASM_NAME)

// ── 1. Extract WASM bytes from Prisma's base64 bundle ─────────────────────
const b64Path = path.join(
  ROOT,
  'node_modules/@prisma/client/runtime/query_compiler_small_bg.postgresql.wasm-base64.mjs'
)
const b64Content = fs.readFileSync(b64Path, 'utf8')
// The file exports: const wasm = "BASE64..."
const b64Match = b64Content.match(/["']([A-Za-z0-9+/]+=*)["']/)
if (!b64Match) throw new Error('[patch-wasm] Could not extract WASM base64 data from ' + b64Path)
const wasmBytes = Buffer.from(b64Match[1], 'base64')
fs.writeFileSync(WASM_OUT, wasmBytes)
console.log(`[patch-wasm] Written ${WASM_NAME} (${wasmBytes.length} bytes)`)

// ── 2. Prepend static WASM import to worker.js ────────────────────────────
const workerContent = fs.readFileSync(WORKER_JS, 'utf8')
const wasmImportLine = `import __prismaWasm from './${WASM_NAME}';\nglobalThis.__prismaWasmModule = __prismaWasm;\n`
if (!workerContent.includes('__prismaWasmModule')) {
  fs.writeFileSync(WORKER_JS, wasmImportLine + workerContent)
  console.log('[patch-wasm] Added WASM import to worker.js')
} else {
  console.log('[patch-wasm] worker.js already has WASM import — skipping')
}

// ── 3. Patch bundle chunks that call `new WebAssembly.Module(...)` ─────────
const WASM_RE = /new WebAssembly\.Module\([a-zA-Z_$][a-zA-Z0-9_$]*\)/g
const WASM_REPLACEMENT = 'globalThis.__prismaWasmModule'

function patchDir(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      patchDir(full)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const src = fs.readFileSync(full, 'utf8')
      if (!src.includes('new WebAssembly.Module(')) continue
      const patched = src.replace(WASM_RE, WASM_REPLACEMENT)
      fs.writeFileSync(full, patched)
      console.log('[patch-wasm] Patched:', path.relative(OPEN_NEXT, full))
    }
  }
}

patchDir(path.join(OPEN_NEXT, 'server-functions/default/.next/server/chunks'))
console.log('[patch-wasm] Done')
