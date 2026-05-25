import { Link } from 'react-router-dom'
import PageCTA from '../components/PageCTA'
import './About.css'

const TEAM = [
  {
    name: 'Tanvir Ahmed',
    role: 'Creative Director',
    initials: 'TA',
    gradient: 'linear-gradient(135deg, #D7262E 0%, #9B1C22 100%)',
    bio: 'Leads all creative output — from campaign concepts to final delivery — ensuring every piece is visually compelling and on-brand.',
    socials: { linkedin: '#', instagram: '#', email: 'tanvir@ktimarketing.com' },
  },
  {
    name: 'Sadia Islam',
    role: 'Social Media Strategist',
    initials: 'SI',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
    bio: 'Builds and manages social presence across platforms, crafting content strategies that turn followers into loyal brand communities.',
    socials: { linkedin: '#', instagram: '#', email: 'sadia@ktimarketing.com' },
  },
  {
    name: 'Rafiqul Islam',
    role: 'Content & Copy Lead',
    initials: 'RI',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #0E4F6B 100%)',
    bio: 'Crafts persuasive copy and editorial content that resonates with audiences, drives engagement, and supports every stage of the funnel.',
    socials: { linkedin: '#', instagram: '#', email: 'rafiq@ktimarketing.com' },
  },
  {
    name: 'Nadia Rahman',
    role: 'Graphic Designer',
    initials: 'NR',
    gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    bio: 'Translates brand identities into striking visuals — from social graphics and ads to packaging and brand guidelines.',
    socials: { linkedin: '#', instagram: '#', email: 'nadia@ktimarketing.com' },
  },
  {
    name: 'Shahriar Hossain',
    role: 'Video Editor',
    initials: 'SH',
    gradient: 'linear-gradient(135deg, #059669 0%, #065F46 100%)',
    bio: 'Edits and produces video content for ads, reels, and campaigns — bringing stories to life through motion, pacing, and sound.',
    socials: { linkedin: '#', instagram: '#', email: 'shahriar@ktimarketing.com' },
  },
  {
    name: 'Rashida Khatun',
    role: 'Digital Ads Manager',
    initials: 'RK',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #831843 100%)',
    bio: 'Plans and optimises paid campaigns across Meta, Google, and TikTok — maximising ROAS and scaling what works.',
    socials: { linkedin: '#', instagram: '#', email: 'rashida@ktimarketing.com' },
  },
]

const VALUES = [
  {
    icon: '🎯',
    title: 'Results First',
    body: 'We measure success in revenue, not reach. Every strategy we build is engineered around your business objectives — and nothing else.',
  },
  {
    icon: '🔍',
    title: 'Radical Transparency',
    body: 'No smoke and mirrors. No vanity metrics. You will always know exactly what we are doing, why we are doing it, and how it is performing.',
  },
  {
    icon: '⚡',
    title: 'Obsessive Quality',
    body: 'We do not do average. Every campaign, every piece of content, every report reflects our absolute commitment to excellence.',
  },
  {
    icon: '🤝',
    title: 'True Partnership',
    body: 'Your wins are our wins. We show up as a genuine extension of your team — invested in your success just as much as you are.',
  },
]

const STATS = [
  { num: '120+',  label: 'Brands Grown' },
  { num: '8+',    label: 'Years in Business' },
  { num: '$40M+', label: 'Revenue Generated' },
  { num: '94%',   label: 'Client Retention' },
  { num: '3.2×',  label: 'Average ROI' },
  { num: '9',     label: 'Core Services' },
]

export default function About() {
  return (
    <main className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__badge fade-up">
            <span className="about-hero__badge-dot" />
            Full-Service Marketing Agency · Since 2016
          </div>
          <p className="eyebrow fade-up-1">About KTI Marketing</p>
          <h1 className="about-hero__title fade-up-2">
            Built to Grow Brands.<br />
            <span className="accent">Obsessed With Results.</span>
          </h1>
          <p className="about-hero__sub fade-up-2">
            A team of strategists, creatives, and performance marketers united
            by one obsession — making your brand the market leader it deserves to be.
          </p>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="about-founder">
        <div className="container">
          <div className="about-founder__grid">

            <div className="about-founder__photo reveal">
              <div className="about-founder__photo-frame">
                <img src="/founder.jpg" alt="Md Mehedi Hasan (Babla) — Founder & Chief" />
                <span className="about-founder__since-badge">Est. 2016</span>
              </div>
              <div className="about-founder__photo-bg" aria-hidden="true" />
            </div>

            <div className="about-founder__content reveal" style={{ '--reveal-delay': '0.12s' }}>
              <span className="about-founder__badge">Founder &amp; Chief</span>
              <h2 className="about-founder__name">
                Md Mehedi Hasan
                <span className="about-founder__nick"> (Babla)</span>
              </h2>
              <div className="about-founder__tags">
                {['Founder & Chief', 'KIBAN SHOE', 'KIBAN Trade International', 'KTI – Marketing Agency'].map(tag => (
                  <span key={tag} className="about-founder__tag">{tag}</span>
                ))}
              </div>
              <p>
                Md Mehedi Hasan (Babla) is a visionary entrepreneur and the founder of
                KIBAN Trade International and KIBAN SHOE. With a commitment to quality and
                integrity, he has built a strong reputation in the e-commerce and trading
                sectors of Bangladesh.
              </p>
              <p>
                Beyond manufacturing and trade, he leads KTI – Marketing Agency,
                specializing in innovative digital marketing and branding solutions. Based in
                Mirpur 10, Dhaka, Mehedi is dedicated to creating sustainable business growth
                and delivering excellence to his clients. He believes in the power of hard work
                and staying ahead of market trends to build brands that truly resonate with people.
              </p>

              <blockquote className="about-founder__pullquote">
                "My goal has always been simple — help brands grow in ways that actually
                matter to their bottom line. Real revenue, not just reach."
              </blockquote>

              <div className="about-founder__connect">
                <h3 className="about-founder__connect-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  Connect with Mehedi
                </h3>
                <div className="about-founder__connect-grid">
                  <div className="about-founder__connect-item">
                    <span className="about-founder__connect-label">Email</span>
                    <a href="mailto:mehedihasan.babla@gmail.com" className="about-founder__connect-link">
                      mehedihasan.babla@gmail.com
                    </a>
                  </div>
                  <div className="about-founder__connect-item">
                    <span className="about-founder__connect-label">Facebook</span>
                    <a href="https://facebook.com/ktibabla" target="_blank" rel="noopener noreferrer" className="about-founder__connect-link">
                      facebook.com/ktibabla
                    </a>
                  </div>
                  <div className="about-founder__connect-item">
                    <span className="about-founder__connect-label">KIBAN Shoe</span>
                    <a href="https://www.kibanshoe.com" target="_blank" rel="noopener noreferrer" className="about-founder__connect-link">
                      www.kibanshoe.com
                    </a>
                  </div>
                  <div className="about-founder__connect-item">
                    <span className="about-founder__connect-label">KTI Agency</span>
                    <a href="https://www.kti.com.bd" target="_blank" rel="noopener noreferrer" className="about-founder__connect-link">
                      www.kti.com.bd
                    </a>
                  </div>
                  <div className="about-founder__connect-item about-founder__connect-item--full">
                    <span className="about-founder__connect-label">Office Address</span>
                    <span className="about-founder__connect-address">
                      Suite 1005, 10th Floor (Lift-9), Shah Ali Plaza, Mirpur 10, Dhaka.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            {STATS.map(({ num, label }, i) => (
              <div className="about-stat reveal-scale" key={label} style={{ '--reveal-delay': `${i * 0.07}s` }}>
                <span className="about-stat__num">{num}</span>
                <span className="about-stat__label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission__inner reveal">
            <p className="eyebrow">Our Mission</p>
            <blockquote className="about-mission__quote">
              "We exist to help ambitious brands grow. Not just in followers or impressions,
              but in the metrics that actually matter: qualified leads, conversions, revenue,
              and market share. Since 2016, we have helped over 120 businesses transform
              their marketing from a cost centre into their most powerful competitive advantage."
            </blockquote>
            <cite className="about-mission__cite">— The KTI Marketing Team</cite>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="about-story">
        <div className="container">
          <div className="about-story__grid">
            <div className="about-story__left reveal">
              <p className="eyebrow">Our Story</p>
              <h2>From a Small Studio to <span className="accent">a Full-Scale Agency</span></h2>
            </div>
            <div className="about-story__right reveal" style={{ '--reveal-delay': '0.15s' }}>
              <span className="about-story__milestone">2016 — Founded</span>
              <p>
                KTI Marketing started in 2016 with a simple belief: that great marketing
                should be accessible to every ambitious business, not just the big players
                with enormous budgets. We began as a small creative studio with three
                people and a shared passion for brand storytelling.
              </p>
              <span className="about-story__milestone">2019 — Full-Service Expansion</span>
              <p>
                Over the years, we expanded into performance advertising, social media
                management, influencer marketing, and production — building a full-service
                capability that covers every stage of your customer journey. Today, we are
                a team of 25+ specialists across strategy, creative, media, and analytics.
              </p>
              <span className="about-story__milestone">Today — 25+ Specialists</span>
              <p>
                But what has never changed is our core obsession: delivering results that
                genuinely move the needle for the brands we work with. We do not just run
                campaigns. We build growth engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-team">
        <div className="container">
          <div className="about-team__header text-center reveal">
            <p className="eyebrow">The People Behind the Work</p>
            <h2>Meet Our <span className="accent">Creative Team</span></h2>
            <p className="about-team__sub">
              Strategists, designers, writers, and producers — each specialist is
              hand-picked for their craft and their shared obsession with results.
            </p>
          </div>
          <div className="about-team__grid">
            {TEAM.map(({ name, role, initials, gradient, bio, socials }, i) => (
              <div className="team-card reveal" key={name} style={{ '--reveal-delay': `${i * 0.08}s` }}>
                <div className="team-card__avatar" style={{ background: gradient }}>
                  {initials}
                </div>
                <div className="team-card__body">
                  <h3 className="team-card__name">{name}</h3>
                  <span className="team-card__role">{role}</span>
                  <p className="team-card__bio">{bio}</p>
                  <div className="team-card__socials">
                    {socials.linkedin && (
                      <a href={socials.linkedin} className="team-card__social-link" target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      </a>
                    )}
                    {socials.instagram && (
                      <a href={socials.instagram} className="team-card__social-link" target="_blank" rel="noopener noreferrer" aria-label={`${name} on Instagram`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                      </a>
                    )}
                    {socials.email && (
                      <a href={`mailto:${socials.email}`} className="team-card__social-link" aria-label={`Email ${name}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values">
        <div className="container">
          <div className="about-values__header text-center reveal">
            <p className="eyebrow">What We Stand For</p>
            <h2>The Values That Drive <span className="accent">Everything We Do</span></h2>
          </div>
          <div className="about-values__grid">
            {VALUES.map(({ icon, title, body }, i) => (
              <div className="value-card reveal" key={title} style={{ '--reveal-delay': `${i * 0.1}s` }}>
                <div className="value-card__icon-wrap" aria-hidden="true">{icon}</div>
                <h3 className="value-card__title">{title}</h3>
                <p className="value-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <PageCTA
        eyebrow="Ready to Grow?"
        title={<>Join the brands growing<br />with KTI Marketing.</>}
        sub="Let's build a strategy that turns your marketing into your strongest competitive advantage."
        primaryLabel="Start Your Project →"
        primaryTo="/contact"
        secondaryLabel="Explore Services"
        secondaryTo="/services"
      />

    </main>
  )
}
