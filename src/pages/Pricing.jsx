import { useState } from 'react'
import { Link } from 'react-router-dom'
import { marketingPackages, photoshootPackages, FAQS } from '../data/pricingData'
import PageCTA from '../components/PageCTA'
import useScrollReveal from '../hooks/useScrollReveal'
import './Pricing.css'

function fmt(n) {
  return '৳' + n.toLocaleString('en-IN')
}

/* ── Calculator Tab ──────────────────────────────────── */
function CalculatorTab({ cartItems, addToCart, removeFromCart, cartTotal }) {
  const [openCategory, setOpenCategory] = useState('marketing')
  const [photoQtys, setPhotoQtys] = useState(() =>
    Object.fromEntries(photoshootPackages.map(p => [p.type, p.qtyConfig.defaultQty]))
  )

  function toggleCategory(key) {
    setOpenCategory(prev => (prev === key ? null : key))
  }

  function calcPhoto(pkg, qty) {
    const sessions = Math.ceil(qty / pkg.qtyConfig.capacity)
    const total = sessions * pkg.priceNumeric
    return { sessions, total }
  }

  function handleQtyChange(type, raw) {
    const val = Math.max(1, parseInt(raw) || 1)
    setPhotoQtys(prev => ({ ...prev, [type]: val }))
  }

  const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div className="calc-tab-body">
      {/* Left: accordion categories */}
      <div className="calc-tab-left">

        {/* Marketing Packages accordion */}
        <div className={`calc-accordion${openCategory === 'marketing' ? ' calc-accordion--open' : ''}`}>
          <button
            className="calc-accordion__header"
            onClick={() => toggleCategory('marketing')}
            aria-expanded={openCategory === 'marketing'}
          >
            <span className="calc-accordion__title">Marketing Packages</span>
            <span className="calc-accordion__meta">{marketingPackages.length} packages</span>
            <span className="calc-accordion__chevron"><ChevronIcon /></span>
          </button>

          {openCategory === 'marketing' && (
            <div className="calc-accordion__body">
              <div className="calc-pkg-grid">
                {marketingPackages.map(pkg => {
                  const itemId = `mkt-${pkg.id}`
                  const inCart = cartItems.some(c => c.id === itemId)
                  return (
                    <div key={pkg.id} className={`calc-pkg-option${inCart ? ' calc-pkg-option--added' : ''}`}>
                      {pkg.badge && (
                        <span className="calc-pkg-option__badge">{pkg.badge}</span>
                      )}
                      <div className="calc-pkg-option__info">
                        <div className="calc-pkg-option__top">
                          <span className="calc-pkg-option__name">{pkg.name}</span>
                          <span className="calc-pkg-option__price">{fmt(pkg.price)}<small>/mo</small></span>
                        </div>
                        <ul className="calc-pkg-option__highlights">
                          {pkg.deliverables.slice(0, 3).map(d => <li key={d}>{d}</li>)}
                        </ul>
                      </div>
                      <button
                        className={`calc-pkg-option__add${inCart ? ' calc-pkg-option__add--added' : ''}`}
                        onClick={() => !inCart && addToCart({ id: itemId, name: pkg.name, category: 'marketing', price: pkg.price })}
                        disabled={inCart}
                      >
                        {inCart ? '✓ Added' : '+ Add to Cart'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Photoshoot accordion */}
        <div className={`calc-accordion${openCategory === 'photoshoot' ? ' calc-accordion--open' : ''}`}>
          <button
            className="calc-accordion__header"
            onClick={() => toggleCategory('photoshoot')}
            aria-expanded={openCategory === 'photoshoot'}
          >
            <span className="calc-accordion__title">Photoshoot Packages</span>
            <span className="calc-accordion__meta">{photoshootPackages.length} packages</span>
            <span className="calc-accordion__chevron"><ChevronIcon /></span>
          </button>

          {openCategory === 'photoshoot' && (
            <div className="calc-accordion__body">
              <div className="calc-pkg-grid">
                {photoshootPackages.map(pkg => {
                  const itemId = `photo-${pkg.type.replace(/\s+/g, '-').toLowerCase()}`
                  const inCart = cartItems.some(c => c.id === itemId)
                  const qty = photoQtys[pkg.type]
                  const { sessions, total } = calcPhoto(pkg, qty)
                  return (
                    <div key={pkg.type} className={`calc-pkg-option${inCart ? ' calc-pkg-option--added' : ''}`}>
                      <div className="calc-pkg-option__info">
                        <div className="calc-pkg-option__top">
                          <span className="calc-pkg-option__name">{pkg.icon} {pkg.type}</span>
                          <span className="calc-pkg-option__price">{pkg.price}<small> {pkg.unit}</small></span>
                        </div>
                        <ul className="calc-pkg-option__highlights">
                          {pkg.includes.slice(0, 3).map(item => <li key={item}>{item}</li>)}
                        </ul>
                      </div>

                      <div className="calc-qty-control">
                        <span className="calc-qty-control__label">{pkg.qtyConfig.inputLabel}</span>
                        <div className="calc-qty-control__row">
                          <button
                            type="button"
                            className="calc-qty-control__btn"
                            onClick={() => handleQtyChange(pkg.type, qty - 1)}
                            aria-label="Decrease quantity"
                          >−</button>
                          <input
                            type="number"
                            className="calc-qty-control__input"
                            value={qty}
                            min="1"
                            onChange={e => handleQtyChange(pkg.type, e.target.value)}
                            aria-label={pkg.qtyConfig.inputLabel}
                          />
                          <button
                            type="button"
                            className="calc-qty-control__btn"
                            onClick={() => handleQtyChange(pkg.type, qty + 1)}
                            aria-label="Increase quantity"
                          >+</button>
                          <span className="calc-qty-control__unit">{pkg.qtyConfig.unit}</span>
                        </div>
                      </div>

                      <p className="calc-qty-preview">
                        {sessions} {pkg.qtyConfig.sessionLabel}{sessions !== 1 ? 's' : ''}{' '}
                        × {fmt(pkg.priceNumeric)} = <strong>{fmt(total)}</strong>
                      </p>

                      <button
                        className={`calc-pkg-option__add${inCart ? ' calc-pkg-option__add--added' : ''}`}
                        onClick={() => addToCart({
                          id: itemId,
                          name: pkg.type,
                          category: 'photoshoot',
                          price: total,
                          qty,
                          qtyUnit: pkg.qtyConfig.unit,
                          sessions,
                          sessionLabel: pkg.qtyConfig.sessionLabel,
                          sessionPrice: pkg.priceNumeric,
                        })}
                      >
                        {inCart ? '✓ Update' : '+ Add to Cart'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right: sticky cart */}
      <div className="calc-tab-right">
        <div className="cart-panel">
          <p className="cart-panel__title">Your Cart</p>

          {cartItems.length === 0 ? (
            <p className="cart-panel__empty">
              Open a category on the left and add packages to see your estimate here.
            </p>
          ) : (
            <ul className="cart-items">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.name}</span>
                    {item.sessions != null && (
                      <span className="cart-item__detail">
                        {item.qty} {item.qtyUnit} · {item.sessions} {item.sessionLabel}{item.sessions !== 1 ? 's' : ''} × {fmt(item.sessionPrice)}
                      </span>
                    )}
                    <span className="cart-item__price">{fmt(item.price)}</span>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >×</button>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-divider" />
          <div className="cart-total">
            <span>Estimated Total</span>
            <span className="cart-total__num">{fmt(cartTotal)}</span>
          </div>

          {cartItems.length > 0 && (
            <p className="cart-note">
              Bundled package pricing is typically 15–25% lower than individual rates.
            </p>
          )}

          <Link to="/contact" className="btn cart-cta">
            Get a Custom Quote →
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── FAQ Accordion ───────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section className="pricing-faq" id="faq">
      <div className="container">
        <div className="pricing-faq__header reveal">
          <p className="eyebrow">Common Questions</p>
          <h2>Everything You <span className="accent">Need to Know</span></h2>
        </div>
        <div className="pricing-faq__list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${open === i ? ' faq-item--open' : ''} reveal`}
              style={{ '--reveal-delay': `${i * 0.06}s` }}
            >
              <button
                className="faq-item__q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <span className="faq-item__chevron" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="faq-item__a">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Main Page ───────────────────────────────────────── */
export default function Pricing() {
  useScrollReveal()

  const [activeTab, setActiveTab] = useState('marketing')
  const [cartItems, setCartItems] = useState([])

  function addToCart(item) {
    setCartItems(prev => {
      const exists = prev.find(c => c.id === item.id)
      if (exists) return prev.map(c => c.id === item.id ? item : c)
      return [...prev, item]
    })
  }

  function removeFromCart(id) {
    setCartItems(prev => prev.filter(c => c.id !== id))
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  const TABS = [
    { key: 'marketing',  label: 'Marketing Packages' },
    { key: 'photoshoot', label: 'Photoshoot' },
    { key: 'calculator', label: 'Price Calculator' },
  ]

  return (
    <main className="pricing-page">

      {/* ── 1. Hero ───────────────────────────────────────── */}
      <section className="pricing-hero">
        <div className="pricing-hero__bg" aria-hidden="true">
          <div className="pricing-hero__shape--1" />
          <div className="pricing-hero__shape--2" />
        </div>
        <div className="container pricing-hero__inner">
          <p className="eyebrow reveal" style={{ color: '#f87171' }}>Transparent Pricing</p>
          <h1 className="pricing-hero__title reveal">
            Packages Built<br />
            <span className="accent">for Growth.</span>
          </h1>
          <p className="pricing-hero__sub reveal">
            No vague retainers. No surprise invoices. Every package is scoped,
            priced, and delivered exactly as agreed — so you can plan your
            marketing spend with confidence.
          </p>
          <div className="pricing-hero__stats reveal">
            {[
              { num: '120+', label: 'Brands Scaled' },
              { num: '5', label: 'Clear Tiers' },
              { num: '0', label: 'Hidden Fees' },
            ].map(({ num, label }) => (
              <div key={label} className="pricing-hero__stat">
                <span className="pricing-hero__stat-num">{num}</span>
                <span className="pricing-hero__stat-lbl">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Sticky tab bar ─────────────────────────────── */}
      <div className="pricing-tabs-wrap">
        <div className="container">
          <div className="pricing-tabs" role="tablist">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className={`pricing-tab${activeTab === key ? ' pricing-tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
                {key === 'calculator' && cartItems.length > 0 && (
                  <span className="pricing-tab__badge">{cartItems.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Tab panels ─────────────────────────────────── */}

      {/* Marketing Packages */}
      {activeTab === 'marketing' && (
        <section className="pricing-packages">
          <div className="container">
            <div className="pricing-packages__header">
              <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>Monthly Retainer</p>
              <h2 className="pricing-packages__title">
                Marketing <span className="accent">Packages</span>
              </h2>
              <p className="pricing-packages__sub">
                All packages include strategy, creative production, platform management,
                and performance reporting. Ad spend is separate.
              </p>
            </div>

            <div className="pricing-packages__grid">
              {marketingPackages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`pkg-card${pkg.highlight ? ' pkg-card--featured' : ''}${pkg.badge === 'Premium' ? ' pkg-card--premium' : ''}`}
                  style={{ animationDelay: `${Math.min(i * 0.08, 0.36)}s` }}
                >
                  {pkg.badge && (
                    <span className={`pkg-card__badge${pkg.highlight ? ' pkg-card__badge--hot' : ''}`}>
                      {pkg.badge}
                    </span>
                  )}
                  <div className="pkg-card__top">
                    <p className="pkg-card__name">{pkg.name}</p>
                    <div className="pkg-card__price-row">
                      <span className="pkg-card__price">{fmt(pkg.price)}</span>
                      <span className="pkg-card__mo">/month</span>
                    </div>
                    <p className="pkg-card__desc">{pkg.description}</p>
                  </div>

                  <div className="pkg-card__divider" />

                  <div className="pkg-card__platforms">
                    <p className="pkg-card__section-label">Platforms</p>
                    <ul>
                      {pkg.platforms.map(p => (
                        <li key={p} className="pkg-card__platform-item">
                          <span className="pkg-card__dot" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pkg-card__deliverables">
                    <p className="pkg-card__section-label">Deliverables</p>
                    <ul>
                      {pkg.deliverables.map(d => (
                        <li key={d} className="pkg-card__check-item">
                          <span className="pkg-card__check" aria-hidden="true">✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className={`btn pkg-card__cta${pkg.highlight ? ' pkg-card__cta--featured' : ''}`}
                  >
                    {pkg.cta} →
                  </Link>
                </div>
              ))}
            </div>

            <p className="pricing-packages__note">
              Need something in between? All packages are fully customisable.{' '}
              <Link to="/contact">Talk to our team →</Link>
            </p>
          </div>
        </section>
      )}

      {/* Photoshoot Pricing */}
      {activeTab === 'photoshoot' && (
        <section className="pricing-photo">
          <div className="container">
            <div className="pricing-photo__header">
              <p className="eyebrow">Photography & Shoots</p>
              <h2>Photoshoot <span className="accent">Pricing</span></h2>
              <p className="pricing-photo__sub">
                Professional photography for products, models, and commercial campaigns.
                All sessions include editing and high-resolution delivery.
              </p>
            </div>

            <div className="pricing-photo__grid">
              {photoshootPackages.map(pkg => (
                <div key={pkg.type} className="photo-card">
                  <div className="photo-card__icon">{pkg.icon}</div>
                  <div className="photo-card__body">
                    <h3 className="photo-card__type">{pkg.type}</h3>
                    <p className="photo-card__desc">{pkg.description}</p>
                    <ul className="photo-card__includes">
                      {pkg.includes.map(item => (
                        <li key={item}>
                          <span aria-hidden="true">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                    {pkg.addOn && (
                      <p className="photo-card__addon">+ {pkg.addOn}</p>
                    )}
                  </div>
                  <div className="photo-card__price-col">
                    <span className="photo-card__price">{pkg.price}</span>
                    <span className="photo-card__unit">{pkg.unit}</span>
                    <Link to="/contact" className="btn btn-outline photo-card__btn">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Calculator */}
      {activeTab === 'calculator' && (
        <section className="pricing-calc-tab">
          <div className="container">
            <div className="pricing-calc-tab__header">
              <p className="eyebrow">Build Your Bundle</p>
              <h2>Price <span className="accent">Calculator</span></h2>
              <p className="pricing-calc-tab__sub">
                Browse our packages below and add them to your cart.
                Real bundle pricing is always lower than individual rates.
              </p>
            </div>
            <CalculatorTab
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartTotal={cartTotal}
            />
          </div>
        </section>
      )}

      {/* ── 4. FAQ ───────────────────────────────────────── */}
      <FAQ />

      {/* ── 5. Final CTA ─────────────────────────────────── */}
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
