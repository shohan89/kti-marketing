import type { Metadata } from 'next'
import Link from 'next/link'
import { generalPosts, type BlogPost } from '@/data/staticData'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import { BlogSection, BLOG_PALETTE } from './_components'
import './Blog.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('blog')
  return buildMetadata(seo, { title: 'Blog — Ideas That Drive Growth', description: 'Strategy, stories, and practical guides from the KTI Marketing team — written for ambitious brands that care about results, not just reach.' })
}

export default async function BlogPage() {
  let general: BlogPost[] = generalPosts()
  try {
    const rows = await prisma.blogPost.findMany({
      where: { isPublished: true, category: 'MARKETING' },
      orderBy: { publishDate: 'desc' },
    })
    if (rows.length > 0) {
      general = rows.map((p, i) => {
        const vis = BLOG_PALETTE[i % BLOG_PALETTE.length]
        return {
          ...p,
          category: p.category.toLowerCase(),
          gradientFrom: p.gradientFrom ?? vis.gradientFrom,
          gradientTo:   p.gradientTo   ?? vis.gradientTo,
          accentColor:  p.accentColor  ?? vis.accentColor,
          callout:      p.callout      ?? null,
          takeaways:    p.takeaways    ?? [],
        }
      }) as unknown as BlogPost[]
    }
  } catch { /* use static fallback */ }

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <p className="eyebrow reveal" style={{ color: '#f87171' }}>KTI Insights</p>
          <h1 className="blog-hero__title reveal">Ideas That <span className="accent">Drive Growth</span></h1>
          <p className="blog-hero__sub reveal">Strategy, stories, and practical guides from the KTI Marketing team — written for ambitious brands that care about results, not just reach.</p>
          <div className="blog-hero__nav reveal">
            <Link href="/blog" className="blog-hero__tab blog-hero__tab--active">Marketing &amp; Strategy</Link>
            <Link href="/blog/import" className="blog-hero__tab">Import &amp; Export</Link>
          </div>
        </div>
        <div className="blog-hero__glow" aria-hidden="true" />
      </section>

      <BlogSection id="general" eyebrow="Marketing & Strategy" title="Insights to" accent="Grow Your Brand" posts={general} flipped={false} />
    </main>
  )
}
