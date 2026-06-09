import type { Metadata } from 'next'
import Link from 'next/link'
import { ecommercePosts, type BlogPost } from '@/data/staticData'
import { prisma } from '@/lib/prisma'
import { BlogSection, BLOG_PALETTE } from '../_components'
import '../Blog.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'E-commerce & Export-Import Blog — KTI Marketing',
  description: 'Practical guides on launching and scaling e-commerce brands, export-import strategies, and trade marketing from the KTI Marketing team.',
}

export default async function EcommerceBlogPage() {
  let posts: BlogPost[] = ecommercePosts()
  try {
    const rows = await prisma.blogPost.findMany({
      where: { isPublished: true, category: 'ECOMMERCE' },
      orderBy: { publishDate: 'desc' },
    })
    if (rows.length > 0) {
      posts = rows.map((p, i) => {
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
          <h1 className="blog-hero__title reveal">Trade Smart, <span className="accent">Scale Globally</span></h1>
          <p className="blog-hero__sub reveal">Practical guides on e-commerce, export-import, and trade marketing — written for ambitious brands ready to grow beyond borders.</p>
          <div className="blog-hero__nav reveal">
            <Link href="/blog" className="blog-hero__tab">Marketing &amp; Strategy</Link>
            <Link href="/blog/ecommerce" className="blog-hero__tab blog-hero__tab--active">E-commerce &amp; Export-Import</Link>
          </div>
        </div>
        <div className="blog-hero__glow" aria-hidden="true" />
      </section>

      <BlogSection id="ecommerce" eyebrow="E-commerce & Export-Import" title="Trade Smart," accent="Scale Globally" posts={posts} flipped={false} />
    </main>
  )
}
