import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const CV_BUCKET = 'applications'
const SIGNED_URL_TTL_SECONDS = 300

/**
 * Streams an applicant's CV to an authenticated admin via a short-lived signed
 * URL. CVs live in a private bucket, so this route is the only way to reach one.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  const { id } = await context.params

  const application = await prisma.jobApplication.findUnique({
    where: { id },
    select: { cvUrl: true },
  })

  const cvUrl: string | null = application?.cvUrl ?? null
  if (!cvUrl) {
    return NextResponse.json({ error: 'No CV on file for this application.' }, { status: 404 })
  }

  // Legacy rows stored a fully-qualified public URL before the bucket was made
  // private; pass those through unchanged.
  if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
    return NextResponse.redirect(cvUrl, 302)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Storage is not configured.' }, { status: 500 })
  }

  const signRes = await fetch(
    `${supabaseUrl}/storage/v1/object/sign/${CV_BUCKET}/${cvUrl}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: SIGNED_URL_TTL_SECONDS }),
    },
  )

  if (!signRes.ok) {
    console.error('[cv] Failed to sign URL:', await signRes.text())
    return NextResponse.json({ error: 'Could not retrieve the CV.' }, { status: 502 })
  }

  const { signedURL } = (await signRes.json()) as { signedURL?: string }
  if (!signedURL) {
    return NextResponse.json({ error: 'Could not retrieve the CV.' }, { status: 502 })
  }

  return NextResponse.redirect(`${supabaseUrl}/storage/v1${signedURL}`, 302)
}
