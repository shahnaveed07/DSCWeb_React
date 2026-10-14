import { NavLink } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { aboutStats } from '../content/siteContent'

const focusAreas = [
  {
    title: 'Desktop Utility Panels',
    tag: 'Windows x64 & .NET',
    desc: 'High-performance desktop utilities designed for zero bloat, OBS-safe broadcast overlays, rapid hotkey tool switching, and input sensitivity calibration.',
  },
  {
    title: 'Mobile Applications & Games',
    tag: 'Android & Kotlin',
    desc: 'Native Android tools such as our offline QR Scanner & Generator, alongside cognitive puzzle games like Mind Matrix with zero intrusive telemetry.',
  },
  {
    title: 'Hardware-Bound Licensing',
    tag: 'Security & HWID',
    desc: 'Cryptographic Hardware Identifier (HWID) verification architectures ensuring single-device license protection, order tracking, and account security.',
  },
]

const engineeringStandards = [
  {
    number: '01',
    title: 'Practical Purpose',
    desc: 'Every tool and feature must solve a real functional requirement. We eliminate bloatware, cosmetic fluff, and unnecessary background processes.',
  },
  {
    number: '02',
    title: 'Resource Respect',
    desc: 'Software should execute instantaneously with low CPU and memory footprints. Our tools are compiled to run silently without slowing down your system.',
  },
  {
    number: '03',
    title: 'Transparent Security',
    desc: 'We are open about how hardware tokens are generated and how payment proofs are verified. We never harvest or sell personal data.',
  },
]

export function AboutPage() {
  usePageMeta({
    title: 'About Dark Skull Corporation & Lead Developer',
    description:
      'Learn about Dark Skull Corporation, an independent software studio led by Naveed Mushtaq, focusing on lightweight desktop panels, Android utilities, and logic games.',
    canonical: 'https://dscweb.me/pages/about',
  })

  return (
    <div className="center-wrap">
      {/* Header */}
      <section className="page-header-center">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Independent Software Studio</h1>
        <p>
          Dark Skull Corporation (DSC) is an independent software development studio focused on building lightweight desktop utilities, specialized software panels, Android applications, and interactive puzzle experiences.
        </p>
      </section>

      {/* Stats Strip */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          padding: '24px',
          marginBottom: '36px',
          background: 'var(--surface-hover)',
          border: '1px solid var(--surface-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {aboutStats.map((st) => (
          <div key={st.label} style={{ textAlign: 'center' }}>
            <span className="micro-label" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
              {st.label}
            </span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{st.value}</strong>
          </div>
        ))}
      </div>

      {/* Focus Areas */}
      <div className="focus-grid">
        {focusAreas.map((area) => (
          <div key={area.title} className="focus-card">
            <span className="badge warning mb-8">{area.tag}</span>
            <h2 className="focus-card-title">{area.title}</h2>
            <p className="focus-card-desc">{area.desc}</p>
          </div>
        ))}
      </div>

      {/* Engineering Standards */}
      <section className="seo-section" style={{ marginTop: '36px', marginBottom: '32px' }}>
        <div className="seo-container">
          <h2>Engineering Principles</h2>
          <div className="principles-grid-about" style={{ marginTop: '20px' }}>
            {engineeringStandards.map((pr) => (
              <div key={pr.number} className="principle-item-about">
                <span className="principle-item-num">{pr.number}</span>
                <h3 className="principle-item-title">{pr.title}</h3>
                <p className="principle-item-desc">{pr.desc}</p>
              </div>
            ))}
          </div>

          {/* Technology & Architecture Section */}
          <h2 style={{ marginTop: '40px' }}>Technology Stack &amp; Architecture</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
            Dark Skull Corporation builds applications across multiple software tiers using battle-tested technology:
          </p>
          <ul className="feature-list" style={{ marginTop: '12px' }}>
            <li>
              <strong>Windows Desktop Binaries:</strong> Developed in C# utilizing the Microsoft .NET Framework for low memory footprint, raw input processing, and native Windows API integration.
            </li>
            <li>
              <strong>Mobile Applications:</strong> Built natively for Android using Kotlin and modern Android Jetpack components, published securely through the Google Play Store.
            </li>
            <li>
              <strong>Web Architecture:</strong> Engineered with React, Vite, and clean client-side routing, interfacing with high-availability RESTful backend services.
            </li>
            <li>
              <strong>License Verification:</strong> Cryptographically generated Hardware Identifier (HWID) tokens validate single-machine authorization and prevent unauthorized key duplication.
            </li>
          </ul>

          {/* Leadership & Bio */}
          <h2 style={{ marginTop: '40px' }}>Developer Leadership</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
            Dark Skull Corporation is founded and independently developed by{' '}
            <a
              href="https://naveedmushtaq.tech/"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-semibold"
            >
              Naveed Mushtaq ↗
            </a>
            . Naveed leads all aspects of software architecture, C# tool compilation, mobile application deployment, and community support.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginTop: '12px' }}>
            You can inspect public code repositories and open-source contributions on GitHub at{' '}
            <a
              href="https://github.com/shahnaveed07"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-semibold"
            >
              github.com/shahnaveed07 ↗
            </a>
            , or review past engineering projects on the developer portfolio.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="about-cta-card">
        <h2 className="about-cta-title">Explore Our Products &amp; Community</h2>
        <p className="about-cta-desc">
          Browse our software catalog, download community builds, or connect directly with our engineering team on Discord.
        </p>
        <div className="about-cta-actions">
          <NavLink to="/pages/products" className="button button-primary">
            View Products
          </NavLink>
          <NavLink to="/pages/contact" className="button button-secondary">
            Contact Support
          </NavLink>
          <a
            href="https://discord.gg/XB2Zjmsb7K"
            target="_blank"
            rel="noopener noreferrer"
            className="button button-ghost"
          >
            Join Discord Community ↗
          </a>
        </div>
      </section>
    </div>
  )
}
