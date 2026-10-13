import { Outlet, useLocation } from 'react-router-dom'
import { isFooterNeeded } from '../../utils/navigation'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout({ session, systemStatus, onLogout }) {
  const location = useLocation()
  const cleanPath = location.pathname.toLowerCase().replace(/\.html$/i, '').replace(/\/+$/, '') || '/'

  const compactHeader = /^\/pages\/(ulogin|alogin|freepanel|checkout|udash|change|adash|ownerdb|generatekey)/i.test(
    cleanPath,
  )

  const showFooter = isFooterNeeded(cleanPath)

  return (
    <div className="app-shell">
      <SiteHeader
        compact={compactHeader}
        session={session}
        systemStatus={systemStatus}
        onLogout={onLogout}
      />
      <main className="main-shell">
        <Outlet />
      </main>
      {showFooter && <SiteFooter />}
    </div>
  )
}


