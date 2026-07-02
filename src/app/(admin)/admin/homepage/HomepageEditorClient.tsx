'use client'

import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────────────────

interface Hero { badge: string; headline: string; highlightWord: string; subheadline: string; cta1Text: string; cta1Url: string; cta2Text: string; cta2Url: string; heroImageUrl: string; heroVideoUrl: string }
interface StatItem { num: string; label: string }
interface BrandItem { name: string; logoUrl: string }
interface PillarItem { icon: string; title: string; body: string }
interface ProcessStep { num: string; title: string; body: string }
interface HomepageData {
  hero: Hero
  stats: StatItem[]
  brands: BrandItem[]
  marquee: string[]
  services: { eyebrow: string; title: string; subtitle: string }
  why: { eyebrow: string; title: string; body: string; pillars: PillarItem[] }
  video: { eyebrow: string; title: string; youtubeUrl: string }
  portfolio: { eyebrow: string; title: string; subtitle: string }
  process: { eyebrow: string; title: string; steps: ProcessStep[] }
  testimonials: { eyebrow: string; title: string }
  blog: { eyebrow: string; title: string }
  cta: { eyebrow: string; title: string; body: string; btnText: string; btnUrl: string; subtext: string }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function saveSection(key: string, value: unknown): Promise<string | null> {
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: JSON.stringify(value) }),
    })
    if (res.ok) return null
    const body = await res.json().catch(() => ({}))
    return body.error ?? `HTTP ${res.status}`
  } catch (e) {
    return e instanceof Error ? e.message : String(e)
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {children}
    </div>
  )
}

function SectionCard({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
          color: '#fff', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.02em',
          borderBottom: open ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        <span>{title}</span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>}
    </div>
  )
}

function SaveBtn({ saving, saved, error, onClick }: { saving: boolean; saved: boolean; error: string | null; onClick: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
      <button type="button" className="admin-btn admin-btn--primary" onClick={onClick} disabled={saving}>
        {saving ? 'Saving…' : 'Save Section'}
      </button>
      {saved && <span style={{ color: '#4ade80', fontSize: '0.875rem' }}>✓ Saved</span>}
      {error && <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{error}</span>}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function HomepageEditorClient({ data }: { data: HomepageData }) {
  // ── Hero ──────────────────────────────────────────────────────────────────
  const [hero, setHero] = useState<Hero>(data.hero)
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroSaved, setHeroSaved] = useState(false)
  const [heroError, setHeroError] = useState<string | null>(null)
  const [heroImgUploading, setHeroImgUploading] = useState(false)
  const [heroImgStatus, setHeroImgStatus] = useState<'ok' | 'err' | null>(null)
  const [heroImgError, setHeroImgError] = useState<string | null>(null)

  async function saveHero() {
    setHeroSaving(true); setHeroSaved(false); setHeroError(null)
    const err = await saveSection('homepage_hero', hero)
    setHeroSaving(false)
    if (!err) { setHeroSaved(true); setTimeout(() => setHeroSaved(false), 3000) } else { setHeroError(err) }
  }

  async function uploadHeroImage(file: File) {
    setHeroImgUploading(true); setHeroImgStatus(null); setHeroImgError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'hero')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        setHero(h => ({ ...h, heroImageUrl: body.url }))
        setHeroImgStatus('ok')
        setTimeout(() => setHeroImgStatus(null), 4000)
      } else {
        setHeroImgStatus('err')
        setHeroImgError(body.error || 'Upload failed')
      }
    } catch (e) {
      setHeroImgStatus('err')
      setHeroImgError(String(e))
    } finally {
      setHeroImgUploading(false)
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<StatItem[]>(data.stats)
  const [statsSaving, setStatsSaving] = useState(false)
  const [statsSaved, setStatsSaved] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)

  async function saveStats() {
    setStatsSaving(true); setStatsSaved(false); setStatsError(null)
    const err = await saveSection('homepage_stats', stats)
    setStatsSaving(false)
    if (!err) { setStatsSaved(true); setTimeout(() => setStatsSaved(false), 3000) } else { setStatsError(err) }
  }

  // ── Brands ────────────────────────────────────────────────────────────────
  const [brands, setBrands] = useState<BrandItem[]>(data.brands)
  const [brandsSaving, setBrandsSaving] = useState(false)
  const [brandsSaved, setBrandsSaved] = useState(false)
  const [brandsError, setBrandsError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<number | null>(null)
  const [uploadStatus, setUploadStatus] = useState<Record<number, 'ok' | 'err'>>({})
  const [uploadError, setUploadError] = useState<Record<number, string>>({})

  async function saveBrands() {
    setBrandsSaving(true); setBrandsSaved(false); setBrandsError(null)
    const err = await saveSection('homepage_brands', brands)
    setBrandsSaving(false)
    if (!err) { setBrandsSaved(true); setTimeout(() => setBrandsSaved(false), 3000) } else { setBrandsError(err) }
  }

  async function uploadLogo(index: number, file: File) {
    setUploading(index)
    setUploadStatus(s => { const n = { ...s }; delete n[index]; return n })
    setUploadError(s => { const n = { ...s }; delete n[index]; return n })
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'brand-logos')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        setBrands(b => b.map((x, i) => i === index ? { ...x, logoUrl: body.url } : x))
        setUploadStatus(s => ({ ...s, [index]: 'ok' }))
        setTimeout(() => setUploadStatus(s => { const n = { ...s }; delete n[index]; return n }), 4000)
      } else {
        console.error('Upload failed:', body)
        setUploadStatus(s => ({ ...s, [index]: 'err' }))
        setUploadError(s => ({ ...s, [index]: body.error || 'Unknown error' }))
      }
    } catch (e) {
      console.error('Upload error:', e)
      setUploadStatus(s => ({ ...s, [index]: 'err' }))
      setUploadError(s => ({ ...s, [index]: String(e) }))
    } finally {
      setUploading(null)
    }
  }

  // ── Marquee ───────────────────────────────────────────────────────────────
  const [marqueeText, setMarqueeText] = useState(data.marquee.join('\n'))
  const [marqueeSaving, setMarqueeSaving] = useState(false)
  const [marqueeSaved, setMarqueeSaved] = useState(false)
  const [marqueeError, setMarqueeError] = useState<string | null>(null)

  async function saveMarquee() {
    setMarqueeSaving(true); setMarqueeSaved(false); setMarqueeError(null)
    const arr = marqueeText.split('\n').map(s => s.trim()).filter(Boolean)
    const err = await saveSection('homepage_marquee', arr)
    setMarqueeSaving(false)
    if (!err) { setMarqueeSaved(true); setTimeout(() => setMarqueeSaved(false), 3000) } else { setMarqueeError(err) }
  }

  // ── Services header ───────────────────────────────────────────────────────
  const [services, setServices] = useState(data.services)
  const [servicesSaving, setServicesSaving] = useState(false)
  const [servicesSaved, setServicesSaved] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

  async function saveServices() {
    setServicesSaving(true); setServicesSaved(false); setServicesError(null)
    const err = await saveSection('homepage_services', services)
    setServicesSaving(false)
    if (!err) { setServicesSaved(true); setTimeout(() => setServicesSaved(false), 3000) } else { setServicesError(err) }
  }

  // ── Why KTI ───────────────────────────────────────────────────────────────
  const [why, setWhy] = useState(data.why)
  const [whySaving, setWhySaving] = useState(false)
  const [whySaved, setWhySaved] = useState(false)
  const [whyError, setWhyError] = useState<string | null>(null)

  async function saveWhy() {
    setWhySaving(true); setWhySaved(false); setWhyError(null)
    const err = await saveSection('homepage_why', why)
    setWhySaving(false)
    if (!err) { setWhySaved(true); setTimeout(() => setWhySaved(false), 3000) } else { setWhyError(err) }
  }

  // ── Video ─────────────────────────────────────────────────────────────────
  const [video, setVideo] = useState(data.video)
  const [videoSaving, setVideoSaving] = useState(false)
  const [videoSaved, setVideoSaved] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  async function saveVideo() {
    setVideoSaving(true); setVideoSaved(false); setVideoError(null)
    const err = await saveSection('homepage_video', video)
    setVideoSaving(false)
    if (!err) { setVideoSaved(true); setTimeout(() => setVideoSaved(false), 3000) } else { setVideoError(err) }
  }

  // ── Portfolio / Case Studies header ───────────────────────────────────────
  const [portfolio, setPortfolio] = useState(data.portfolio)
  const [portfolioSaving, setPortfolioSaving] = useState(false)
  const [portfolioSaved, setPortfolioSaved] = useState(false)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)

  async function savePortfolio() {
    setPortfolioSaving(true); setPortfolioSaved(false); setPortfolioError(null)
    const err = await saveSection('homepage_portfolio', portfolio)
    setPortfolioSaving(false)
    if (!err) { setPortfolioSaved(true); setTimeout(() => setPortfolioSaved(false), 3000) } else { setPortfolioError(err) }
  }

  // ── Process ───────────────────────────────────────────────────────────────
  const [proc, setProc] = useState(data.process)
  const [procSaving, setProcSaving] = useState(false)
  const [procSaved, setProcSaved] = useState(false)
  const [procError, setProcError] = useState<string | null>(null)

  async function saveProcess() {
    setProcSaving(true); setProcSaved(false); setProcError(null)
    const err = await saveSection('homepage_process', proc)
    setProcSaving(false)
    if (!err) { setProcSaved(true); setTimeout(() => setProcSaved(false), 3000) } else { setProcError(err) }
  }

  // ── Testimonials header ───────────────────────────────────────────────────
  const [testimonials, setTestimonials] = useState(data.testimonials)
  const [testimonialsSaving, setTestimonialsSaving] = useState(false)
  const [testimonialsSaved, setTestimonialsSaved] = useState(false)
  const [testimonialsError, setTestimonialsError] = useState<string | null>(null)

  async function saveTestimonials() {
    setTestimonialsSaving(true); setTestimonialsSaved(false); setTestimonialsError(null)
    const err = await saveSection('homepage_testimonials', testimonials)
    setTestimonialsSaving(false)
    if (!err) { setTestimonialsSaved(true); setTimeout(() => setTestimonialsSaved(false), 3000) } else { setTestimonialsError(err) }
  }

  // ── Blog header ───────────────────────────────────────────────────────────
  const [blog, setBlog] = useState(data.blog)
  const [blogSaving, setBlogSaving] = useState(false)
  const [blogSaved, setBlogSaved] = useState(false)
  const [blogError, setBlogError] = useState<string | null>(null)

  async function saveBlog() {
    setBlogSaving(true); setBlogSaved(false); setBlogError(null)
    const err = await saveSection('homepage_blog', blog)
    setBlogSaving(false)
    if (!err) { setBlogSaved(true); setTimeout(() => setBlogSaved(false), 3000) } else { setBlogError(err) }
  }

  // ── Final CTA ─────────────────────────────────────────────────────────────
  const [cta, setCta] = useState(data.cta)
  const [ctaSaving, setCtaSaving] = useState(false)
  const [ctaSaved, setCtaSaved] = useState(false)
  const [ctaError, setCtaError] = useState<string | null>(null)

  async function saveCta() {
    setCtaSaving(true); setCtaSaved(false); setCtaError(null)
    const err = await saveSection('homepage_cta', cta)
    setCtaSaving(false)
    if (!err) { setCtaSaved(true); setTimeout(() => setCtaSaved(false), 3000) } else { setCtaError(err) }
  }

  const inputStyle: CSSProperties = {
    width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.4rem',
    border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box',
  }
  const taStyle: CSSProperties = { ...inputStyle, resize: 'vertical', minHeight: '80px' }
  const row2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage Editor</h1>
          <p className="admin-page-sub">Edit every section of the homepage. Changes are saved per section and go live immediately.</p>
        </div>
        <Link href="/" target="_blank" className="admin-btn admin-btn--outline">Preview Site ↗</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <SectionCard title="Hero Section" defaultOpen>
          <div style={row2}>
            <Field label="Badge Text">
              <input style={inputStyle} value={hero.badge} onChange={e => setHero(h => ({ ...h, badge: e.target.value }))} placeholder="Full-Service Growth Agency" />
            </Field>
            <Field label="Subheadline">
              <input style={inputStyle} value={hero.subheadline} onChange={e => setHero(h => ({ ...h, subheadline: e.target.value }))} placeholder="We build performance campaigns…" />
            </Field>
          </div>
          <Field label="Headline (use line breaks with Enter — each line is a new line on the page)">
            <textarea style={{ ...taStyle, minHeight: '80px' }} value={hero.headline} onChange={e => setHero(h => ({ ...h, headline: e.target.value }))} placeholder={'Bold Strategy.\nReal Revenue.\nZero Compromises.'} />
          </Field>
          <Field label="Highlight Word (this word is shown in red wherever it appears in the headline)">
            <input style={inputStyle} value={hero.highlightWord} onChange={e => setHero(h => ({ ...h, highlightWord: e.target.value }))} placeholder="Revenue" />
          </Field>
          <div style={row2}>
            <Field label="Primary CTA Text">
              <input style={inputStyle} value={hero.cta1Text} onChange={e => setHero(h => ({ ...h, cta1Text: e.target.value }))} placeholder="Start Growing" />
            </Field>
            <Field label="Primary CTA URL">
              <input style={inputStyle} value={hero.cta1Url} onChange={e => setHero(h => ({ ...h, cta1Url: e.target.value }))} placeholder="/contact" />
            </Field>
          </div>
          <div style={row2}>
            <Field label="Secondary CTA Text">
              <input style={inputStyle} value={hero.cta2Text} onChange={e => setHero(h => ({ ...h, cta2Text: e.target.value }))} placeholder="Book a Strategy Call" />
            </Field>
            <Field label="Secondary CTA URL">
              <input style={inputStyle} value={hero.cta2Url} onChange={e => setHero(h => ({ ...h, cta2Url: e.target.value }))} placeholder="/contact" />
            </Field>
          </div>
          <Field label="Background Image">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={hero.heroImageUrl}
                  onChange={e => setHero(h => ({ ...h, heroImageUrl: e.target.value }))}
                  placeholder="Paste image URL or upload below"
                />
                <label style={{ cursor: heroImgUploading ? 'not-allowed' : 'pointer', padding: '0.45rem 0.9rem', background: heroImgUploading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.35rem', fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', userSelect: 'none' }}>
                  {heroImgUploading ? 'Uploading…' : '↑ Upload'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={heroImgUploading} onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroImage(f); e.target.value = '' }} />
                </label>
                {hero.heroImageUrl && (
                  <button type="button" title="Remove image" onClick={() => setHero(h => ({ ...h, heroImageUrl: '' }))} style={{ padding: '0.45rem 0.65rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.35rem', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' }}>×</button>
                )}
              </div>
              {hero.heroImageUrl && (
                <img src={hero.heroImageUrl} alt="Hero preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '0.4rem', opacity: 0.8 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              )}
              {heroImgStatus === 'ok' && <p style={{ margin: 0, fontSize: '0.78rem', color: '#4ade80' }}>✓ Image uploaded — click <strong>Save Section</strong> to apply.</p>}
              {heroImgStatus === 'err' && <p style={{ margin: 0, fontSize: '0.78rem', color: '#f87171' }}>✗ {heroImgError || 'Upload failed'}</p>}
            </div>
          </Field>
          <Field label="Hero Video URL (YouTube — shown on the right side of the hero)">
            <input style={inputStyle} value={hero.heroVideoUrl} onChange={e => setHero(h => ({ ...h, heroVideoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
          </Field>
          <SaveBtn saving={heroSaving} saved={heroSaved} error={heroError} onClick={saveHero} />
        </SectionCard>

        {/* ── Stats Bar ───────────────────────────────────────────────── */}
        <SectionCard title="Stats Bar (4 social proof numbers below the hero)">
          {stats.map((stat, i) => (
            <div key={i} style={row2}>
              <Field label={`Stat ${i + 1} — Number`}>
                <input style={inputStyle} value={stat.num} onChange={e => setStats(s => s.map((x, j) => j === i ? { ...x, num: e.target.value } : x))} placeholder="120+" />
              </Field>
              <Field label={`Stat ${i + 1} — Label`}>
                <input style={inputStyle} value={stat.label} onChange={e => setStats(s => s.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="Brands Grown" />
              </Field>
            </div>
          ))}
          <SaveBtn saving={statsSaving} saved={statsSaved} error={statsError} onClick={saveStats} />
        </SectionCard>

        {/* ── Client Brands ────────────────────────────────────────────── */}
        <SectionCard title="Client Brands (scrolling logo strip)">
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Upload a logo or paste an external image URL. Brands without a logo fall back to displaying the name as text.
          </p>
          {brands.map((brand, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', padding: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                {/* Logo preview */}
                <div style={{ width: 64, height: 64, borderRadius: '0.35rem', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                  {brand.logoUrl
                    ? <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style') }}
                      />
                    : null}
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.3, display: brand.logoUrl ? 'none' : 'block' }}>No logo</span>
                </div>
                {/* Name */}
                <input
                  style={inputStyle}
                  value={brand.name}
                  onChange={e => setBrands(b => b.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  placeholder="Brand name"
                />
                {/* URL */}
                <input
                  style={inputStyle}
                  value={brand.logoUrl}
                  onChange={e => setBrands(b => b.map((x, j) => j === i ? { ...x, logoUrl: e.target.value } : x))}
                  placeholder="Paste image URL here"
                />
                {/* Upload + Remove */}
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <label title="Upload image file" style={{ cursor: uploading !== null ? 'not-allowed' : 'pointer', padding: '0.45rem 0.7rem', background: uploading === i ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.35rem', fontSize: '0.75rem', color: '#fff', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    {uploading === i ? '…' : '↑ Upload'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading !== null} onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(i, f); e.target.value = '' }} />
                  </label>
                  <button type="button" title="Remove" onClick={() => setBrands(b => b.filter((_, j) => j !== i))} style={{ padding: '0.45rem 0.65rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.35rem', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}>×</button>
                </div>
              </div>
              {/* Upload status row */}
              {uploadStatus[i] === 'ok' && (
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#4ade80' }}>✓ Logo uploaded — click <strong>Save Section</strong> to publish it.</p>
              )}
              {uploadStatus[i] === 'err' && (
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#f87171' }}>✗ Upload failed: {uploadError[i] || 'Unknown error'}</p>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setBrands(b => [...b, { name: '', logoUrl: '' }])} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.8rem' }}>
            + Add Brand
          </button>
          <SaveBtn saving={brandsSaving} saved={brandsSaved} error={brandsError} onClick={saveBrands} />
        </SectionCard>

        {/* ── Marquee ──────────────────────────────────────────────────── */}
        <SectionCard title="Marquee Banner (scrolling service tags)">
          <Field label="Service tags — one per line">
            <textarea style={{ ...taStyle, minHeight: '150px' }} value={marqueeText} onChange={e => setMarqueeText(e.target.value)} placeholder={'Social Media Management\nContent Creation\nAds Campaign Management'} />
          </Field>
          <SaveBtn saving={marqueeSaving} saved={marqueeSaved} error={marqueeError} onClick={saveMarquee} />
        </SectionCard>

        {/* ── Services Header ──────────────────────────────────────────── */}
        <SectionCard title="Services Section Header">
          <Field label="Eyebrow">
            <input style={inputStyle} value={services.eyebrow} onChange={e => setServices(s => ({ ...s, eyebrow: e.target.value }))} placeholder="What We Do" />
          </Field>
          <Field label="Title">
            <input style={inputStyle} value={services.title} onChange={e => setServices(s => ({ ...s, title: e.target.value }))} placeholder="Every Service You Need. All Under One Roof." />
          </Field>
          <Field label="Subtitle">
            <textarea style={taStyle} value={services.subtitle} onChange={e => setServices(s => ({ ...s, subtitle: e.target.value }))} placeholder="From brand strategy to performance ads…" />
          </Field>
          <SaveBtn saving={servicesSaving} saved={servicesSaved} error={servicesError} onClick={saveServices} />
        </SectionCard>

        {/* ── Why KTI ──────────────────────────────────────────────────── */}
        <SectionCard title="Why KTI Marketing Section">
          <Field label="Eyebrow">
            <input style={inputStyle} value={why.eyebrow} onChange={e => setWhy(w => ({ ...w, eyebrow: e.target.value }))} placeholder="Why KTI Marketing" />
          </Field>
          <Field label="Title">
            <input style={inputStyle} value={why.title} onChange={e => setWhy(w => ({ ...w, title: e.target.value }))} placeholder="We Don't Chase Metrics. We Chase Revenue." />
          </Field>
          <Field label="Body Text">
            <textarea style={taStyle} value={why.body} onChange={e => setWhy(w => ({ ...w, body: e.target.value }))} placeholder="Most agencies show you follower counts…" />
          </Field>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>4 Pillars</p>
          {why.pillars.map((pillar, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={row2}>
                <Field label={`Pillar ${i + 1} Icon (emoji)`}>
                  <input style={inputStyle} value={pillar.icon} onChange={e => setWhy(w => ({ ...w, pillars: w.pillars.map((p, j) => j === i ? { ...p, icon: e.target.value } : p) }))} placeholder="📈" />
                </Field>
                <Field label={`Pillar ${i + 1} Title`}>
                  <input style={inputStyle} value={pillar.title} onChange={e => setWhy(w => ({ ...w, pillars: w.pillars.map((p, j) => j === i ? { ...p, title: e.target.value } : p) }))} placeholder="Results, Not Excuses" />
                </Field>
              </div>
              <Field label="Body">
                <textarea style={{ ...taStyle, minHeight: '70px' }} value={pillar.body} onChange={e => setWhy(w => ({ ...w, pillars: w.pillars.map((p, j) => j === i ? { ...p, body: e.target.value } : p) }))} />
              </Field>
            </div>
          ))}
          <SaveBtn saving={whySaving} saved={whySaved} error={whyError} onClick={saveWhy} />
        </SectionCard>

        {/* ── Video ────────────────────────────────────────────────────── */}
        <SectionCard title="Video Section">
          <div style={row2}>
            <Field label="Eyebrow">
              <input style={inputStyle} value={video.eyebrow} onChange={e => setVideo(v => ({ ...v, eyebrow: e.target.value }))} placeholder="See Our Work" />
            </Field>
            <Field label="Title">
              <input style={inputStyle} value={video.title} onChange={e => setVideo(v => ({ ...v, title: e.target.value }))} placeholder="Campaigns That Move People." />
            </Field>
          </div>
          <Field label="YouTube Video URL">
            <input style={inputStyle} value={video.youtubeUrl} onChange={e => setVideo(v => ({ ...v, youtubeUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
          </Field>
          <SaveBtn saving={videoSaving} saved={videoSaved} error={videoError} onClick={saveVideo} />
        </SectionCard>

        {/* ── Portfolio Section ────────────────────────────────────────── */}
        <SectionCard title="Case Studies Section Header">
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            The 3 portfolio cards are pulled from <Link href="/admin/portfolio" style={{ color: '#D7262E' }}>Portfolio →</Link> (latest 3 published). Edit their content there.
          </p>
          <Field label="Eyebrow">
            <input style={inputStyle} value={portfolio.eyebrow} onChange={e => setPortfolio(p => ({ ...p, eyebrow: e.target.value }))} placeholder="Case Studies" />
          </Field>
          <Field label="Title">
            <input style={inputStyle} value={portfolio.title} onChange={e => setPortfolio(p => ({ ...p, title: e.target.value }))} placeholder="Results That Speak for Themselves." />
          </Field>
          <Field label="Subtitle">
            <textarea style={taStyle} value={portfolio.subtitle} onChange={e => setPortfolio(p => ({ ...p, subtitle: e.target.value }))} placeholder="We don't believe in case studies that only show the highlights…" />
          </Field>
          <SaveBtn saving={portfolioSaving} saved={portfolioSaved} error={portfolioError} onClick={savePortfolio} />
        </SectionCard>

        {/* ── Process ──────────────────────────────────────────────────── */}
        <SectionCard title="Process Section (How We Work)">
          <div style={row2}>
            <Field label="Eyebrow">
              <input style={inputStyle} value={proc.eyebrow} onChange={e => setProc(p => ({ ...p, eyebrow: e.target.value }))} placeholder="How We Work" />
            </Field>
            <Field label="Title">
              <input style={inputStyle} value={proc.title} onChange={e => setProc(p => ({ ...p, title: e.target.value }))} placeholder="A Proven 3-Step Growth System" />
            </Field>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>3 Steps</p>
          {proc.steps.map((step, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={row2}>
                <Field label={`Step ${i + 1} Number`}>
                  <input style={inputStyle} value={step.num} onChange={e => setProc(p => ({ ...p, steps: p.steps.map((s, j) => j === i ? { ...s, num: e.target.value } : s) }))} placeholder="01" />
                </Field>
                <Field label={`Step ${i + 1} Title`}>
                  <input style={inputStyle} value={step.title} onChange={e => setProc(p => ({ ...p, steps: p.steps.map((s, j) => j === i ? { ...s, title: e.target.value } : s) }))} placeholder="Strategy" />
                </Field>
              </div>
              <Field label="Body">
                <textarea style={{ ...taStyle, minHeight: '70px' }} value={step.body} onChange={e => setProc(p => ({ ...p, steps: p.steps.map((s, j) => j === i ? { ...s, body: e.target.value } : s) }))} />
              </Field>
            </div>
          ))}
          <SaveBtn saving={procSaving} saved={procSaved} error={procError} onClick={saveProcess} />
        </SectionCard>

        {/* ── Testimonials Header ──────────────────────────────────────── */}
        <SectionCard title="Testimonials Section Header">
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Individual testimonial cards are managed in <Link href="/admin/testimonials" style={{ color: '#D7262E' }}>Testimonials →</Link>. Only edit the section header here.
          </p>
          <div style={row2}>
            <Field label="Eyebrow">
              <input style={inputStyle} value={testimonials.eyebrow} onChange={e => setTestimonials(t => ({ ...t, eyebrow: e.target.value }))} placeholder="Client Results" />
            </Field>
            <Field label="Title">
              <input style={inputStyle} value={testimonials.title} onChange={e => setTestimonials(t => ({ ...t, title: e.target.value }))} placeholder="Don't Take Our Word for It." />
            </Field>
          </div>
          <SaveBtn saving={testimonialsSaving} saved={testimonialsSaved} error={testimonialsError} onClick={saveTestimonials} />
        </SectionCard>

        {/* ── Blog Header ──────────────────────────────────────────────── */}
        <SectionCard title="Blog Section Header">
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            The 3 latest blog posts are pulled automatically from <Link href="/admin/blog" style={{ color: '#D7262E' }}>Blog →</Link>.
          </p>
          <div style={row2}>
            <Field label="Eyebrow">
              <input style={inputStyle} value={blog.eyebrow} onChange={e => setBlog(b => ({ ...b, eyebrow: e.target.value }))} placeholder="From the Blog" />
            </Field>
            <Field label="Title">
              <input style={inputStyle} value={blog.title} onChange={e => setBlog(b => ({ ...b, title: e.target.value }))} placeholder="Ideas That Drive Growth" />
            </Field>
          </div>
          <SaveBtn saving={blogSaving} saved={blogSaved} error={blogError} onClick={saveBlog} />
        </SectionCard>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <SectionCard title="Final CTA Section (bottom of page)">
          <div style={row2}>
            <Field label="Eyebrow">
              <input style={inputStyle} value={cta.eyebrow} onChange={e => setCta(c => ({ ...c, eyebrow: e.target.value }))} placeholder="Ready to Grow?" />
            </Field>
            <Field label="Button Text">
              <input style={inputStyle} value={cta.btnText} onChange={e => setCta(c => ({ ...c, btnText: e.target.value }))} placeholder="Get a Free Strategy Call →" />
            </Field>
          </div>
          <Field label="Title (use Enter for line breaks)">
            <textarea style={{ ...taStyle, minHeight: '70px' }} value={cta.title} onChange={e => setCta(c => ({ ...c, title: e.target.value }))} placeholder={'Stop Leaving Revenue\non the Table.'} />
          </Field>
          <Field label="Body Text">
            <textarea style={taStyle} value={cta.body} onChange={e => setCta(c => ({ ...c, body: e.target.value }))} placeholder="Let's build a custom growth strategy…" />
          </Field>
          <div style={row2}>
            <Field label="Button URL">
              <input style={inputStyle} value={cta.btnUrl} onChange={e => setCta(c => ({ ...c, btnUrl: e.target.value }))} placeholder="/contact" />
            </Field>
            <Field label="Sub-text (below button)">
              <input style={inputStyle} value={cta.subtext} onChange={e => setCta(c => ({ ...c, subtext: e.target.value }))} placeholder="No commitment required · Strategy session is 100% free" />
            </Field>
          </div>
          <SaveBtn saving={ctaSaving} saved={ctaSaved} error={ctaError} onClick={saveCta} />
        </SectionCard>

      </div>
    </>
  )
}
