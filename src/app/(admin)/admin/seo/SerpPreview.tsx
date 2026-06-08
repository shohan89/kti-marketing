'use client'

interface Props {
  title: string
  description: string
  url: string
}

// Approximate px widths: 1 char ≈ 8.5px for title (20px system-ui), 6.5px for description
const TITLE_MAX_PX = 580
const DESC_MAX_PX = 960
const TITLE_PX_PER_CHAR = 8.5
const DESC_PX_PER_CHAR = 6.5

function ProgressBar({ value, max, warn, label }: { value: number; max: number; warn: number; label: string }) {
  const pct = Math.min(100, (value / max) * 100)
  const color = value > max ? '#f87171' : value > warn ? '#fbbf24' : '#4ade80'
  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', marginBottom: '2px' }}>
        <span>{label}</span>
        <span style={{ color: value > max ? '#ef4444' : value > warn ? '#d97706' : '#16a34a', fontWeight: 600 }}>
          {Math.round(value)}px {value > max ? '(over limit)' : value > warn ? '(close)' : '(good)'}
        </span>
      </div>
      <div style={{ height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

function getBreadcrumb(url: string): string {
  try {
    const parsed = new URL(url)
    const parts = [parsed.hostname.replace('www.', '')]
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    return [...parts, ...pathParts].join(' › ')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

export default function SerpPreview({ title, description, url }: Props) {
  const displayTitle = title || 'Page Title — KTI Marketing'
  const displayDesc = description || 'Page description will appear here in Google search results.'
  const displayUrl = url || 'https://ktimarketing.com'

  const titlePx = displayTitle.length * TITLE_PX_PER_CHAR
  const descPx = displayDesc.length * DESC_PX_PER_CHAR

  const truncTitle = titlePx > TITLE_MAX_PX
    ? displayTitle.slice(0, Math.floor(TITLE_MAX_PX / TITLE_PX_PER_CHAR)) + '…'
    : displayTitle
  const truncDesc = descPx > DESC_MAX_PX
    ? displayDesc.slice(0, Math.floor(DESC_MAX_PX / DESC_PX_PER_CHAR)) + '…'
    : displayDesc

  return (
    <div>
      {/* Google-style preview card */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem', fontFamily: '"Google Sans", Arial, sans-serif' }}>
        {/* Favicon row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.65rem', color: '#5f6368', fontWeight: 600 }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#202124', fontWeight: 500, lineHeight: 1 }}>KTI Marketing</div>
            <div style={{ fontSize: '0.7rem', color: '#4d5156', lineHeight: 1.3 }}>{getBreadcrumb(displayUrl)}</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: '1.15rem', color: '#1a0dab', lineHeight: 1.35, marginBottom: '4px', fontWeight: 400, cursor: 'pointer' }}>
          {truncTitle}
        </div>

        {/* Description */}
        <div style={{ fontSize: '0.83rem', color: '#4d5156', lineHeight: 1.55, maxWidth: '480px' }}>
          {truncDesc}
        </div>
      </div>

      {/* Pixel-accurate progress bars */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0 0 10px 10px', padding: '0.6rem 1.25rem 0.75rem', border: '1px solid rgba(255,255,255,0.05)', borderTop: 'none', marginTop: '-1px' }}>
        <ProgressBar value={titlePx} max={TITLE_MAX_PX} warn={500} label="Title width" />
        <ProgressBar value={descPx} max={DESC_MAX_PX} warn={900} label="Description width" />
      </div>
    </div>
  )
}
