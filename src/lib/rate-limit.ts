/**
 * Fixed-window in-memory rate limiter for public endpoints.
 *
 * Scope note: state lives in the process, so on Cloudflare Workers each isolate
 * keeps its own counters. That makes this a spam/accident brake rather than a
 * hard guarantee — a determined attacker spread across isolates can exceed the
 * nominal limit. Swap the store for Durable Objects / KV if strict enforcement
 * is ever required.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function prune(now: number) {
  if (buckets.size < 1024) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  /** Seconds until the current window resets. */
  retryAfter: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  prune(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  bucket.count += 1
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfter: 0 }
}

/** Best-effort client identifier for rate-limit keying. */
export function clientKey(request: Request, scope: string): string {
  const headers = request.headers
  const ip =
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  return `${scope}:${ip}`
}

export function tooManyRequests(retryAfter: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfter),
    },
  })
}
