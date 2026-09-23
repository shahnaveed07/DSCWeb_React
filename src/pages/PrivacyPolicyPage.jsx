import { PageSection } from '../components/ui/PageSection'
import { privacySections } from '../content/siteContent'

export function PrivacyPolicyPage() {
  return (
    <div className="page-stack">
      <section className="hero-block">
        <span className="hero-eyebrow">Privacy Policy</span>
        <h1>Your privacy matters to us.</h1>
        <p className="hero-copy">
          Clear standards governing how Dark Skull Corporation protects client account information, license verification tokens, and transaction details.
        </p>
      </section>

      <PageSection
        title="Policy overview"
        description="DarkSkullCorporation collects only the information necessary to operate services, improve reliability, and support its applications."
      >
        <div className="card-grid columns-2">
          {privacySections.map((section) => (
            <article className="info-card" key={section.title}>
              <h3>{section.title}</h3>
              <ul className="feature-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
