import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Serves clean URLs like /public/team/filename.jpg
// by redirecting to the Supabase CDN URL for that file.
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params

  if (!path || path.length < 2) {
    return new NextResponse('Not found', { status: 404 })
  }

  const [bucket, ...rest] = path
  const filename = rest.join('/')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new NextResponse('Storage not configured', { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename)

  return NextResponse.redirect(publicUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
