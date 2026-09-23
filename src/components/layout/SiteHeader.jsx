import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { pageLabels, primaryNavItems } from '../../content/siteContent'

function isExternal(target) {
  return /^https?:\/\//.test(String(target || ''))
}

export function SiteHeader({ session, systemStatus, onLogout, compact = false }) {
  const location = useLocation()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setThemeState] = useState(() => {
    if (typeof document === 'undefined') return 'dark'
    const currentTheme = document.documentElement.getAttribute('data-theme')
    if (currentTheme === 'light' || currentTheme === 'dark') return currentTheme
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const hasDownloadCta =
    systemStatus &&
    (systemStatus.showHomeDownloadBtn === true ||
      systemStatus.ShowHomeDownloadBtn === true) &&
    (systemStatus.freeLink || systemStatus.FreeLink)

  const currentPageLabel = useMemo(() => {
    const currentPath = location.pathname.toLowerCase()
    const match = pageLabels.find((item) =>
      item.paths.some((path) => path.toLowerCase() === currentPath),
    )

    return match?.label || ''
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)

    try {
      localStorage.setItem('siteTheme', theme)
    } catch {
      // Ignore localStorage access errors.
    }
  }, [theme])

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function toggleTheme() {
    setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header className={`site-header ${compact ? 'site-header-compact' : ''}`.trim()}>
      <NavLink className="logo-mark" to="/" aria-label="Dark Skull Corporation Home">
        <img
          src="/images/dsclogo.png"
          alt="Dark Skull Corporation logo"
          className="header-logo-img"
        />
        <span>
          <strong className="logo-text">Dark Skull Corporation</strong>
        </span>
      </NavLink>

      <div className="header-actions">
        {currentPageLabel ? (
          <span className="current-page-label">{currentPageLabel}</span>
        ) : null}

        <button
          type="button"
          className="button button-secondary theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light mode' : 'dark mode'}`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {hasDownloadCta ? (
          <a
            className="button button-secondary"
            href="/pages/downloads"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">📥 </span>Download<span className="hide-mobile"> Panel</span>
          </a>
        ) : null}

        {session?.role === 'User' ? (
          <>
            <NavLink className="button button-ghost" to="/pages/udash">
              Dashboard
            </NavLink>
            <button className="button button-primary" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}

        {session?.role === 'Admin' ? (
          <>
            <NavLink className="button button-ghost" to="/pages/adash">
              Admin
            </NavLink>
            <button className="button button-primary" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}

        {!session ? (
          <NavLink className="button button-primary" to="/pages/ulogin">
            Login
          </NavLink>
        ) : null}

        <div className="menu-container" ref={menuRef}>
          <button
            type="button"
            className="button button-secondary menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-menu"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span>Menu</span>
          </button>

          <nav
            id="primary-menu"
            className="menu-panel"
            aria-label="Primary navigation"
            hidden={!menuOpen}
            onClick={() => setMenuOpen(false)}
          >
            {primaryNavItems.map((item) => {
              if (item.href) {
                return (
                  <a
                    key={item.href}
                    className="nav-link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active nav-link-active' : ''}`.trim()
                  }
                  to={item.to}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export function ButtonLink({ action, className = 'button button-primary' }) {
  if (!action) return null

  if (action.disabled) {
    return (
      <span className={`${className} button-disabled`.trim()} aria-disabled="true">
        {action.label}
      </span>
    )
  }

  if (isExternal(action.href)) {
    return (
      <a className={className} href={action.href} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    )
  }

  if (action.href) {
    return (
      <a className={className} href={action.href}>
        {action.label}
      </a>
    )
  }

  return (
    <NavLink className={className} to={action.to}>
      {action.label}
    </NavLink>
  )
}
