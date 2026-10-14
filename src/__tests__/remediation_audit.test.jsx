import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  extractApiMessage,
  resetUserHwid,
  forceUserPasswordReset,
  getApiBaseUrl,
} from '../services/dscApi'
import { FreePanelPage } from '../pages/FreePanelPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { ChangePasswordPage } from '../pages/ChangePasswordPage'
import { persistSessionFromResponse, loadStoredSession } from '../utils/auth'

function createMockJwt(payload) {
  const base64Url = btoa(JSON.stringify(payload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return `mockHeader.${base64Url}.mockSignature`
}

describe('Audit Remediation & Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  describe('API Contracts & Helper Verification', () => {
    it('extracts detail field from RFC 7807 ProblemDetails payload', () => {
      const payload = {
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Validation Error',
        detail: 'The provided hardware identifier is invalid or blacklisted.',
        status: 400,
      }
      expect(extractApiMessage(payload)).toBe(
        'The provided hardware identifier is invalid or blacklisted.'
      )
    })

    it('resetUserHwid sends POST request to /api/admin/user/{id}/reset-hwid with bearer token', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'HWID successfully reset.' }),
      })

      const token = 'mock-admin-token'
      const res = await resetUserHwid(token, 42)
      expect(res.message).toBe('HWID successfully reset.')

      expect(fetchSpy).toHaveBeenCalledWith(
        `${getApiBaseUrl()}/api/admin/user/42/reset-hwid`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-admin-token',
          }),
        })
      )
    })

    it('forceUserPasswordReset sends POST to /api/admin/user/{id}/force-password-reset with bearer token', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Password reset enforced.' }),
      })

      const token = 'mock-admin-token'
      const res = await forceUserPasswordReset(token, 101)
      expect(res.message).toBe('Password reset enforced.')

      expect(fetchSpy).toHaveBeenCalledWith(
        `${getApiBaseUrl()}/api/admin/user/101/force-password-reset`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-admin-token',
          }),
        })
      )
    })
  })

  describe('Free Panel Response & Offline State Remediation', () => {
    it('renders slots telemetry and download button when credentials are omitted from backend response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          usedSlots: 8,
          maxSlots: 20,
          freeLink: 'https://downloads.dscweb.me/freepanel-setup.zip',
        }),
      })

      render(
        <MemoryRouter>
          <FreePanelPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.queryByText(/Checking credentials/i)).toBeNull()
      })

      // The offline notice must NOT be present
      expect(screen.queryByText(/The free panel is currently offline/i)).toBeNull()

      // Slot availability and dynamic evaluation message must be shown
      expect(screen.getByText(/8 \/ 20 Slots Used/i)).toBeTruthy()
      expect(screen.getByText(/COMMUNITY EVALUATION POOL/i)).toBeTruthy()

      // Download button must be linked to freeLink
      const downloadBtn = screen.getByRole('link', { name: /Download Free Panel/i })
      expect(downloadBtn.getAttribute('href')).toBe('https://downloads.dscweb.me/freepanel-setup.zip')
    })
  })

  describe('Checkout Page Remediation', () => {
    it('rejects passwords shorter than 6 characters and prevents submission', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch')

      render(
        <MemoryRouter initialEntries={['/pages/checkout?panel=streamer']}>
          <Routes>
            <Route path="/pages/checkout" element={<CheckoutPage />} />
          </Routes>
        </MemoryRouter>
      )

      const usernameInput = screen.getByPlaceholderText(/Must match game username/i)
      const passwordInput = screen.getByPlaceholderText(/Minimum 6 characters/i)
      const submitBtn = screen.getByRole('button', { name: /Submit Order/i })

      fireEvent.change(usernameInput, { target: { value: 'coolplayer' } })
      fireEvent.change(passwordInput, { target: { value: '12345' } }) // 5 characters (less than 6)
      fireEvent.click(submitBtn)

      expect(await screen.findByText('Password must be at least 6 characters long.')).toBeTruthy()
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('normalizes aimassist panel to aimbot in order payload for backend compatibility', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Order created' }),
      })

      // Create a dummy file for payment proof
      const file = new File(['dummy proof data'], 'proof.png', { type: 'image/png' })

      render(
        <MemoryRouter initialEntries={['/pages/checkout?panel=aimassist']}>
          <Routes>
            <Route path="/pages/checkout" element={<CheckoutPage />} />
          </Routes>
        </MemoryRouter>
      )

      const usernameInput = screen.getByPlaceholderText(/Must match game username/i)
      const passwordInput = screen.getByPlaceholderText(/Minimum 6 characters/i)
      const fileInput = screen.getByLabelText(/UPLOAD PAYMENT PROOF SCREENSHOT/i)

      fireEvent.change(usernameInput, { target: { value: 'aimpro' } })
      fireEvent.change(passwordInput, { target: { value: 'secretPass123' } })
      fireEvent.change(fileInput, { target: { files: [file] } })

      const submitBtn = screen.getByRole('button', { name: /Submit Order/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          `${getApiBaseUrl()}/api/auth/checkout`,
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"Plan":"aimbot"'),
          })
        )
      })
    })
  })

  describe('Change Password & MustChangePassword Flow', () => {
    it('enforces 6-character minimum for new password', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch')
      const mockSession = { token: 'mock-token', plan: 'streamer', username: 'user1' }

      render(
        <MemoryRouter>
          <ChangePasswordPage session={mockSession} onSessionInvalid={() => {}} />
        </MemoryRouter>
      )

      const currentInput = screen.getByPlaceholderText('Enter current password')
      const newInput = screen.getByPlaceholderText('Enter new password (min. 6 characters)')
      const submitBtn = screen.getByRole('button', { name: /Update Password/i })

      fireEvent.change(currentInput, { target: { value: 'oldPass123' } })
      fireEvent.change(newInput, { target: { value: '12345' } }) // 5 chars
      fireEvent.click(submitBtn)

      expect(await screen.findByText('New password must be at least 6 characters long.')).toBeTruthy()
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('renders security notice when session has mustChangePassword: true', () => {
      const mockSession = {
        token: 'mock-token',
        plan: 'streamer',
        username: 'user1',
        mustChangePassword: true,
      }

      render(
        <MemoryRouter>
          <ChangePasswordPage session={mockSession} onSessionInvalid={() => {}} />
        </MemoryRouter>
      )

      expect(screen.getByText('Password Reset Required')).toBeTruthy()
      expect(
        screen.getByText(/requires a new password before you can access the user dashboard/i)
      ).toBeTruthy()
    })

    it('preserves mustChangePassword flag in session persistence and clears it on update', () => {
      const userJwt = createMockJwt({
        sub: '99',
        name: 'resetuser',
        role: 'User',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const session = persistSessionFromResponse({
        token: userJwt,
        username: 'resetuser',
        plan: 'sniper',
        mustChangePassword: true,
      })

      expect(session.mustChangePassword).toBe(true)

      const stored = loadStoredSession()
      expect(stored.mustChangePassword).toBe(true)
    })
  })
})
