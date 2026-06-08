import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CaseStudyForm from '../../CaseStudyForm'

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const study = await prisma.caseStudy.findUnique({ where: { id } }).catch(() => null)
  if (!study) notFound()
  return <CaseStudyForm initialData={study as Parameters<typeof CaseStudyForm>[0]['initialData']} />
}
