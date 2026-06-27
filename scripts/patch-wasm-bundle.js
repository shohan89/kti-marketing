/**
 * Post-build patch for Cloudflare Workers WASM restriction.
 *
 * Cloudflare Workers blocks the SYNCHRONOUS `new WebAssembly.Module(buffer)`
 * constructor at runtime (error: "Wasm code generation disallowed by embedder").
 * The ASYNCHRONOUS `WebAssembly.compile(buffer)` is permitted.
 *
 * Prisma v7's query compiler calls `new WebAssembly.Module(wasmBytes)` after
 * decoding its bundled base64 WASM. This script patches every JS file in the
 * OpenNext build output that makes that synchronous call and replaces it with
 * the async equivalent — no extra .wasm file needed, bundle size stays the same.
 *
 * Primary fix: patch-prisma.js patches the TypeScript source before compilation.
 * This script is a belt-and-suspenders pass over the compiled output.
 */
const fs = require('fs')
const path = require('path')

const OPEN_NEXT = path.join(__dirname, '..', '.open-next')

// Replace: new WebAssembly.Module(<var>)
// With:    await WebAssembly.compile(<var>)
// The surrounding code is always in an async function context (Prisma's WASM init).
const SYNC_RE = /new WebAssembly\.Module\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)/g
const ASYNC_REPLACE = 'await WebAssembly.compile($1)'

let patchCount = 0

function patchFile(full) {
  const src = fs.readFileSync(full, 'utf8')
  if (!src.includes('new WebAssembly.Module(')) return
  const patched = src.replace(SYNC_RE, ASYNC_REPLACE)
  if (patched === src) return
  fs.writeFileSync(full, patched)
  patchCount++
  console.log('[patch-wasm] Patched:', path.relative(OPEN_NEXT, full))
}

function patchDir(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // Skip static assets directory — no JS to patch there
      if (entry.name === 'assets') continue
      patchDir(full)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      patchFile(full)
    }
  }
}

// Patch chunks (lazily-loaded server code)
const CHUNKS_DIR = path.join(OPEN_NEXT, 'server-functions/default/.next/server/chunks')
patchDir(CHUNKS_DIR)

// Patch the main worker bundle (this is the actual deployed file)
const WORKER_FILE = path.join(OPEN_NEXT, 'worker.js')
if (fs.existsSync(WORKER_FILE)) {
  patchFile(WORKER_FILE)
}

// Patch any other server-function JS (e.g. edge runtime chunks)
const SERVER_FN_DIR = path.join(OPEN_NEXT, 'server-functions')
if (fs.existsSync(SERVER_FN_DIR)) {
  patchDir(SERVER_FN_DIR)
}

console.log(`[patch-wasm] Done — ${patchCount} file(s) patched`)
