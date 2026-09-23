import { NavLink } from 'react-router-dom'

const products = [
  {
    id: 'free',
    title: 'FREE-PANEL',
    price: '$0',
    rateLabel: 'Base Rate',
    elite: false,
    features: [
      'Limited-slot shared access',
      'Free credentials displayed live',
      'Public test and evaluation',
      'Community Discord assistance',
    ],
    action: { label: 'Access Free Panel', to: '/pages/freepanel', primary: true },
  },
  {
    id: 'streamer',
    title: 'STREAMER-PANEL',
    price: '$2',
    rateLabel: 'Base Rate',
    elite: false,
    features: [
      'OBS and broadcast-safe guidance',
      'Clean interface with zero overlay clash',
      'Durations from 1 to 365 days',
      'Verified payment approval flow',
    ],
    action: { label: 'Buy Streamer Panel', to: '/pages/checkout?panel=streamer', primary: true },
  },
  {
    id: 'special',
    title: 'SPECIAL-PANEL',
    price: '$3',
    rateLabel: 'Base Rate',
    elite: true,
    badge: 'VIP TIER',
    features: [
      'Private-slot optimization',
      'Advanced stability & defense layer',
      'Priority 24/7 Discord support',
      'Fast-track order approval & key delivery',
      'Extended multi-month options',
    ],
    action: { label: 'Buy Special Panel', to: '/pages/checkout?panel=special', primary: true, elite: true },
  },
  {
    id: 'sniper',
    title: 'SNIPER-PANEL',
    price: '$1',
    rateLabel: 'Base Rate',
    elite: false,
    features: [
      'Fast-switch utility controls',
      'Lightweight memory footprint',
      'Instant configuration presets',
      'Full duration range from 1 to 365 days',
    ],
    action: { label: 'Buy Sniper Panel', to: '/pages/checkout?panel=sniper', primary: true },
  },
  {
    id: 'aimassist',
    title: 'AIM-ASSIST-PANEL',
    price: '$1',
    rateLabel: 'Base Rate',
    elite: false,
    features: [
      'Target tracking & precision orientation',
      'Dynamic sensitivity calibration',
      'Regular performance updates',
      'Secure payment proof verification',
    ],
    action: { label: 'Buy Aim Assist Panel', to: '/pages/checkout?panel=aimassist', primary: true },
  },
  {
    id: 'premium',
    title: 'PREMIUM-PANEL',
    price: '$5',
    rateLabel: 'Base Rate',
    elite: false,
    features: [
      'Next-generation engine architecture',
      'Dedicated private server allocations',
      'Direct developer hotline support',
      'Upcoming automated key issuance',
    ],
    action: { label: 'Coming Soon', disabled: true },
  },
  {
    id: 'customised',
    title: 'CUSTOMISED-PANEL',
    price: '$10',
    rateLabel: 'Base Rate',
    elite: false,
    features: [
      'Custom branding & build compilation',
      'Dedicated private build pipeline',
      'Direct contact with lead engineer',
      'Bespoke feature integration',
    ],
    action: { label: 'Coming Soon', disabled: true },
  },
]

export function ProductsPage() {
  return (
    <div className="center-wrap">
      <section className="page-header-center">
        <span className="hero-eyebrow">Product Catalog</span>
        <h1>Software & Panel Products</h1>
        <p>
          Choose from our range of high-performance utilities and software panels.
          Enjoy transparent base pricing, multiple duration options, and verified access.
        </p>
      </section>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((p) => (
          <article
            key={p.id}
            className={`product-card ${p.elite ? 'elite' : ''}`}
          >
            {p.elite && p.badge ? (
              <span className="elite-badge">{p.badge}</span>
            ) : null}

            <div>
              <h2 className="product-title">{p.title}</h2>
              <div className="product-price">
                {p.price} <span className="product-price-rate">/ {p.rateLabel}</span>
              </div>
              <ul className="product-features">
                {p.features.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="product-action-wrap">
              {p.action.disabled ? (
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
        ))}
      </div>

      {/* SEO Section */}
      <section className="seo-section">
        <div className="seo-container">
          <h2>Why Choose Dark Skull Corporation Software?</h2>
          <p>
            Dark Skull Corporation delivers robust, reliable software solutions designed for high performance, ease of use, and security. Whether you are looking for free lightweight utilities or specialized software access, our products undergo continuous optimization and testing to ensure an exceptional experience.
          </p>

          <h2>Approval-Based Licensing & Security</h2>
          <p>
            All premium panels use an approval-based licensing mechanism with verified payment proofs and direct administrator review. This guarantees that your access keys are unique, verified, and secure. Need assistance or have questions? Our community on Discord is always ready to support you.
          </p>
        </div>
      </section>
    </div>
  )
}
