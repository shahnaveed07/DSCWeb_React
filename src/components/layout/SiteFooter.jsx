import { NavLink } from 'react-router-dom'
import { footerGroups } from '../../content/siteContent'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-badge">DSC</span>
        <div>
          <strong>DSCWeb</strong>
          <p>Software, applications, and digital products from DarkSkullCorporation.</p>
        </div>
      </div>

      <div className="footer-columns">
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2026 Dark Skull Corporation. All rights reserved.
        </p>
        <p className="footer-credit">
          Developed By{' '}
          <a
            className="footer-name"
            href="https://naveedmushtaq.tech/"
            target="_blank"
            rel="noreferrer"
          >
            Naveed Mushtaq
          </a>
        </p>
      </div>
    </footer>
  )
}
