import { useParams, Link, Navigate } from 'react-router-dom'
import { getJobBySlug, DEPT_COLORS } from '../data/careersData'
import PageCTA from '../components/PageCTA'
import useScrollReveal from '../hooks/useScrollReveal'
import './JobPost.css'

export default function JobPost() {
  useScrollReveal()
  const { slug } = useParams()
  const job = getJobBySlug(slug)

  if (!job) return <Navigate to="/careers" replace />

  const dept = DEPT_COLORS[job.department] || DEPT_COLORS.Marketing

  return (
    <main className="jp-page">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="jp-hero">
        <div className="jp-hero__bg" aria-hidden="true">
          <div className="jp-hero__shape--1" />
          <div className="jp-hero__shape--2" />
        </div>
        <div className="container jp-hero__inner">

          <nav className="jp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/careers">Careers</Link>
            <span aria-hidden="true">›</span>
            <span>{job.title}</span>
          </nav>

          <span
            className="jp-hero__badge"
            style={{ background: dept.bg, color: dept.text }}
          >
            {job.department}
          </span>

          <h1 className="jp-hero__title reveal">{job.title}</h1>

          <div className="jp-hero__meta reveal">
            <span className="jp-meta-pill">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6A4.5 4.5 0 0 0 8 1.5Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
              </svg>
              {job.location}
            </span>
            <span className="jp-meta-pill">{job.type}</span>
            <span className="jp-meta-pill">Posted {job.posted}</span>
          </div>

          {job.salary && (
            <p className="jp-hero__salary reveal">{job.salary}</p>
          )}

        </div>
      </section>

      {/* ── Content ───────────────────────────────────────── */}
      <section className="jp-content">
        <div className="container jp-content__grid">

          {/* Article */}
          <article className="jp-article">

            <div className="jp-section reveal">
              <h2 className="jp-section__heading">About This Role</h2>
              <p className="jp-section__para">{job.description}</p>
            </div>

            <div className="jp-section reveal">
              <h2 className="jp-section__heading">Responsibilities</h2>
              <ul className="jp-list">
                {job.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="jp-section reveal">
              <h2 className="jp-section__heading">Requirements</h2>
              <ul className="jp-list">
                {job.requirements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {job.niceToHave && job.niceToHave.length > 0 && (
              <div className="jp-section reveal">
                <h2 className="jp-section__heading">Nice to Have</h2>
                <ul className="jp-list jp-list--secondary">
                  {job.niceToHave.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="jp-section reveal">
              <h2 className="jp-section__heading">What We Offer</h2>
              <ul className="jp-list">
                {job.benefits.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="jp-article__footer reveal">
              <Link to="/careers" className="btn btn-outline">← Back to Careers</Link>
              <Link to="/contact" className="btn">Apply Now →</Link>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="jp-sidebar">

            <div className="jp-sidebar-card">
              <p className="jp-sidebar-card__label">Job Details</p>
              <ul className="jp-sidebar-info">
                <li>
                  <span className="jp-sidebar-info__key">Department</span>
                  <span
                    className="jp-sidebar-info__val jp-sidebar-badge"
                    style={{ color: dept.text, background: dept.bg }}
                  >
                    {job.department}
                  </span>
                </li>
                <li>
                  <span className="jp-sidebar-info__key">Location</span>
                  <span className="jp-sidebar-info__val">{job.location}</span>
                </li>
                <li>
                  <span className="jp-sidebar-info__key">Type</span>
                  <span className="jp-sidebar-info__val">{job.type}</span>
                </li>
                {job.salary && (
                  <li>
                    <span className="jp-sidebar-info__key">Salary</span>
                    <span className="jp-sidebar-info__val">{job.salary}</span>
                  </li>
                )}
                <li>
                  <span className="jp-sidebar-info__key">Posted</span>
                  <span className="jp-sidebar-info__val">{job.posted}</span>
                </li>
              </ul>
            </div>

            <div className="jp-sidebar-card jp-sidebar-card--cta">
              <p className="jp-sidebar-cta__eyebrow">Interested in this role?</p>
              <h3 className="jp-sidebar-cta__title">Ready to Apply?</h3>
              <p className="jp-sidebar-cta__body">
                Send us your CV and a short cover letter via our contact page. Tell us
                why you are the right fit — we read every application personally.
              </p>
              <Link to="/contact" className="btn jp-sidebar-cta__btn">
                Apply Now →
              </Link>
            </div>

          </aside>

        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────── */}
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
