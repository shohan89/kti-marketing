import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main>
      <section className="not-found">
        <div className="container">
          <h1>404</h1>
          <p>Looks like this page doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </section>
    </main>
  )
}
