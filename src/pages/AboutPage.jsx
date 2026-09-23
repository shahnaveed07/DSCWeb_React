import { PageSection } from '../components/ui/PageSection'
import { aboutStats, homeHighlights } from '../content/siteContent'

export function AboutPage() {
  return (
    <div className="page-stack">
      <section className="hero-block hero-grid">
        <div>
          <span className="hero-eyebrow">About DSCWeb</span>
          <h1>DarkSkullCorporation, presented with more structure and less noise.</h1>
          <p className="hero-copy">
            The old site positions DSC as a software studio spanning utilities,
            web delivery, mobile releases, and future AI tooling. This page keeps
            that identity while aligning the language to a more credible company
            presentation.
          </p>
        </div>

        <aside className="metric-strip">
          {aboutStats.map((item) => (
            <div className="metric-card" key={item.label}>
              <span className="micro-label">{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </aside>
      </section>

      <PageSection
        eyebrow="Mission"
        title="Build dependable products with a maintainable foundation"
        description="The modernization goal is not a brand rewrite. It is a structural upgrade that keeps recognizable DSCWeb content and workflows intact."
      >
        <div className="card-grid columns-3">
          {homeHighlights.map((item) => (
            <article className="info-card" key={item.title}>
              <span className="card-label">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
