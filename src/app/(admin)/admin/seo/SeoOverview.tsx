'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { calculateSeoScore, getScoreColor, getScoreLabel } from '@/lib/seo-utils'
import type { STATIC_PAGES } from '@/lib/seo-utils'

interface ExistingPage {
  id: string
  pageKey: string
  pageLabel: string
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  ogImage: string | null
  twitterCard: string | null
  robotsIndex: boolean
  updatedAt: string
  _schemasActive: number
}

type StaticPage = typeof STATIC_PAGES[number]

interface Props {
  staticPages: (StaticPage & { seo: ExistingPage | null })[]
}

export default function SeoOverview({ staticPages }: Props) {
  const router = useRouter()
  const [seeding, setSeeding] = useState(false)
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [configureError, setConfigureError] = useState('')

  async function handleSeedAll() {
    setSeeding(true)
    setConfigureError('')
    const res = await fetch('/api/admin/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seedAll: true }),
    })
    if (res.ok) router.refresh()
    else {
      const data = await res.json().catch(() => ({}))
      setConfigureError(data.error ?? 'Failed to set up pages')
    }
    setSeeding(false)
  }

  async function handleConfigure(pageKey: string, pageLabel: string) {
    setConfiguring(pageKey)
    setConfigureError('')
    const res = await fetch('/api/admin/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageKey, pageLabel }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/admin/seo/${data.id}/edit`)
    } else {
      const data = await res.json().catch(() => ({}))
      setConfigureError(data.error ?? 'Failed to configure — check server logs')
    }
    setConfiguring(null)
  }

  const unconfigured = staticPages.filter(p => !p.seo).length
  const configured = staticPages.filter(p => p.seo).length

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">SEO Manager</h1>
          <p className="admin-page-sub">{configured}/{staticPages.length} pages configured</p>
        </div>
        {unconfigured > 0 && (
          <button className="admin-btn admin-btn--primary" onClick={handleSeedAll} disabled={seeding}>
            {seeding ? 'Setting up…' : `Setup All ${unconfigured} Missing Pages`}
          </button>
        )}
      </div>

      {configureError && (
        <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
          {configureError}
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{configured}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Pages Configured</div>
        </div>
        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: unconfigured > 0 ? '#f87171' : '#4ade80' }}>{unconfigured}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Not Configured</div>
        </div>
        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#4ade80' }}>
            {staticPages.filter(p => p.seo && p.seo.metaTitle && p.seo.metaDescription).length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>With Meta Data</div>
        </div>
        <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#a78bfa' }}>
            {staticPages.filter(p => p.seo && p.seo._schemasActive > 0).length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>With Schema Markup</div>
        </div>
      </div>

      {/* Static Pages Table */}
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Path</th>
              <th>Focus Keyword</th>
              <th>Meta Title</th>
              <th>Schemas</th>
              <th>SEO Score</th>
              <th>Robots</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staticPages.map(page => {
              const seoScore = page.seo ? calculateSeoScore({
                focusKeyword: page.seo.focusKeyword,
                metaTitle: page.seo.metaTitle,
                metaDescription: page.seo.metaDescription,
                canonicalUrl: null,
                ogTitle: null,
                ogImage: page.seo.ogImage,
                twitterCard: page.seo.twitterCard,
                schemasCount: page.seo._schemasActive,
              }).score : 0
              const color = getScoreColor(seoScore)
              const label = page.seo ? getScoreLabel(seoScore) : 'Not Set'
              return (
                <tr key={page.key}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{page.label}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontFamily: 'monospace' }}>{page.path}</td>
                  <td>
                    {page.seo?.focusKeyword
                      ? <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{page.seo.focusKeyword}</span>
                      : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                    {page.seo?.metaTitle || <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                  </td>
                  <td>
                    {page.seo && page.seo._schemasActive > 0
                      ? <span className="admin-badge admin-badge--green">{page.seo._schemasActive} schema{page.seo._schemasActive > 1 ? 's' : ''}</span>
                      : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600 }}>
                      <span style={{ color, fontSize: '1rem', lineHeight: 1 }}>●</span>
                      {page.seo && <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{seoScore}%</span>}
                      <span style={{ color: page.seo ? color : 'rgba(255,255,255,0.2)', fontWeight: 400 }}>{label}</span>
                    </span>
                  </td>
                  <td>
                    {page.seo
                      ? <span className={`admin-badge admin-badge--${page.seo.robotsIndex ? 'green' : 'gray'}`}>{page.seo.robotsIndex ? 'Indexed' : 'NoIndex'}</span>
                      : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td>
                    {page.seo
                      ? (
                        <Link href={`/admin/seo/${page.seo.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">
                          Edit SEO
                        </Link>
                      )
                      : (
                        <button
                          className="admin-btn admin-btn--primary admin-btn--sm"
                          disabled={configuring === page.key}
                          onClick={() => handleConfigure(page.key, page.label)}
                        >
                          {configuring === page.key ? 'Setting up…' : 'Configure'}
                        </button>
                      )
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Content Types info section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Dynamic Content SEO
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Blog Posts', path: '/admin/blog', note: 'Meta title, description, OG image & canonical URL per post' },
            { label: 'Case Studies', path: '/admin/case-studies', note: 'Meta title, description & OG image per case study' },
            { label: 'Services', path: '/admin/services', note: 'Meta title, description & OG image per service' },
            { label: 'Job Listings', path: '/admin/jobs', note: 'Meta title & description per job listing' },
          ].map(item => (
            <div key={item.label} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{item.note}</div>
              </div>
              <Link href={item.path} className="admin-btn admin-btn--outline admin-btn--sm">Manage</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
