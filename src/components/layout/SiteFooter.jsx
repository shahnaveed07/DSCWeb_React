import { NavLink } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer id="dsc-footer" className="developer-footer">
      <div className="footer-container">
        

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
