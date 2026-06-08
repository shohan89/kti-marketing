interface Props {
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  ogUrl?: string
  canonicalUrl?: string
  metaTitle?: string
  metaDescription?: string
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') } catch { return 'ktimarketing.com' }
}

export default function OgPreview({ ogImage, ogTitle, ogDescription, ogUrl, canonicalUrl, metaTitle, metaDescription }: Props) {
  const displayImage = ogImage
  const displayTitle = ogTitle || metaTitle || 'Page Title'
  const displayDesc = ogDescription || metaDescription || ''
  const displayUrl = ogUrl || canonicalUrl || 'https://ktimarketing.com'
  const domain = getDomain(displayUrl).toUpperCase()

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Facebook / LinkedIn Preview
      </div>
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '480px',
        border: '1px solid #dddfe2',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}>
        {displayImage ? (
          <div style={{ background: '#f0f2f5', height: '252px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={displayImage}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).parentElement!.style.background = '#e4e6ea' }}
            />
          </div>
        ) : (
          <div style={{ background: '#e4e6ea', height: '252px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#bec3c9', fontSize: '0.82rem' }}>No OG image set</span>
          </div>
        )}
        <div style={{ padding: '10px 12px 11px', borderTop: '1px solid #dddfe2', background: '#f2f3f5' }}>
          <div style={{ fontSize: '0.68rem', color: '#606770', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {domain}
          </div>
          <div style={{ fontSize: '0.93rem', fontWeight: 600, color: '#1c1e21', lineHeight: 1.35, marginBottom: '3px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {displayTitle.slice(0, 88)}
          </div>
          {displayDesc && (
            <div style={{ fontSize: '0.82rem', color: '#606770', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {displayDesc.slice(0, 110)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
