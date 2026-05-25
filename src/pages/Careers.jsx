import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jobListings, DEPT_COLORS } from '../data/careersData'
import PageCTA from '../components/PageCTA'
import useScrollReveal from '../hooks/useScrollReveal'
import './Careers.css'

const FILTERS = ['All', 'Marketing', 'Creative', 'Technology']

function JobCard({ job }) {
  const dept = DEPT_COLORS[job.department] || DEPT_COLORS.Marketing
  return (
    <article className="job-card reveal">
      <div className="job-card__top">
        <span
          className="job-card__dept"
          style={{ background: dept.bg, color: dept.text }}
        >
          {job.department}
        </span>
        <span className="job-card__type">{job.type}</span>
      </div>

      <h3 className="job-card__title">{job.title}</h3>

      <div className="job-card__meta">
        <span className="job-card__location">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6A4.5 4.5 0 0 0 8 1.5Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor"/>
          </svg>
          {job.location}
        </span>
        {job.salary && (
          <span className="job-card__salary">{job.salary}</span>
        )}
      </div>

      <p className="job-card__excerpt">{job.excerpt}</p>

      <div className="job-card__footer">
        <span className="job-card__posted">Posted {job.posted}</span>
        <Link to={`/careers/${job.slug}`} className="job-card__cta">
          View Role
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </article>
  )
}

export default function Careers() {
  useScrollReveal()
  const [filter, setFilter] = useState('All')

  const visible = filter === 'All'
    ? jobListings
    : jobListings.filter(j => j.department === filter)

  const countFor = (dept) =>
    dept === 'All' ? jobListings.length : jobListings.filter(j => j.department === dept).length

  return (
    <main className="careers-page">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="careers-hero">
        <div className="container">
          <p className="eyebrow fade-up" style={{ color: '#f87171' }}>Join Our Team</p>
          <h1 className="careers-hero__title fade-up-1">
            Build Something<br />
            <span className="accent">Great. Together.</span>
          </h1>
          <p className="careers-hero__sub fade-up-2">
            KTI Marketing is a fast-moving creative agency helping brands grow across
            social, search, and beyond. We are looking for passionate people who are
            ready to do their best work — and have fun doing it.
          </p>
          <div className="careers-hero__badges fade-up-3">
            <span className="careers-badge">
              <span className="careers-badge__dot" aria-hidden="true" />
              {jobListings.length} Open Roles
            </span>
            <span className="careers-badge">
              <span className="careers-badge__dot" aria-hidden="true" />
              3 Departments
            </span>
            <span className="careers-badge">
              <span className="careers-badge__dot" aria-hidden="true" />
              Hybrid / Remote
            </span>
          </div>
        </div>
      </section>

      {/* ── Listings ──────────────────────────────────────── */}
      <section className="careers-listings">
        <div className="container">

          {/* Filter tabs */}
          <div className="careers-tabs" role="tablist" aria-label="Filter jobs by department">
            {FILTERS.map(dept => (
              <button
                key={dept}
                role="tab"
                aria-selected={filter === dept}
                className={`careers-tab${filter === dept ? ' careers-tab--active' : ''}`}
                onClick={() => setFilter(dept)}
              >
                {dept}
                <span className="careers-tab__count">{countFor(dept)}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          {visible.length > 0 ? (
            <div className="careers-grid">
              {visible.map(job => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          ) : (
            <div className="careers-empty">
              <p>No openings in <strong>{filter}</strong> right now. Check back soon.</p>
            </div>
          )}

        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <PageCTA
        eyebrow="Don't See the Right Role?"
        title={<>Send Us Your<br /><span className="accent">CV Anyway.</span></>}
        sub="We are always on the lookout for exceptional talent. Drop us a message with your skills and ambitions — we will be in touch when the right opportunity opens up."
        primaryLabel="Get in Touch →"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />

    </main>
  )
}
