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

  // Readability text is stored in SiteSetting (no PageSeo column) so it survives reloads.
  const setting = await prisma.siteSetting
    .findUnique({ where: { key: `seo_readability_${id}` } })
    .catch(() => null)

  return (
    <SeoEditor
      pageId={page.id}
      pageLabel={page.pageLabel}
      initialReadability={setting?.value ?? ''}
      initialData={page as Parameters<typeof SeoEditor>[0]['initialData']}
    />
  )
}
