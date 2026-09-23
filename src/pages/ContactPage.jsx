const contactChannels = [
  {
    tag: 'Community & Instant Help',
    title: 'Discord Community Server',
    description:
      'Join our active server for real-time support, update announcements, and direct interaction with the DSC team and users.',
    actionLabel: 'Join Discord Server ↗',
    href: 'https://discord.gg/XB2Zjmsb7K',
    primary: true,
  },
  {
    tag: 'Formal Inquiries',
    title: 'Official Email Support',
    description:
      'Reach out directly for partnership opportunities, licensing questions, business proposals, or account issues.',
    actionLabel: 'Send an Email ↗',
    href: 'mailto:darkskullcorporation@gmail.com',
    primary: false,
  },
  {
    tag: 'Open Source',
    title: 'GitHub Organization',
    description:
      'Explore public code repositories, report bugs, review open source tools, and follow developer contributions.',
    actionLabel: 'Visit GitHub Profile ↗',
    href: 'https://github.com/shahnaveed07',
    primary: false,
  },
  {
    tag: 'Leadership',
    title: 'Developer Portfolio',
    description:
      'Learn more about lead engineer Naveed Mushtaq, view past engineering work, and explore technical credentials.',
    actionLabel: 'View Portfolio ↗',
    href: 'https://naveedmushtaq.tech/',
    primary: false,
  },
]

export function ContactPage() {
  return (
    <div className="center-wrap">
      <section className="section-head-v2" style={{ textAlign: 'center', display: 'block', marginBottom: '36px' }}>
        <span className="hero-eyebrow">Direct Communication</span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, margin: '8px 0 12px' }}>
          Contact & Support Channels
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Have questions about your order, need technical assistance, or want to discuss a custom build?
          Connect with the Dark Skull Corporation team through any of our official channels.
        </p>
      </section>

      {/* Channels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {contactChannels.map((c) => (
          <article
            key={c.title}
            className="card"
            style={{
              padding: '26px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span className="badge warning" style={{ marginBottom: '10px' }}>
                {c.tag}
              </span>
              <h2 style={{ fontSize: '1.25rem', margin: '6px 0 10px', fontWeight: 700 }}>
                {c.title}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                {c.description}
              </p>
            </div>

            <div style={{ marginTop: '24px' }}>
              <a
                className={`button ${c.primary ? 'button-primary' : 'button-secondary'} w-100`}
                href={c.href}
                target="_blank"
                rel="noreferrer"
              >
                {c.actionLabel}
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Support FAQ */}
      <section className="seo-section">
        <div className="seo-container">
          <h2>Order & Licensing Support Notice</h2>
          <p>
            Orders placed via the checkout system undergo verification of screenshot payment proofs. Once confirmed by our administrators, your access key is available immediately on your User Dashboard. If you experience delays over 24 hours, post your order ID or transaction reference in our Discord support channel for priority review.
          </p>
        </div>
      </section>
    </div>
  )
}
