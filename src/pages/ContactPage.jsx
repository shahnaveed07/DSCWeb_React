import { contactChannels } from '../content/siteContent'

export function ContactPage() {
  return (
    <div className="page-stack">
      <section className="hero-block">
        <span className="hero-eyebrow">Contact and Support</span>
        <h1>Reach out for product, business, or support conversations.</h1>
        <p className="hero-copy">
          The live DSCWeb already exposes email, Discord, and GitHub surfaces.
          This page keeps those channels but turns them into a clearer contact
          structure.
        </p>
      </section>

      <section className="panel">
        <div className="card-grid columns-3">
          {contactChannels.map((channel) => (
            <article className="contact-card" key={channel.label}>
              <span className="card-label">{channel.label}</span>
              <h3>{channel.title}</h3>
              <p>{channel.body}</p>
              <a
                className="button button-secondary"
                href={channel.action.href}
                rel={channel.action.href.startsWith('http') ? 'noreferrer' : undefined}
                target={channel.action.href.startsWith('http') ? '_blank' : undefined}
              >
                {channel.action.label}
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
