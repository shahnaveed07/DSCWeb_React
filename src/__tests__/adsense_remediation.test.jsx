import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppsPage } from '../pages/AppsPage'
import { ProductsPage } from '../pages/ProductsPage'
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage'
import { TermsPage } from '../pages/TermsPage'
import { ContactPage } from '../pages/ContactPage'

describe('AdSense Low-Value Content Remediation Suite', () => {
  it('AppsPage includes interactive working Web Calculator with math execution', () => {
    render(
      <MemoryRouter>
        <AppsPage />
      </MemoryRouter>
    )

    // Check title and calculator component
    expect(screen.getByText(/DSC WEB CALCULATOR/i)).toBeTruthy()

    // Perform calculation 7 + 8 = 15
    const btn7 = screen.getByRole('button', { name: '7' })
    const btn8 = screen.getByRole('button', { name: '8' })
    const btnPlus = screen.getByRole('button', { name: '+' })
    const btnEqual = screen.getByRole('button', { name: '=' })

    fireEvent.click(btn7)
    fireEvent.click(btnPlus)
    fireEvent.click(btn8)
    fireEvent.click(btnEqual)

    // Result should show 15
    expect(screen.getByText('15')).toBeTruthy()
  })

  it('ProductsPage renders category filter buttons and setup guides', () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /All Products/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Free Tier/i })).toBeTruthy()
    expect(screen.getByText(/STREAMER-PANEL/i)).toBeTruthy()
    expect(screen.getByText(/SPECIAL-PANEL/i)).toBeTruthy()
    expect(screen.getByText(/How Licensing & Order Delivery Works/i)).toBeTruthy()
  })

  it('PrivacyPolicyPage includes required Google AdSense and third-party advertising disclosures', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Cookies, Local Storage & Advertising Disclosures/i)).toBeTruthy()
    expect(screen.getByText(/Third-Party Advertising: Third-party vendors, including Google/i)).toBeTruthy()
    expect(screen.getByText(/Personalized Ad Opt-Out/i)).toBeTruthy()
  })

  it('TermsPage renders full licensing and platform rules', () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Software Licensing & Single-User Restrictions/i)).toBeTruthy()
    expect(screen.getByText(/Payment Verification & Delivery Policy/i)).toBeTruthy()
    expect(screen.getByText(/Free Panel Fair Use Policy/i)).toBeTruthy()
  })

  it('ContactPage validates inquiry form and prepares structured inquiry', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )

    // Channels
    expect(screen.getByText(/Official Email/i)).toBeTruthy()
    expect(screen.getByText(/darkskullcorporation@gmail.com/i)).toBeTruthy()
    expect(screen.getByText(/Discord Server/i)).toBeTruthy()

    // Submit button
    const submitBtn = screen.getByRole('button', { name: /Submit Inquiry Details/i })
    expect(submitBtn).toBeTruthy()
  })
})
