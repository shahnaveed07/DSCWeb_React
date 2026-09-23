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
    <div className="center-wrap" style={{ maxWidth: '1060px', margin: '0 auto', padding: '24px 20px' }}>
      <section className="mb-32" style={{ textAlign: 'center' }}>
        <span className="hero-eyebrow">Product Studio</span>
        <h1 className="mt-10" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
          Applications & Software
        </h1>
        <p style={{ maxWidth: '640px', margin: '12px auto 0', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore desktop tools, Android applications, and interactive puzzle experiences
          developed by Dark Skull Corporation with an emphasis on speed, reliability, and clean design.
        </p>
      </section>

      {/* Showcase Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {appsList.map((app) => (
          <article
            key={app.title}
            className="card"
            style={{
              background: 'var(--surface-strong)',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge warning" style={{ marginBottom: '6px' }}>
                  {app.badge}
                </span>
                <h2 style={{ fontSize: '1.4rem', margin: '4px 0 0', fontWeight: 700 }}>
                  {app.title}
                </h2>
              </div>
              <div>
                {app.action.href ? (
                  <a
                    className="btn btn-secondary"
                    href={app.action.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {app.action.label} ↗
                  </a>
                ) : (
                  <NavLink className="btn btn-primary" to={app.action.to}>
                    {app.action.label}
                  </NavLink>
                )}
              </div>
            </div>

            <p style={{ color: 'var(--secondary)', fontSize: '0.96rem', fontWeight: 600, margin: 0 }}>
              {app.tagline}
            </p>

            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
              {app.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
                paddingTop: '10px',
                borderTop: '1px solid var(--surface-border)',
              }}
            >
              {app.features.map((feat) => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text)' }}>
                  <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Engineering Philosophy Section */}
      <section className="seo-section mt-30">
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
