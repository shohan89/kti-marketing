import { NextRequest, NextResponse } from 'next/server'

// Serves Supabase Storage objects under /public/{bucket}/{filename} by proxying the
// bytes, so the Supabase host never appears in the browser address bar.
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params

  if (!path || path.length < 2) {
    return new NextResponse('Not found', { status: 404 })
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) {
    return new NextResponse('Storage not configured', { status: 500 })
  }

  const objectPath = path.map(encodeURIComponent).join('/')
  const upstream = await fetch(`${base}/storage/v1/object/public/${objectPath}`, {
    headers: {
      ...(req.headers.get('range') ? { range: req.headers.get('range')! } : {}),
      ...(req.headers.get('if-none-match') ? { 'if-none-match': req.headers.get('if-none-match')! } : {}),
    },
  })

  if (upstream.status === 404 || upstream.status === 400) {
    return new NextResponse('Not found', { status: 404 })
  }

  const headers = new Headers()
  for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified', 'content-disposition']) {
    const v = upstream.headers.get(h)
    if (v) headers.set(h, v)
  }
  headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800')
  headers.set('X-Content-Type-Options', 'nosniff')

  return new NextResponse(upstream.body, { status: upstream.status, headers })
}
