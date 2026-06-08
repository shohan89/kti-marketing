'use client'

import { useState } from 'react'
import { calculateReadabilityScore } from '@/lib/seo-utils'
import type { PageSeoData } from '@/lib/seo-utils'
import SerpPreview from './SerpPreview'
import SeoScore from './SeoScore'
import SchemaBuilder from './SchemaBuilder'
import OgPreview from './OgPreview'

type Tab = 'meta' | 'og' | 'twitter' | 'schema' | 'advanced' | 'readability'

const TABS: { id: Tab; label: string }[] = [
  { id: 'meta',        label: 'Meta Tags' },
  { id: 'og',          label: 'Open Graph' },
  { id: 'twitter',     label: 'Twitter Card' },
  { id: 'schema',      label: 'Schema Markup' },
  { id: 'advanced',    label: 'Advanced SEO' },
  { id: 'readability', label: 'Readability' },
]

interface Props {
  pageId: string
  pageLabel: string
  initialData: PageSeoData
}

function ProgressBar({ value, max, warn, limit }: { value: string; max: number; warn: number; limit: number }) {
  const len = value.length
  const pct = Math.min(100, (len / max) * 100)
  const color = len > limit ? '#f87171' : len > warn ? '#fbbf24' : len >= 10 ? '#4ade80' : 'rgba(255,255,255,0.15)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width 0.2s' }} />
      </div>
      <span style={{ fontSize: '0.68rem', color, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
        {len}/{max}
      </span>
    </div>
  )
}

function CopyButton({ onClick }: { onClick: () => void }) {
  const [copied, setCopied] = useState(false)
  function handle() {
    onClick()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      type="button"
      onClick={handle}
      style={{
        fontSize: '0.65rem', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '4px', background: 'transparent', color: copied ? '#4ade80' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy from meta'}
    </button>
  )
}

function ReadabilityTab({ content, onChange }: { content: string; onChange: (v: string) => void }) {
  const result = content.trim() ? calculateReadabilityScore(content) : null
  const levelColor = result
    ? result.level === 'Easy' ? '#4ade80' : result.level === 'OK' ? '#fbbf24' : '#f87171'
    : 'rgba(255,255,255,0.2)'
  return (
    <div className="admin-form">
      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
        Paste your page&apos;s main body content below. The readability score updates in real-time and appears in the SEO Analysis sidebar.
      </div>
      <div className="admin-field">
        <label className="admin-label">Page Content</label>
        <textarea
          className="admin-textarea"
          rows={14}
          value={content}
          onChange={e => onChange(e.target.value)}
          placeholder={"Paste your main body text here to analyze readability…\n\nWe help ambitious brands grow faster with data-driven digital marketing strategies."}
        />
      </div>
      {result && (
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: levelColor }}>{result.score}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginLeft: '0.4rem' }}>/ 100</span>
            </div>
            <span style={{ background: levelColor, color: '#000', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>{result.level}</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Flesch Reading Ease</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Avg Sentence', value: `${result.avgSentenceLength} words` },
              { label: 'Avg Word Length', value: `${result.avgWordLength} chars` },
              { label: 'Paragraphs', value: String(result.paragraphCount) },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{stat.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          {result.checks.map((c, i) => {
            const isGood = !c.includes('—') && !c.includes('aim') && !c.includes('Add') && !c.includes('very')
            return (
              <div key={i} style={{ fontSize: '0.75rem', color: isGood ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.4)', display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span style={{ color: isGood ? '#4ade80' : '#f87171', fontSize: '0.55rem', marginTop: '3px', flexShrink: 0 }}>●</span>
                {c}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SeoEditor({ pageId, pageLabel, initialData }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('meta')

  // Meta Tags
  const [focusKeyword, setFocusKeyword]       = useState(initialData.focusKeyword ?? '')
  const [metaTitle, setMetaTitle]             = useState(initialData.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData.metaDescription ?? '')
  const [canonicalUrl, setCanonicalUrl]       = useState(initialData.canonicalUrl ?? '')

  // Open Graph
  const [ogTitle, setOgTitle]               = useState(initialData.ogTitle ?? '')
  const [ogDescription, setOgDescription]   = useState(initialData.ogDescription ?? '')
  const [ogImage, setOgImage]               = useState(initialData.ogImage ?? '')
  const [ogUrl, setOgUrl]                   = useState(initialData.ogUrl ?? '')
  const [ogType, setOgType]                 = useState(initialData.ogType ?? 'website')

  // Twitter
  const [twitterCard, setTwitterCard]                   = useState(initialData.twitterCard ?? 'summary_large_image')
  const [twitterTitle, setTwitterTitle]                 = useState(initialData.twitterTitle ?? '')
  const [twitterDescription, setTwitterDescription]     = useState(initialData.twitterDescription ?? '')
  const [twitterImage, setTwitterImage]                 = useState(initialData.twitterImage ?? '')

  // Advanced
  const [robotsIndex, setRobotsIndex]   = useState(initialData.robotsIndex)
  const [robotsFollow, setRobotsFollow] = useState(initialData.robotsFollow)
  const [priority, setPriority]         = useState(initialData.priority)
  const [changeFreq, setChangeFreq]     = useState(initialData.changeFreq)

  // Readability
  const [readabilityContent, setReadabilityContent] = useState('')

  // Schemas count for score
  const [activeSchemasCount, setActiveSchemasCount] = useState(
    (initialData.schemas ?? []).filter(s => s.isActive).length
  )

  // UI
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  // Keyword density (rough: occurrences in title + description combined)
  const combinedText = `${metaTitle} ${metaDescription}`.toLowerCase()
  const kwTrimmed = focusKeyword.toLowerCase().trim()
  const kwOccurrences = kwTrimmed
    ? combinedText.split(kwTrimmed).length - 1
    : 0
  const kwTotalWords = combinedText.split(/\s+/).filter(Boolean).length
  const kwDensity = kwTrimmed && kwTotalWords > 0
    ? ((kwOccurrences / kwTotalWords) * 100).toFixed(1)
    : null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/seo/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        focusKeyword: focusKeyword || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        ogUrl: ogUrl || null,
        ogType,
        twitterCard,
        twitterTitle: twitterTitle || null,
        twitterDescription: twitterDescription || null,
        twitterImage: twitterImage || null,
        robotsIndex,
        robotsFollow,
        priority,
        changeFreq,
      }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
    }
    setSaving(false)
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">SEO: {pageLabel}</h1>
          <p className="admin-page-sub">Meta tags, Open Graph, Twitter Card, schema markup and advanced settings.</p>
        </div>
        {saved && <span style={{ color: '#4ade80', fontSize: '0.875rem', alignSelf: 'center' }}>✓ Saved</span>}
      </div>

      {error && (
        <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '0', background: '#111118', borderRadius: '10px 10px 0 0', border: '1px solid rgba(255,255,255,0.07)', borderBottom: 'none', overflow: 'hidden' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 0.4rem',
                    background: activeTab === tab.id ? '#1a1a28' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #f87171' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="admin-card" style={{ borderRadius: '0 0 10px 10px' }}>

              {/* ── Meta Tags ──────────────────────────────────── */}
              {activeTab === 'meta' && (
                <div className="admin-form">
                  <div className="admin-field">
                    <label className="admin-label">
                      Focus Keyword
                      {kwDensity && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: Number(kwDensity) > 3 ? '#f87171' : Number(kwDensity) >= 0.5 ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                          — {kwDensity}% density in title + description
                        </span>
                      )}
                    </label>
                    <input
                      className="admin-input"
                      value={focusKeyword}
                      onChange={e => setFocusKeyword(e.target.value)}
                      placeholder="e.g. digital marketing agency bangladesh"
                    />
                    {kwTrimmed && !metaTitle.toLowerCase().includes(kwTrimmed) && (
                      <span style={{ fontSize: '0.7rem', color: '#fbbf24' }}>⚠ Keyword not found in meta title</span>
                    )}
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Meta Title</label>
                    <input
                      className="admin-input"
                      value={metaTitle}
                      onChange={e => setMetaTitle(e.target.value)}
                      placeholder="60 characters recommended"
                      style={{ borderColor: metaTitle.length > 60 ? 'rgba(248,113,113,0.5)' : undefined }}
                    />
                    <ProgressBar value={metaTitle} max={60} warn={50} limit={60} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Meta Description</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={metaDescription}
                      onChange={e => setMetaDescription(e.target.value)}
                      placeholder="120–160 characters recommended"
                      style={{ borderColor: metaDescription.length > 160 ? 'rgba(248,113,113,0.5)' : undefined }}
                    />
                    <ProgressBar value={metaDescription} max={160} warn={140} limit={160} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Canonical URL</label>
                    <input
                      className="admin-input"
                      value={canonicalUrl}
                      onChange={e => setCanonicalUrl(e.target.value)}
                      placeholder="https://ktimarketing.com/page"
                    />
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>Prevents duplicate content — use full absolute HTTPS URL</span>
                  </div>
                </div>
              )}

              {/* ── Open Graph ─────────────────────────────────── */}
              {activeTab === 'og' && (
                <div className="admin-form">
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    Open Graph controls how your page appears when shared on Facebook, LinkedIn, and other platforms.
                  </div>
                  <div className="admin-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="admin-label" style={{ margin: 0 }}>OG Title</label>
                      {metaTitle && <CopyButton onClick={() => setOgTitle(metaTitle)} />}
                    </div>
                    <input className="admin-input" value={ogTitle} onChange={e => setOgTitle(e.target.value)} placeholder={metaTitle || 'Falls back to meta title'} />
                    <ProgressBar value={ogTitle} max={95} warn={80} limit={95} />
                  </div>
                  <div className="admin-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="admin-label" style={{ margin: 0 }}>OG Description</label>
                      {metaDescription && <CopyButton onClick={() => setOgDescription(metaDescription)} />}
                    </div>
                    <textarea className="admin-textarea" rows={3} value={ogDescription} onChange={e => setOgDescription(e.target.value)} placeholder={metaDescription || 'Falls back to meta description'} />
                    <ProgressBar value={ogDescription} max={200} warn={180} limit={200} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">OG Image URL <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>1200×630px recommended</span></label>
                    <input className="admin-input" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://…" />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label className="admin-label">OG URL</label>
                      <input className="admin-input" value={ogUrl} onChange={e => setOgUrl(e.target.value)} placeholder={canonicalUrl || 'https://ktimarketing.com/page'} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">OG Type</label>
                      <select className="admin-select" value={ogType} onChange={e => setOgType(e.target.value)}>
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="profile">profile</option>
                        <option value="book">book</option>
                        <option value="product">product</option>
                      </select>
                    </div>
                  </div>
                  <OgPreview
                    ogImage={ogImage}
                    ogTitle={ogTitle}
                    ogDescription={ogDescription}
                    ogUrl={ogUrl}
                    canonicalUrl={canonicalUrl}
                    metaTitle={metaTitle}
                    metaDescription={metaDescription}
                  />
                </div>
              )}

              {/* ── Twitter Card ───────────────────────────────── */}
              {activeTab === 'twitter' && (
                <div className="admin-form">
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    Twitter Card controls how your page appears when shared on X (Twitter).
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Card Type</label>
                    <select className="admin-select" value={twitterCard} onChange={e => setTwitterCard(e.target.value)}>
                      <option value="summary_large_image">summary_large_image — Large image card</option>
                      <option value="summary">summary — Small image card</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Twitter Title</label>
                      {metaTitle && <CopyButton onClick={() => setTwitterTitle(metaTitle)} />}
                    </div>
                    <input className="admin-input" value={twitterTitle} onChange={e => setTwitterTitle(e.target.value)} placeholder={metaTitle || 'Falls back to meta title'} />
                    <ProgressBar value={twitterTitle} max={70} warn={60} limit={70} />
                  </div>
                  <div className="admin-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Twitter Description</label>
                      {metaDescription && <CopyButton onClick={() => setTwitterDescription(metaDescription)} />}
                    </div>
                    <textarea className="admin-textarea" rows={3} value={twitterDescription} onChange={e => setTwitterDescription(e.target.value)} placeholder={metaDescription || 'Falls back to meta description'} />
                    <ProgressBar value={twitterDescription} max={200} warn={180} limit={200} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Twitter Image URL</label>
                    <input className="admin-input" value={twitterImage} onChange={e => setTwitterImage(e.target.value)} placeholder={ogImage || 'https://… (2:1 ratio for large image card)'} />
                  </div>
                  {/* Twitter card preview */}
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>X (Twitter) Card Preview</div>
                    <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', maxWidth: '440px', border: '1px solid #e1e8ed' }}>
                      {(twitterImage || ogImage) && (
                        <div style={{ background: '#f5f8fa', height: twitterCard === 'summary_large_image' ? '230px' : '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={twitterImage || ogImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        </div>
                      )}
                      <div style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#657786', marginBottom: '2px' }}>
                          {canonicalUrl ? (() => { try { return new URL(canonicalUrl).hostname } catch { return 'ktimarketing.com' } })() : 'ktimarketing.com'}
                        </div>
                        <div style={{ fontWeight: 700, color: '#14171a', fontSize: '0.9rem', marginBottom: '3px' }}>
                          {(twitterTitle || metaTitle || 'Page Title').slice(0, 70)}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#657786' }}>
                          {(twitterDescription || metaDescription || 'Page description').slice(0, 160)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Schema Markup ──────────────────────────────── */}
              {activeTab === 'schema' && (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      Structured data helps search engines understand your content and can enable rich results in Google Search (star ratings, FAQs, breadcrumbs, etc.)
                    </div>
                  </div>
                  <SchemaBuilder
                    pageId={pageId}
                    initialSchemas={initialData.schemas ?? []}
                    onCountChange={setActiveSchemasCount}
                  />
                </div>
              )}

              {/* ── Advanced SEO ───────────────────────────────── */}
              {activeTab === 'advanced' && (
                <div className="admin-form">
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label className="admin-label">Robots — Indexing</label>
                      <select className="admin-select" value={robotsIndex ? '1' : '0'} onChange={e => setRobotsIndex(e.target.value === '1')}>
                        <option value="1">index — Allow search engines to index</option>
                        <option value="0">noindex — Prevent indexing</option>
                      </select>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Robots — Link Following</label>
                      <select className="admin-select" value={robotsFollow ? '1' : '0'} onChange={e => setRobotsFollow(e.target.value === '1')}>
                        <option value="1">follow — Follow links on this page</option>
                        <option value="0">nofollow — Don&apos;t follow links</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '-0.25rem' }}>
                    robots meta tag will output: <code style={{ color: '#fff', fontFamily: 'monospace' }}>{robotsIndex ? 'index' : 'noindex'}, {robotsFollow ? 'follow' : 'nofollow'}</code>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label className="admin-label">Sitemap Priority (0.0–1.0)</label>
                      <input
                        className="admin-input"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={priority}
                        onChange={e => setPriority(Number(e.target.value))}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>Homepage = 1.0, important pages = 0.8, others = 0.5</span>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Change Frequency</label>
                      <select className="admin-select" value={changeFreq} onChange={e => setChangeFreq(e.target.value)}>
                        <option value="always">always</option>
                        <option value="hourly">hourly</option>
                        <option value="daily">daily</option>
                        <option value="weekly">weekly</option>
                        <option value="monthly">monthly</option>
                        <option value="yearly">yearly</option>
                        <option value="never">never</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Readability ────────────────────────────────── */}
              {activeTab === 'readability' && (
                <ReadabilityTab
                  content={readabilityContent}
                  onChange={setReadabilityContent}
                />
              )}

            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save SEO Settings'}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem' }}>
            {/* SERP Preview */}
            <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
              <div className="admin-section-title" style={{ marginBottom: '0.75rem' }}>Google SERP Preview</div>
              <SerpPreview
                title={metaTitle}
                description={metaDescription}
                url={canonicalUrl}
              />
            </div>

            {/* SEO Score */}
            <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
              <div className="admin-section-title" style={{ marginBottom: '0.75rem' }}>SEO Analysis</div>
              <SeoScore
                focusKeyword={focusKeyword}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                canonicalUrl={canonicalUrl}
                ogTitle={ogTitle}
                ogDescription={ogDescription}
                ogImage={ogImage}
                ogUrl={ogUrl}
                twitterCard={twitterCard}
                twitterTitle={twitterTitle}
                twitterImage={twitterImage}
                schemasCount={activeSchemasCount}
                readabilityContent={readabilityContent}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
