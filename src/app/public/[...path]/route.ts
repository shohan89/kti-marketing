import { NextRequest, NextResponse } from 'next/server'

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

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new NextResponse('Storage not configured', { status: 500 })
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`

  return NextResponse.redirect(publicUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
