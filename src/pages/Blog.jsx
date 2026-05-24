import { Link } from 'react-router-dom'
import { generalPosts, ecommercePosts } from '../data/blogData'
import useScrollReveal from '../hooks/useScrollReveal'
import './Blog.css'

export function BlogCard({ post, large = false }) {
  return (
    <article className={`blog-card${large ? ' blog-card--featured' : ''}`}>
      <div
        className="blog-card__img"
        style={{
          background: `linear-gradient(135deg, ${post.gradientFrom} 0%, ${post.gradientTo} 100%)`,
        }}
      >
        <span
          className="blog-card__badge"
          style={{ background: post.accentColor }}
        >
          {post.category === 'general' ? 'Marketing' : 'E-commerce'}
        </span>
        <div className="blog-card__img-icon" style={{ color: post.accentColor }}>
          {post.category === 'general' ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
        </div>
      </div>
      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span>{post.publishDate}</span>
          <span className="blog-card__dot">·</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="blog-card__cta"
          style={{ color: post.accentColor }}
        >
          Read Article <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

function BlogSection({ id, eyebrow, title, accent, posts, flipped }) {
  useScrollReveal()
  const [featured, ...rest] = posts

  return (
    <section className={`blog-section${flipped ? ' blog-section--alt' : ''}`} id={id}>
      <div className="container">
        <div className="blog-section__header reveal">
          <p className="eyebrow">{eyebrow}</p>
          <h2>
            {title} <span className="accent">{accent}</span>
          </h2>
          <div className="blog-section__bar" />
        </div>

        <div className="blog-section__featured reveal">
          <BlogCard post={featured} large />
        </div>

        <div className="blog-section__grid">
          {rest.map((post, i) => (
            <div key={post.slug} className={`reveal reveal-delay-${(i + 1) * 100}`}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Blog() {
  useScrollReveal()
  const general   = generalPosts()
  const ecommerce = ecommercePosts()

  return (
    <main className="blog-page">
      {/* ── Hero ── */}
      <section className="blog-hero">
        <div className="container">
          <p className="eyebrow reveal" style={{ color: '#f87171' }}>KTI Insights</p>
          <h1 className="blog-hero__title reveal">
            Ideas That <span className="accent">Drive Growth</span>
          </h1>
          <p className="blog-hero__sub reveal">
            Strategy, stories, and practical guides from the KTI Marketing team — written for
            ambitious brands that care about results, not just reach.
          </p>
          <div className="blog-hero__nav reveal">
            <a href="#general" className="blog-hero__tab blog-hero__tab--active">
              Marketing &amp; Strategy
            </a>
            <a href="#ecommerce" className="blog-hero__tab">
              E-commerce &amp; Export-Import
            </a>
          </div>
        </div>
        <div className="blog-hero__glow" aria-hidden="true" />
      </section>

      {/* ── General Blog Section ── */}
      <BlogSection
        id="general"
        eyebrow="Marketing & Strategy"
        title="Insights to"
        accent="Grow Your Brand"
        posts={general}
        flipped={false}
      />

      {/* ── E-commerce Section ── */}
      <BlogSection
        id="ecommerce"
        eyebrow="E-commerce & Export-Import"
        title="Trade Smart,"
        accent="Scale Globally"
        posts={ecommerce}
        flipped
      />
    </main>
  )
}
