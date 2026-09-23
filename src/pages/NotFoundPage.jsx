export function NotFoundPage() {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow">404</span>
        <h1>Page not found.</h1>
        <p className="hero-copy">
          The requested route does not exist in the new DSCWeb surface.
        </p>
        <a className="button button-primary" href="/">
          Return home
        </a>
      </div>
    </section>
  )
}
