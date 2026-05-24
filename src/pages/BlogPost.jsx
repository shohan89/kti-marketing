import { useParams, Link, Navigate } from 'react-router-dom'
import { getBlogBySlug, blogPosts } from '../data/blogData'
import { BlogCard } from './Blog'
import PageCTA from '../components/PageCTA'
import useScrollReveal from '../hooks/useScrollReveal'
import './BlogPost.css'

export default function BlogPost() {
  useScrollReveal()
  const { slug } = useParams()
  const post = getBlogBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  const related = blogPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3)

  const categoryLabel = post.category === 'general' ? 'Marketing & Strategy' : 'E-commerce & Export-Import'

  return (
    <main className="bp-page">

      {/* ── 1. Hero ───────────────────────────────────────── */}
      <section className="bp-hero">
        <div className="bp-hero__bg" aria-hidden="true">
          <div className="bp-hero__shape--1" />
          <div className="bp-hero__shape--2" />
        </div>
        <div className="container bp-hero__inner">
          <nav className="bp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/blog">Blog</Link>
            <span aria-hidden="true">›</span>
            <span>{post.title}</span>
          </nav>

          <span
            className="bp-hero__badge"
            style={{ background: post.accentColor }}
          >
            {categoryLabel}
          </span>

          <h1 className="bp-hero__title reveal">{post.title}</h1>

          <div className="bp-hero__meta reveal">
            <span>{post.author}</span>
            <span className="bp-dot" aria-hidden="true">·</span>
            <span>{post.publishDate}</span>
            <span className="bp-dot" aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>

          <p className="bp-hero__excerpt reveal">{post.excerpt}</p>

          <div className="bp-hero__tags reveal">
            {post.tags.map(tag => (
              <span key={tag} className="bp-tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Article Body + Sidebar ─────────────────────── */}
      <section className="bp-content">
        <div className="container bp-content__grid">

          {/* Article */}
          <article className="bp-article">
            {post.body.map((section, i) => (
              <div key={i} className="bp-section reveal">
                {section.heading && <h2 className="bp-section__heading">{section.heading}</h2>}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="bp-section__para">{p}</p>
                ))}
              </div>
            ))}

            {/* Callout */}
            {post.callout && (
              <div className="bp-callout reveal">
                <span className="bp-callout__icon" aria-hidden="true">💡</span>
                <p>{post.callout}</p>
              </div>
            )}

            {/* Key Takeaways */}
            {post.takeaways && (
              <div className="bp-takeaways reveal">
                <h3 className="bp-takeaways__title">Key Takeaways</h3>
                <ul className="bp-takeaways__list">
                  {post.takeaways.map((item, i) => (
                    <li key={i} className="bp-takeaways__item">
                      <span className="bp-check" style={{ color: post.accentColor }} aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article footer */}
            <div className="bp-article__footer reveal">
              <Link to="/blog" className="btn btn-outline">← Back to Blog</Link>
              <Link to="/contact" className="btn" style={{ background: post.accentColor }}>
                Work With Us →
              </Link>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="bp-sidebar">
            {/* Article info card */}
            <div className="bp-sidebar-card">
              <p className="bp-sidebar-card__label">Article Info</p>
              <ul className="bp-sidebar-info">
                <li>
                  <span className="bp-sidebar-info__key">Category</span>
                  <span
                    className="bp-sidebar-info__val bp-sidebar-badge"
                    style={{ color: post.accentColor, borderColor: post.accentColor + '33' }}
                  >
                    {categoryLabel}
                  </span>
                </li>
                <li>
                  <span className="bp-sidebar-info__key">Published</span>
                  <span className="bp-sidebar-info__val">{post.publishDate}</span>
                </li>
                <li>
                  <span className="bp-sidebar-info__key">Read time</span>
                  <span className="bp-sidebar-info__val">{post.readTime}</span>
                </li>
                <li>
                  <span className="bp-sidebar-info__key">Author</span>
                  <span className="bp-sidebar-info__val">{post.author}</span>
                </li>
              </ul>
              <div className="bp-sidebar-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="bp-tag bp-tag--sm">{tag}</span>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="bp-sidebar-card bp-sidebar-card--cta">
              <p className="bp-sidebar-cta__eyebrow">Ready to grow?</p>
              <h3 className="bp-sidebar-cta__title">Let's Build Your Strategy</h3>
              <p className="bp-sidebar-cta__body">
                Get a free 30-minute strategy session with the KTI Marketing team.
                No commitment. Just results.
              </p>
              <Link to="/contact" className="btn bp-sidebar-cta__btn">
                Book Free Call →
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* ── 3. Related Posts ──────────────────────────────── */}
      {related.length > 0 && (
        <section className="bp-related">
          <div className="container">
            <div className="bp-related__header reveal">
              <p className="eyebrow">Keep Reading</p>
              <h2>More from <span className="accent">{categoryLabel}</span></h2>
            </div>
            <div className="bp-related__grid">
              {related.map((p, i) => (
                <div key={p.slug} className={`reveal reveal-delay-${(i + 1) * 100}`}>
                  <BlogCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Final CTA ─────────────────────────────────── */}
      <PageCTA />

    </main>
  )
}
