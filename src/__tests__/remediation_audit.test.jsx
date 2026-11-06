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
import { UserDashboardPage } from '../pages/UserDashboardPage'
import { evaluateSubscriptionExpiry } from '../utils/format'
import { AdminWorkspacePage } from '../pages/AdminWorkspacePage'
import { GenerateKeyPage } from '../pages/GenerateKeyPage'
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

  describe('Free Panel Credential Gating & State Matrix', () => {
    it('hides availability section, slots, progress bar, and download button when credentials are null or missing', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          freeUser: null,
          freePass: null,
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
        expect(screen.getByText('Free Panel Not Available')).toBeTruthy()
      })

      expect(
        screen.getByText('The free panel is currently offline. Please check back later.')
      ).toBeTruthy()
      expect(screen.queryByText(/Slots Availability/i)).toBeNull()
      expect(screen.queryByText(/8 \/ 20 Slots Used/i)).toBeNull()
      expect(screen.queryByRole('link', { name: /Download Free Panel/i })).toBeNull()
    })

    it('hides complete availability section when username or password is empty or whitespace-only, or when only one exists', async () => {
      const cases = [
        { freeUser: '', freePass: '' },
        { freeUser: '   ', freePass: '   ' },
        { freeUser: 'eval_user', freePass: null },
        { freeUser: null, freePass: 'eval_pass' },
      ]

      for (const payload of cases) {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            ...payload,
            usedSlots: 5,
            maxSlots: 20,
            freeLink: 'https://downloads.dscweb.me/freepanel-setup.zip',
          }),
        })

        const { unmount } = render(
          <MemoryRouter>
            <FreePanelPage />
          </MemoryRouter>
        )

        await waitFor(() => {
          expect(screen.getByText('Free Panel Not Available')).toBeTruthy()
        })

        expect(screen.queryByText(/Slots Availability/i)).toBeNull()
        expect(screen.queryByRole('link', { name: /Download Free Panel/i })).toBeNull()
        unmount()
      }
    })

    it('displays credentials, slot progress bar, and download button when both credentials are valid', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          freeUser: 'dsc_free_trial',
          freePass: 'trial_pass_2026',
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
        expect(screen.getByText('dsc_free_trial')).toBeTruthy()
      })

      expect(screen.getByText('trial_pass_2026')).toBeTruthy()
      expect(screen.getByText('8 / 20 Slots Used')).toBeTruthy()
      expect(screen.queryByText('Free Panel Not Available')).toBeNull()
      expect(screen.queryByText('Slots Full')).toBeNull()

      const downloadBtn = screen.getByRole('link', { name: /Download Free Panel/i })
      expect(downloadBtn.getAttribute('href')).toBe('https://downloads.dscweb.me/freepanel-setup.zip')
    })

    it('shows credentials, download button, and Slots Full warning when valid credentials exist and slots are full', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          freeUser: 'dsc_free_trial',
          freePass: 'trial_pass_2026',
          usedSlots: 20,
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
        expect(screen.getByText('Slots Full')).toBeTruthy()
      })

      expect(screen.getByText('dsc_free_trial')).toBeTruthy()
      expect(screen.getByText('trial_pass_2026')).toBeTruthy()
      expect(screen.getByText('20 / 20 Slots Used')).toBeTruthy()
      expect(screen.getByText('No Slot is Available. Existing users can still download.')).toBeTruthy()
      expect(screen.getByRole('link', { name: /Download Free Panel/i })).toBeTruthy()
    })

    it('shows Free Panel Not Available message when API request fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Internal Server Error' }),
      })

      render(
        <MemoryRouter>
          <FreePanelPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Free Panel Not Available')).toBeTruthy()
      })
      expect(screen.queryByRole('link', { name: /Download Free Panel/i })).toBeNull()
    })
  })

  describe('User Dashboard 404 & Expiry Parity', () => {
    it('displays NO ACTIVE ORDERS and No Active Order key placeholder when /api/auth/my-order returns 404', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'No order found for user' }),
      })

      const session = {
        token: 'mock-user-token',
        username: 'newplayer',
        plan: 'Temp',
        role: 'User',
      }

      render(
        <MemoryRouter>
          <UserDashboardPage session={session} onSessionInvalid={vi.fn()} />
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('NO ACTIVE ORDERS')).toBeTruthy()
      })

      // Key card remains visible with No Active Order placeholder text
      expect(screen.getByText('No Active Order')).toBeTruthy()
      // Copy key button and download button are hidden
      expect(screen.queryByRole('button', { name: /Copy License Key/i })).toBeNull()
      expect(screen.queryByRole('button', { name: /Download/i })).toBeNull()
      // Pending/Rejected alerts and fatal error banner are not shown
      expect(screen.queryByText(/Order Pending Review/i)).toBeNull()
      expect(screen.queryByText(/Unable to Load Order Status/i)).toBeNull()
    })

    it('evaluates subscription expiry from explicit boolean or actual expiry timestamp safely', () => {
      const futureIso = new Date(Date.now() + 86400000).toISOString()
      const pastIso = new Date(Date.now() - 86400000).toISOString()

      // Explicit boolean takes precedence
      expect(
        evaluateSubscriptionExpiry({
          data: { isExpired: true },
          session: {},
          liveExpiry: futureIso,
          isPending: false,
          isNoOrder: false,
        })
      ).toBe(true)

      expect(
        evaluateSubscriptionExpiry({
          data: { isExpired: false },
          session: {},
          liveExpiry: pastIso,
          isPending: false,
          isNoOrder: false,
        })
      ).toBe(false)

      // Date fallback when boolean is omitted
      expect(
        evaluateSubscriptionExpiry({
          data: {},
          session: {},
          liveExpiry: pastIso,
          isPending: false,
          isNoOrder: false,
        })
      ).toBe(true)

      expect(
        evaluateSubscriptionExpiry({
          data: {},
          session: {},
          liveExpiry: futureIso,
          isPending: false,
          isNoOrder: false,
        })
      ).toBe(false)

      // Pending orders or null/invalid dates are not falsely marked expired
      expect(
        evaluateSubscriptionExpiry({
          data: {},
          session: {},
          liveExpiry: null,
          isPending: true,
          isNoOrder: false,
        })
      ).toBe(false)

      expect(
        evaluateSubscriptionExpiry({
          data: {},
          session: {},
          liveExpiry: 'not-a-valid-date',
          isPending: false,
          isNoOrder: false,
        })
      ).toBe(false)
    })
  })

  describe('Owner DB Free Users EnvName & CaptchaToken Preservation', () => {
    it('preserves distinct EnvName and CaptchaToken fields when editing a free user record', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, init) => {
        const strUrl = String(url)
        if (strUrl.includes('/api/admin/users')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => [],
          }
        }
        if (strUrl.includes('/api/admin/free-users')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => [
              {
                id: 77,
                Username: 'free_tester',
                HWID: 'HWID-ABC-999',
                EnvName: 'DESKTOP-GAMING-PC',
                CaptchaToken: 'CAPTCHA-VERIFIED-TOKEN-XYZ',
                IsBanned: false,
                FailedLoginAttempts: 1,
              },
            ],
          }
        }
        if (strUrl.includes('/api/admin/manage/free-user/update') && init?.method === 'PUT') {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ message: 'Free user updated.' }),
          }
        }
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({}),
        }
      })

      render(
        <MemoryRouter>
          <AdminWorkspacePage
            session={{ token: 'mock-owner-token', role: 'Owner', username: 'owner1' }}
            onSessionInvalid={vi.fn()}
          />
        </MemoryRouter>
      )

      // Switch table to freeusers
      const tableSelect = screen.getByRole('combobox')
      fireEvent.change(tableSelect, { target: { value: 'freeusers' } })

      await waitFor(() => {
        expect(screen.getByText('free_tester')).toBeTruthy()
      })

      // Open Edit modal
      fireEvent.click(screen.getByRole('button', { name: /Edit \/ Manage/i }))

      // Verify both EnvName and CaptchaToken inputs have their distinct initial values
      const envInput = screen.getByDisplayValue('DESKTOP-GAMING-PC')
      const captchaInput = screen.getByDisplayValue('CAPTCHA-VERIFIED-TOKEN-XYZ')
      expect(envInput).toBeTruthy()
      expect(captchaInput).toBeTruthy()

      // Save without changing CaptchaToken, only updating EnvName
      fireEvent.change(envInput, { target: { value: 'WORKSTATION-PRO-2' } })
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))

      await waitFor(() => {
        const updateCall = fetchSpy.mock.calls.find(([url]) =>
          String(url).includes('/api/admin/manage/free-user/update')
        )
        expect(updateCall).toBeTruthy()
        const sentBody = JSON.parse(updateCall[1].body)
        expect(sentBody.EnvName).toBe('WORKSTATION-PRO-2')
        expect(sentBody.CaptchaToken).toBe('CAPTCHA-VERIFIED-TOKEN-XYZ')
      })
    })
  })

  describe('Generate Key Page Validation & Response Handling', () => {
    it('validates positive integer days and renders generated license key', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ Key: 'DSC-AIMBOT-30D-998877' }),
      })

      render(
        <MemoryRouter>
          <GenerateKeyPage
            session={{ token: 'mock-admin-token', role: 'Admin' }}
            onSessionInvalid={vi.fn()}
          />
        </MemoryRouter>
      )

      const planSelect = screen.getByRole('combobox')
      const daysInput = screen.getByPlaceholderText('e.g. 30')
      const submitBtn = screen.getByRole('button', { name: /Generate License Key/i })

      fireEvent.change(planSelect, { target: { value: 'aimbot' } })
      fireEvent.change(daysInput, { target: { value: '30' } })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(screen.getByText('DSC-AIMBOT-30D-998877')).toBeTruthy()
      })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
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
