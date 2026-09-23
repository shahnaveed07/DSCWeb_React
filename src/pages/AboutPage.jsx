import { NavLink } from 'react-router-dom'

const focusAreas = [
  {
    title: 'Applications',
    tag: 'Mobile & Desktop',
    desc: 'Functional tools and everyday utilities designed to solve specific challenges with speed and clarity.',
  },
  {
    title: 'Software Panels',
    tag: 'Access & Management',
    desc: 'Specialized desktop management interfaces with verified licensing, secure key distribution, and live status.',
  },
  {
    title: 'Games & Interactive',
    tag: 'Brain & Logic',
    desc: 'Engaging puzzle challenges and cognitive exercise games built for mobile players who love problem solving.',
  },
]

const principles = [
  {
    number: '01',
    title: 'Useful First',
    desc: 'Every feature we code must serve a practical need. We do not add filler or complex layers just for show.',
  },
  {
    number: '02',
    title: 'Clean Interfaces',
    desc: 'Software should be straightforward to understand. We prioritize clarity, high readability, and responsive design.',
  },
  {
    number: '03',
    title: 'Reliable Delivery',
    desc: 'We verify our releases, perform continuous testing, and support our community directly through active communication channels.',
  },
]

export function AboutPage() {
  return (
    <div className="center-wrap">
      <section className="page-header-center">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Independent Software Studio</h1>
        <p>
          Dark Skull Corporation is an independent software studio focused on creating focused desktop utilities, specialized software panels, Android applications, and interactive puzzle experiences.
        </p>
      </section>

      {/* Focus Areas */}
      <div className="focus-grid">
        {focusAreas.map((area) => (
          <div key={area.title} className="focus-card">
            <span className="badge warning mb-8">
              {area.tag}
            </span>
            <h2 className="focus-card-title">{area.title}</h2>
            <p className="focus-card-desc">{area.desc}</p>
          </div>
        ))}
      </div>

      {/* Principles Section */}
      <section className="seo-section mb-32">
        <div className="seo-container">
          <h2>Our Core Principles</h2>
          <div className="principles-grid-about">
            {principles.map((pr) => (
              <div key={pr.number} className="principle-item-about">
                <span className="principle-item-num">{pr.number}</span>
                <h3 className="principle-item-title">{pr.title}</h3>
                <p className="principle-item-desc">{pr.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-36">Developer Portfolio & Leadership</h2>
          <p>
            DSCWeb and the software offerings within the Dark Skull Corporation portfolio are developed and maintained under the leadership of{' '}
            <a
              href="https://naveedmushtaq.tech/"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-semibold"
            >
              Naveed Mushtaq ↗
            </a>
            . Our projects undergo active refinement based on feedback from our global community.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="about-cta-card">
        <h2 className="about-cta-title">
          Explore Our Products & Ecosystem
        </h2>
        <p className="about-cta-desc">
          Discover what we have built or connect directly with our engineering team on Discord.
        </p>
        <div className="about-cta-actions">
          <NavLink to="/pages/products" className="button button-primary">
            View Products
          </NavLink>
          <NavLink to="/pages/contact" className="button button-secondary">
            Contact Us
          </NavLink>
        </div>
      </section>
    </div>
  )
}
