import { NavLink } from 'react-router-dom'

const appsList = [
  {
    badge: 'Desktop App',
    title: 'Calculator',
    tagline: 'Fast, lightweight desktop mathematics utility for Windows.',
    description:
      'A simple, clean calculator application for everyday calculations. Designed to open instantly, handle continuous operations, and stay completely out of your way.',
    features: [
      'Instant zero-latency launch',
      'Calculation history reel',
      'Clean interface with zero intrusive ads',
      'Low memory consumption',
    ],
    action: { label: 'Download', to: '/pages/downloads' },
  },
  {
    badge: 'Android App',
    title: 'QR Scanner | Generator',
    tagline: 'High-speed camera scanner & customizable barcode/QR generator.',
    description:
      'Scan barcodes and QR codes with lightning-fast detection. Generate clean, custom QR codes from URLs, contact details, WiFi credentials, and plain text with a single tap.',
    features: [
      'Real-time autofocus camera scan',
      'Offline QR generation engine',
      'Instant copy, share & browse actions',
      'No telemetry or background data mining',
    ],
    action: {
      label: 'Google Play',
      href: 'https://play.google.com/store/apps/details?id=com.dsc.qrscanner',
    },
  },
  {
    badge: 'Mobile Game',
    title: 'Mind Matrix',
    tagline: 'Brain-training puzzle game with logic, memory, and reaction drills.',
    description:
      'A collection of minimalist puzzle games designed to challenge your cognitive reflexes, pattern recognition, and working memory across hundreds of handcrafted stages.',
    features: [
      'Multiple challenging puzzle modes',
      'Progressive difficulty scaling',
      'Offline friendly gameplay',
      'Smooth animations & intuitive touch controls',
    ],
    action: {
      label: 'Google Play',
      href: 'https://play.google.com/store/apps/details?id=com.dsc.mindmatrix',
    },
  },
]

export function AppsPage() {
  return (
    <div className="center-wrap">
      <section className="page-header-center">
        <span className="hero-eyebrow">Product Studio</span>
        <h1>Applications & Software</h1>
        <p>
          Explore desktop tools, Android applications, and interactive puzzle experiences
          developed by Dark Skull Corporation with an emphasis on speed, reliability, and clean design.
        </p>
      </section>

      {/* Showcase List */}
      <div className="apps-list">
        {appsList.map((app) => (
          <article key={app.title} className="app-card">
            <div className="app-card-header">
              <div>
                <span className="badge warning">{app.badge}</span>
                <h2 className="app-card-title">{app.title}</h2>
              </div>
              <div>
                {app.action.href ? (
                  <a
                    className="button button-secondary"
                    href={app.action.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {app.action.label} ↗
                  </a>
                ) : (
                  <NavLink className="button button-primary" to={app.action.to}>
                    {app.action.label}
                  </NavLink>
                )}
              </div>
            </div>

            <p className="app-card-tagline">{app.tagline}</p>
            <p className="app-card-desc">{app.description}</p>

            <div className="app-feature-grid">
              {app.features.map((feat) => (
                <div key={feat} className="app-feature-item">
                  <span className="app-feature-check">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Roadmap Section */}
      <section className="seo-section mt-36">
        <div className="seo-container">
          <span className="badge warning mb-8">Roadmap</span>
          <h2 className="mt-8">In Development &amp; Future Tools</h2>
          <p className="mb-20" style={{ color: 'var(--muted)' }}>
            Upcoming software tools currently being designed and engineered by Dark Skull Corporation.
          </p>

          <div className="card-grid columns-2">
            <article className="info-card">
              <span className="card-badge">AI Suite</span>
              <h3 className="mt-12">Future AI Assistant</h3>
              <p className="mt-8" style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
                Intelligent workflow experiences tailored for smart automation, productivity, and developer assistance.
              </p>
              <div className="mt-16">
                <button className="button button-secondary button-sm" disabled type="button">
                  Coming Soon
                </button>
              </div>
            </article>

            <article className="info-card">
              <span className="card-badge">Desktop Suite</span>
              <h3 className="mt-12">Future Desktop Tools</h3>
              <p className="mt-8" style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
                Next-generation desktop utilities that combine speed, system performance, and trusted usability.
              </p>
              <div className="mt-16">
                <button className="button button-secondary button-sm" disabled type="button">
                  Coming Soon
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
