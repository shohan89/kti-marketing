import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts, getBlogBySlug } from '@/data/staticData'
import type { BlogPost } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import { prisma } from '@/lib/prisma'
import './BlogPost.css'

export const dynamic = 'force-dynamic'

const BLOG_PALETTE = [
  { gradientFrom: '#1a1a2e', gradientTo: '#16213e', accentColor: '#f87171' },
  { gradientFrom: '#0d1117', gradientTo: '#161b22', accentColor: '#a78bfa' },
  { gradientFrom: '#0f2027', gradientTo: '#203a43', accentColor: '#34d399' },
  { gradientFrom: '#1e1b4b', gradientTo: '#312e81', accentColor: '#818cf8' },
  { gradientFrom: '#0c1a0c', gradientTo: '#14532d', accentColor: '#86efac' },
  { gradientFrom: '#2d1b00', gradientTo: '#78350f', accentColor: '#fbbf24' },
]
function assignBlogVisuals(index: number) {
  return BLOG_PALETTE[index % BLOG_PALETTE.length]
}

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (post) {
      const title = post.metaTitle ?? post.title
      const description = post.metaDescription ?? post.excerpt
      return {
        title,
        description,
        alternates: { canonical: post.canonicalUrl ?? `/blog/${slug}` },
        openGraph: { title, description, type: 'article', ...(post.ogImageUrl ? { images: [{ url: post.ogImageUrl }] } : {}) },
        twitter: { card: 'summary_large_image', title, description, ...(post.ogImageUrl ? { images: [post.ogImageUrl] } : {}) },
      }
    }
  } catch { /* fall through to static */ }
  const post = getBlogBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: 'article' } }
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      <div className="blog-card__img" style={{ background: `linear-gradient(135deg, ${post.gradientFrom} 0%, ${post.gradientTo} 100%)` }}>
        <span className="blog-card__badge" style={{ background: post.accentColor }}>{post.category === 'general' ? 'Marketing' : 'E-commerce'}</span>
      </div>
      <div className="blog-card__body">
        <div className="blog-card__meta"><span>{post.publishDate}</span><span className="blog-card__dot">·</span><span>{post.readTime}</span></div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="blog-card__cta" style={{ color: post.accentColor }}>Read Article <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  )
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let post: any = null
  try {
    const db = await prisma.blogPost.findUnique({ where: { slug } })
    if (db) {
      const vis = BLOG_PALETTE[0]
      post = {
        ...db,
        category: db.category.toLowerCase(),
        gradientFrom: db.gradientFrom ?? vis.gradientFrom,
        gradientTo:   db.gradientTo   ?? vis.gradientTo,
        accentColor:  db.accentColor  ?? vis.accentColor,
        callout:      db.callout      ?? null,
        takeaways:    db.takeaways    ?? [],
      }
    }
  } catch {}
  if (!post) post = getBlogBySlug(slug)
  if (!post) notFound()

  const related = blogPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3)
  const categoryLabel = post.category === 'general' ? 'Marketing & Strategy' : 'E-commerce & Export-Import'

  return (
    <main className="bp-page">
      <section className="bp-hero">
        <div className="bp-hero__bg" aria-hidden="true"><div className="bp-hero__shape--1" /><div className="bp-hero__shape--2" /></div>
        <div className="container bp-hero__inner">
          <nav className="bp-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">›</span><span>{post.title}</span></nav>
          <span className="bp-hero__badge" style={{ background: post.accentColor }}>{categoryLabel}</span>
          <h1 className="bp-hero__title reveal">{post.title}</h1>
          <div className="bp-hero__meta reveal"><span>{post.author}</span><span className="bp-dot" aria-hidden="true">·</span><span>{post.publishDate}</span><span className="bp-dot" aria-hidden="true">·</span><span>{post.readTime}</span></div>
          <p className="bp-hero__excerpt reveal">{post.excerpt}</p>
          <div className="bp-hero__tags reveal">{post.tags.map((tag: string) => (<span key={tag} className="bp-tag">{tag}</span>))}</div>
        </div>
      </section>

      <section className="bp-content">
        <div className="container bp-content__grid">
          <article className="bp-article">
            {post.body.map((section, i) => (
              <div key={i} className="bp-section reveal">
                {section.heading && <h2 className="bp-section__heading">{section.heading}</h2>}
                {section.paragraphs.map((p, j) => <p key={j} className="bp-section__para">{p}</p>)}
              </div>
            ))}
            {post.callout && (
              <div className="bp-callout reveal"><span className="bp-callout__icon" aria-hidden="true">💡</span><p>{post.callout}</p></div>
            )}
            {post.takeaways && (
              <div className="bp-takeaways reveal">
                <h3 className="bp-takeaways__title">Key Takeaways</h3>
                <ul className="bp-takeaways__list">
                  {post.takeaways.map((item, i) => (
                    <li key={i} className="bp-takeaways__item"><span className="bp-check" style={{ color: post.accentColor }} aria-hidden="true">✓</span>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bp-article__footer reveal">
              <Link href="/blog" className="btn btn-outline">← Back to Blog</Link>
              <Link href="/contact" className="btn" style={{ background: post.accentColor }}>Work With Us →</Link>
            </div>
          </article>

          <aside className="bp-sidebar">
            <div className="bp-sidebar-card">
              <p className="bp-sidebar-card__label">Article Info</p>
              <ul className="bp-sidebar-info">
                <li><span className="bp-sidebar-info__key">Category</span><span className="bp-sidebar-info__val bp-sidebar-badge" style={{ color: post.accentColor, borderColor: post.accentColor + '33' }}>{categoryLabel}</span></li>
                <li><span className="bp-sidebar-info__key">Published</span><span className="bp-sidebar-info__val">{post.publishDate}</span></li>
                <li><span className="bp-sidebar-info__key">Read time</span><span className="bp-sidebar-info__val">{post.readTime}</span></li>
                <li><span className="bp-sidebar-info__key">Author</span><span className="bp-sidebar-info__val">{post.author}</span></li>
              </ul>
              <div className="bp-sidebar-tags">{post.tags.map((tag: string) => (<span key={tag} className="bp-tag bp-tag--sm">{tag}</span>))}</div>
            </div>
            <div className="bp-sidebar-card bp-sidebar-card--cta">
              <p className="bp-sidebar-cta__eyebrow">Ready to grow?</p>
              <h3 className="bp-sidebar-cta__title">Let&apos;s Build Your Strategy</h3>
              <p className="bp-sidebar-cta__body">Get a free 30-minute strategy session with the KTI Marketing team. No commitment. Just results.</p>
              <Link href="/contact" className="btn bp-sidebar-cta__btn">Book Free Call →</Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bp-related">
          <div className="container">
            <div className="bp-related__header reveal"><p className="eyebrow">Keep Reading</p><h2>More from <span className="accent">{categoryLabel}</span></h2></div>
            <div className="bp-related__grid">
              {related.map((p, i) => (<div key={p.slug} className={`reveal reveal-delay-${(i + 1) * 100}`}><BlogCard post={p} /></div>))}
            </div>
          </div>
        </section>
      )}

      <PageCTA />
    </main>
  )
}
