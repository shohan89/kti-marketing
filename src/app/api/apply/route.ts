import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { validateCvUpload } from '@/lib/upload-validation'

const MAX_NAME = 200
const MAX_EMAIL = 320
const MAX_PHONE = 50
const MAX_COVER_LETTER = 10_000
const MAX_URL = 500

export const CV_BUCKET = 'applications'

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

function supabaseHeaders() {
  return {
    Authorization: `Bearer ${SERVICE_KEY()}`,
    apikey: SERVICE_KEY(),
  }
}

/**
 * Uploads a CV to the private `applications` bucket and returns its object
 * path. Applicant CVs are personal data and must not be publicly readable —
 * admins reach them through /api/admin/applications/[id]/cv, which mints a
 * short-lived signed URL.
 */
async function uploadCV(jobId: string, name: string, cvFile: File): Promise<string | null> {
  const bucket = CV_BUCKET
  const ext = cvFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'pdf'
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  const path = `${jobId}/${Date.now()}-${safeName}.${ext}`

  // Create as private if absent...
  await fetch(`${SUPABASE_URL()}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...supabaseHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bucket, name: bucket, public: false }),
  }).catch(() => {})

  // ...and demote it if a previous deploy created it public.
  await fetch(`${SUPABASE_URL()}/storage/v1/bucket/${bucket}`, {
    method: 'PUT',
    headers: { ...supabaseHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bucket, public: false }),
  }).catch(() => {})

  const uploadRes = await fetch(
    `${SUPABASE_URL()}/storage/v1/object/${bucket}/${path}`,
    {
      method: 'POST',
      headers: { ...supabaseHeaders(), 'Content-Type': cvFile.type, 'x-upsert': 'false' },
      body: await cvFile.arrayBuffer(),
    }
  )

  if (!uploadRes.ok) {
    console.error('CV upload error:', await uploadRes.text())
    return null
  }

  return path
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, 'apply'), 5, 60 * 60_000)
  if (!limit.ok) {
    return tooManyRequests(limit.retryAfter, 'Too many applications submitted. Please try again later.')
  }

  try {
    const formData = await request.formData()

    const jobId       = formData.get('jobId') as string
    const name        = formData.get('name') as string
    const email       = formData.get('email') as string
    const phone       = formData.get('phone') as string | null
    const coverLetter = formData.get('coverLetter') as string
    const portfolioUrl = formData.get('portfolioUrl') as string | null
    const cvFile      = formData.get('cv') as File | null

    if (!jobId || !name?.trim() || !email?.trim() || !phone?.trim() || !coverLetter?.trim()) {
      return NextResponse.json({ error: 'Job ID, name, email, phone, and cover letter are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > MAX_EMAIL) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (name.length > MAX_NAME || coverLetter.length > MAX_COVER_LETTER || phone.length > MAX_PHONE) {
      return NextResponse.json({ error: 'Submission is too long.' }, { status: 400 })
    }

    // Verify the job exists so applications can't be attached to arbitrary IDs.
    const job = await prisma.jobListing.findUnique({ where: { id: jobId }, select: { id: true } })
    if (!job) {
      return NextResponse.json({ error: 'This job listing is no longer available.' }, { status: 404 })
    }

    let cvUrl: string | null = null

    if (cvFile && cvFile.size > 0) {
      const invalid = validateCvUpload(cvFile)
      if (invalid) {
        return NextResponse.json({ error: invalid.error }, { status: invalid.status })
      }
      if (SUPABASE_URL() && SERVICE_KEY()) {
        cvUrl = await uploadCV(jobId, name, cvFile)
      }
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        name: name.trim().slice(0, MAX_NAME),
        email: email.trim().toLowerCase(),
        phone: phone?.trim().slice(0, MAX_PHONE) || null,
        coverLetter: coverLetter.trim().slice(0, MAX_COVER_LETTER),
        portfolioUrl: portfolioUrl?.trim().slice(0, MAX_URL) || null,
        cvUrl,
        ipAddress: request.headers.get('x-forwarded-for') ?? null,
      },
    })

    return NextResponse.json({ success: true, applicationId: application.id })
  } catch (error) {
    console.error('Job application error:', error)
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
  }
}
