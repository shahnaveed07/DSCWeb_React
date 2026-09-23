import { NavLink } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer id="dsc-footer" className="developer-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <NavLink className="footer-brand" to="/" aria-label="Dark Skull Corporation Home">
              <img
                src="/images/dsclogo.png"
                alt="Dark Skull Corporation"
                className="footer-brand-logo"
              />
              <span className="footer-brand-name">Dark Skull Corporation</span>
            </NavLink>
            <p className="footer-desc">
              Software &amp; digital products by DSC.
            </p>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Products</span>
            <ul className="footer-links">
              <li>
                <NavLink to="/pages/apps">Applications</NavLink>
              </li>
              <li>
                <NavLink to="/pages/products">Software Panels</NavLink>
              </li>
              <li>
                <NavLink to="/pages/downloads">Download Center</NavLink>
              </li>
              <li>
                <NavLink to="/pages/freepanel">Free Panel Access</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Company</span>
            <ul className="footer-links">
              <li>
                <NavLink to="/pages/about">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/pages/contact">Contact Support</NavLink>
              </li>
              <li>
                <NavLink to="/pages/privacy-policy">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/pages/terms">Terms of Use</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Connect</span>
            <ul className="footer-links">
              <li>
                <a
                  href="https://discord.gg/XB2Zjmsb7K"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord Community
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shahnaveed07"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </a>
              </li>
              <li>
                <NavLink to="/pages/status">System Status</NavLink>
              </li>
              <li>
                <a href="mailto:darkskullcorporation@gmail.com">
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2026 Dark Skull Corporation. All rights reserved.
          </p>
          <p className="footer-credit">
            Developed by{' '}
            <a
              href="https://naveedmushtaq.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-developer-link"
              title="Visit Developer Portfolio"
            >
              Naveed Mushtaq
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
