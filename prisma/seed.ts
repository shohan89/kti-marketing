import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { servicesData, blogPosts, caseStudies, marketingPackages, photoshootPackages, jobListings } from '../src/data/staticData'

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL || '' })
const prisma = new PrismaClient({ adapter } as never)

async function main() {
  console.log('🌱 Seeding database...')

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug, title: s.title, description: s.description,
        longDescription: s.longDescription || s.description,
        headline: s.headline, isPublished: true,
        sortOrder: servicesData.indexOf(s),
        deliverables: s.deliverables,
        processSteps: s.process as unknown as never,
        results: s.results as unknown as never,
        faqs: s.faqs as unknown as never,
      },
    })
  }
  console.log(`✓ Seeded ${servicesData.length} services`)

  for (const p of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug, title: p.title,
        category: (p.category === 'import' ? 'IMPORT' : 'MARKETING') as 'MARKETING' | 'IMPORT',
        excerpt: p.excerpt, readTime: p.readTime,
        publishDate: p.publishDate,
        author: p.author, tags: p.tags,
        isPublished: true, featured: false,
        body: p.body as unknown as never,
      },
    })
  }
  console.log(`✓ Seeded ${blogPosts.length} blog posts`)

  for (const cs of caseStudies) {
    await prisma.caseStudy.upsert({
      where: { slug: cs.slug },
      update: {},
      create: {
        slug: cs.slug, title: cs.title, subtitle: cs.subtitle || cs.title,
        client: cs.client, industry: cs.industry, category: cs.category, tag: cs.tag,
        challenge: cs.challenge, solution: cs.solution,
        body: cs.solution,
        phases: cs.phases as unknown as never,
        deliverables: cs.deliverables,
        metrics: cs.metrics as unknown as never,
        duration: cs.duration, services: cs.services,
        quote: cs.quote, quoteName: cs.quoteName, quoteRole: cs.quoteRole,
        quoteCompany: cs.quoteCompany, quoteResult: cs.quoteResult,
        isPublished: true,
      },
    })
  }
  console.log(`✓ Seeded ${caseStudies.length} case studies`)

  for (const pkg of marketingPackages) {
    await prisma.marketingPackage.upsert({
      where: { id: String(pkg.id) },
      update: {},
      create: {
        id: String(pkg.id), name: pkg.name, price: pkg.price,
        description: pkg.description, badge: pkg.badge ?? null,
        highlight: pkg.highlight ?? false, cta: pkg.cta,
        platforms: pkg.platforms, deliverables: pkg.deliverables,
        sortOrder: marketingPackages.indexOf(pkg), isPublished: true,
      },
    })
  }
  console.log(`✓ Seeded ${marketingPackages.length} marketing packages`)

  for (const j of jobListings) {
    await prisma.jobListing.upsert({
      where: { slug: j.slug },
      update: {},
      create: {
        slug: j.slug, title: j.title, department: j.department,
        location: j.location, type: j.type, salary: j.salary ?? null,
        excerpt: j.excerpt, description: j.description,
        responsibilities: j.responsibilities, requirements: j.requirements,
        niceToHave: j.niceToHave ?? [], benefits: j.benefits ?? [],
        isPublished: true, posted: j.posted,
      },
    })
  }
  console.log(`✓ Seeded ${jobListings.length} job listings`)

  const defaults = [
    { key: 'contact_email', value: 'hello@ktimarketing.com' },
    { key: 'contact_phone', value: '+880 1234 567890' },
    { key: 'contact_address', value: 'Dhaka, Bangladesh' },
    { key: 'social_facebook', value: 'https://facebook.com/ktimarketing' },
    { key: 'social_instagram', value: 'https://instagram.com/ktimarketing' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/ktimarketing' },
  ]
  for (const { key, value } of defaults) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } })
  }
  console.log('✓ Seeded site settings')
  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch(e => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
