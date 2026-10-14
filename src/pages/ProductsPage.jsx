import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { productPlans } from '../content/siteContent'

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'available', label: 'Available Now' },
  { id: 'free', label: 'Free Tier' },
  { id: 'upcoming', label: 'Custom & Future' },
]

export function ProductsPage() {
  usePageMeta({
    title: 'Software Products & Panel Catalog',
    description:
      'Explore Dark Skull Corporation software panels and desktop utilities with transparent base pricing, hardware-bound licensing, and complete system requirements.',
    canonical: 'https://dscweb.me/pages/products',
  })

  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedProduct, setExpandedProduct] = useState(null)

  const filteredProducts = productPlans.filter((p) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'available') return !p.action.disabled && p.slug !== 'free'
    if (activeFilter === 'free') return p.slug === 'free'
    if (activeFilter === 'upcoming') return p.slug === 'premium' || p.slug === 'customised'
    return true
  })

  function toggleProductSpecs(slug) {
    setExpandedProduct((current) => (current === slug ? null : slug))
  }

  return (
    <div className="center-wrap">
      {/* Header */}
      <section className="page-header-center">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Software Products &amp; Utility Panels</h1>
        <p>
          High-performance desktop utilities engineered for zero bloat, low memory consumption, and hardware-bound license security. Every product includes transparent base pricing, duration options, and verified access.
        </p>

        {/* Filter Tabs */}
        <div className="category-filter-bar" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`button ${activeFilter === cat.id ? 'button-primary' : 'button-secondary'} button-sm`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <div className="products-grid" style={{ marginTop: '36px' }}>
        {filteredProducts.map((p) => {
          const isExpanded = expandedProduct === p.slug
          return (
            <article
              key={p.slug}
              className={`product-card ${p.featured ? 'elite' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                {p.badge ? (
                  <span className="elite-badge">{p.badge}</span>
                ) : (
                  <span className="badge warning mb-8" style={{ fontSize: '0.74rem' }}>{p.category}</span>
                )}

                <h2 className="product-title" style={{ marginTop: '8px' }}>{p.title}</h2>
                <div className="product-price">
                  {p.price.split(' ')[0]} <span className="product-price-rate">/ Base Rate</span>
                </div>

                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.5', margin: '12px 0 16px' }}>
                  {p.description}
                </p>

                {/* Key Features */}
                <span className="micro-label" style={{ display: 'block', marginBottom: '8px' }}>CORE CAPABILITIES</span>
                <ul className="product-features" style={{ marginBottom: '16px' }}>
                  {p.features.map((feat) => (
                    <li key={feat}>{feat}</li>
                  ))}
                </ul>

                {/* Tech Specs Summary */}
                {p.specs ? (
                  <div
                    style={{
                      background: 'var(--surface-hover)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      fontSize: '0.8rem',
                      lineHeight: '1.4',
                      border: '1px solid var(--surface-border)',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--muted)' }}>Platform:</span>
                      <strong style={{ color: 'var(--text)' }}>{p.specs.platform}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--muted)' }}>Memory:</span>
                      <strong style={{ color: 'var(--text)' }}>{p.specs.memory}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Licensing:</span>
                      <strong style={{ color: 'var(--text)' }}>{p.specs.licensing}</strong>
                    </div>
                  </div>
                ) : null}

                {/* Collapsible Specs & Guide */}
                {isExpanded ? (
                  <div
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--primary-border, var(--surface-border))',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      marginBottom: '16px',
                      fontSize: '0.84rem',
                      lineHeight: '1.5',
                    }}
                  >
                    <h4 style={{ margin: '0 0 6px', color: 'var(--primary)' }}>Installation &amp; Activation Guide</h4>
                    <ol style={{ paddingLeft: '18px', margin: '0 0 10px', color: 'var(--muted)' }}>
                      <li>Windows 10 / 11 64-bit with .NET Framework 4.8 runtime required.</li>
                      <li>Place the executable in an isolated folder and run with administrative rights.</li>
                      <li>Upon launch, copy your hardware token and paste your assigned license key.</li>
                      <li>All licenses are bound to 1 machine (HWID) to safeguard credential integrity.</li>
                    </ol>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Need help? Open a support ticket on our <a href="https://discord.gg/XB2Zjmsb7K" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Discord server</a>.
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => toggleProductSpecs(p.slug)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '4px 0',
                    marginBottom: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isExpanded ? '▲ Hide Setup Guide' : '▼ View Setup & System Requirements'}
                </button>
              </div>

              {/* Action Button */}
              <div className="product-action-wrap" style={{ marginTop: '12px' }}>
                {p.action.href ? (
                  <a
                    href={p.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-secondary w-100"
                  >
                    {p.action.label} ↗
                  </a>
                ) : p.action.disabled ? (
                  <button
                    type="button"
                    className="button button-ghost w-100 disabled-btn"
                    disabled
                  >
                    {p.action.label}
                  </button>
                ) : (
                  <NavLink
                    to={p.action.to}
                    className="button button-primary w-100"
                  >
                    {p.action.label}
                  </NavLink>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* Licensing Workflow Explanation */}
      <section className="seo-section" style={{ marginTop: '56px' }}>
        <div className="seo-container">
          <span className="badge warning mb-8">Transparent Process</span>
          <h2 style={{ marginTop: '10px' }}>How Licensing &amp; Order Delivery Works</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>
            We prioritize security and transparent delivery. Here is what happens when you purchase or evaluate our software:
          </p>

          <div className="card-grid columns-3" style={{ gap: '20px' }}>
            <article className="info-card">
              <span className="card-badge">STEP 1</span>
              <h3 style={{ marginTop: '8px' }}>Select Plan &amp; Duration</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                Choose your desired tier (Streamer, Special, Sniper, Aim Assist) and duration (1-day trial, weekly, 30 days, or yearly). The total amount is clearly calculated in USD and INR.
              </p>
            </article>

            <article className="info-card">
              <span className="card-badge">STEP 2</span>
              <h3 style={{ marginTop: '8px' }}>Submit Payment Proof</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                Complete payment using UPI or direct QR code and upload your screenshot payment confirmation at checkout. Your client account credentials are submitted simultaneously.
              </p>
            </article>

            <article className="info-card">
              <span className="card-badge">STEP 3</span>
              <h3 style={{ marginTop: '8px' }}>Instant Key Activation</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                Our administrator verifies your payment proof. Once confirmed, your unique hardware-bound license key and download build are unlocked in your Client Dashboard.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Product FAQ */}
      <section className="seo-section" style={{ marginTop: '32px', marginBottom: '40px' }}>
        <div className="seo-container">
          <span className="badge good mb-8">Answers &amp; Support</span>
          <h2 style={{ marginTop: '10px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '1.02rem', margin: '0 0 8px', color: 'var(--text)' }}>
                Can I use my license key on more than one computer?
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                No. All Dark Skull Corporation software panel licenses are cryptographically bound to a single machine Hardware Identifier (HWID). If you upgrade your hardware or need an authorized HWID reset, contact support in our Discord community.
              </p>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '1.02rem', margin: '0 0 8px', color: 'var(--text)' }}>
                What is the difference between the Free Panel and Paid Tiers?
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                The Free Panel is a shared community test pool limited to 20 concurrent slots, intended for evaluation of UI speed and server connectivity. Paid tiers (Streamer, Special, Sniper, Aim Assist) provide private dedicated slots, priority server bandwidth, and continuous uptime without slot congestion.
              </p>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '1.02rem', margin: '0 0 8px', color: 'var(--text)' }}>
                How quickly are checkout orders processed?
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Screenshot payment proofs are reviewed manually by administrators. Average verification takes between 15 minutes and a few hours during active hours. For priority review, you can post your order username in our Discord ticket channel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
