import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

function supabaseHeaders() {
  return {
    Authorization: `Bearer ${SERVICE_KEY()}`,
    apikey: SERVICE_KEY(),
  }
}

async function uploadCV(jobId: string, name: string, cvFile: File): Promise<string | null> {
  const bucket = 'applications'
  const ext = cvFile.name.split('.').pop() || 'pdf'
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  const path = `${jobId}/${Date.now()}-${safeName}.${ext}`

  await fetch(`${SUPABASE_URL()}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...supabaseHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
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

  return `${SUPABASE_URL()}/storage/v1/object/public/${bucket}/${path}`
}

export async function POST(request: NextRequest) {
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

    let cvUrl: string | null = null

    if (cvFile && cvFile.size > 0 && SUPABASE_URL() && SERVICE_KEY()) {
      cvUrl = await uploadCV(jobId, name, cvFile)
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        coverLetter: coverLetter.trim(),
        portfolioUrl: portfolioUrl?.trim() || null,
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
