const contactChannels = [
  {
    tag: 'Community & Instant Help',
    title: 'Discord Community Server',
    description:
      'Join our active server for real-time support, update announcements, and direct interaction with the DSC team and users.',
    actionLabel: 'Join Discord ↗',
    href: 'https://discord.gg/XB2Zjmsb7K',
    primary: true,
  },
  {
    tag: 'Formal Inquiries',
    title: 'Official Email Support',
    description:
      'Reach out directly for partnership opportunities, licensing questions, business proposals, or account issues.',
    actionLabel: 'Email Support ↗',
    href: 'mailto:darkskullcorporation@gmail.com',
    primary: false,
  },
  {
    tag: 'Open Source',
    title: 'GitHub Organization',
    description:
      'Explore public code repositories, report bugs, review open source tools, and follow developer contributions.',
    actionLabel: 'GitHub Profile ↗',
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
      <section className="page-header-center">
        <span className="hero-eyebrow">Direct Communication</span>
        <h1>Contact & Support Channels</h1>
        <p>
          Have questions about your order, need technical assistance, or want to discuss a custom build?
          Connect with the Dark Skull Corporation team through any of our official channels.
        </p>
      </section>

      {/* Channels Grid */}
      <div className="channels-grid">
        {contactChannels.map((c) => (
          <article key={c.title} className="channel-card">
            <div>
              <span className="badge warning mb-10">
                {c.tag}
              </span>
              <h2 className="channel-card-title">{c.title}</h2>
              <p className="channel-card-desc">{c.description}</p>
            </div>

            <div className="channel-card-action">
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
