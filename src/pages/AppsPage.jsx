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
    action: { label: 'Download Application', to: '/pages/downloads' },
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
      label: 'Google Play Store',
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
      label: 'Google Play Store',
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

      {/* Engineering Philosophy Section */}
      <section className="seo-section">
        <div className="seo-container">
          <h2>Application Development Philosophy</h2>
          <p>
            At Dark Skull Corporation, we build our software around clear everyday use cases. We believe applications should load in milliseconds, consume minimal system memory, and require zero complex setup.
          </p>

          <h2>Multi-Platform Roadmap</h2>
          <p>
            Our software engineering pipeline targets Windows Desktop, native Android runtime, and cross-platform web utilities. All releases are continuously updated and monitored for performance.
          </p>
        </div>
      </section>
    </div>
  )
}
