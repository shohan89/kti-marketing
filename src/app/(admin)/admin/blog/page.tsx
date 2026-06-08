import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { blogPosts } from '@/data/staticData'

export const metadata: Metadata = { title: 'Blog — KTI Admin' }

type DbBlogPost = { id: string; slug: string; title: string; category: string; author: string; isPublished: boolean; publishDate: string }

async function getPosts(): Promise<DbBlogPost[]> {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as DbBlogPost[]
  } catch {
    return blogPosts.map((p, i) => ({
      id: String(i), slug: p.slug, title: p.title,
      category: p.category.toUpperCase(),
      author: p.author, isPublished: true,
      publishDate: p.publishDate,
    }))
  }
}

export default async function AdminBlogPage() {
  const posts = await getPosts()

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Blog</h1><p className="admin-page-sub">{posts.length} articles</p></div>
        <Link href="/admin/blog/new" className="admin-btn admin-btn--primary">+ New Post</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Published</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: '#fff', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                <td><span className={`admin-badge ${p.category === 'ECOMMERCE' ? 'admin-badge--yellow' : 'admin-badge--gray'}`}>{p.category === 'ECOMMERCE' ? 'E-commerce' : 'General'}</span></td>
                <td style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>{p.author}</td>
                <td><span className={`admin-badge admin-badge--${p.isPublished ? 'green' : 'gray'}`}>{p.isPublished ? 'Published' : 'Draft'}</span></td>
                <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{p.publishDate}</td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/blog/${p.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                    <Link href={`/blog/${p.slug}`} className="admin-btn admin-btn--outline admin-btn--sm" target="_blank">View ↗</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
