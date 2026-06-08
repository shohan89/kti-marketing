import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { servicesData, blogPosts, caseStudies, jobListings } from '@/data/staticData'

const BASE = 'https://ktimarketing.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/case-studies`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/themes`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  let serviceUrls: MetadataRoute.Sitemap = []
  let blogUrls: MetadataRoute.Sitemap = []
  let caseUrls: MetadataRoute.Sitemap = []
  let jobUrls: MetadataRoute.Sitemap = []

  try {
    const [services, posts, cases, jobs] = await Promise.all([
      prisma.service.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.caseStudy.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.jobListing.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ])
    serviceUrls = services.map(s => ({ url: `${BASE}/services/${s.slug}`, lastModified: s.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 }))
    blogUrls = posts.map(p => ({ url: `${BASE}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 }))
    caseUrls = cases.map(c => ({ url: `${BASE}/case-studies/${c.slug}`, lastModified: c.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 }))
    jobUrls = jobs.map(j => ({ url: `${BASE}/careers/${j.slug}`, lastModified: j.updatedAt, changeFrequency: 'weekly' as const, priority: 0.5 }))
  } catch {
    serviceUrls = servicesData.map(s => ({ url: `${BASE}/services/${s.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 }))
    blogUrls = blogPosts.map(p => ({ url: `${BASE}/blog/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 }))
    caseUrls = caseStudies.map(c => ({ url: `${BASE}/case-studies/${c.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 }))
    jobUrls = jobListings.map(j => ({ url: `${BASE}/careers/${j.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 }))
  }

  return [...staticPages, ...serviceUrls, ...blogUrls, ...caseUrls, ...jobUrls]
}
