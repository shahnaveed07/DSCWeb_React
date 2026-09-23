import { PageSection } from '../components/ui/PageSection'

const terms = [
  {
    label: 'Web Services',
    title: 'Website Usage',
    body: 'Use our website in a lawful and respectful manner. Avoid actions that disrupt service quality, compromise server security, or misuse platform resources.',
  },
  {
    label: 'Applications',
    title: 'Software Usage',
    body: 'Any software or utility distributed by DSC should be used according to the stated purpose, system requirements, and specified license conditions.',
  },
  {
    label: 'Intellectual Property',
    title: 'Licensing & Distribution',
    body: 'Products and download packages are subject to individual licensing terms. Unauthorized decompilation, redistribution, or modification is prohibited.',
  },
]

export function TermsPage() {
  return (
    <div className="page-stack">
      <section className="hero-block">
        <span className="hero-eyebrow">Terms of Use</span>
        <h1>Terms of service and platform agreements.</h1>
        <p className="hero-copy">
          By using our website, software products, and digital utilities, you
          agree to comply with responsible usage policies, respect licensing
          agreements, and adhere to appropriate security guidelines.
        </p>
      </section>

      <PageSection
        eyebrow="Guidelines"
        title="Usage & Licensing Terms"
        description="Key terms governing your access to Dark Skull Corporation software and online resources."
      >
        <div className="card-grid columns-3">
          {terms.map((item) => (
            <article className="info-card" key={item.title}>
              <span className="card-badge">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
