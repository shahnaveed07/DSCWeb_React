import { NavLink } from 'react-router-dom'

const focusAreas = [
  {
    title: 'Applications',
    tag: 'Mobile & Desktop',
    desc: 'Functional tools and everyday utilities designed to solve specific challenges with speed and clarity.',
  },
  {
    title: 'Software Panels',
    tag: 'Access & Management',
    desc: 'Specialized desktop management interfaces with verified licensing, secure key distribution, and live status.',
  },
  {
    title: 'Games & Interactive',
    tag: 'Brain & Logic',
    desc: 'Engaging puzzle challenges and cognitive exercise games built for mobile players who love problem solving.',
  },
]

const principles = [
  {
    number: '01',
    title: 'Useful First',
    desc: 'Every feature we code must serve a practical need. We do not add filler or complex layers just for show.',
  },
  {
    number: '02',
    title: 'Clean Interfaces',
    desc: 'Software should be straightforward to understand. We prioritize clarity, high readability, and responsive responsiveness.',
  },
  {
    number: '03',
    title: 'Reliable Delivery',
    desc: 'We verify our releases, perform continuous testing, and support our community directly through active communication channels.',
  },
]

export function AboutPage() {
  return (
    <div className="center-wrap">
      <section className="section-head-v2" style={{ textAlign: 'center', display: 'block', marginBottom: '36px' }}>
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, margin: '8px 0 12px' }}>
          Independent Software Studio
        </h1>
        <p style={{ maxWidth: '680px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Dark Skull Corporation is an independent software studio focused on creating focused desktop utilities, specialized software panels, Android applications, and interactive puzzle experiences.
        </p>
      </section>

      {/* Focus Areas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {focusAreas.map((area) => (
          <div
            key={area.title}
            className="card"
            style={{
              padding: '24px',
            }}
          >
            <span className="badge warning" style={{ marginBottom: '8px' }}>
              {area.tag}
            </span>
            <h2 style={{ fontSize: '1.3rem', margin: '6px 0 10px', fontWeight: 700 }}>
              {area.title}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
              {area.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Principles Section */}
      <section className="seo-section" style={{ marginTop: '20px', marginBottom: '32px' }}>
        <div className="seo-container">
          <h2>Our Core Principles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {principles.map((pr) => (
              <div key={pr.number} style={{ padding: '20px', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                  {pr.number}
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: '8px 0 6px', color: 'var(--text)' }}>
                  {pr.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                  {pr.desc}
                </p>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: '36px' }}>Developer Portfolio & Leadership</h2>
          <p>
            DSCWeb and the software offerings within the Dark Skull Corporation portfolio are developed and maintained under the leadership of{' '}
            <a
              href="https://naveedmushtaq.tech/"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Naveed Mushtaq ↗
            </a>
            . Our projects undergo active refinement based on feedback from our global community.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px' }}>
          Explore Our Products & Ecosystem
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
          Discover what we have built or connect directly with our engineering team on Discord.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <NavLink to="/pages/products" className="button button-primary">
            View Products Catalog
          </NavLink>
          <NavLink to="/pages/contact" className="button button-secondary">
            Get in Touch
          </NavLink>
        </div>
      </section>
    </div>
  )
}
