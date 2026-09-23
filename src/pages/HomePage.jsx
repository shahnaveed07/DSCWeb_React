import { ButtonLink } from '../components/layout/SiteHeader'
import { PageSection } from '../components/ui/PageSection'

const buildAreas = [
  ['Apps', 'Applications', 'Mobile and desktop apps built around practical features and everyday use.'],
  ['Tools', 'Software Tools', 'Focused tools made to handle specific tasks without adding unnecessary complexity.'],
  ['Games', 'Games', 'Puzzle games and interactive projects built for people who enjoy playing and exploring.'],
]

const featuredWork = [
  { badge: 'Utility', title: 'Calculator', text: 'A simple calculator for everyday mathematical calculations.', action: { label: 'View App', to: '/pages/apps' }, style: 'button button-secondary' },
  { badge: 'Android App', title: 'QR Scanner | Generator', text: 'Scan QR codes and barcodes, or create QR codes from text and links.', action: { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.dsc.qrscanner' } },
  { badge: 'Game', title: 'Mind Matrix', text: 'A collection of puzzle games built around logic, memory, and quick thinking.', action: { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.dsc.mindmatrix' } },
]

const principles = [
  ['01', 'Useful', 'Features should have a clear purpose and solve a real problem.'],
  ['02', 'Simple', "Interfaces should be easy to understand without getting in the user's way."],
  ['03', 'Reliable', 'We test, fix, and improve our products as they develop.'],
]

export function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Software made to be useful.</h1>
        <p>We build apps, tools, games, and digital products with a focus on useful features and straightforward experiences.</p>
        <div className="hero-actions">
          <ButtonLink action={{ label: 'Explore Apps', to: '/pages/apps' }} />
          <ButtonLink action={{ label: 'View Products', to: '/pages/products' }} className="button button-secondary" />
        </div>
      </section>

      <PageSection eyebrow="What We Build" title="Apps, Tools, and Games." description="Different projects, one simple goal: build software that people can actually use.">
        <div className="section-grid">
          {buildAreas.map(([badge, title, text]) => <article className="feature-card" key={title}><span className="card-badge">{badge}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </PageSection>

      <PageSection eyebrow="Featured Work" title="Some of our projects." description="Take a look at a few applications and games from DSC.">
        <div className="section-grid">
          {featuredWork.map((item) => <article className="feature-card" key={item.title}><span className="card-badge">{item.badge}</span><h3>{item.title}</h3><p>{item.text}</p><div className="card-actions"><ButtonLink action={item.action} className={item.style || 'button button-primary'} /></div></article>)}
        </div>
      </PageSection>

      <PageSection eyebrow="What Matters" title="Built with the basics in mind." description="Good software does not need to be complicated. We care about the parts that matter to the people using it.">
        <div className="section-grid">
          {principles.map(([number, title, text]) => <article className="service-card" key={number}><span className="card-badge">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </PageSection>

      <PageSection eyebrow="Dark Skull Corporation" title="We build our own software." description="Dark Skull Corporation is an independent software company focused on applications, tools, and games. Our projects are developed and improved over time as we learn from testing and real use.">
        <div className="hero-actions"><ButtonLink action={{ label: 'About DSC', to: '/pages/about' }} className="button button-secondary" /></div>
      </PageSection>

      <PageSection eyebrow="Contact" title="Want to get in touch?" description="Have a question about one of our products or want to discuss an idea? We'd be happy to hear from you.">
        <div className="hero-actions"><ButtonLink action={{ label: 'Contact Us', to: '/pages/contact' }} /></div>
      </PageSection>
    </div>
  )
}
