import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import JobForm from '../../JobForm'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await prisma.jobListing.findUnique({ where: { id } }).catch(() => null)
  if (!job) notFound()
  return <JobForm initialData={job as Parameters<typeof JobForm>[0]['initialData']} />
}
