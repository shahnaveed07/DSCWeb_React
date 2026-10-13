import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ROUTE_MAP, getRoute, evaluateRouteAccess } from '../components/chatbot/routeMap'
import { detectNavigationIntent, resolveLocalIntent } from '../components/chatbot/intentResolver'
import { validateAssistantResponse } from '../services/assistantService'
import { DSCAssistant } from '../components/chatbot/DSCAssistant'

describe('DSC AI Assistant — Route Map & Access Control', () => {
  it('contains all 18 canonical routes in ROUTE_MAP', () => {
    const requiredKeys = [
      'home',
      'apps',
      'products',
      'downloads',
      'about',
      'contact',
      'status',
      'privacy',
      'terms',
      'freepanel',
      'checkout',
      'ulogin',
      'udash',
      'change',
      'alogin',
      'adash',
      'generatekey',
      'ownerdb',
    ]

    for (const key of requiredKeys) {
      expect(ROUTE_MAP[key]).toBeDefined()
      expect(ROUTE_MAP[key].path).toBeTruthy()
      expect(ROUTE_MAP[key].title).toBeTruthy()
    }
  })

  it('resolves routes with case-insensitivity', () => {
    expect(getRoute('PRODUCTS')?.path).toBe('/pages/products')
    expect(getRoute('freepanel')?.path).toBe('/pages/freepanel')
    expect(getRoute('NON_EXISTENT')).toBeNull()
  })

  it('permits guests to access public routes', () => {
    const access = evaluateRouteAccess('products', null)
    expect(access.allowed).toBe(true)
    expect(access.targetPath).toBe('/pages/products')
  })

  it('guards user dashboard from guests and redirects to ulogin', () => {
    const guestAccess = evaluateRouteAccess('udash', null)
    expect(guestAccess.allowed).toBe(false)
    expect(guestAccess.targetPath).toBe('/pages/ulogin')
    expect(guestAccess.alternativeRouteKey).toBe('ulogin')

    const userAccess = evaluateRouteAccess('udash', { role: 'User' })
    expect(userAccess.allowed).toBe(true)
    expect(userAccess.targetPath).toBe('/pages/udash')
  })

  it('guards admin dashboard from users and redirects to alogin', () => {
    const userAccess = evaluateRouteAccess('adash', { role: 'User' })
    expect(userAccess.allowed).toBe(false)
    expect(userAccess.targetPath).toBe('/pages/alogin')

    const adminAccess = evaluateRouteAccess('adash', { role: 'Admin' })
    expect(adminAccess.allowed).toBe(true)
    expect(adminAccess.targetPath).toBe('/pages/adash')
  })

  it('guards ownerdb from non-owner admin sessions', () => {
    const regularAdminAccess = evaluateRouteAccess('ownerdb', { role: 'Admin', isOwner: false })
    expect(regularAdminAccess.allowed).toBe(false)
    expect(regularAdminAccess.targetPath).toBe('/pages/adash')

    const ownerAccess = evaluateRouteAccess('ownerdb', { role: 'Admin', isOwner: true })
    expect(ownerAccess.allowed).toBe(true)
    expect(ownerAccess.targetPath).toBe('/pages/ownerdb')
  })
})

describe('DSC AI Assistant — Intent Resolution & Hinglish Support', () => {
  it('detects user intent for English and Hinglish navigation queries', () => {
    expect(detectNavigationIntent('Take me to the products page.')).toBe('products')
    expect(detectNavigationIntent('Mujhe downloads dikhao.')).toBe('downloads')
    expect(detectNavigationIntent('Open the free panel.')).toBe('freepanel')
    expect(detectNavigationIntent('Where can I purchase a plan?')).toBe('checkout')
    expect(detectNavigationIntent('Go to my dashboard.')).toBe('udash')
    expect(detectNavigationIntent('Mujhe contact page par le jao.')).toBe('contact')
    expect(detectNavigationIntent('I want to change my password.')).toBe('change')
  })

  it('resolves deterministic navigation intent with route validation', () => {
    const navMatch = resolveLocalIntent('take me to products', null)
    expect(navMatch).toBeTruthy()
    expect(navMatch.type).toBe('navigate')
    expect(navMatch.routeKey).toBe('products')
    expect(navMatch.message).toContain('Products')
  })

  it('handles guest asking for user dashboard with protective redirect', () => {
    const navMatch = resolveLocalIntent('open my dashboard', null)
    expect(navMatch).toBeTruthy()
    expect(navMatch.type).toBe('navigate')
    expect(navMatch.routeKey).toBe('ulogin')
    expect(navMatch.message).toContain('protected')
  })

  it('answers grounded FAQ queries instantly', () => {
    const faqAbout = resolveLocalIntent('What is DSC?', null)
    expect(faqAbout).toBeTruthy()
    expect(faqAbout.type).toBe('answer')
    expect(faqAbout.message).toContain('Dark Skull Corporation')

    const faqPricing = resolveLocalIntent('How much is the pricing for panels?', null)
    expect(faqPricing).toBeTruthy()
    expect(faqPricing.message).toContain('STREAMER-PANEL')
  })
})

describe('DSC AI Assistant — Response Validation', () => {
  it('sanitizes model responses and discards unrecognized route keys', () => {
    const malformed = {
      type: 'navigate',
      routeKey: 'INVALID_PAGE_KEY',
      message: 'Navigating somewhere',
      links: [{ label: 'Bad Link', routeKey: 'FAKE_KEY' }],
    }
    const validated = validateAssistantResponse(malformed, null)
    expect(validated.routeKey).toBeNull()
    expect(validated.links).toEqual([])
  })

  it('falls back gracefully on empty or null payloads', () => {
    const validated = validateAssistantResponse(null, null)
    expect(validated.type).toBe('fallback')
    expect(validated.links.length).toBeGreaterThan(0)
  })
})

describe('DSC AI Assistant — UI Widget Component', () => {
  it('renders closed launcher by default with accessible attributes', () => {
    render(
      <MemoryRouter>
        <DSCAssistant session={null} />
      </MemoryRouter>,
    )

    const launcher = screen.getByRole('button', { name: /open dsc ai assistant/i })
    expect(launcher).toBeDefined()
    expect(launcher.getAttribute('aria-expanded')).toBe('false')
  })

  it('opens chat panel and displays welcome message and quick prompts', () => {
    render(
      <MemoryRouter>
        <DSCAssistant session={null} />
      </MemoryRouter>,
    )

    const launcher = screen.getByRole('button', { name: /open dsc ai assistant/i })
    fireEvent.click(launcher)

    expect(screen.getByText('DSC AI Assistant')).toBeDefined()
    expect(screen.getByText(/AI Powered • Website Guide/i)).toBeDefined()
    expect(screen.getByText(/Hey! Welcome to DSC/i)).toBeDefined()
    expect(screen.getAllByText('Explore Products').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Open Downloads').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Free Panel').length).toBeGreaterThan(0)
  })
})
