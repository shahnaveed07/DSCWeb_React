import { Component } from 'react'
import { Link } from 'react-router-dom'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="center-wrap" role="alert" aria-live="assertive">
          <section className="panel auth-card" style={{ maxWidth: '560px', margin: '60px auto', textAlign: 'center' }}>
            <div className="logo-mark mb-15" style={{ width: '56px', height: '56px', margin: '0 auto 16px' }}>
              <img
                src="/images/dsclogo.png"
                alt="Dark Skull Corporation"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <span className="hero-eyebrow" style={{ color: 'var(--warning)' }}>Application Notice</span>
            <h1 className="auth-title mt-6">Something Went Wrong</h1>
            <p className="auth-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
              An unexpected issue occurred while rendering this view. You can reload the application or return safely to the home page.
            </p>
            <div className="flex gap-12 mt-25" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="button button-primary"
                onClick={this.handleReload}
              >
                Reload Application
              </button>
              <Link
                to="/"
                className="button button-secondary"
                onClick={this.handleReset}
              >
                Return to Home
              </Link>
            </div>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
