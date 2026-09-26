import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { useRemoteResource } from './hooks/useRemoteResource'
import { checkOwnerAccess, getSystemStatus } from './services/dscApi'
import { clearStoredSession, loadStoredSession } from './utils/auth'
import { AboutPage } from './pages/AboutPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminWorkspacePage } from './pages/AdminWorkspacePage'
import { AppsPage } from './pages/AppsPage'
import { ChangePasswordPage } from './pages/ChangePasswordPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/ContactPage'
import { DownloadsPage } from './pages/DownloadsPage'
import { FreePanelPage } from './pages/FreePanelPage'
import { GenerateKeyPage } from './pages/GenerateKeyPage'
import { HomePage } from './pages/HomePage'
import { MaintenancePage } from './pages/MaintenancePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { ProductsPage } from './pages/ProductsPage'
import { StatusPage } from './pages/StatusPage'
import { TermsPage } from './pages/TermsPage'
import { UserDashboardPage } from './pages/UserDashboardPage'
import { UserLoginPage } from './pages/UserLoginPage'

function redirectForSession(session) {
  if (!session) return '/pages/ulogin'
  return session.role === 'Admin' ? '/pages/adash' : '/pages/udash'
}

function MaintenanceGate({ children, systemStatus, onRetry }) {
  const location = useLocation()
  const isAdminRoute = /^\/pages\/(alogin|adash|ownerdb|generatekey|Alogin\.html|Adash\.html|OwnerDB\.html|generateKey\.html)/i.test(
    location.pathname,
  )

  const maintenanceActive =
    systemStatus?.isMaintenanceMode === true ||
    systemStatus?.IsMaintenanceMode === true

  if (maintenanceActive && !isAdminRoute) {
    return <MaintenancePage onRetry={onRetry} systemStatus={systemStatus} />
  }

  return children
}

function RoleGate({ session, role, children }) {
  if (!session) {
    return <Navigate replace to={role === 'Admin' ? '/pages/alogin' : '/pages/ulogin'} />
  }

  if (session.role !== role) {
    return <Navigate replace to={redirectForSession(session)} />
  }

  return children
}

function OwnerGate({ session, children }) {
  const [ownerState, setOwnerState] = useState('checking')

  useEffect(() => {
    let active = true
    checkOwnerAccess(session?.token)
      .then((isOwner) => {
        if (active) setOwnerState(isOwner ? 'owner' : 'denied')
      })
      .catch(() => {
        if (active) setOwnerState('denied')
      })
    return () => {
      active = false
    }
  }, [session?.token])

  if (ownerState === 'checking') {
    return (
      <main className="center-wrap">
        <section className="panel auth-card" style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center' }}>
          <div className="spinner-inline" style={{ width: '28px', height: '28px', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Verifying Permissions</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
            Checking owner privileges for your administrative session...
          </p>
        </section>
      </main>
    )
  }

  if (ownerState !== 'owner') {
    return <Navigate replace to="/pages/adash" />
  }

  return children
}

export default function App() {
  const [session, setSession] = useState(() => loadStoredSession())
  const [statusRevision, setStatusRevision] = useState(0)

  const { data: systemStatus } = useRemoteResource(
    getSystemStatus,
    [statusRevision],
  )

  function handleRetryStatus() {
    setStatusRevision((v) => v + 1)
  }

  function handleSessionChange(nextSession) {
    setSession(nextSession)
  }

  function handleLogout() {
    clearStoredSession()
    setSession(null)
  }

  return (
    <ErrorBoundary>
      <MaintenanceGate onRetry={handleRetryStatus} systemStatus={systemStatus}>
        <Routes>
          <Route path="/pages/status" element={<StatusPage />} />
          <Route path="/pages/status.html" element={<Navigate replace to="/pages/status" />} />

          <Route
            element={
              <SiteLayout
                onLogout={handleLogout}
                session={session}
                systemStatus={systemStatus}
              />
            }
          >
            <Route index element={<HomePage systemStatus={systemStatus} />} />
            <Route path="/index.html" element={<Navigate replace to="/" />} />

            <Route path="/pages/apps" element={<AppsPage />} />
            <Route path="/pages/apps.html" element={<Navigate replace to="/pages/apps" />} />

            <Route path="/pages/products" element={<ProductsPage />} />
            <Route path="/pages/products.html" element={<Navigate replace to="/pages/products" />} />

            <Route
              path="/pages/downloads"
              element={<DownloadsPage systemStatus={systemStatus} />}
            />
            <Route
              path="/pages/downloads.html"
              element={<Navigate replace to="/pages/downloads" />}
            />

            <Route path="/pages/about" element={<AboutPage />} />
            <Route path="/pages/about.html" element={<Navigate replace to="/pages/about" />} />

            <Route path="/pages/contact" element={<ContactPage />} />
            <Route path="/pages/contact.html" element={<Navigate replace to="/pages/contact" />} />

            <Route
              path="/pages/privacy-policy"
              element={<PrivacyPolicyPage />}
            />
            <Route
              path="/pages/privacy-policy.html"
              element={<Navigate replace to="/pages/privacy-policy" />}
            />
            <Route
              path="/pages/policy.html"
              element={<Navigate replace to="/pages/privacy-policy" />}
            />

            <Route path="/pages/terms" element={<TermsPage />} />
            <Route path="/pages/terms.html" element={<Navigate replace to="/pages/terms" />} />

            <Route
              path="/pages/ulogin"
              element={
                <UserLoginPage
                  onSessionChange={handleSessionChange}
                  session={session}
                />
              }
            />
            <Route
              path="/pages/Ulogin.html"
              element={<Navigate replace to="/pages/ulogin" />}
            />

            <Route
              path="/pages/alogin"
              element={
                <AdminLoginPage
                  onSessionChange={handleSessionChange}
                  session={session}
                />
              }
            />
            <Route
              path="/pages/Alogin.html"
              element={<Navigate replace to="/pages/alogin" />}
            />

            <Route path="/pages/freepanel" element={<FreePanelPage />} />
            <Route
              path="/pages/freepanel.html"
              element={<Navigate replace to="/pages/freepanel" />}
            />

            <Route path="/pages/checkout" element={<CheckoutPage />} />
            <Route
              path="/pages/checkout.html"
              element={<Navigate replace to="/pages/checkout" />}
            />

            <Route
              path="/pages/udash"
              element={
                <RoleGate role="User" session={session}>
                  <UserDashboardPage
                    onSessionInvalid={handleLogout}
                    session={session}
                  />
                </RoleGate>
              }
            />
            <Route
              path="/pages/Udash.html"
              element={<Navigate replace to="/pages/udash" />}
            />

            <Route
              path="/pages/change"
              element={
                <RoleGate role="User" session={session}>
                  <ChangePasswordPage
                    onSessionInvalid={handleLogout}
                    session={session}
                  />
                </RoleGate>
              }
            />
            <Route
              path="/pages/change.html"
              element={<Navigate replace to="/pages/change" />}
            />

            <Route
              path="/pages/adash"
              element={
                <RoleGate role="Admin" session={session}>
                  <AdminDashboardPage
                    onSessionInvalid={handleLogout}
                    session={session}
                    systemStatus={systemStatus}
                  />
                </RoleGate>
              }
            />
            <Route
              path="/pages/Adash.html"
              element={<Navigate replace to="/pages/adash" />}
            />

            <Route
              path="/pages/ownerdb"
              element={
                <RoleGate role="Admin" session={session}>
                  <OwnerGate session={session}>
                    <AdminWorkspacePage onSessionInvalid={handleLogout} session={session} />
                  </OwnerGate>
                </RoleGate>
              }
            />
            <Route
              path="/pages/OwnerDB.html"
              element={<Navigate replace to="/pages/ownerdb" />}
            />

            <Route
              path="/pages/generatekey"
              element={
                <RoleGate role="Admin" session={session}>
                  <GenerateKeyPage onSessionInvalid={handleLogout} session={session} />
                </RoleGate>
              }
            />
            <Route
              path="/pages/generateKey.html"
              element={<Navigate replace to="/pages/generatekey" />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </MaintenanceGate>
    </ErrorBoundary>
  )
}
