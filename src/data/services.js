export const services = [
  {
    slug: 'brand-strategy',
    title: 'Brand Strategy',
    icon: '🏆',
    tagline: 'Define who you are before the market does.',
    description:
      'We build positioning frameworks, brand voices, and visual identities that make you instantly recognisable and deeply trusted.',
    bullets: [
      'Competitive landscape analysis',
      'Brand positioning & messaging',
      'Visual identity system',
      'Brand guidelines document',
    ],
  },
  {
    slug: 'digital-advertising',
    title: 'Digital Advertising',
    icon: '📣',
    tagline: 'Paid media that pays back.',
    description:
      'Full-funnel campaigns across Google, Meta, LinkedIn, and programmatic channels — engineered to convert at every stage.',
    bullets: [
      'Campaign strategy & audience research',
      'Ad creative & copywriting',
      'Bid management & optimisation',
      'Monthly performance reporting',
    ],
  },
  {
    slug: 'seo-content',
    title: 'SEO & Content',
    icon: '🔍',
    tagline: 'Rank higher. Get found. Stay found.',
    description:
      'Technical SEO, keyword strategy, and editorial content that earns authority and compounds over time.',
    bullets: [
      'Technical SEO audit & fixes',
      'Keyword & topic cluster strategy',
      'Long-form content production',
      'Link acquisition campaigns',
    ],
  },
  {
    slug: 'social-media',
    title: 'Social Media',
    icon: '📲',
    tagline: 'Scroll-stopping content at scale.',
    description:
      'End-to-end social management — strategy, content creation, scheduling, and community building across every major platform.',
    bullets: [
      'Platform strategy & content calendar',
      'Graphic & video content production',
      'Community management',
      'Monthly analytics review',
    ],
  },
  {
    slug: 'email-marketing',
    title: 'Email Marketing',
    icon: '✉️',
    tagline: 'Your highest-ROI channel, fully unlocked.',
    description:
      'Automated sequences and broadcast campaigns that nurture leads, re-engage lapsed customers, and drive repeat revenue.',
    bullets: [
      'List segmentation & hygiene',
      'Welcome & nurture sequences',
      'Promotional broadcast campaigns',
      'A/B testing & deliverability tuning',
    ],
  },
  {
    slug: 'analytics-reporting',
    title: 'Analytics & Reporting',
    icon: '📊',
    tagline: 'Know exactly what\'s working — and why.',
    description:
      'Custom dashboards, attribution modelling, and plain-English monthly reports so every decision is backed by real data.',
    bullets: [
      'GA4 & pixel setup / audit',
      'Custom Looker Studio dashboards',
      'Attribution modelling',
      'Quarterly strategy reviews',
    ],
  },
]

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug) ?? null
}
