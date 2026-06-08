import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { jobListings, getJobBySlug, DEPT_COLORS } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import { prisma } from '@/lib/prisma'
import './JobPost.css'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return jobListings.map(j => ({ slug: j.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const job = await prisma.jobListing.findUnique({ where: { slug } })
    if (job) {
      const title = job.metaTitle ?? `${job.title} — Careers at KTI Marketing`
      const description = job.metaDescription ?? job.excerpt
      return {
        title,
        description,
        openGraph: { title, description },
        twitter: { card: 'summary_large_image', title, description },
      }
    }
  } catch { /* fall through to static */ }
  const job = getJobBySlug(slug)
  if (!job) return {}
  return {
    title: `${job.title} — Careers at KTI Marketing`,
    description: job.excerpt,
  }
}

export default async function JobPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let job: any = null
  try {
    const db = await prisma.jobListing.findUnique({ where: { slug } })
    if (db) job = db
  } catch {}
  if (!job) job = getJobBySlug(slug)
  if (!job) notFound()

  const dept = DEPT_COLORS[job.department as keyof typeof DEPT_COLORS] || DEPT_COLORS.Marketing

  return (
    <main className="jp-page">
      <section className="jp-hero">
        <div className="jp-hero__bg" aria-hidden="true"><div className="jp-hero__shape--1" /><div className="jp-hero__shape--2" /></div>
        <div className="container jp-hero__inner">
          <nav className="jp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/careers">Careers</Link><span aria-hidden="true">›</span><span>{job.title}</span>
          </nav>
          <span className="jp-hero__badge" style={{ background: dept.bg, color: dept.text }}>{job.department}</span>
          <h1 className="jp-hero__title reveal">{job.title}</h1>
          <div className="jp-hero__meta reveal">
            <span className="jp-meta-pill">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6A4.5 4.5 0 0 0 8 1.5Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" /></svg>
              {job.location}
            </span>
            <span className="jp-meta-pill">{job.type}</span>
            <span className="jp-meta-pill">Posted {job.posted}</span>
          </div>
          {job.salary && <p className="jp-hero__salary reveal">{job.salary}</p>}
        </div>
      </section>

      <section className="jp-content">
        <div className="container jp-content__grid">
          <article className="jp-article">
            <div className="jp-section reveal">
              <h2 className="jp-section__heading">About This Role</h2>
              <p className="jp-section__para">{job.description}</p>
            </div>
            <div className="jp-section reveal">
              <h2 className="jp-section__heading">Responsibilities</h2>
              <ul className="jp-list">{job.responsibilities.map((item, i) => (<li key={i}>{item}</li>))}</ul>
            </div>
            <div className="jp-section reveal">
              <h2 className="jp-section__heading">Requirements</h2>
              <ul className="jp-list">{job.requirements.map((item, i) => (<li key={i}>{item}</li>))}</ul>
            </div>
            {job.niceToHave && job.niceToHave.length > 0 && (
              <div className="jp-section reveal">
                <h2 className="jp-section__heading">Nice to Have</h2>
                <ul className="jp-list jp-list--secondary">{job.niceToHave.map((item, i) => (<li key={i}>{item}</li>))}</ul>
              </div>
            )}
            {job.benefits && job.benefits.length > 0 && (
              <div className="jp-section reveal">
                <h2 className="jp-section__heading">What We Offer</h2>
                <ul className="jp-list">{job.benefits.map((item, i) => (<li key={i}>{item}</li>))}</ul>
              </div>
            )}
            <div className="jp-article__footer reveal">
              <Link href="/careers" className="btn btn-outline">← Back to Careers</Link>
              <Link href="/contact" className="btn">Apply Now →</Link>
            </div>
          </article>

          <aside className="jp-sidebar">
            <div className="jp-sidebar-card">
              <p className="jp-sidebar-card__label">Job Details</p>
              <ul className="jp-sidebar-info">
                <li><span className="jp-sidebar-info__key">Department</span><span className="jp-sidebar-info__val jp-sidebar-badge" style={{ color: dept.text, background: dept.bg }}>{job.department}</span></li>
                <li><span className="jp-sidebar-info__key">Location</span><span className="jp-sidebar-info__val">{job.location}</span></li>
                <li><span className="jp-sidebar-info__key">Type</span><span className="jp-sidebar-info__val">{job.type}</span></li>
                {job.salary && <li><span className="jp-sidebar-info__key">Salary</span><span className="jp-sidebar-info__val">{job.salary}</span></li>}
                <li><span className="jp-sidebar-info__key">Posted</span><span className="jp-sidebar-info__val">{job.posted}</span></li>
              </ul>
            </div>
            <div className="jp-sidebar-card jp-sidebar-card--cta">
              <p className="jp-sidebar-cta__eyebrow">Interested in this role?</p>
              <h3 className="jp-sidebar-cta__title">Ready to Apply?</h3>
              <p className="jp-sidebar-cta__body">Send us your CV and a short cover letter via our contact page. Tell us why you are the right fit — we read every application personally.</p>
              <Link href="/contact" className="btn jp-sidebar-cta__btn">Apply Now →</Link>
            </div>
          </aside>
        </div>
      </section>

      <PageCTA
        eyebrow="Explore More Openings"
        title={<>Find Your<br /><span className="accent">Perfect Role.</span></>}
        sub="We are always growing. Browse all open positions and find the opportunity that matches your skills and ambitions."
        primaryLabel="View All Jobs →"
        primaryTo="/careers"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </main>
  )
}
