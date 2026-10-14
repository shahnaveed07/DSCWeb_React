import { NavLink } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { ButtonLink } from '../components/layout/SiteHeader'

export function HomePage({ systemStatus }) {
  usePageMeta({
    title: 'Dark Skull Corporation | Independent Software Studio',
    description:
      'Dark Skull Corporation develops focused desktop utilities, specialized software panels, Android applications, and logic puzzle games.',
    canonical: 'https://dscweb.me/',
  })

  const isMaintenance =
    systemStatus?.isMaintenanceMode === true || systemStatus?.IsMaintenanceMode === true

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero-v2">
        <div className="home-hero-content">
          <div className="hero-eyebrow-row">
            <span className="hero-eyebrow">Dark Skull Corporation</span>
            <span className="hero-dot">·</span>
            <span className="hero-subkicker">Independent Software Studio</span>
            <span className="hero-dot">·</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                color: isMaintenance ? 'var(--warning)' : 'var(--success)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isMaintenance ? 'var(--warning)' : 'var(--success)',
                }}
              />
              {isMaintenance ? 'System Maintenance' : 'Systems Operational'}
            </span>
          </div>

          <h1 className="home-hero-title">
            Software built to be <span className="text-highlight">useful</span>.
          </h1>

          <p className="home-hero-desc">
            We develop lightweight desktop utilities, specialized software panels with hardware-bound licensing, privacy-conscious Android applications, and interactive logic puzzle games.
          </p>

          <div className="home-hero-actions">
            <NavLink to="/pages/products" className="button button-primary button-lg">
              Explore Products
            </NavLink>
            <NavLink to="/pages/downloads" className="button button-secondary button-lg">
              Download Center
            </NavLink>
            <NavLink to="/pages/apps" className="button button-ghost button-lg">
              Try Apps &amp; Calculator
            </NavLink>
          </div>
        </div>

        {/* Hero Capability Strip */}
        <div className="hero-capability-grid">
          <div className="hero-cap-item">
            <span className="hero-cap-num">01</span>
            <div className="hero-cap-text">
              <strong>Desktop Software Panels</strong>
              <span>Streaming HUD, quick-switch &amp; calibration</span>
            </div>
          </div>
          <div className="hero-cap-item">
            <span className="hero-cap-num">02</span>
            <div className="hero-cap-text">
              <strong>Android Utilities</strong>
              <span>Fast QR scanner &amp; offline code generator</span>
            </div>
          </div>
          <div className="hero-cap-item">
            <span className="hero-cap-num">03</span>
            <div className="hero-cap-text">
              <strong>Interactive Games</strong>
              <span>Mind Matrix logic &amp; cognitive drills</span>
            </div>
          </div>
          <div className="hero-cap-item">
            <span className="hero-cap-num">04</span>
            <div className="hero-cap-text">
              <strong>Hardware ID Security</strong>
              <span>Cryptographic HWID validation &amp; delivery</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="home-divider" />

      {/* Featured Projects Showcase */}
      <section className="home-section">
        <div className="section-head-v2">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Real Releases</span>
            <h2 className="section-title-v2">Featured Software &amp; Tools</h2>
          </div>
          <p className="section-subtitle-v2">
            Actively maintained applications and software releases available for immediate access and download.
          </p>
        </div>

        <div className="showcase-grid">
          {/* Card 1: Free Panel */}
          <article className="showcase-card">
            <div className="showcase-card-top">
              <span className="showcase-badge">Public Evaluation</span>
              <h3 className="showcase-title">Free Panel Build</h3>
              <p className="showcase-desc">
                Public community release of our panel software. Test interface responsiveness, monitor live server slot availability, and download the verified package archive.
              </p>
            </div>
            <div className="showcase-card-bottom">
              <ButtonLink action={{ label: 'Access Free Panel', to: '/pages/freepanel' }} className="button button-primary" />
            </div>
          </article>

          {/* Card 2: Calculator */}
          <article className="showcase-card">
            <div className="showcase-card-top">
              <span className="showcase-badge">Interactive Tool</span>
              <h3 className="showcase-title">Calculator Tool</h3>
              <p className="showcase-desc">
                A lightweight mathematics utility featuring instant expression parsing, calculation history logs, and zero tracking. Try it directly in your browser.
              </p>
            </div>
            <div className="showcase-card-bottom">
              <ButtonLink action={{ label: 'Launch Calculator', to: '/pages/apps' }} className="button button-secondary" />
            </div>
          </article>

          {/* Card 3: QR Scanner */}
          <article className="showcase-card">
            <div className="showcase-card-top">
              <span className="showcase-badge">Android Utility</span>
              <h3 className="showcase-title">QR Scanner | Generator</h3>
              <p className="showcase-desc">
                High-speed autofocus camera scanner for barcodes and QR codes, paired with an offline generator for Wi-Fi, contacts, and URLs on Google Play.
              </p>
            </div>
            <div className="showcase-card-bottom">
              <ButtonLink
                action={{
                  label: 'Google Play ↗',
                  href: 'https://play.google.com/store/apps/details?id=com.dsc.qrscanner',
                }}
                className="button button-primary"
              />
            </div>
          </article>

          {/* Card 4: Mind Matrix */}
          <article className="showcase-card">
            <div className="showcase-card-top">
              <span className="showcase-badge">Brain Game</span>
              <h3 className="showcase-title">Mind Matrix</h3>
              <p className="showcase-desc">
                Minimalist mobile puzzle game featuring progressive logic, sequence recall, and cognitive reflex drills playable completely offline.
              </p>
            </div>
            <div className="showcase-card-bottom">
              <ButtonLink
                action={{
                  label: 'Google Play ↗',
                  href: 'https://play.google.com/store/apps/details?id=com.dsc.mindmatrix',
                }}
                className="button button-primary"
              />
            </div>
          </article>
        </div>
      </section>

      <hr className="home-divider" />

      {/* Disciplines Section */}
      <section className="home-section home-disciplines-section">
        <div className="section-head-v2">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Disciplines</span>
            <h2 className="section-title-v2">Software Disciplines</h2>
          </div>
          <p className="section-subtitle-v2">
            Focused development areas grounded in practical usability, clean interfaces, and robust software architecture.
          </p>
        </div>

        <div className="disciplines-grid">
          <article className="discipline-card">
            <div className="discipline-num">01</div>
            <span className="discipline-category">Desktop Engineering</span>
            <h3 className="discipline-title">Utility Software Panels</h3>
            <p className="discipline-text">
              High-performance Windows utilities designed for OBS-safe broadcasting, rapid tool switching, and precision input calibration with minimal RAM usage.
            </p>
          </article>

          <article className="discipline-card">
            <div className="discipline-num">02</div>
            <span className="discipline-category">Mobile Engineering</span>
            <h3 className="discipline-title">Privacy-Centric Mobile Tools</h3>
            <p className="discipline-text">
              Android applications built with scoped permissions, offline-first generation engines, and zero background telemetry or invasive analytics.
            </p>
          </article>

          <article className="discipline-card">
            <div className="discipline-num">03</div>
            <span className="discipline-category">Licensing &amp; Security</span>
            <h3 className="discipline-title">Cryptographic HWID Binding</h3>
            <p className="discipline-text">
              Hardware ID authorization ensuring secure single-device access, verified payment proof reviews, and transparent community evaluation tiers.
            </p>
          </article>
        </div>
      </section>

      <hr className="home-divider" />

      {/* Split Highlights: About & Contact */}
      <section className="home-section home-split-grid">
        <article className="highlight-panel">
          <span className="section-eyebrow">About Dark Skull Corporation</span>
          <h2 className="highlight-title">Independent Engineering</h2>
          <p className="highlight-desc">
            Led by software engineer Naveed Mushtaq, Dark Skull Corporation creates focused applications, tools, and games. We believe in steady refinement, practical utility, and direct community communication.
          </p>
          <div className="highlight-action">
            <ButtonLink action={{ label: 'Read About Studio', to: '/pages/about' }} className="button button-secondary" />
          </div>
        </article>

        <article className="highlight-panel highlight-panel-alt">
          <span className="section-eyebrow">Direct Support</span>
          <h2 className="highlight-title">Active Community &amp; Help</h2>
          <p className="highlight-desc">
            Need technical assistance, have questions regarding an order, or want to verify license keys? Join our verified Discord community or email our support desk directly.
          </p>
          <div className="highlight-action">
            <ButtonLink action={{ label: 'Contact Support', to: '/pages/contact' }} className="button button-primary" />
          </div>
        </article>
      </section>
    </div>
  )
}
