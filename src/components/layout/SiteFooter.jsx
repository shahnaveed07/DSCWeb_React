import { NavLink } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer id="dsc-footer" className="developer-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <NavLink className="logo-mark" to="/">
              <img
                src="/images/dsclogo.png"
                alt="Dark Skull Corporation"
                className="header-logo-img"
              />
              <span className="logo-text">Dark Skull Corporation</span>
            </NavLink>
            <p className="footer-desc mt-10">
              Professional software studio crafting secure utilities, desktop tools, and future-ready digital experiences.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              <li>
                <NavLink to="/pages/apps">Applications</NavLink>
              </li>
              <li>
                <NavLink to="/pages/products">Products</NavLink>
              </li>
              <li>
                <NavLink to="/pages/downloads">Downloads</NavLink>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li>
                <NavLink to="/pages/about">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/pages/contact">Contact</NavLink>
              </li>
              <li>
                <NavLink to="/pages/privacy-policy">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/pages/terms">Terms of Use</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2026 DARK SKULL CORPORATION. ALL RIGHTS RESERVED.
          </p>
          <p className="footer-credit">
            Developer{' '}
            <a
              href="https://naveedmushtaq.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-name tooltip-trigger"
              data-tooltip="Visit Portfolio"
            >
              Naveed Mushtaq
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
