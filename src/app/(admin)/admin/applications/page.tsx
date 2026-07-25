import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getCurrentAdminUser } from '@/lib/auth'
import ApplicationsClient from './ApplicationsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Applications — KTI Admin' }

async function getApplications() {
  try {
    return await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { title: true, department: true } } },
    })
  } catch {
    return []
  }
}

export default async function ApplicationsPage() {
  const [apps, me] = await Promise.all([getApplications(), getCurrentAdminUser()])

  // Department-scoped roles (Manager, HR) only ever see applications for
  // their assigned department(s); an empty list means unrestricted.
  const scoped = me && me.departments.length > 0
    ? apps.filter(a => a.job?.department && me.departments.includes(a.job.department))
    : apps

  return <ApplicationsClient apps={scoped} />
}

