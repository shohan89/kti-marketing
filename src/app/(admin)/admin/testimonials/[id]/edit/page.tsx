import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TestimonialForm from '../../TestimonialForm'

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = await prisma.testimonial.findUnique({ where: { id } }).catch(() => null)
  if (!t) notFound()
  return <TestimonialForm initialData={t as Parameters<typeof TestimonialForm>[0]['initialData']} />
}
