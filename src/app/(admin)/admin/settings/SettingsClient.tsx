'use client'

import { useState, useRef } from 'react'

/* ── Types ──────────────────────────────────────────────── */
interface Phone   { id: string; label: string; number: string }
interface Email   { id: string; label: string; address: string }
interface Social  { id: string; platform: string; url: string }

interface Initial {
  siteName: string; tagline: string; logoUrl: string; faviconUrl: string
  address: string; businessHours: string; mapEmbedUrl: string
  phones: Phone[]; emails: Email[]; socials: Social[]
  seoTitle: string; seoDescription: string
}

/* ── Social platforms ───────────────────────────────────── */
const PLATFORMS = [
  { value: 'facebook',  label: 'Facebook',    color: '#1877f2' },
  { value: 'instagram', label: 'Instagram',   color: '#e1306c' },
  { value: 'linkedin',  label: 'LinkedIn',    color: '#0077b5' },
  { value: 'twitter',   label: 'Twitter / X', color: '#000' },
  { value: 'youtube',   label: 'YouTube',     color: '#ff0000' },
  { value: 'tiktok',    label: 'TikTok',      color: '#010101' },
  { value: 'whatsapp',  label: 'WhatsApp',    color: '#25d366' },
  { value: 'telegram',  label: 'Telegram',    color: '#2ca5e0' },
  { value: 'pinterest', label: 'Pinterest',   color: '#e60023' },
  { value: 'snapchat',  label: 'Snapchat',    color: '#fffc00' },
  { value: 'threads',   label: 'Threads',     color: '#000' },
]

function platLabel(v: string) {
  return PLATFORMS.find(p => p.value === v)?.label ?? v
}
function platColor(v: string) {
  return PLATFORMS.find(p => p.value === v)?.color ?? '#888'
}

function PlatIcon({ p, size = 18 }: { p: string; size?: number }) {
  const s = { width: size, height: size, display: 'inline-block', flexShrink: 0 } as React.CSSProperties
  switch (p) {
    case 'facebook':  return <svg style={s} viewBox="0 0 24 24" fill="#1877f2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    case 'instagram': return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#e1306c" stroke="none"/></svg>
    case 'linkedin':  return <svg style={s} viewBox="0 0 24 24" fill="#0077b5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    case 'twitter':   return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    case 'youtube':   return <svg style={s} viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
    case 'tiktok':    return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/></svg>
    case 'whatsapp':  return <svg style={s} viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
    case 'telegram':  return <svg style={s} viewBox="0 0 24 24" fill="#2ca5e0"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
    case 'pinterest': return <svg style={s} viewBox="0 0 24 24" fill="#e60023"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
    default:          return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  }
}

/* ── Helpers ────────────────────────────────────────────── */
let _id = 0
const uid = () => String(++_id + Date.now())

function UploadBtn({ folder, onUploaded, uploading, setUploading }: {
  folder: string; onUploaded: (url: string) => void
  uploading: boolean; setUploading: (v: boolean) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  async function handleFile(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (res.ok) { const { url } = await res.json(); onUploaded(url) }
      else alert('Upload failed')
    } finally { setUploading(false) }
  }
  return (
    <label className="admin-btn admin-btn--outline admin-btn--sm" style={{ cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
      {uploading ? 'Uploading…' : '↑ Upload'}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
        disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
    </label>
  )
}

/* ── Main Component ─────────────────────────────────────── */
export default function SettingsClient({ initial }: { initial: Initial }) {
  const [tab, setTab]                 = useState<'general' | 'contact' | 'social' | 'seo'>('general')
  const [siteName, setSiteName]       = useState(initial.siteName)
  const [tagline, setTagline]         = useState(initial.tagline)
  const [logoUrl, setLogoUrl]         = useState(initial.logoUrl)
  const [faviconUrl, setFaviconUrl]   = useState(initial.faviconUrl)
  const [address, setAddress]         = useState(initial.address)
  const [hours, setHours]             = useState(initial.businessHours)
  const [mapEmbedUrl, setMapEmbedUrl] = useState(initial.mapEmbedUrl)
  const [phones, setPhones]           = useState<Phone[]>(initial.phones)
  const [emails, setEmails]           = useState<Email[]>(initial.emails)
  const [socials, setSocials]         = useState<Social[]>(initial.socials)
  const [seoTitle, setSeoTitle]       = useState(initial.seoTitle)
  const [seoDesc, setSeoDesc]         = useState(initial.seoDescription)
  const [logoUpl, setLogoUpl]         = useState(false)
  const [faviconUpl, setFaviconUpl]   = useState(false)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')

  async function handleSave() {
    setSaving(true); setError('')
    const payload: Record<string, string> = {
      site_name:              siteName,
      site_tagline:           tagline,
      site_logo_url:          logoUrl,
      site_favicon_url:       faviconUrl,
      contact_address:        address,
      business_hours:         hours,
      contact_phones:         JSON.stringify(phones),
      contact_emails:         JSON.stringify(emails),
      map_embed_url:          mapEmbedUrl,
      social_links:           JSON.stringify(socials),
      seo_default_title:      seoTitle,
      seo_default_description: seoDesc,
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3500) }
      else setError('Save failed. Please try again.')
    } catch { setError('Network error.') }
    setSaving(false)
  }

  /* ── Phone helpers ──────────────────────────────────────── */
  const addPhone    = () => setPhones(p => [...p, { id: uid(), label: 'Office', number: '' }])
  const removePhone = (id: string) => setPhones(p => p.filter(x => x.id !== id))
  const setPhone    = (id: string, field: 'label' | 'number', val: string) =>
    setPhones(p => p.map(x => x.id === id ? { ...x, [field]: val } : x))

  /* ── Email helpers ──────────────────────────────────────── */
  const addEmail    = () => setEmails(e => [...e, { id: uid(), label: 'General', address: '' }])
  const removeEmail = (id: string) => setEmails(e => e.filter(x => x.id !== id))
  const setEmail    = (id: string, field: 'label' | 'address', val: string) =>
    setEmails(e => e.map(x => x.id === id ? { ...x, [field]: val } : x))

  /* ── Social helpers ─────────────────────────────────────── */
  const addSocial    = () => setSocials(s => [...s, { id: uid(), platform: 'facebook', url: '' }])
  const removeSocial = (id: string) => setSocials(s => s.filter(x => x.id !== id))
  const setSocial    = (id: string, field: 'platform' | 'url', val: string) =>
    setSocials(s => s.map(x => x.id === id ? { ...x, [field]: val } : x))

  /* ── Sub-section label ──────────────────────────────────── */
  const SubLabel = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.85rem' }}>{children}</p>
  )

  const tabStyle = (t: typeof tab): React.CSSProperties => ({
    padding: '0.55rem 1.2rem',
    borderRadius: '0.4rem',
    border: '1px solid',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    background:   tab === t ? 'rgba(215,38,46,0.18)' : 'rgba(255,255,255,0.04)',
    borderColor:  tab === t ? 'rgba(215,38,46,0.5)'  : 'rgba(255,255,255,0.1)',
    color:        tab === t ? '#ff6b73'               : 'rgba(255,255,255,0.55)',
  })

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-sub">Site-wide configuration stored in the database</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {saved  && <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>✓ Saved</span>}
          {error  && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</span>}
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button style={tabStyle('general')} onClick={() => setTab('general')}>⚙ General</button>
        <button style={tabStyle('contact')} onClick={() => setTab('contact')}>✆ Contact</button>
        <button style={tabStyle('social')}  onClick={() => setTab('social')}>◎ Social Media</button>
        <button style={tabStyle('seo')}     onClick={() => setTab('seo')}>◈ SEO</button>
      </div>

      {/* ── GENERAL tab ───────────────────────────────────────── */}
      {tab === 'general' && (
        <>
          {/* Site Identity */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <SubLabel>Site Identity</SubLabel>
            <div className="admin-form-row" style={{ marginBottom: '1rem' }}>
              <div className="admin-field">
                <label className="admin-label">Site Name</label>
                <input className="admin-input" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="KTI Marketing" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Tagline</label>
                <input className="admin-input" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Bold Strategy. Real Revenue." />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <SubLabel>Site Logo</SubLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {logoUrl ? (
                <div style={{ width: 120, height: 50, background: 'rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={logoUrl} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ width: 120, height: 50, background: 'rgba(255,255,255,0.04)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.12)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>No logo</div>
              )}
              <div style={{ flex: 1, minWidth: 220 }}>
                <input className="admin-input" style={{ marginBottom: '0.5rem' }} value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://… or upload →" />
                <UploadBtn folder="branding" onUploaded={setLogoUrl} uploading={logoUpl} setUploading={setLogoUpl} />
              </div>
              {logoUrl && (
                <button type="button" onClick={() => setLogoUrl('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.1rem' }} title="Remove logo">×</button>
              )}
            </div>
            <p style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>Recommended: SVG or PNG with transparent background, at least 200 × 60 px</p>
          </div>

          {/* Favicon */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <SubLabel>Favicon</SubLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {faviconUrl ? (
                <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={faviconUrl} alt="Favicon preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.04)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.12)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>ICO</div>
              )}
              <div style={{ flex: 1, minWidth: 220 }}>
                <input className="admin-input" style={{ marginBottom: '0.5rem' }} value={faviconUrl} onChange={e => setFaviconUrl(e.target.value)} placeholder="https://… or upload →" />
                <UploadBtn folder="branding" onUploaded={setFaviconUrl} uploading={faviconUpl} setUploading={setFaviconUpl} />
              </div>
              {faviconUrl && (
                <button type="button" onClick={() => setFaviconUrl('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.1rem' }} title="Remove">×</button>
              )}
            </div>
            <p style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>Recommended: ICO or 32 × 32 PNG / SVG</p>
          </div>
        </>
      )}

      {/* ── CONTACT tab ───────────────────────────────────────── */}
      {tab === 'contact' && (
        <>
          {/* Phone Numbers */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SubLabel>Phone Numbers</SubLabel>
              <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={addPhone}>+ Add Phone</button>
            </div>
            {phones.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No phone numbers added yet.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {phones.map(ph => (
                <div key={ph.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '0.6rem', alignItems: 'center' }}>
                  <input className="admin-input" value={ph.label} onChange={e => setPhone(ph.id, 'label', e.target.value)} placeholder="Label (e.g. Main)" style={{ fontSize: '0.82rem' }} />
                  <input className="admin-input" value={ph.number} onChange={e => setPhone(ph.id, 'number', e.target.value)} placeholder="+880 1234 567890" type="tel" />
                  <button type="button" onClick={() => removePhone(ph.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '0.4rem', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Email Addresses */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SubLabel>Email Addresses</SubLabel>
              <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={addEmail}>+ Add Email</button>
            </div>
            {emails.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No email addresses added yet.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {emails.map(em => (
                <div key={em.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '0.6rem', alignItems: 'center' }}>
                  <input className="admin-input" value={em.label} onChange={e => setEmail(em.id, 'label', e.target.value)} placeholder="Label (e.g. Support)" style={{ fontSize: '0.82rem' }} />
                  <input className="admin-input" value={em.address} onChange={e => setEmail(em.id, 'address', e.target.value)} placeholder="hello@example.com" type="email" />
                  <button type="button" onClick={() => removeEmail(em.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '0.4rem', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Office Info */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <SubLabel>Office Info</SubLabel>
            <div className="admin-field" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Physical Address</label>
              <textarea className="admin-textarea" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Street, Dhaka, Bangladesh" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Business Hours</label>
              <input className="admin-input" value={hours} onChange={e => setHours(e.target.value)} placeholder="Sun – Thu: 9 AM – 6 PM" />
            </div>
          </div>

          {/* Map Embed */}
          <div className="admin-card">
            <SubLabel>Footer Map</SubLabel>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Paste a Google Maps embed URL. To get it: open Google Maps → find your location → Share → Embed a map → copy the <code style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 3, padding: '1px 5px' }}>src</code> value from the iframe code.
            </p>
            <div className="admin-field" style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Google Maps Embed URL</label>
              <input
                className="admin-input"
                value={mapEmbedUrl}
                onChange={e => setMapEmbedUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
            {mapEmbedUrl && (
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: 200 }}>
                <iframe
                  src={mapEmbedUrl}
                  title="Map preview"
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* ── SOCIAL MEDIA tab ──────────────────────────────────── */}
      {tab === 'social' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <SubLabel>Social Media Channels</SubLabel>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Select a platform and paste your profile or page URL</p>
            </div>
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={addSocial}>+ Add Channel</button>
          </div>

          {socials.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No social channels added. Click <strong>+ Add Channel</strong> to start.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {socials.map(sc => (
              <div key={sc.id} style={{ display: 'grid', gridTemplateColumns: '210px 1fr auto', gap: '0.65rem', alignItems: 'center' }}>
                {/* Platform selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 0.75rem', height: 38 }}>
                  <PlatIcon p={sc.platform} size={17} />
                  <select
                    value={sc.platform}
                    onChange={e => setSocial(sc.id, 'platform', e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.83rem', outline: 'none', cursor: 'pointer', flex: 1, minWidth: 0 }}
                  >
                    {PLATFORMS.map(p => <option key={p.value} value={p.value} style={{ background: '#1a1a1a' }}>{p.label}</option>)}
                  </select>
                </div>
                {/* URL input */}
                <input
                  className="admin-input"
                  value={sc.url}
                  onChange={e => setSocial(sc.id, 'url', e.target.value)}
                  placeholder={`https://${sc.platform}.com/yourpage`}
                  type="url"
                />
                <button type="button" onClick={() => removeSocial(sc.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '0.4rem', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>

          {socials.length > 0 && (
            <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Channels</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {socials.filter(s => s.url).map(s => (
                  <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '0.25rem 0.75rem 0.25rem 0.5rem', fontSize: '0.78rem', color: '#fff' }}>
                    <PlatIcon p={s.platform} size={14} />
                    {platLabel(s.platform)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SEO tab ───────────────────────────────────────────── */}
      {tab === 'seo' && (
        <div className="admin-card">
          <SubLabel>Default SEO Settings</SubLabel>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>These values are used as fallbacks when a page has no custom SEO settings.</p>
          <div className="admin-field" style={{ marginBottom: '1rem' }}>
            <label className="admin-label">Default Meta Title</label>
            <input className="admin-input" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="KTI Marketing — Bold Strategy. Real Revenue." />
            <p style={{ marginTop: '0.35rem', fontSize: '0.73rem', color: Number(seoTitle.length) > 60 ? '#f87171' : 'rgba(255,255,255,0.25)' }}>{seoTitle.length}/60 characters</p>
          </div>
          <div className="admin-field">
            <label className="admin-label">Default Meta Description</label>
            <textarea className="admin-textarea" rows={3} value={seoDesc} onChange={e => setSeoDesc(e.target.value)} placeholder="Full-service growth agency for ambitious brands." />
            <p style={{ marginTop: '0.35rem', fontSize: '0.73rem', color: Number(seoDesc.length) > 160 ? '#f87171' : 'rgba(255,255,255,0.25)' }}>{seoDesc.length}/160 characters</p>
          </div>
        </div>
      )}

      {/* Sticky save bar */}
      <div style={{ position: 'sticky', bottom: 0, padding: '1rem 0', marginTop: '1.5rem', background: 'transparent', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>✓ All changes saved</span>}
        {error && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</span>}
      </div>
    </>
  )
}
