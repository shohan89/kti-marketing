import { NextRequest, NextResponse } from 'next/server'
import { revalidateContent, type CacheTag } from '@/lib/revalidate'

const VALID_TAGS: readonly CacheTag[] = [
  'services', 'blog', 'portfolio', 'jobs', 'pricing',
  'testimonials', 'team', 'settings', 'home',
]

/** Constant-time comparison so the secret can't be recovered by timing. */
function secretMatches(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATION_SECRET

  // Without a configured secret this endpoint must stay shut. Previously an
  // unset env var made the check `undefined !== undefined`, which passed and
  // left revalidation open to anyone.
  if (!expected) {
    console.error('[revalidate] REVALIDATION_SECRET is not configured — refusing request.')
    return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 })
  }

  const provided = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!provided || !secretMatches(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tag } = await request.json().catch(() => ({ tag: undefined }))

    if (tag) {
      if (!VALID_TAGS.includes(tag)) {
        return NextResponse.json({ error: 'Unknown tag' }, { status: 400 })
      }
      revalidateContent(tag)
      return NextResponse.json({ revalidated: true, tag })
    }

    VALID_TAGS.forEach(revalidateContent)
    return NextResponse.json({ revalidated: true, tag: 'all' })
  } catch (error) {
    // Surface failures instead of silently reporting success, so a broken
    // revalidation path is visible rather than masked by `{revalidated: true}`.
    console.error('Revalidation error:', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
