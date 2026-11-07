import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFoundPage() {
  usePageMeta({
    title: 'Page Not Found (404)',
    description: 'The requested page could not be found. Return to DSCWeb homepage or browse active software releases.',
  })
  return (
    <section className="auth-shell">
      <div className="auth-card text-center">
        <span className="hero-eyebrow">Error 404</span>
        <h1 className="mt-8">Page Not Found</h1>
        <p className="hero-copy mt-8">
          The page you are looking for is unavailable or has been relocated. Please return to the homepage or explore our active services.
        </p>
        <div className="modal-actions-center mt-24">
          <Link className="button button-primary" to="/">
            Return Home
          </Link>
          <Link className="button button-secondary" to="/pages/contact">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  )
}
