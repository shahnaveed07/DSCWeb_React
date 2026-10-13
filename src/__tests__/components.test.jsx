import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from '../pages/NotFoundPage'
import { StatusPage } from '../pages/StatusPage'
import { SiteFooter } from '../components/layout/SiteFooter'

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
})
