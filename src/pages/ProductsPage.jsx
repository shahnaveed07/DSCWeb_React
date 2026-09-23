import { ButtonLink } from '../components/layout/SiteHeader'
import { PageSection } from '../components/ui/PageSection'
import { productPlans } from '../content/siteContent'

export function ProductsPage() {
  return (
    <div className="page-stack">
      <section className="hero-block">
        <span className="hero-eyebrow">Product Catalog</span>
        <h1>Software offerings and access tiers.</h1>
        <p className="hero-copy">
          The current catalog remains intact, but pricing references on this page
          now align to the live checkout base-rate logic where the legacy system
          had inconsistencies.
        </p>
      </section>

      <PageSection
        eyebrow="Access Tiers"
        title="Choose your panel"
        description="Phase 1 preserves the approval-based purchase flow, free access surface, and duration-based checkout model."
      >
        <div className="product-grid">
          {productPlans.map((plan) => (
            <article
              className={`product-card ${plan.featured ? 'product-card-featured' : ''}`.trim()}
              key={plan.title}
            >
              <span className="card-label">{plan.label}</span>
              <h3>{plan.title}</h3>
              <p className="product-price">{plan.price}</p>
              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <ButtonLink action={plan.action} />
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
