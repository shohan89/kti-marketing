import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/rate-limit'

// Caps so a submission can't be used to write unbounded data.
const MAX_NAME = 200
const MAX_EMAIL = 320
const MAX_PHONE = 30
const MAX_COMPANY = 200
const MAX_BUDGET = 100
const MAX_MESSAGE = 5000

export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, 'contact'), 5, 10 * 60_000)
  if (!limit.ok) {
    return tooManyRequests(limit.retryAfter, 'Too many submissions. Please try again shortly.')
  }

  try {
    const body = await request.json()
    const { name, email, phone, company, budget, message } = body

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }

    if (name.length > MAX_NAME) {
      return NextResponse.json({ error: 'Submission is too long.' }, { status: 400 })
    }

    const optional = (value: unknown, max: number) =>
      typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null

    let normalizedEmail: string | null = null
    if (typeof email === 'string' && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email) || email.length > MAX_EMAIL) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
      }
      normalizedEmail = email.trim().toLowerCase()
    }

    if (typeof message === 'string' && message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: 'Submission is too long.' }, { status: 400 })
    }

    await prisma.contactSubmission.create({
      data: {
        name: name.trim().slice(0, MAX_NAME),
        email: normalizedEmail,
        phone: optional(phone, MAX_PHONE),
        company: optional(company, MAX_COMPANY),
        budget: optional(budget, MAX_BUDGET),
        message: optional(message, MAX_MESSAGE),
        ipAddress: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null,
        userAgent: request.headers.get('user-agent') ?? null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
