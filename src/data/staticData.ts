// Static fallback data — used when database is not yet connected
// This mirrors the Vite project's data files for zero-downtime startup

export interface Service {
  title: string; slug: string; description: string
  image: string; videoUrl: string; longDescription: string; headline: string
  deliverables: string[]
  process: { num: string; title: string; body: string }[]
  results: { stat: string; label: string; description: string }[]
  faqs: { q: string; a: string }[]
}

export interface BlogPost {
  slug: string; category: string; featured: boolean; title: string; excerpt: string
  readTime: string; publishDate: string; author: string; tags: string[]
  accentColor: string; gradientFrom: string; gradientTo: string
  callout?: string; takeaways?: string[]
  body: { heading?: string; paragraphs: string[] }[]
}

export interface CaseStudy {
  slug: string; tag: string; category: string; industry: string
  client: string; title: string; subtitle: string; challenge: string; solution: string; body: string
  phases: { num: string; title: string; body: string }[]
  deliverables: string[]; metrics: { num: string; label: string }[]
  duration: string; services: string[]
  quote: string; quoteName: string; quoteRole: string; quoteCompany: string; quoteResult: string
}

export interface JobListing {
  slug: string; title: string; department: string; location: string; type: string
  posted: string; salary?: string; excerpt: string; description: string
  responsibilities: string[]; requirements: string[]; niceToHave: string[]; benefits: string[]
}

export interface MarketingPackage {
  id: number; name: string; price: number; badge: string | null; highlight: boolean
  description: string; platforms: string[]; deliverables: string[]; cta: string
}

export interface PhotoshootPackage {
  type: string; icon: string; description: string; price: string; priceNumeric: number
  unit: string; addOn: string | null; includes: string[]
  qtyConfig: {
    inputLabel: string; unit: string; capacity: number; sessionLabel: string; defaultQty: number
    imagesConfig: { defaultImages: number; pricePerImage: number }
  }
}

export const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
  Marketing:  { bg: 'rgba(215,38,46,0.1)',  text: '#D7262E' },
  Creative:   { bg: 'rgba(99,102,241,0.1)', text: '#6366F1' },
  Technology: { bg: 'rgba(16,185,129,0.1)', text: '#10B981' },
}

// ── Services ──────────────────────────────────────────────────────────────────

export const servicesData: Service[] = [
  {
    title: 'Social Media Management', slug: 'social-media-management',
    description: 'Full-service management of your social media presence across all major platforms.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'We handle everything from strategy and content planning to daily posting, community engagement, and performance tracking.',
    headline: 'Turn Your Social Media Into Your #1 Revenue Channel.',
    deliverables: ['Custom monthly content calendar', 'Daily posting across Instagram, Facebook, TikTok & LinkedIn', 'Community management & comment response', 'Instagram & Facebook Stories', 'Short-form Reels & TikTok video content', 'Monthly analytics & performance report', 'Hashtag research & platform SEO', 'Competitor monitoring & trend analysis'],
    process: [
      { num: '01', title: 'Brand Audit', body: 'We analyze your existing presence, audience data, competitors, and growth opportunities.' },
      { num: '02', title: 'Strategy Build', body: 'We create a platform-specific strategy with content pillars, posting cadence, tone of voice, and clear KPIs.' },
      { num: '03', title: 'Content Production', body: 'Our creative team builds a full month of scroll-stopping content — all approved by you before publishing.' },
      { num: '04', title: 'Publish & Engage', body: 'We post at optimal times, respond to comments and DMs, and actively grow your audience.' },
      { num: '05', title: 'Report & Optimize', body: 'Monthly reporting covers reach, engagement, follower growth, and conversions.' },
    ],
    results: [
      { stat: '3×', label: 'Average follower growth', description: 'Clients typically triple their following within the first 6 months.' },
      { stat: '4.8%', label: 'Average engagement rate', description: 'We consistently deliver 4–6% engagement on managed accounts.' },
      { stat: '40%', label: 'Increase in organic reach', description: 'Our structured approach drives significantly wider organic distribution.' },
    ],
    faqs: [
      { q: 'Which platforms do you manage?', a: 'We manage Instagram, Facebook, TikTok, LinkedIn, and X.' },
      { q: 'How many posts per month do we get?', a: 'Typically 20–30 posts per month depending on your package.' },
      { q: 'Do you respond to comments and DMs?', a: 'Yes. Community management is included.' },
      { q: 'How long before we see results?', a: 'Most clients see meaningful engagement within 60–90 days.' },
    ],
  },
  {
    title: 'Content Creation', slug: 'content-creation',
    description: 'Scroll-stopping content crafted to engage your audience and reinforce your brand.',
    image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'Great content is the engine behind every successful marketing channel. We produce graphics, carousels, short-form videos, blog posts, and everything in between.',
    headline: 'Content That Stops the Scroll and Drives Real Action.',
    deliverables: ['Custom branded graphics & carousel posts', 'Short-form video scripts & editing', 'Blog articles & long-form copywriting', 'Email newsletter design & copy', 'Brand-consistent template library', 'Content repurposing across platforms', 'Monthly content package delivery', 'Brand guidelines adherence review'],
    process: [
      { num: '01', title: 'Discovery Call', body: 'We learn your brand, audience, goals, and existing content assets.' },
      { num: '02', title: 'Creative Direction', body: 'We develop a content style guide including visual language and copy tone.' },
      { num: '03', title: 'Production', body: 'Our design and copy team creates all content pieces to spec.' },
      { num: '04', title: 'Review & Revisions', body: 'You review everything before it goes live. Two rounds of revisions included.' },
      { num: '05', title: 'Delivery & Scheduling', body: 'Final assets delivered in platform-ready formats, organized by channel.' },
    ],
    results: [
      { stat: '60%', label: 'Higher engagement than average', description: 'Brand-consistent, strategy-led content consistently outperforms generic content.' },
      { stat: '2×', label: 'Faster content pipeline', description: 'A steady stream of ready-to-publish content eliminates last-minute scramble.' },
      { stat: '100%', label: 'On-brand output guaranteed', description: 'Every piece goes through a brand quality check before delivery.' },
    ],
    faqs: [
      { q: 'What types of content do you create?', a: 'Graphics, carousels, short-form video, Reels, TikToks, blog articles, email copy, ad creative, and more.' },
      { q: 'How many content pieces per month?', a: 'Most clients receive 30–60 assets per month.' },
      { q: 'Do you follow our brand guidelines?', a: 'Absolutely. We complete a full brand intake before production begins.' },
      { q: 'How many revisions are included?', a: 'Two rounds of revisions per piece.' },
    ],
  },
  {
    title: 'Ads Campaign Management', slug: 'ads-campaign-management',
    description: 'Paid advertising campaigns across Meta, Google, and TikTok built to convert.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'We design, launch, and continuously optimize paid media campaigns that turn ad spend into real revenue.',
    headline: 'Turn Ad Spend Into Predictable, Scalable Revenue.',
    deliverables: ['Multi-platform campaign strategy (Meta, Google, TikTok)', 'Ad creative production — copy, graphics & video', 'Audience research & targeting setup', 'A/B testing framework & execution', 'Conversion tracking & pixel setup', 'Bid strategy & budget optimization', 'Weekly performance snapshots', 'Monthly deep-dive reporting'],
    process: [
      { num: '01', title: 'Account Audit', body: 'We review your existing ad accounts, creative, targeting, and historical performance.' },
      { num: '02', title: 'Strategy & Planning', body: 'We define campaign objectives, funnel structure, audience segments, and budget distribution.' },
      { num: '03', title: 'Creative Development', body: 'We produce ad creative designed to perform across cold, warm, and retargeting audiences.' },
      { num: '04', title: 'Launch & Test', body: 'Campaigns go live with a structured A/B testing framework.' },
      { num: '05', title: 'Optimize & Scale', body: 'We scale budgets into winning ad sets and kill underperformers fast.' },
    ],
    results: [
      { stat: '4.2×', label: 'Average ROAS across accounts', description: 'We deliver an average 4.2× return on ad spend within the first 90 days.' },
      { stat: '38%', label: 'Reduction in cost per lead', description: 'Better targeting and tighter creative consistently lower CPL.' },
      { stat: '90', label: 'Days to break-even (avg)', description: 'Most clients recover their initial investment within 90 days.' },
    ],
    faqs: [
      { q: 'Which ad platforms do you manage?', a: 'Meta Ads, Google Ads, and TikTok Ads. Most clients run on 2 platforms.' },
      { q: 'What is the minimum ad budget?', a: 'We recommend a minimum of $2,000/month in ad spend.' },
      { q: 'Do you create the ad creative?', a: 'Yes. Ad creative production is included in our service.' },
      { q: 'How quickly can we expect results?', a: 'The first 30 days are a learning phase. Strong returns typically established by month 2–3.' },
    ],
  },
  {
    title: 'Copywriting', slug: 'copywriting',
    description: 'Words that sell — from ad copy and landing pages to email sequences and brand messaging.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'Our copywriters craft messaging that speaks directly to your audience\'s needs, objections, and desires.',
    headline: 'Words That Convert Readers Into Buyers.',
    deliverables: ['Landing page copy (full-length, conversion-optimized)', 'Ad copy — headlines, primary text & CTAs', 'Email nurture sequences (5–10 emails)', 'Product & service descriptions', 'Brand messaging guide & tone of voice', 'Website copy rewrites', 'Social media caption templates', 'Sales page copywriting'],
    process: [
      { num: '01', title: 'Discovery & Research', body: 'We dig into your brand, ideal customer profile, competitors, and existing messaging.' },
      { num: '02', title: 'Messaging Framework', body: 'We define your core value proposition and key differentiators.' },
      { num: '03', title: 'First Draft', body: 'We write the full copy piece using proven direct-response frameworks.' },
      { num: '04', title: 'Review & Feedback', body: 'You review the draft and provide feedback.' },
      { num: '05', title: 'Refinement & Delivery', body: 'We revise and deliver the final approved copy in your preferred format.' },
    ],
    results: [
      { stat: '35%', label: 'Average lift in conversion rate', description: 'Replacing weak copy consistently increases conversion rates by 25–45%.' },
      { stat: '2.4×', label: 'Higher email open rates', description: 'Subject lines written with deliberate psychology consistently outperform generic approaches.' },
      { stat: '28%', label: 'Shorter sales cycles', description: 'Clear, persuasive copy that addresses objections upfront means prospects arrive more ready to buy.' },
    ],
    faqs: [
      { q: 'What types of copy do you write?', a: 'Landing pages, sales pages, ad copy, email sequences, website copy, product descriptions, social captions, and more.' },
      { q: 'How many revisions are included?', a: 'Two rounds of revisions are included for every project.' },
      { q: 'Do you research our industry?', a: 'We research every client deeply before writing.' },
      { q: 'What is the typical turnaround time?', a: 'A landing page typically takes 5–7 business days from brief to first draft.' },
    ],
  },
  {
    title: 'Product Photography', slug: 'product-photography',
    description: 'High-quality product images that make your offerings impossible to scroll past.',
    image: 'https://images.unsplash.com/photo-1506719040632-7d586470c936?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'Our product photography sessions are styled, lit, and shot to showcase your products at their very best.',
    headline: 'Visuals That Make Your Products Impossible to Ignore.',
    deliverables: ['Full creative brief & mood board development', 'Professional studio or on-location shoot', 'Art direction, styling & propping', 'White background e-commerce shots', 'Lifestyle & context shots', 'Full post-production editing & retouching', 'Platform-optimized exports', 'Commercial usage rights included'],
    process: [
      { num: '01', title: 'Creative Brief', body: 'We develop a comprehensive brief covering visual direction, shot list, and styling references.' },
      { num: '02', title: 'Pre-Production', body: 'We coordinate all shoot logistics — studio booking, prop sourcing, and lighting design.' },
      { num: '03', title: 'Shoot Day', body: 'Our photographer executes the full shot list with methodical precision.' },
      { num: '04', title: 'Editing & Retouching', body: 'Every selected image goes through full post-production.' },
      { num: '05', title: 'Delivery', body: 'Final images delivered in organized folders. Typical turnaround 5–7 business days post-shoot.' },
    ],
    results: [
      { stat: '28%', label: 'Higher CTR on product listings', description: 'Professional imagery consistently outperforms amateur product photos in click-through rates.' },
      { stat: '3×', label: 'More saves & shares on social', description: 'High-quality product visuals generate significantly more saves and shares.' },
      { stat: '18%', label: 'Lower return rates', description: 'Accurate, detailed photography sets the right expectations and reduces returns.' },
    ],
    faqs: [
      { q: 'How many products can you shoot per session?', a: 'A standard full-day shoot covers 8–15 products with multiple angles.' },
      { q: 'Studio or on-location?', a: 'Both. We have access to professional studio spaces and can organize on-location shoots.' },
      { q: 'What is the turnaround time after the shoot?', a: 'Final edited images delivered within 5–7 business days of approval.' },
      { q: 'What file formats will we receive?', a: 'High-resolution JPEGs and PNGs optimized for web, print, and social.' },
    ],
  },
  {
    title: 'Model Photography', slug: 'model-photography',
    description: 'Lifestyle and model shoots that put a human face on your brand.',
    image: 'https://images.unsplash.com/photo-1520975916090-7be0e1ae1d4e?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'Our model photography sessions blend professional talent with thoughtful direction to create authentic, aspirational imagery.',
    headline: 'Lifestyle Imagery That Connects Products to People.',
    deliverables: ['Talent casting & model coordination', 'Wardrobe sourcing & styling direction', 'Location scouting or studio booking', 'Full shoot day with art direction', 'Full post-production editing', 'Platform-optimized final delivery', 'Commercial usage rights included'],
    process: [
      { num: '01', title: 'Creative Brief', body: 'We define the visual direction, casting requirements, and lifestyle context for every shoot.' },
      { num: '02', title: 'Talent Sourcing', body: 'We cast professional models suited to your brand and audience.' },
      { num: '03', title: 'Pre-Production', body: 'Wardrobe coordination, location scouting, and shoot day logistics.' },
      { num: '04', title: 'Shoot Day', body: 'Full art direction on shoot day to capture authentic, brand-aligned imagery.' },
      { num: '05', title: 'Post-Production', body: 'Color grading, retouching, and platform-specific format delivery.' },
    ],
    results: [
      { stat: '42%', label: 'Higher engagement on lifestyle posts', description: 'Human imagery consistently outperforms product-only content in social engagement.' },
      { stat: '2.6×', label: 'More shares vs product-only shoots', description: 'Relatable lifestyle imagery drives significantly more social sharing.' },
      { stat: '31%', label: 'Higher conversion on fashion ads', description: 'Model photography in fashion ads consistently delivers stronger conversion rates.' },
    ],
    faqs: [
      { q: 'Do you provide the models?', a: 'Yes. We have a roster of professional models and can cast to match your brand perfectly.' },
      { q: 'Where are shoots conducted?', a: 'We work across studios and on-location depending on the creative brief.' },
      { q: 'What is the turnaround time?', a: 'Edited images delivered within 5–7 business days post-shoot.' },
      { q: 'Are usage rights included?', a: 'Yes. Commercial usage rights for all final delivered images are included.' },
    ],
  },
  {
    title: 'Video Production', slug: 'video-production',
    description: 'Branded video content — from social Reels and TikToks to full-scale brand films.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'Video is the highest-performing content format across every platform. We produce short-form social content, product videos, brand films, and everything in between.',
    headline: 'Video That Moves People. Literally.',
    deliverables: ['Short-form social video (Reels, TikToks, Shorts)', 'Brand films & sizzle reels', 'Product demo videos', 'Explainer animations', 'Video scripts & storyboarding', 'Professional editing & color grading', 'Motion graphics & text overlays', 'Platform-optimized format delivery'],
    process: [
      { num: '01', title: 'Script & Concept', body: 'Every video starts with a clear concept, script, and storyboard that maps to your objective.' },
      { num: '02', title: 'Pre-Production', body: 'Shot list, location, talent, and equipment — all organized before a single second of footage is captured.' },
      { num: '03', title: 'Production', body: 'Professional filming with directorial oversight to ensure every shot serves the story.' },
      { num: '04', title: 'Edit & Post', body: 'Color grading, sound design, motion graphics, and platform-specific formatting.' },
      { num: '05', title: 'Delivery', body: 'Final files delivered in all required formats for social, web, and broadcast.' },
    ],
    results: [
      { stat: '87%', label: 'Of marketers say video gives positive ROI', description: 'Video consistently outperforms every other content format for both reach and conversion.' },
      { stat: '3×', label: 'More engagement than static content', description: 'Video content generates 3× more engagement on average versus static images or text.' },
      { stat: '64%', label: 'Of consumers buy after watching brand video', description: 'Video is the single most powerful purchase trigger in the consumer journey.' },
    ],
    faqs: [
      { q: 'What types of video do you produce?', a: 'Social Reels, TikToks, product demos, brand films, explainers, testimonials, and more.' },
      { q: 'Do you handle scripting and concept development?', a: 'Yes. Scripting, concept development, and storyboarding are all included.' },
      { q: 'What is the turnaround time?', a: 'Short-form social content: 5–7 days. Longer brand films: 10–14 days post-shoot.' },
      { q: 'Do you provide the talent?', a: 'We can source on-screen talent, voiceover artists, and production crew as needed.' },
    ],
  },
  {
    title: 'Influencer Marketing', slug: 'influencer-marketing',
    description: 'Strategic influencer partnerships that build trust and drive conversions at scale.',
    image: 'https://images.unsplash.com/photo-1551817958-11e55958a8c6?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'We identify, vet, and activate the right creators for your brand — then manage every aspect of the campaign from briefing to reporting.',
    headline: 'Reach the Right Audience Through the Voices They Trust.',
    deliverables: ['Influencer research, vetting & outreach', 'Campaign strategy & brief development', 'Contract negotiation & management', 'Creative direction & content review', 'Performance tracking & attribution', 'Relationship management & reporting', 'UGC rights acquisition'],
    process: [
      { num: '01', title: 'Strategy & Targeting', body: 'We define the campaign objective, audience profile, and influencer tier mix before sourcing.' },
      { num: '02', title: 'Research & Vetting', body: 'We vet every influencer on audience authenticity, engagement quality, and brand alignment.' },
      { num: '03', title: 'Outreach & Contracts', body: 'We handle all outreach, negotiation, and contract management.' },
      { num: '04', title: 'Content Production', body: 'We brief creators, review content, and ensure brand guidelines are met before posting.' },
      { num: '05', title: 'Reporting & UGC', body: 'Post-campaign reporting covers reach, engagement, conversions, and earned media value.' },
    ],
    results: [
      { stat: '11×', label: 'Higher ROI vs traditional advertising', description: 'Influencer marketing consistently delivers superior ROI compared to traditional digital ads.' },
      { stat: '6.1%', label: 'Average engagement rate (micro-influencers)', description: 'Micro-influencer campaigns average 6.1% engagement — far above standard ad benchmarks.' },
      { stat: '92%', label: 'Of consumers trust peer recommendations', description: 'Influencer content leverages the trust people extend to the voices they already follow.' },
    ],
    faqs: [
      { q: 'Do you work with macro or micro influencers?', a: 'Both. We build the right mix based on your campaign objective and budget.' },
      { q: 'How do you vet influencers?', a: 'We analyse follower authenticity, engagement quality, audience demographics, and brand alignment.' },
      { q: 'What is the minimum campaign budget?', a: 'We recommend a minimum of $3,000 for a meaningful campaign with measurable results.' },
      { q: 'Who owns the content after the campaign?', a: 'We negotiate UGC rights as part of every influencer contract — usage terms are agreed upfront.' },
    ],
  },
  {
    title: 'Website Maintenance', slug: 'website-maintenance',
    description: 'Ongoing technical and content updates that keep your website fast, secure, and current.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    longDescription: 'A website is never finished. Ours keeps yours secure, fast, and always up to date so you can focus on the business.',
    headline: 'Your Website, Always Fast. Always Secure. Always Current.',
    deliverables: ['Monthly plugin & theme updates', 'Security monitoring & malware scanning', 'Performance optimization & speed checks', 'Content updates & page edits', 'Database optimization & cleanup', 'Uptime monitoring with instant alerts', 'Monthly health report', 'Emergency support (8-hour response SLA)'],
    process: [
      { num: '01', title: 'Site Audit', body: 'We audit your current stack — plugins, themes, performance scores, and security vulnerabilities.' },
      { num: '02', title: 'Baseline Fixes', body: 'We address any immediate issues before beginning ongoing maintenance.' },
      { num: '03', title: 'Monthly Updates', body: 'Core, plugin, and theme updates are applied and tested in a staging environment first.' },
      { num: '04', title: 'Performance Monitoring', body: 'Continuous uptime monitoring, Core Web Vitals tracking, and speed optimization.' },
      { num: '05', title: 'Monthly Report', body: 'You receive a clear summary of all work performed, current health scores, and upcoming tasks.' },
    ],
    results: [
      { stat: '99.9%', label: 'Uptime guarantee', description: 'Our monitoring and rapid response processes keep your site available around the clock.' },
      { stat: '2.3s', label: 'Average page load time', description: 'Performance optimization keeps load times below the 3-second attention threshold.' },
      { stat: '0', label: 'Successful breaches on managed sites', description: 'Our security protocols have maintained a zero-breach record across all maintained sites.' },
    ],
    faqs: [
      { q: 'What CMS platforms do you maintain?', a: 'We maintain WordPress, Shopify, Webflow, and custom-coded sites.' },
      { q: 'How do content updates work?', a: 'Submit requests via our client portal. Most updates are completed within 24–48 hours.' },
      { q: 'What happens if the site goes down?', a: 'Our monitoring alerts us within minutes and our emergency response SLA is 8 hours.' },
      { q: 'Is hosting included?', a: 'Hosting is not included in our maintenance packages but we can recommend and manage your hosting setup.' },
    ],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return servicesData.find(s => s.slug === slug)
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    slug: 'consistency-beats-creativity-social-media', category: 'marketing', featured: true,
    title: 'Why Consistency Beats Creativity in Social Media',
    excerpt: 'Most brands chase the next viral idea. The ones that actually grow do one thing every day — show up.',
    readTime: '6 min read', publishDate: 'May 18, 2026', author: 'KTI Marketing Team',
    tags: ['Social Media', 'Strategy', 'Content'],
    accentColor: '#D7262E', gradientFrom: '#1a0a0b', gradientTo: '#2d0e10',
    callout: 'The algorithm rewards brands that post consistently far more than brands that post brilliantly once a month.',
    takeaways: ['Post at least 4–5 times per week on your primary platform', 'Build a 2-week content buffer before you go live', 'Track engagement rate, not follower count, as your north star', 'Batch-create content every Sunday to remove daily decision fatigue'],
    body: [
      { heading: 'The Myth of the Viral Post', paragraphs: ['Every week, a brand somewhere posts one perfect piece of content and wakes up to 50,000 new followers. The internet celebrates. Competitors try to reverse-engineer the magic. And then nothing. The spike disappears, the followers churn, and three months later the brand is quieter than ever.', 'Virality is real, but it is a lottery ticket, not a business model. The brands that build durable audiences are the ones that show up every single day, whether their last post got 40 likes or 4,000.'] },
      { heading: 'How Algorithms Actually Work', paragraphs: ['Every major platform — Instagram, TikTok, LinkedIn, Facebook — rewards consistency through its distribution algorithm. When you post regularly, the algorithm classifies your account as an active publisher and gives your content preference in the feed.', 'The compounding effect is real. A brand posting five times a week generates 260 touchpoints per year. A brand posting once a week generates 52. All other variables equal, the consistent brand will build an audience five times larger.'] },
      { heading: 'Building a System, Not a Strategy', paragraphs: ['Most brands treat social media as a creative challenge. They wait for inspiration, craft a post, and publish when the mood strikes. This is the wrong mental model. Social media is an operational challenge. It needs a production system, not a creative process.', 'The most effective system works like this: every Sunday, a 90-minute batch session produces all content for the following week. Captions are drafted, images are selected or shot, and everything is scheduled. Monday to Friday, the brand is present without the daily cognitive cost of figuring out what to post.'] },
    ],
  },
  {
    slug: 'turn-followers-into-paying-customers', category: 'marketing', featured: false,
    title: 'How to Turn Followers into Paying Customers',
    excerpt: 'A large following means nothing if it does not convert. This guide walks through the funnel mechanics that transform passive scrollers into buyers.',
    readTime: '8 min read', publishDate: 'May 10, 2026', author: 'KTI Marketing Team',
    tags: ['Conversion', 'Social Media', 'Sales Funnel'],
    accentColor: '#D7262E', gradientFrom: '#0f1117', gradientTo: '#1c1f2e',
    callout: 'A follower is not a customer. They are a subscriber to your content who might, one day, become a customer — if you build the right bridge.',
    takeaways: ['Every post needs a clear next step', 'Move conversations from public comments to private DMs', 'Build a simple email list as your owned channel', 'Use social proof in every sales touchpoint'],
    body: [
      { heading: 'The Follower Trap', paragraphs: ['Growing a social media following feels like progress. The numbers go up, the notifications keep coming, and the brand looks credible. But follower count is a vanity metric.', 'We have worked with brands that had 5,000 highly engaged followers and generated 50 sales per month, and brands with 80,000 followers and near-zero conversion. The difference was not reach — it was funnel architecture.'] },
      { heading: 'The Awareness-to-Purchase Bridge', paragraphs: ['Every follower sits somewhere on a spectrum from "just discovered you" to "ready to buy." Your content strategy must serve all stages simultaneously.', 'A healthy content mix is roughly 60% awareness, 30% consideration, and 10% direct conversion. That 10% — the posts that say "here is how to work with us" — is what most brands are too timid to publish consistently.'] },
    ],
  },
  {
    slug: '5-marketing-metrics-that-actually-matter', category: 'marketing', featured: false,
    title: 'The 5 Marketing Metrics That Actually Matter',
    excerpt: 'Vanity metrics like impressions and likes feel good but rarely drive decisions. Learn which five numbers tell the real story of your marketing health.',
    readTime: '5 min read', publishDate: 'April 28, 2026', author: 'KTI Marketing Team',
    tags: ['Analytics', 'Strategy', 'ROI'],
    accentColor: '#D7262E', gradientFrom: '#0b0f1a', gradientTo: '#131825',
    callout: 'If your marketing report is full of impressions and reach but light on revenue and conversion, you are measuring the wrong things.',
    takeaways: ['Track CAC monthly', 'Know your LTV:CAC ratio — healthy is 3:1 or better', 'ROAS below 2.0 usually means the creative or audience needs reworking', 'Organic reach velocity tells you if your content strategy is gaining momentum'],
    body: [
      { heading: 'Why Vanity Metrics Are Dangerous', paragraphs: ['Likes, comments, impressions, follower counts — these numbers are easy to produce, easy to screenshot, and almost impossible to connect directly to revenue.', 'The problem is that they create a false sense of progress. A brand can be losing money on every sale while its social media metrics trend upward.'] },
      { heading: '1. Customer Acquisition Cost (CAC)', paragraphs: ['CAC is the total amount you spend on marketing and sales divided by the number of new customers acquired in the same period.', 'CAC is only meaningful when compared against the value of a customer. Track it monthly and watch for trends.'] },
    ],
  },
  {
    slug: 'brand-storytelling-small-business', category: 'marketing', featured: false,
    title: 'Brand Storytelling: How Small Businesses Win Against Big Budgets',
    excerpt: 'You cannot out-spend a corporate competitor. But you can out-story them.',
    readTime: '7 min read', publishDate: 'April 15, 2026', author: 'KTI Marketing Team',
    tags: ['Branding', 'Storytelling', 'Small Business'],
    accentColor: '#D7262E', gradientFrom: '#120b0b', gradientTo: '#1e1010',
    callout: 'People do not buy products. They buy the story of who they will become after using the product.',
    takeaways: ['Find your origin story', 'Make the customer the hero of every story', 'Document the transformation with specific details and numbers', 'Consistency of narrative builds a brand that compounds over time'],
    body: [
      { heading: 'Why Stories Beat Budgets', paragraphs: ['A multinational corporation can spend a billion dollars on advertising and still lose market share to a small brand with a compelling story.', 'What great brands share is not budget — it is narrative clarity. They know why they exist beyond making money, they tell that story with conviction, and they attract customers who believe in the same things.'] },
    ],
  },
  {
    slug: 'launch-ecommerce-brand-bangladesh', category: 'import', featured: true,
    title: 'How to Launch an E-commerce Brand in Bangladesh',
    excerpt: 'The Bangladeshi e-commerce market is growing at 30% annually, yet most new sellers fail within 12 months.',
    readTime: '10 min read', publishDate: 'May 20, 2026', author: 'KTI Marketing Team',
    tags: ['E-commerce', 'Bangladesh', 'Launch Strategy'],
    accentColor: '#0ea5e9', gradientFrom: '#060d1a', gradientTo: '#0c1a30',
    callout: 'The brands that win in Bangladesh\'s e-commerce market are not the ones with the best products — they are the ones with the best customer experience.',
    takeaways: ['Choose your primary platform based on your product category', 'Offer at least 3 payment methods including cash-on-delivery', 'Invest in packaging as a brand touchpoint', 'Set up your Facebook page before your website'],
    body: [
      { heading: 'The Opportunity and the Obstacle', paragraphs: ['Bangladesh\'s e-commerce market crossed $3 billion in 2024 and is projected to reach $8 billion by 2028.', 'But the failure rate is brutal. Most new e-commerce brands in Bangladesh close within their first year, not because the product fails but because the business model was not stress-tested.'] },
      { heading: 'Platform Selection: Where to Sell', paragraphs: ['Bangladesh\'s e-commerce landscape is dominated by three channels: Facebook Shop/Marketplace, Daraz, and direct-to-consumer websites.', 'Facebook is where discovery happens in Bangladesh. An estimated 80% of first-time online purchases happen through Facebook Shops or via Facebook-referred traffic.'] },
    ],
  },
  {
    slug: 'export-import-documentation-marketing', category: 'import', featured: false,
    title: 'Export-Import Documentation: A Marketing Perspective',
    excerpt: 'LC, ERC, HS codes — the paperwork of international trade is dense. But hidden inside every document is a positioning opportunity.',
    readTime: '7 min read', publishDate: 'May 5, 2026', author: 'KTI Marketing Team',
    tags: ['Export-Import', 'B2B Marketing', 'Trade'],
    accentColor: '#0ea5e9', gradientFrom: '#07101c', gradientTo: '#0d1a2a',
    callout: 'Your Export Registration Certificate, your ISO certification, your lab test reports — these are not administrative requirements. They are marketing assets.',
    takeaways: ['Display your ERC, trade licences, and certifications prominently', 'Include quality test reports in your buyer deck', 'Use your documented track record as social proof', 'Make your documentation process transparent'],
    body: [
      { heading: 'The Documents No One Thinks to Market', paragraphs: ['Every export-import business accumulates a library of compliance documents: ERC, trade licences, inspection certificates, lab test reports, ISO certifications.', 'For most businesses, these documents live in a filing cabinet. For smart marketers, they live on the website, in the sales deck, and at the top of the buyer conversation.'] },
    ],
  },
  {
    slug: 'daraz-vs-facebook-shop', category: 'import', featured: false,
    title: 'Daraz vs Facebook Shop: Which Platform Should You Start With?',
    excerpt: 'Both platforms dominate Bangladesh\'s e-commerce landscape — but they serve very different customer journeys.',
    readTime: '6 min read', publishDate: 'April 22, 2026', author: 'KTI Marketing Team',
    tags: ['E-commerce', 'Platform Strategy', 'Bangladesh'],
    accentColor: '#0ea5e9', gradientFrom: '#050d18', gradientTo: '#0a1525',
    callout: 'Start with Facebook to build trust and cash flow. Move to Daraz for scale and discoverability.',
    takeaways: ['Use Facebook for brand building and direct community sales', 'Use Daraz for reaching buyers who do not know your brand yet', 'Build on both once you have validated product-market fit', 'Your own website is the long-term asset — invest in it after proving the model'],
    body: [
      { heading: 'The Two Platforms Dominating Bangladesh E-commerce', paragraphs: ['If you are launching an e-commerce brand in Bangladesh, you will eventually need to make a decision: Daraz or Facebook Shop? Or both? Or neither, and build a direct-to-consumer website?', 'The honest answer is that the right platform depends entirely on your product category, target customer, and stage of business.'] },
    ],
  },
]

export function generalPosts(): BlogPost[] {
  return blogPosts.filter(p => p.category === 'marketing')
}

export function ecommercePosts(): BlogPost[] {
  return blogPosts.filter(p => p.category === 'import')
}

export function latestPosts(): BlogPost[] {
  return blogPosts.slice(0, 3)
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

// ── Case Studies ──────────────────────────────────────────────────────────────

export const caseStudies: CaseStudy[] = [
  {
    slug: 'luxe-apparel-social-media', tag: 'E-Commerce', category: 'Social Media + Paid Ads',
    industry: 'Fashion & Apparel', client: 'Luxe Apparel Co.',
    title: 'From Zero to $1.2M in Online Sales',
    subtitle: 'How we rebuilt Luxe Apparel\'s entire digital presence and turned social media into their number one revenue channel in under 9 months.',
    challenge: 'Luxe Apparel had a stagnant social presence and zero paid media infrastructure. Their e-commerce conversion rate sat below 1% and they relied entirely on organic traffic that wasn\'t converting.',
    solution: 'We rebuilt their entire social identity, launched segmented Meta campaigns targeting high-intent shoppers, and overhauled product page UX to drive conversions.',
    body: 'Rebuilt their entire social presence, launched targeted Meta ads, and delivered 7.4× follower growth alongside a 340% increase in e-commerce revenue in under 9 months.',
    phases: [
      { num: '01', title: 'Brand & Channel Audit', body: 'Audited every touchpoint — content, creative, copy, and conversion paths.' },
      { num: '02', title: 'Creative System & Content Engine', body: 'Built a 30-day content calendar, shot a new creative library with lifestyle and product photography.' },
      { num: '03', title: 'Paid Media Scale', body: 'Launched segmented Meta campaigns with full-funnel coverage. Scaled winning ad sets weekly.' },
    ],
    deliverables: ['Full social media rebrand (Instagram, TikTok, Pinterest)', 'Meta Ads account build and full-funnel campaign structure', '60-piece creative library', 'Weekly A/B creative testing framework', 'E-commerce landing page CRO audit and rebuild', 'Monthly performance reporting'],
    metrics: [{ num: '7.4×', label: 'Follower Growth' }, { num: '340%', label: 'Revenue Increase' }, { num: '$1.2M', label: 'Online Sales Generated' }, { num: '4.8×', label: 'ROAS Achieved' }],
    duration: '9 months', services: ['Social Media Management', 'Paid Ads', 'Content Creation'],
    quote: 'KTI grew our Instagram from 4,200 to 31,000 followers in 6 months and turned it into our number one revenue channel. The ROI speaks for itself.',
    quoteName: 'Amira Hassan', quoteRole: 'CEO', quoteCompany: 'Luxe Apparel Co.', quoteResult: '7.4× follower growth',
  },
  {
    slug: 'techflow-saas-growth', tag: 'SaaS', category: 'Performance Ads + Content',
    industry: 'B2B Software', client: 'TechFlow Inc.',
    title: 'Scaling a SaaS Brand to 4.6× ROAS',
    subtitle: 'How we turned a money-losing ad account into the fastest-growing revenue channel for a B2B SaaS company in one quarter.',
    challenge: 'TechFlow was burning $35K/month on paid ads with a 1.8× ROAS and no clear attribution model. Leadership was days away from cutting the entire paid media budget.',
    solution: 'Complete paid media overhaul: rebuilt campaigns from scratch, developed conversion-focused ad creative aligned with each funnel stage, and rebuilt landing pages.',
    body: 'Overhauled their paid media strategy, developed conversion-focused ad creative, and rebuilt landing pages to turn a losing ad account into their fastest-growing revenue channel.',
    phases: [
      { num: '01', title: 'Attribution & Account Audit', body: 'Installed proper conversion tracking. Audited the full account structure and shut down 14 underperforming campaigns.' },
      { num: '02', title: 'Landing Page & Creative Overhaul', body: 'Rebuilt 4 core landing pages. Developed 20 new ad creatives mapped to each stage of the funnel.' },
      { num: '03', title: 'Funnel Optimisation & Scale', body: 'Launched restructured campaigns with tight ad groups and proper bidding strategies.' },
    ],
    deliverables: ['Full Google Ads account restructure', 'Meta Ads funnel rebuild', '4 conversion-optimised landing pages', '20-piece ad creative library', 'Attribution model setup', 'Weekly performance dashboard'],
    metrics: [{ num: '4.6×', label: 'ROAS Achieved' }, { num: '-62%', label: 'Cost Per Lead' }, { num: '3.1×', label: 'Pipeline Growth' }, { num: '28%', label: 'Trial-to-Paid Rate' }],
    duration: '6 months', services: ['Performance Ads', 'Content Strategy', 'CRO'],
    quote: 'Our ROAS jumped from 1.8× to 4.6× within the first quarter. KTI\'s paid media team understands performance advertising at a level I haven\'t seen elsewhere.',
    quoteName: 'Daniel Osei', quoteRole: 'Head of Growth', quoteCompany: 'TechFlow Inc.', quoteResult: '4.6× ROAS achieved',
  },
  {
    slug: 'wellness-hub-leads', tag: 'Health & Wellness', category: 'Influencer + Content Strategy',
    industry: 'Health & Wellness', client: 'Wellness Hub',
    title: '287% More Leads in 90 Days',
    subtitle: 'How a disciplined influencer and content strategy tripled qualified inbound leads for a health brand in 3 months.',
    challenge: 'Wellness Hub had strong brand awareness but poor lead generation. Their content was informational but not conversion-oriented, and they had never invested in influencer marketing.',
    solution: 'Launched an influencer campaign across micro and macro creators, paired with a content engine that tripled organic reach and filled the pipeline with qualified leads.',
    body: 'Launched an influencer campaign across micro and macro creators, paired with a content engine that tripled organic reach and filled the pipeline with qualified leads.',
    phases: [
      { num: '01', title: 'Audience Research', body: 'Identified the 5 highest-intent audience segments and the content types that converted each.' },
      { num: '02', title: 'Influencer Campaign Launch', body: 'Activated 12 micro-influencers and 2 macro influencers, each with custom briefs and tracked links.' },
      { num: '03', title: 'Content Engine Build', body: 'Built a 90-day content calendar mapping to the full funnel, from awareness to lead capture.' },
    ],
    deliverables: ['Influencer sourcing and campaign management', 'UGC rights acquisition', 'Full-funnel content calendar', 'Lead capture optimisation', 'Attribution tracking and reporting'],
    metrics: [{ num: '+287%', label: 'Qualified Leads' }, { num: '3.1M', label: 'Organic Impressions' }, { num: '12', label: 'Influencers Activated' }, { num: '4.2%', label: 'Average Engagement Rate' }],
    duration: '3 months', services: ['Influencer Marketing', 'Content Creation', 'Social Media Management'],
    quote: '287% increase in qualified leads in under 90 days. They don\'t just promise results — they build systems that deliver them consistently.',
    quoteName: 'Priya Nair', quoteRole: 'Founder', quoteCompany: 'Wellness Hub', quoteResult: '+287% qualified leads',
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug)
}

// ── Marketing Packages ────────────────────────────────────────────────────────

export const marketingPackages: MarketingPackage[] = [
  { id: 1, name: 'Essential', price: 24499, badge: null, highlight: false, description: 'Perfect for brands getting started with professional social media management.', platforms: ['Facebook — 15 posts/mo', 'Instagram — 15 posts/mo'], deliverables: ['Static Designs: 5 pieces', 'Thumbnails: 2 pieces', 'Copywriting: 10 pieces', 'Explainer Videos: 2', 'Voice-over Videos: 1', 'Ads Management', 'Ad Spend Budget: ৳70,000–80,000', 'Monthly Performance Report'], cta: 'Get Started' },
  { id: 2, name: 'Growth', price: 34999, badge: null, highlight: false, description: 'Expand your reach across multiple platforms with enhanced creative output.', platforms: ['Facebook — 22 posts/mo', 'Instagram — 22 posts/mo', 'YouTube — 8 posts/mo', 'TikTok — 8 posts/mo'], deliverables: ['Static Designs: 8 pieces', 'Thumbnails: 3 pieces', 'Copywriting: 15 pieces', 'Explainer Videos: 2', 'Voice-overs: 2', 'Online Strategy Meeting: 1/mo', 'Ad Spend Budget: ৳1,20,000', 'Monthly Performance Report'], cta: 'Get Started' },
  { id: 3, name: 'Professional', price: 49499, badge: 'Most Popular', highlight: true, description: 'Our most popular package — the sweet spot of reach, creativity, and results.', platforms: ['Facebook — 30 posts/mo', 'Instagram — 30 posts/mo', 'YouTube — 12 posts/mo', 'TikTok / Facebook Group — 15 posts/mo'], deliverables: ['Static Designs: 10 pieces', 'Thumbnails: 4 pieces', 'Explainer Videos: 3', 'Voice-overs: 2', 'Online Strategy Meetings: 2/mo', 'Ad Spend Budget: ৳1,80,000', 'Priority Support', 'Monthly Performance Report'], cta: 'Get Started' },
  { id: 4, name: 'Scale', price: 80000, badge: null, highlight: false, description: 'For established brands ready to dominate across every major platform.', platforms: ['Facebook — 40 posts/mo', 'Instagram — 40 posts/mo', 'YouTube — 15 posts/mo', 'Google Business Profile — 10 posts/mo'], deliverables: ['Static Designs: 13 pieces', 'Thumbnails: 6 pieces', 'Explainer Videos: 4', 'Animation: 1', 'Website Blog Posts: 1/mo', 'Ad Spend Budget: ৳3,00,000', 'Dedicated Account Manager', 'Monthly Performance Report'], cta: 'Talk to Sales' },
  { id: 5, name: 'Enterprise', price: 132499, badge: 'Premium', highlight: false, description: 'Maximum output, maximum reach — built for brands that refuse to be second.', platforms: ['Facebook — 40+ posts/mo', 'Instagram — 40+ posts/mo', 'TikTok — 20 posts/mo', 'LinkedIn — 15 posts/mo', 'Threads — 15 posts/mo', 'Facebook Group — 30+ posts/mo'], deliverables: ['Static Designs: 18 pieces', 'Thumbnails: 8 pieces', 'Explainer Videos: 6', 'Character Animation: included', 'AI Video: included', 'Website Blog Posts: 2/mo', 'Ad Spend Budget: ৳4,50,000–5,00,000', 'Dedicated Senior Account Manager', 'Weekly Performance Reports', 'Custom Strategy Sessions'], cta: 'Talk to Sales' },
]

export const photoshootPackages: PhotoshootPackage[] = [
  { type: 'Product Photography', icon: '📦', description: 'Professional studio shots for individual products on white or branded backgrounds.', price: '৳8,000', priceNumeric: 8000, unit: 'per session', addOn: '৳500 per extra product', includes: ['Up to 10 products', 'White & lifestyle backgrounds', 'Basic retouching', 'High-res delivery'], qtyConfig: { inputLabel: 'How many products?', unit: 'products', capacity: 10, sessionLabel: 'session', defaultQty: 10, imagesConfig: { defaultImages: 30, pricePerImage: 150 } } },
  { type: 'Model Photography', icon: '👤', description: 'Lifestyle and fashion shoots featuring professional models.', price: '৳15,000', priceNumeric: 15000, unit: 'per session', addOn: 'Model fee may apply', includes: ['Half-day shoot (4 hrs)', '2 outfit changes', 'Professional model', 'Location or studio'], qtyConfig: { inputLabel: 'How many sessions?', unit: 'sessions', capacity: 1, sessionLabel: 'session', defaultQty: 1, imagesConfig: { defaultImages: 50, pricePerImage: 200 } } },
  { type: 'E-commerce Pack', icon: '🛒', description: 'High-volume product photography package for sellers on Daraz, Amazon, or direct-to-consumer stores.', price: '৳18,000', priceNumeric: 18000, unit: 'per pack', addOn: null, includes: ['Up to 20 products', 'Pure white background', 'Multi-angle shots', 'Same-day processing'], qtyConfig: { inputLabel: 'How many products?', unit: 'products', capacity: 20, sessionLabel: 'pack', defaultQty: 20, imagesConfig: { defaultImages: 60, pricePerImage: 150 } } },
  { type: 'Commercial Full-Day', icon: '🎬', description: 'Full production day with professional crew, studio access, styling, and comprehensive post-processing.', price: '৳45,000', priceNumeric: 45000, unit: 'per day', addOn: 'Travel fees extra', includes: ['8-hour shoot', 'Full crew & equipment', 'Styling assistance', 'Advanced retouching', 'Usage rights'], qtyConfig: { inputLabel: 'How many days?', unit: 'days', capacity: 1, sessionLabel: 'day', defaultQty: 1, imagesConfig: { defaultImages: 100, pricePerImage: 250 } } },
]

export const FAQS = [
  { q: 'Are these prices fixed or can they be customised?', a: 'All packages are starting points. We tailor every engagement to the specific brand. Contact us and we will build a package around your exact goals and budget.' },
  { q: 'Is the ad spend budget included in the package price?', a: 'No. The ad spend budget listed is the amount spent directly on platform advertising, paid to the platforms. The package price covers our management, strategy, and creative fees only.' },
  { q: 'Is there a minimum contract length?', a: 'We recommend a minimum of 3 months to see meaningful results. We do not lock you into long contracts, but ask for 30 days\' notice before cancellation.' },
  { q: 'What is included in "Ads Management"?', a: 'Campaign setup, audience research, ad creative briefing, A/B testing, bid optimisation, and weekly performance monitoring.' },
  { q: 'Do you offer packages for startups or small budgets?', a: 'Yes. The Essential package is designed for brands at the beginning of their growth journey.' },
  { q: 'How does the pricing calculator work?', a: 'The calculator gives a bottom-up estimate based on the individual unit cost of each service. Real package pricing is lower due to bundling efficiencies.' },
]

// ── Job Listings ──────────────────────────────────────────────────────────────

export const jobListings: JobListing[] = [
  {
    slug: 'social-media-manager', title: 'Social Media Manager',
    department: 'Marketing', location: 'Dhaka, Bangladesh', type: 'Full-time',
    posted: 'May 20, 2026', salary: '৳35,000 – ৳50,000 / month',
    excerpt: 'Own the content calendar and community for 10+ client brands across Facebook, Instagram, and TikTok.',
    description: 'We are looking for a creative and data-driven Social Media Manager to join our growing team at KTI Marketing. In this role you will take full ownership of organic social strategy and execution for a portfolio of ambitious brands.',
    responsibilities: ['Manage content calendars for 8–12 client accounts across Meta, TikTok, and YouTube', 'Write compelling captions, scripts, and creative briefs', 'Monitor performance metrics and produce weekly client reports', 'Coordinate with the Ads team to align organic and paid social strategies', 'Lead community management', 'Stay ahead of platform algorithm changes and content trends'],
    requirements: ['Minimum 2 years of social media management experience', 'Proven track record of growing brand audiences organically', 'Strong written Bangla and English communication skills', 'Proficiency with Meta Business Suite and TikTok Creator Studio', 'Analytical mindset — comfortable reading data and translating it into strategy'],
    niceToHave: ['Experience coordinating with influencers', 'Basic Canva or CapCut skills', 'Familiarity with social listening tools'],
    benefits: ['Competitive salary with quarterly performance bonuses', 'Flexible hybrid schedule (3 days in-office, 2 days remote)', 'Professional development budget', 'Fast-track career growth', 'Collaborative, creative team culture'],
  },
  {
    slug: 'graphic-designer', title: 'Graphic Designer',
    department: 'Creative', location: 'Dhaka, Bangladesh', type: 'Full-time',
    posted: 'May 18, 2026', salary: '৳30,000 – ৳45,000 / month',
    excerpt: 'Design scroll-stopping visuals for social media, ads, and brand campaigns across a diverse portfolio of clients.',
    description: 'KTI Marketing is hiring a talented Graphic Designer to create visually compelling content that drives results for our clients. You will work closely with social media managers, copywriters, and video editors.',
    responsibilities: ['Design static posts, Stories, Reels covers, thumbnails, and ad creatives', 'Develop brand identity assets including logos and style guides', 'Collaborate with copywriters to ensure design and copy work together', 'Maintain and expand client brand asset libraries', 'Meet tight deadlines while maintaining design quality'],
    requirements: ['Minimum 2 years of professional design experience', 'Expert-level Adobe Creative Suite skills (Photoshop, Illustrator, InDesign)', 'Strong portfolio demonstrating social media and digital design work', 'Understanding of social media platform dimensions and best practices'],
    niceToHave: ['Experience with motion graphics or video editing', 'UI/UX design skills', 'Photography skills'],
    benefits: ['Competitive salary with performance bonuses', 'Creative studio environment', 'Professional development budget', 'Career growth within the agency', 'Flexible working hours'],
  },
  {
    slug: 'video-editor', title: 'Video Editor',
    department: 'Creative', location: 'Dhaka, Bangladesh', type: 'Full-time',
    posted: 'May 12, 2026', salary: '৳25,000 – ৳40,000 / month',
    excerpt: 'Edit high-performing short-form videos for Reels, TikTok, and YouTube across our client portfolio.',
    description: 'We are looking for a skilled Video Editor who thrives in the fast-paced world of short-form social video. You will be editing Reels, TikToks, YouTube Shorts, and longer brand content for a diverse range of clients.',
    responsibilities: ['Edit short-form social videos (Reels, TikTok, Shorts) daily', 'Add motion graphics, text overlays, and sound design', 'Colour grade footage to brand specifications', 'Collaborate with content strategists and designers', 'Manage video asset libraries'],
    requirements: ['Minimum 2 years of video editing experience', 'Expert in Adobe Premiere Pro and After Effects', 'Strong understanding of short-form video formats and trends', 'Ability to edit quickly without sacrificing quality'],
    niceToHave: ['Experience with DaVinci Resolve', 'Basic motion graphics skills', 'Photography skills'],
    benefits: ['Competitive salary', 'Creative team environment', 'Access to professional equipment', 'Growth opportunities in a fast-scaling agency'],
  },
]

export function getJobBySlug(slug: string): JobListing | undefined {
  return jobListings.find(j => j.slug === slug)
}
