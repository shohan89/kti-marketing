import { NextRequest, NextResponse } from 'next/server'

const VALID_TAGS = ['services', 'blog', 'portfolio', 'jobs', 'pricing', 'testimonials', 'team', 'settings', 'home'] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidate = (tag: string) => { try { const { revalidateTag } = require('next/cache'); revalidateTag(tag) } catch {} }

export async function POST(request: NextRequest) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tag } = await request.json()
    if (tag && VALID_TAGS.includes(tag)) {
      revalidate(tag)
      return NextResponse.json({ revalidated: true, tag })
    }
    VALID_TAGS.forEach(t => revalidate(t))
    return NextResponse.json({ revalidated: true, tag: 'all' })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
