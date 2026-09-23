import { ButtonLink } from '../components/layout/SiteHeader'

const buildAreas = [
  {
    num: '01',
    category: 'Applications',
    title: 'Mobile & Desktop Apps',
    text: 'Focused tools built around practical features, instant startup, and everyday productivity.',
  },
  {
    num: '02',
    category: 'Software Panels',
    title: 'Security & Utilities',
    text: 'High-performance desktop software utilities with verified licensing and live operational telemetry.',
  },
  {
    num: '03',
    category: 'Interactive Games',
    title: 'Logic & Cognition',
    text: 'Handcrafted puzzle games and interactive challenges built for players who enjoy mental exercises.',
  },
]

const featuredWork = [
  {
    badge: 'Desktop Utility',
    title: 'Calculator',
    text: 'A simple, ultra-responsive calculator for everyday mathematical computations without bloat.',
    action: { label: 'View Application', to: '/pages/apps' },
    style: 'button button-secondary',
  },
  {
    badge: 'Android App',
    title: 'QR Scanner | Generator',
    text: 'Instant camera detection for barcodes and QR codes, alongside custom offline QR generation.',
    action: {
      label: 'Google Play ↗',
      href: 'https://play.google.com/store/apps/details?id=com.dsc.qrscanner',
    },
    style: 'button button-primary',
  },
  {
    badge: 'Brain Game',
    title: 'Mind Matrix',
    text: 'A minimalist suite of logic, memory, and spatial reaction drills with progressive difficulty scaling.',
    action: {
      label: 'Google Play ↗',
      href: 'https://play.google.com/store/apps/details?id=com.dsc.mindmatrix',
    },
    style: 'button button-primary',
  },
]

const principles = [
  {
    num: '01',
    title: 'Useful',
    text: 'Every feature must solve a tangible problem. We eliminate fluff, bloatware, and cosmetic friction.',
  },
  {
    num: '02',
    title: 'Simple',
    text: 'Interfaces should be obvious and fast. Tools must perform their duty without demanding continuous attention.',
  },
  {
    num: '03',
    title: 'Reliable',
    text: 'We test continuously, verify builds across operating systems, and fix issues transparently.',
  },
]

export function HomePage() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero-v2">
        <div className="home-hero-content">
          <div className="hero-eyebrow-row">
            <span className="hero-eyebrow">Dark Skull Corporation</span>
            <span className="hero-dot">·</span>
            <span className="hero-subkicker">Independent Studio</span>
          </div>
          <h1 className="home-hero-title">
            Software made to be <span className="text-highlight">useful</span>.
          </h1>
          <p className="home-hero-desc">
            We build apps, tools, games, and specialized digital products with a focus on practical features, robust performance, and straightforward user experiences.
          </p>
          <div className="home-hero-actions">
            <ButtonLink action={{ label: 'Explore Apps', to: '/pages/apps' }} className="button button-primary button-lg" />
            <ButtonLink action={{ label: 'View Products', to: '/pages/products' }} className="button button-secondary button-lg" />
          </div>
        </div>

        {/* Hero Capability Strip */}
        <div className="hero-capability-grid">
          <div className="hero-cap-item">
            <span className="hero-cap-num">01</span>
            <div className="hero-cap-text">
              <strong>Desktop Utilities</strong>
              <span>Clean, fast Windows applications</span>
            </div>
          </div>
          <div className="hero-cap-item">
            <span className="hero-cap-num">02</span>
            <div className="hero-cap-text">
              <strong>Android Releases</strong>
              <span>Privacy-first mobile utilities</span>
            </div>
          </div>
          <div className="hero-cap-item">
            <span className="hero-cap-num">03</span>
            <div className="hero-cap-text">
              <strong>Interactive Games</strong>
              <span>Logic & pattern recognition</span>
            </div>
          </div>
          <div className="hero-cap-item">
            <span className="hero-cap-num">04</span>
            <div className="hero-cap-text">
              <strong>Verified Binaries</strong>
              <span>Direct delivery & key management</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="home-divider" />

      {/* Featured Projects Showcase */}
      <section className="home-section">
        <div className="section-head-v2">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Selected Work</span>
            <h2 className="section-title-v2">Featured Projects</h2>
          </div>
          <p className="section-subtitle-v2">
            A look at recent software releases developed and actively maintained by Dark Skull Corporation.
          </p>
        </div>

        <div className="showcase-grid">
          {featuredWork.map((item) => (
            <article className="showcase-card" key={item.title}>
              <div className="showcase-card-top">
                <span className="showcase-badge">{item.badge}</span>
                <h3 className="showcase-title">{item.title}</h3>
                <p className="showcase-desc">{item.text}</p>
              </div>
              <div className="showcase-card-bottom">
                <ButtonLink action={item.action} className={item.style || 'button button-primary'} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="home-divider" />

      {/* Disciplines Section */}
      <section className="home-section home-disciplines-section">
        <div className="section-head-v2">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Disciplines</span>
            <h2 className="section-title-v2">What We Build</h2>
          </div>
          <p className="section-subtitle-v2">
            Different software categories unified by one philosophy: building software that people can genuinely use.
          </p>
        </div>

        <div className="disciplines-grid">
          {buildAreas.map((area) => (
            <article className="discipline-card" key={area.title}>
              <div className="discipline-num">{area.num}</div>
              <span className="discipline-category">{area.category}</span>
              <h3 className="discipline-title">{area.title}</h3>
              <p className="discipline-text">{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <hr className="home-divider" />

      {/* Principles Section */}
      <section className="home-section">
        <div className="section-head-v2">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Core Standards</span>
            <h2 className="section-title-v2">Engineered with Purpose</h2>
          </div>
          <p className="section-subtitle-v2">
            Quality software is not complicated. We focus on the fundamentals that matter to our users.
          </p>
        </div>

        <div className="principles-grid">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.num}>
              <div className="principle-header">
                <span className="principle-num">{principle.num}</span>
                <h3 className="principle-title">{principle.title}</h3>
              </div>
              <p className="principle-desc">{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <hr className="home-divider" />

      {/* Split Highlights: About & Contact */}
      <section className="home-section home-split-grid">
        <article className="highlight-panel">
          <span className="section-eyebrow">About Dark Skull</span>
          <h2 className="highlight-title">Independent Engineering</h2>
          <p className="highlight-desc">
            Dark Skull Corporation is an independent software studio focused on applications, desktop tools, and games. Our software evolves through practical testing, community feedback, and steady refinement.
          </p>
          <div className="highlight-action">
            <ButtonLink action={{ label: 'About Studio', to: '/pages/about' }} className="button button-secondary" />
          </div>
        </article>

        <article className="highlight-panel highlight-panel-alt">
          <span className="section-eyebrow">Get In Touch</span>
          <h2 className="highlight-title">Direct Communication</h2>
          <p className="highlight-desc">
            Have questions about an active order, need technical assistance, or want to discuss custom utility development? We maintain active community and support channels.
          </p>
          <div className="highlight-action">
            <ButtonLink action={{ label: 'Contact Support', to: '/pages/contact' }} className="button button-primary" />
          </div>
        </article>
      </section>
    </div>
  )
}
