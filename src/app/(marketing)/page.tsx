import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import PageSchemas from '@/components/seo/PageSchemas'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('home')
  return buildMetadata(seo, {
    title: 'KTI Marketing — Bold Strategy. Real Revenue. Zero Compromises.',
    description: 'Full-service growth agency helping ambitious brands dominate their market with performance campaigns, bold creative, and measurable results.',
  })
}

export default function HomePage() {
  return (
    <>
      <PageSchemas pageKey="home" />
      <HomeClient />
    </>
  )
}
