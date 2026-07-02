'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { MarketingPackage, PhotoshootPackage, VideoPackage } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import './Pricing.css'

function fmt(n: number) { return '৳' + n.toLocaleString('en-IN') }

function CalculatorTab({ cartItems, addToCart, removeFromCart, cartTotal, marketingPackages, photoshootPackages }: {
  cartItems: CartItem[]; addToCart: (item: CartItem) => void; removeFromCart: (id: string) => void; cartTotal: number
  marketingPackages: MarketingPackage[]; photoshootPackages: PhotoshootPackage[]
}) {
  const [photoQtys, setPhotoQtys] = useState<Record<string, number>>(() =>
    Object.fromEntries(photoshootPackages.map(p => [p.type, p.qtyConfig?.defaultQty ?? 1]))
  )
  const [photoImages, setPhotoImages] = useState<Record<string, number>>(() =>
    Object.fromEntries(photoshootPackages.map(p => [p.type, p.qtyConfig?.imagesConfig?.defaultImages ?? 0]))
  )
  function calcPhoto(pkg: PhotoshootPackage, qty: number, images: number) {
    const capacity = pkg.qtyConfig?.capacity ?? 1
    const ppi = pkg.qtyConfig?.imagesConfig?.pricePerImage ?? 0
    const sessions = Math.ceil(qty / capacity)
    const imageCost = images * ppi
    return { sessions, imageCost, total: sessions * pkg.priceNumeric + imageCost }
  }

  const colHead = (title: string, count: number) => (
    <div className="calc-col-header">
      <span className="calc-col-header__title">{title}</span>
      <span className="calc-col-header__meta">{count} packages</span>
    </div>
  )

  return (
    <div className="calc-tab-body">
      {/* ── Marketing Packages column ───────────────────── */}
      <div className="calc-tab-col">
        {colHead('Marketing Packages', marketingPackages.length)}
        <div className="calc-col-list">
          {marketingPackages.map(pkg => {
            const itemId = `mkt-${pkg.id}`
            const inCart = cartItems.some(c => c.id === itemId)
            return (
              <div key={pkg.id} className={`calc-pkg-option${inCart ? ' calc-pkg-option--added' : ''}`}>
                {pkg.badge && <span className="calc-pkg-option__badge">{pkg.badge}</span>}
                <div className="calc-pkg-option__info">
                  <div className="calc-pkg-option__top">
                    <span className="calc-pkg-option__name">{pkg.name}</span>
                    <span className="calc-pkg-option__price">{fmt(pkg.price)}<small>/mo</small></span>
                  </div>
                  <ul className="calc-pkg-option__highlights">{pkg.deliverables.slice(0, 3).map(d => <li key={d}>{d}</li>)}</ul>
                </div>
                <button className={`calc-pkg-option__add${inCart ? ' calc-pkg-option__add--added' : ''}`} onClick={() => !inCart && addToCart({ id: itemId, name: pkg.name, category: 'marketing', price: pkg.price })} disabled={inCart}>
                  {inCart ? '✓ Added' : '+ Add to Cart'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Photoshoot Packages column ──────────────────── */}
      <div className="calc-tab-col">
        {colHead('Photoshoot Packages', photoshootPackages.length)}
        <div className="calc-col-list">
          {photoshootPackages.map(pkg => {
            const itemId = `photo-${pkg.type.replace(/\s+/g, '-').toLowerCase()}`
            const inCart = cartItems.some(c => c.id === itemId)
            const qty = photoQtys[pkg.type] ?? pkg.qtyConfig?.defaultQty ?? 1
            const images = photoImages[pkg.type] ?? pkg.qtyConfig?.imagesConfig?.defaultImages ?? 0
            const { sessions, imageCost, total } = calcPhoto(pkg, qty, images)
            const ppi = pkg.qtyConfig?.imagesConfig?.pricePerImage ?? 0
            const showImages = ppi > 0
            return (
              <div key={pkg.type} className={`calc-pkg-option${inCart ? ' calc-pkg-option--added' : ''}`}>
                <div className="calc-pkg-option__info">
                  <div className="calc-pkg-option__top">
                    <span className="calc-pkg-option__name">{pkg.icon} {pkg.type}</span>
                    <span className="calc-pkg-option__price">{pkg.price}<small> {pkg.unit}</small></span>
                  </div>
                  <ul className="calc-pkg-option__highlights">{pkg.includes.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className="calc-qty-control">
                  <span className="calc-qty-control__label">{pkg.qtyConfig?.inputLabel ?? 'Quantity'}</span>
                  <div className="calc-qty-control__row">
                    <button type="button" className="calc-qty-control__btn" onClick={() => setPhotoQtys(prev => ({ ...prev, [pkg.type]: Math.max(1, (prev[pkg.type] || 1) - 1) }))} aria-label="Decrease">−</button>
                    <input type="number" className="calc-qty-control__input" value={qty} min="1" onChange={e => setPhotoQtys(prev => ({ ...prev, [pkg.type]: Math.max(1, parseInt(e.target.value) || 1) }))} aria-label={pkg.qtyConfig?.inputLabel} />
                    <button type="button" className="calc-qty-control__btn" onClick={() => setPhotoQtys(prev => ({ ...prev, [pkg.type]: (prev[pkg.type] || 1) + 1 }))} aria-label="Increase">+</button>
                    <span className="calc-qty-control__unit">{pkg.qtyConfig?.unit ?? ''}</span>
                  </div>
                </div>
                {showImages && (
                  <div className="calc-qty-control">
                    <span className="calc-qty-control__label">How many images?</span>
                    <div className="calc-qty-control__row">
                      <button type="button" className="calc-qty-control__btn" onClick={() => setPhotoImages(prev => ({ ...prev, [pkg.type]: Math.max(0, (prev[pkg.type] || 0) - 1) }))} aria-label="Decrease images">−</button>
                      <input type="number" className="calc-qty-control__input" value={images} min="0" onChange={e => setPhotoImages(prev => ({ ...prev, [pkg.type]: Math.max(0, parseInt(e.target.value) || 0) }))} aria-label="How many images?" />
                      <button type="button" className="calc-qty-control__btn" onClick={() => setPhotoImages(prev => ({ ...prev, [pkg.type]: (prev[pkg.type] || 0) + 1 }))} aria-label="Increase images">+</button>
                      <span className="calc-qty-control__unit">images</span>
                    </div>
                  </div>
                )}
                <p className="calc-qty-preview">
                  {sessions} {pkg.qtyConfig?.sessionLabel ?? 'session'}{sessions !== 1 ? 's' : ''} × {fmt(pkg.priceNumeric)}
                  {imageCost > 0 && <> + {images} images × {fmt(ppi)}</>}
                  {' '}= <strong>{fmt(total)}</strong>
                </p>
                <button className={`calc-pkg-option__add${inCart ? ' calc-pkg-option__add--added' : ''}`} onClick={() => addToCart({ id: itemId, name: pkg.type, category: 'photoshoot', price: total, qty, qtyUnit: pkg.qtyConfig?.unit, sessions, sessionLabel: pkg.qtyConfig?.sessionLabel, sessionPrice: pkg.priceNumeric, images: showImages ? images : undefined, pricePerImage: showImages ? ppi : undefined })}>
                  {inCart ? '✓ Update' : '+ Add to Cart'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Cart column ─────────────────────────────────── */}
      <div className="calc-tab-right">
        <div className="cart-panel">
          <p className="cart-panel__title">Your Cart</p>
          {cartItems.length === 0 ? (
            <p className="cart-panel__empty">Add packages from the left to see your estimate here.</p>
          ) : (
            <ul className="cart-items">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.name}</span>
                    {item.sessions != null && (
                      <span className="cart-item__detail">
                        {item.qty} {item.qtyUnit} · {item.sessions} {item.sessionLabel}{item.sessions !== 1 ? 's' : ''} × {fmt(item.sessionPrice!)}
                        {item.images != null && item.pricePerImage ? ` + ${item.images} images × ${fmt(item.pricePerImage)}` : ''}
                      </span>
                    )}
                    <span className="cart-item__price">{fmt(item.price)}</span>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>×</button>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-divider" />
          <div className="cart-total"><span>Estimated Total</span><span className="cart-total__num">{fmt(cartTotal)}</span></div>
          {cartItems.length > 0 && <p className="cart-note">Bundled package pricing is typically 15–25% lower than individual rates.</p>}
          <Link href="/contact" className="btn cart-cta">Get a Custom Quote →</Link>
        </div>
      </div>
    </div>
  )
}

interface CartItem { id: string; name: string; category: string; price: number; qty?: number; qtyUnit?: string; sessions?: number; sessionLabel?: string; sessionPrice?: number; images?: number; pricePerImage?: number }

function groupByCategory(items: VideoPackage[]) {
  const groups: { category: string; items: VideoPackage[] }[] = []
  for (const item of items) {
    let group = groups.find(g => g.category === item.category)
    if (!group) { group = { category: item.category, items: [] }; groups.push(group) }
    group.items.push(item)
  }
  return groups
}

export default function PricingClient({ marketingPackages, photoshootPackages, videoPackages, FAQS }: { marketingPackages: MarketingPackage[]; photoshootPackages: PhotoshootPackage[]; videoPackages: VideoPackage[]; FAQS: { q: string; a: string }[] }) {
  const [activeTab, setActiveTab] = useState('marketing')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function addToCart(item: CartItem) { setCartItems(prev => { const e = prev.find(c => c.id === item.id); return e ? prev.map(c => c.id === item.id ? item : c) : [...prev, item] }) }
  function removeFromCart(id: string) { setCartItems(prev => prev.filter(c => c.id !== id)) }
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  const videoGroups = groupByCategory(videoPackages)

  const TABS = [{ key: 'marketing', label: 'Marketing Packages' }, { key: 'photoshoot', label: 'Photoshoot' }, { key: 'video', label: 'Video Package' }, { key: 'calculator', label: 'Price Calculator' }]

  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-hero__bg" aria-hidden="true"><div className="pricing-hero__shape--1" /><div className="pricing-hero__shape--2" /></div>
        <div className="container pricing-hero__inner">
          <p className="eyebrow reveal" style={{ color: '#f87171' }}>Transparent Pricing</p>
          <h1 className="pricing-hero__title reveal">Packages Built<br /><span className="accent">for Growth.</span></h1>
          <p className="pricing-hero__sub reveal">No vague retainers. No surprise invoices. Every package is scoped, priced, and delivered exactly as agreed.</p>
          <div className="pricing-hero__stats reveal">
            {[{ num: '120+', label: 'Brands Scaled' }, { num: '5', label: 'Clear Tiers' }, { num: '0', label: 'Hidden Fees' }].map(({ num, label }) => (
              <div key={label} className="pricing-hero__stat"><span className="pricing-hero__stat-num">{num}</span><span className="pricing-hero__stat-lbl">{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <div className="pricing-tabs-wrap">
        <div className="container">
          <div className="pricing-tabs" role="tablist">
            {TABS.map(({ key, label }) => (
              <button key={key} role="tab" aria-selected={activeTab === key} className={`pricing-tab${activeTab === key ? ' pricing-tab--active' : ''}`} onClick={() => setActiveTab(key)}>
                {label}
                {key === 'calculator' && cartItems.length > 0 && <span className="pricing-tab__badge">{cartItems.length}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'marketing' && (
        <section className="pricing-packages">
          <div className="container">
            <div className="pricing-packages__header">
              <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>Monthly Retainer</p>
              <h2 className="pricing-packages__title">Marketing <span className="accent">Packages</span></h2>
              <p className="pricing-packages__sub">All packages include strategy, creative production, platform management, and performance reporting. Ad spend is separate.</p>
            </div>
            <div className="pricing-packages__grid">
              {marketingPackages.map((pkg, i) => (
                <div key={pkg.id} className={`pkg-card${pkg.highlight ? ' pkg-card--featured' : ''}${pkg.badge === 'Premium' ? ' pkg-card--premium' : ''}`} style={{ animationDelay: `${Math.min(i * 0.08, 0.36)}s` }}>
                  {pkg.badge && <span className={`pkg-card__badge${pkg.highlight ? ' pkg-card__badge--hot' : ''}`}>{pkg.badge}</span>}
                  <div className="pkg-card__top"><p className="pkg-card__name">{pkg.name}</p><div className="pkg-card__price-row"><span className="pkg-card__price">{fmt(pkg.price)}</span><span className="pkg-card__mo">/month</span></div><p className="pkg-card__desc">{pkg.description}</p></div>
                  <div className="pkg-card__divider" />
                  <div className="pkg-card__platforms"><p className="pkg-card__section-label">Platforms</p><ul>{pkg.platforms.map(p => (<li key={p} className="pkg-card__platform-item"><span className="pkg-card__dot" aria-hidden="true" />{p}</li>))}</ul></div>
                  <div className="pkg-card__deliverables"><p className="pkg-card__section-label">Deliverables</p><ul>{pkg.deliverables.map(d => (<li key={d} className="pkg-card__check-item"><span className="pkg-card__check" aria-hidden="true">✓</span>{d}</li>))}</ul></div>
                  <Link href="/contact" className={`btn pkg-card__cta${pkg.highlight ? ' pkg-card__cta--featured' : ''}`}>{pkg.cta} →</Link>
                </div>
              ))}
            </div>
            <p className="pricing-packages__note">Need something in between? All packages are fully customisable. <Link href="/contact">Talk to our team →</Link></p>
          </div>
        </section>
      )}

      {activeTab === 'photoshoot' && (
        <section className="pricing-photo">
          <div className="container">
            <div className="pricing-photo__header"><p className="eyebrow">Photography &amp; Shoots</p><h2>Photoshoot <span className="accent">Pricing</span></h2><p className="pricing-photo__sub">Professional photography for products, models, and commercial campaigns. All sessions include editing and high-resolution delivery.</p></div>
            <div className="pricing-photo__grid">
              {photoshootPackages.map(pkg => (
                <div key={pkg.type} className="photo-card">
                  <div className="photo-card__icon">{pkg.icon}</div>
                  <div className="photo-card__body">
                    <h3 className="photo-card__type">{pkg.type}</h3>
                    <p className="photo-card__desc">{pkg.description}</p>
                    <ul className="photo-card__includes">{pkg.includes.map(item => (<li key={item}><span aria-hidden="true">✓</span> {item}</li>))}</ul>
                    {pkg.addOn && <p className="photo-card__addon">+ {pkg.addOn}</p>}
                  </div>
                  <div className="photo-card__price-col"><span className="photo-card__price">{pkg.price}</span><span className="photo-card__unit">{pkg.unit}</span><Link href="/contact" className="btn btn-outline photo-card__btn">Book Now</Link></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'video' && (
        <section className="pricing-photo pricing-video">
          <div className="container">
            <div className="pricing-photo__header"><p className="eyebrow">Video Production</p><h2>Video <span className="accent">Package</span></h2><p className="pricing-photo__sub">Elevate your content with professional video editing. Flat, one-time pricing per video — no calculator, no surprises.</p></div>
            <div className="pricing-video__grid">
              {videoGroups.map(group => (
                <div key={group.category} className="video-pkg-col">
                  <h3 className="video-pkg-col__title">{group.category}</h3>
                  <div className="video-pkg-col__list">
                    {group.items.map(item => (
                      <div key={item.id} className="video-pkg-row">
                        <div className="video-pkg-row__info">
                          <span className="video-pkg-row__name">{item.name}</span>
                          {item.priceLabel && <span className="video-pkg-row__label">{item.priceLabel}</span>}
                        </div>
                        <div className="video-pkg-row__cta">
                          <span className="video-pkg-row__price">{fmt(item.price)}</span>
                          <Link href="/contact" className="btn btn-outline video-pkg-row__btn">Book Now</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'calculator' && (
        <section className="pricing-calc-tab">
          <div className="container">
            <div className="pricing-calc-tab__header"><p className="eyebrow">Build Your Bundle</p><h2>Price <span className="accent">Calculator</span></h2><p className="pricing-calc-tab__sub">Browse our packages below and add them to your cart. Real bundle pricing is always lower than individual rates.</p></div>
            <CalculatorTab cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} cartTotal={cartTotal} marketingPackages={marketingPackages} photoshootPackages={photoshootPackages} />
          </div>
        </section>
      )}

      <section className="pricing-faq" id="faq">
        <div className="container">
          <div className="pricing-faq__header reveal"><p className="eyebrow">Common Questions</p><h2>Everything You <span className="accent">Need to Know</span></h2></div>
          <div className="pricing-faq__list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' faq-item--open' : ''} reveal`} style={{ '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span>{faq.q}</span>
                  <span className="faq-item__chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </button>
                {openFaq === i && <div className="faq-item__a"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        eyebrow="Ready to Get Started?"
        title={<>Pick a Package,<br />Start <span className="accent">Growing Today.</span></>}
        sub="No hidden fees, no vague retainers. Tell us your goals and we'll put together a package that fits your budget and timeline."
        primaryLabel="Get a Free Strategy Call →"
        secondaryLabel="View Packages"
        secondaryTo="/pricing"
        note="No commitment required · Strategy session is 100% free"
      />
    </main>
  )
}
