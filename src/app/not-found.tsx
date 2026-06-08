import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <section className="not-found">
        <div className="container" style={{ textAlign: 'center', padding: '8rem 1rem' }}>
          <h1 style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', fontWeight: 700, lineHeight: 1, color: 'var(--accent)', margin: '0 0 1rem' }}>404</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Looks like this page doesn&apos;t exist.</p>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </section>
    </main>
  )
}
