import { Outlet, useLocation } from 'react-router-dom'
import { DSCAssistant } from '../chatbot/DSCAssistant'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout({ session, systemStatus, onLogout }) {
  const location = useLocation()
  const compactHeader = /^\/pages\/(ulogin|alogin|freepanel|checkout|udash|change|adash|ownerdb|generatekey)/i.test(
    location.pathname,
  )

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
      <SiteFooter />
      <DSCAssistant session={session} />
    </div>
  )
}
