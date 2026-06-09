import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioItemForm from '../../PortfolioItemForm'

export default async function EditPortfolioItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.portfolioItem.findUnique({ where: { id } }).catch(() => null)
  if (!item) notFound()
  return <PortfolioItemForm initialData={item as Parameters<typeof PortfolioItemForm>[0]['initialData']} />
}
