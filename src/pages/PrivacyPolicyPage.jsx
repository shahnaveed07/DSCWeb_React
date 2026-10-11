import { Link } from 'react-router-dom'
import { PageSection } from '../components/ui/PageSection'
import { privacySections } from '../content/siteContent'

export function PrivacyPolicyPage() {
  return (
    <div className="page-stack">
      <section className="hero-block">
        <span className="hero-eyebrow">Privacy Policy</span>
        <h1>Your privacy matters to us.</h1>
        <p className="hero-copy">
          Dark Skull Corporation is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our website, Android applications, software products, and related services.
        </p>
        <p className="mt-8 text-sm" style={{ color: 'var(--muted)' }}>
          <strong>Effective Date:</strong> August 2026
        </p>
      </section>

      <PageSection
        title="Privacy Overview"
        description="We believe privacy should be simple and transparent. We collect only the information necessary to operate our services, improve our applications, maintain security, and provide a dependable user experience."
      >
        <div className="card-grid columns-2">
          {privacySections.map((section) => (
            <article className="info-card" key={section.title}>
              <h3>{section.title}</h3>
              {section.description ? (
                <p className="text-sm mb-12" style={{ color: 'var(--muted)' }}>
                  {section.description}
                </p>
              ) : null}
              <ul className="feature-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {section.note ? (
                <p className="text-xs mt-12" style={{ color: 'var(--secondary)' }}>
                  {section.note}
                </p>
              ) : null}
            </article>
          ))}

          <article className="info-card">
            <h3>Contact Us Regarding Privacy</h3>
            <p className="text-sm mb-12" style={{ color: 'var(--muted)' }}>
              If you have any questions or requests regarding this Privacy Policy or data handling:
            </p>
            <p className="text-sm mb-8">
              <strong>Dark Skull Corporation</strong>
              <br />
              Developer: Naveed Mushtaq
              <br />
              Email:{' '}
              <a href="mailto:darkskullcorporation@gmail.com" style={{ color: 'var(--primary)' }}>
                darkskullcorporation@gmail.com
              </a>
            </p>
            <div className="mt-12">
              <Link to="/pages/contact" className="button button-secondary button-sm">
                Open Contact Page
              </Link>
            </div>
          </article>
        </div>
      </PageSection>
    </div>
  )
}
