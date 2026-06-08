'use client'

import { useState } from 'react'
import { calculateSeoScore, calculateReadabilityScore, getScoreColor } from '@/lib/seo-utils'

interface Props {
  focusKeyword?: string
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: string
  twitterTitle?: string
  twitterImage?: string
  schemasCount?: number
  schemas?: { data: unknown; isActive: boolean }[]
  readabilityContent?: string
}

function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 26
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg width={68} height={68} viewBox="0 0 68 68">
        <circle cx={34} cy={34} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
        <circle
          cx={34} cy={34} r={r} fill="none"
          stroke={score > 0 ? color : 'rgba(255,255,255,0.1)'}
          strokeWidth={7}
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 34 34)"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
        <text x={34} y={39} textAnchor="middle" fill={score > 0 ? color : 'rgba(255,255,255,0.25)'} fontSize={15} fontWeight={700} fontFamily="system-ui">
          {score > 0 ? score : '—'}
        </text>
      </svg>
      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  keyword: 'Keyword',
  content: 'Content',
  social: 'Social',
  schema: 'Schema',
}

const categoryKeys = ['keyword', 'content', 'social', 'schema'] as const

export default function SeoScore({
  focusKeyword = '', metaTitle = '', metaDescription = '', canonicalUrl = '',
  ogTitle = '', ogDescription = '', ogImage = '', ogUrl = '',
  twitterCard = '', twitterTitle = '', twitterImage = '',
  schemasCount = 0, schemas, readabilityContent,
}: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const seo = calculateSeoScore({
    focusKeyword, metaTitle, metaDescription, canonicalUrl,
    ogTitle, ogDescription, ogImage, ogUrl,
    twitterCard, twitterTitle, twitterImage,
    schemasCount, schemas,
  })

  const readability = readabilityContent?.trim()
    ? calculateReadabilityScore(readabilityContent)
    : null

  const seoColor = getScoreColor(seo.score)
  const readColor = readability ? getScoreColor(readability.score) : 'rgba(255,255,255,0.15)'

  return (
    <div>
      {/* Two score rings */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
        <ScoreRing score={seo.score} color={seoColor} label="SEO Score" />
        <ScoreRing score={readability?.score ?? 0} color={readColor} label="Readability" />
      </div>

      {!readabilityContent?.trim() && (
        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: '0.75rem', lineHeight: 1.4 }}>
          Use the Readability tab to get a content score
        </div>
      )}

      {/* Category sections */}
      {categoryKeys.map(cat => {
        const catData = seo.categories[cat]
        if (!catData) return null
        const catChecks = seo.checks.filter(c => c.category === cat)
        const isOpen = openCategory === cat
        const allPass = catData.passed === catData.total
        const catColor = allPass ? '#4ade80' : catData.passed >= catData.total / 2 ? '#fbbf24' : '#f87171'
        return (
          <div key={cat} style={{ marginBottom: '0.4rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : cat)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.55rem 0.75rem', background: 'rgba(255,255,255,0.03)',
                border: 'none', cursor: 'pointer', gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: catColor, fontSize: '0.6rem' }}>●</span>
                <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#fff' }}>{CATEGORY_LABELS[cat]}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: catColor, fontVariantNumeric: 'tabular-nums' }}>{catData.passed}/{catData.total}</span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: '0.5rem 0.75rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {catChecks.map((check, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.72rem' }}>
                    <span style={{ color: check.pass ? '#4ade80' : '#f87171', flexShrink: 0, marginTop: '2px', fontSize: '0.55rem' }}>●</span>
                    <span style={{ color: check.pass ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Recommendations */}
      {seo.recommendations.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Top Fixes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {seo.recommendations.slice(0, 4).map((rec, i) => (
              <div key={i} style={{ fontSize: '0.71rem', color: 'rgba(255,255,255,0.45)', paddingLeft: '0.6rem', borderLeft: '2px solid rgba(251,191,36,0.4)', lineHeight: 1.4 }}>
                {rec}
              </div>
            ))}
            {seo.recommendations.length > 4 && (
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>
                +{seo.recommendations.length - 4} more — expand categories above
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
