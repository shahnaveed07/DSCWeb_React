import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NotFoundPage } from '../pages/NotFoundPage'
import { StatusPage } from '../pages/StatusPage'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteLayout } from '../components/layout/SiteLayout'
import { isFooterNeeded } from '../utils/navigation'


describe('Component Render Tests', () => {
  it('renders NotFoundPage with error 404 and return home action', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Error 404/i)).toBeTruthy()
    expect(screen.getByText(/Page Not Found/i)).toBeTruthy()
    expect(screen.getByRole('link', { name: /Return Home/i })).toBeTruthy()
  })

  it('renders StatusPage default notice when no query param is present', () => {
    render(
      <MemoryRouter initialEntries={['/pages/status']}>
        <StatusPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/We are Working on New Updates/i)).toBeTruthy()
    expect(screen.getByText(/Notice/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeTruthy()
  })

  it('renders StatusPage maintenance state when ?type=maintenance is supplied', () => {
    render(
      <MemoryRouter initialEntries={['/pages/status?type=maintenance']}>
        <StatusPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/System Maintenance/i)).toBeTruthy()
    expect(screen.getByText(/We'll be back shortly/i)).toBeTruthy()
  })

  it('renders SiteFooter with copyright, developer credit, and navigation columns', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>
    )

    const brandMatches = screen.getAllByText(/Dark Skull Corporation/i)
    expect(brandMatches.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Naveed Mushtaq/i)).toBeTruthy()
    expect(screen.getByRole('link', { name: /Applications/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Software Panels/i })).toBeTruthy()
  })

  it('correctly evaluates isFooterNeeded for public content vs utility/auth routes', () => {
    // Needed pages
    expect(isFooterNeeded('/')).toBe(true)
    expect(isFooterNeeded('/pages/apps')).toBe(true)
    expect(isFooterNeeded('/pages/products')).toBe(true)
    expect(isFooterNeeded('/pages/downloads')).toBe(true)
    expect(isFooterNeeded('/pages/about')).toBe(true)
    expect(isFooterNeeded('/pages/about/')).toBe(true)
    expect(isFooterNeeded('/pages/about.html')).toBe(true)
    expect(isFooterNeeded('/pages/contact')).toBe(true)
    expect(isFooterNeeded('/pages/privacy-policy')).toBe(true)
    expect(isFooterNeeded('/pages/terms')).toBe(true)

    // Not needed on dashboard, auth, checkout, or admin tools
    expect(isFooterNeeded('/pages/ulogin')).toBe(false)
    expect(isFooterNeeded('/pages/alogin')).toBe(false)
    expect(isFooterNeeded('/pages/udash')).toBe(false)
    expect(isFooterNeeded('/pages/adash')).toBe(false)
    expect(isFooterNeeded('/pages/checkout')).toBe(false)
    expect(isFooterNeeded('/pages/freepanel')).toBe(false)
    expect(isFooterNeeded('/pages/change')).toBe(false)
    expect(isFooterNeeded('/pages/ownerdb')).toBe(false)
    expect(isFooterNeeded('/pages/generatekey')).toBe(false)
    expect(isFooterNeeded('/pages/404')).toBe(false)
  })

  it('renders SiteFooter in SiteLayout on needed pages, but excludes it on dashboards/auth', () => {
    // Test on a needed public page: /pages/about
    const { unmount } = render(
      <MemoryRouter initialEntries={['/pages/about']}>
        <Routes>
          <Route element={<SiteLayout session={null} systemStatus={null} onLogout={() => {}} />}>
            <Route path="/pages/about" element={<div>About Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('About Page Content')).toBeTruthy()
    expect(screen.getByText(/Naveed Mushtaq/i)).toBeTruthy()
    unmount()

    // Test on an unneeded utility/dashboard page: /pages/udash
    render(
      <MemoryRouter initialEntries={['/pages/udash']}>
        <Routes>
          <Route element={<SiteLayout session={null} systemStatus={null} onLogout={() => {}} />}>
            <Route path="/pages/udash" element={<div>User Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('User Dashboard Content')).toBeTruthy()
    expect(screen.queryByText(/Naveed Mushtaq/i)).toBeNull()
  })
})

