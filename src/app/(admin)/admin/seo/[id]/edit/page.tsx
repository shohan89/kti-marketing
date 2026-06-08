import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SeoEditor from '../../SeoEditor'

export default async function SeoEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await prisma.pageSeo.findUnique({
    where: { id },
    include: { schemas: { orderBy: { sortOrder: 'asc' } } },
  }).catch(() => null)

  if (!page) notFound()

  return (
    <SeoEditor
      pageId={page.id}
      pageLabel={page.pageLabel}
      initialData={page as Parameters<typeof SeoEditor>[0]['initialData']}
    />
  )
}
