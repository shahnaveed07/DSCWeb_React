import { ButtonLink } from '../components/layout/SiteHeader'
import { PageSection } from '../components/ui/PageSection'
import { featuredApps, roadmapItems } from '../content/siteContent'

export function AppsPage() {
  return (
    <div className="page-stack">
      <section className="hero-block">
        <span className="hero-eyebrow">Applications and Games</span>
        <h1>Practical software built for reliable daily use.</h1>
        <p className="hero-copy">
          The current DSC app lineup includes lightweight utilities, Android
          applications, and puzzle-focused releases. This page keeps the
          existing inventory while presenting it in a more structured way.
        </p>
      </section>

      <PageSection
        eyebrow="Production Releases"
        title="Available applications and games"
        description="Live products already surfaced by the legacy DSCWeb."
      >
        <div className="card-grid columns-3">
          {featuredApps.map((item) => (
            <article className="feature-card" key={item.title}>
              <span className="card-label">{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ButtonLink action={item.primaryAction} className="button button-secondary" />
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Roadmap"
        title="In development and future tooling"
        description="The legacy site advertises future AI and desktop tools; those themes are preserved here without turning the site into a flashy concept page."
      >
        <div className="timeline-grid">
          {roadmapItems.map((item) => (
            <article className="timeline-card" key={item.title}>
              <span className="timeline-step">{item.title}</span>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
