import { getPageSeo } from '@/lib/seo'
import JsonLd from './JsonLd'

interface Props {
  pageKey: string
}

export default async function PageSchemas({ pageKey }: Props) {
  const seo = await getPageSeo(pageKey)
  if (!seo || !seo.schemas || seo.schemas.length === 0) return null

  const activeSchemas = seo.schemas
    .filter((s: { isActive: boolean }) => s.isActive)
    .map((s: { data: unknown }) => s.data as object)

  if (activeSchemas.length === 0) return null

  return <JsonLd data={activeSchemas} />
}
