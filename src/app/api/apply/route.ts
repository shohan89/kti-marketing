import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

function getStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const jobId      = formData.get('jobId') as string
    const name       = formData.get('name') as string
    const email      = formData.get('email') as string
    const phone      = formData.get('phone') as string | null
    const coverLetter = formData.get('coverLetter') as string
    const portfolioUrl = formData.get('portfolioUrl') as string | null
    const cvFile     = formData.get('cv') as File | null

    if (!jobId || !name?.trim() || !email?.trim() || !coverLetter?.trim()) {
      return NextResponse.json({ error: 'Job ID, name, email, and cover letter are required.' }, { status: 400 })
    }

    let cvUrl: string | null = null

    if (cvFile && cvFile.size > 0) {
      const supabase = getStorageClient()
      // Create bucket if it doesn't exist (idempotent)
      await supabase.storage.createBucket('applications', { public: true }).catch(() => {})

      const ext = cvFile.name.split('.').pop() || 'pdf'
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
      const path = `${jobId}/${Date.now()}-${safeName}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('applications')
        .upload(path, cvFile, { contentType: cvFile.type, upsert: false })

      if (uploadError) {
        console.error('CV upload error:', uploadError)
      } else {
        const { data: { publicUrl } } = supabase.storage.from('applications').getPublicUrl(path)
        cvUrl = publicUrl
      }
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
