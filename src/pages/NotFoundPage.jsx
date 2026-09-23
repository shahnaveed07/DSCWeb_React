import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow">404</span>
        <h1>Page Not Found</h1>
        <p className="hero-copy">
          The requested page or endpoint does not exist on Dark Skull Corporation.
        </p>
        <Link className="button button-primary" to="/">
          Return to Home
        </Link>
      </div>
    </section>
  )
}
