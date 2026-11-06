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
import {
  evaluateSubscriptionExpiry,
  normalizeFreePanelResponse,
  TABLE_COLUMN_DEFINITIONS,
  resolveRecordField,
  getDatabaseRecordId,
} from '../utils/format'
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
    it('normalizes direct, PascalCase, mixed-case, and nested data/Data FreePanel payloads accurately', () => {
      // Lowercase populated
      const directLower = normalizeFreePanelResponse({
        freeUser: 'user_lower',
        freePass: 'pass_lower',
        usedSlots: 3,
        maxSlots: 15,
        freeLink: 'https://downloads.dscweb.me/panel.zip',
      })
      expect(directLower.hasValidCredentials).toBe(true)
      expect(directLower.freeUser).toBe('user_lower')
      expect(directLower.freePass).toBe('pass_lower')
      expect(directLower.usedSlots).toBe(3)
      expect(directLower.maxSlots).toBe(15)
      expect(directLower.hasValidDownloadUrl).toBe(true)

      // PascalCase populated
      const pascal = normalizeFreePanelResponse({
        FreeUser: 'user_pascal',
        FreePass: 'pass_pascal',
        UsedSlots: 0,
        MaxSlots: 10,
        FreeLink: 'https://downloads.dscweb.me/panel2.zip',
      })
      expect(pascal.hasValidCredentials).toBe(true)
      expect(pascal.freeUser).toBe('user_pascal')
      expect(pascal.freePass).toBe('pass_pascal')
      expect(pascal.usedSlots).toBe(0)
      expect(pascal.maxSlots).toBe(10)

      // Lowercase empty + PascalCase populated (must not let empty string shadow PascalCase value)
      const shadowed = normalizeFreePanelResponse({
        freeUser: '',
        FreeUser: 'valid_pascal_user',
        freePass: '   ',
        FreePass: 'valid_pascal_pass',
        usedSlots: 4,
        maxSlots: 20,
        freeLink: '',
        FreeLink: 'https://downloads.dscweb.me/recovered.zip',
      })
      expect(shadowed.hasValidCredentials).toBe(true)
      expect(shadowed.freeUser).toBe('valid_pascal_user')
      expect(shadowed.freePass).toBe('valid_pascal_pass')
      expect(shadowed.freeLink).toBe('https://downloads.dscweb.me/recovered.zip')
      expect(shadowed.hasValidDownloadUrl).toBe(true)

      // Nested data wrapper
      const wrapped = normalizeFreePanelResponse({
        data: {
          freeUsername: 'wrapped_user',
          freePassword: 'wrapped_pass',
          usedSlots: 2,
          freeMaxSlots: 12,
          freeDownloadLink: 'https://downloads.dscweb.me/wrapped.zip',
        },
      })
      expect(wrapped.hasValidCredentials).toBe(true)
      expect(wrapped.freeUser).toBe('wrapped_user')
      expect(wrapped.freePass).toBe('wrapped_pass')
      expect(wrapped.maxSlots).toBe(12)

      // Rejects non-primitive / object credentials so [object Object] never renders
      const invalidStructure = normalizeFreePanelResponse({
        freeUser: { nested: 'bad' },
        freePass: ['bad'],
        usedSlots: 'NaN',
        maxSlots: -5,
        freeLink: 'javascript:alert(1)',
      })
      expect(invalidStructure.hasValidCredentials).toBe(false)
      expect(invalidStructure.freeUser).toBe('')
      expect(invalidStructure.freePass).toBe('')
      expect(invalidStructure.usedSlots).toBe(0)
      expect(invalidStructure.maxSlots).toBe(10)
      expect(invalidStructure.hasValidDownloadUrl).toBe(false)
    })

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

    it('hides complete availability section when username or password is empty, whitespace-only, object-typed, or when only one exists', async () => {
      const cases = [
        { freeUser: '', freePass: '' },
        { freeUser: '   ', freePass: '   ' },
        { freeUser: 'eval_user', freePass: null },
        { freeUser: null, freePass: 'eval_pass' },
        { freeUser: 'eval_user', freePass: '' },
        { freeUser: '', freePass: 'eval_pass' },
        { freeUser: { bad: true }, freePass: 'eval_pass' },
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

    it('displays credentials, slot progress bar (0 and partial slots), download button, and copies credentials safely', async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextSpy },
      })

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          freeUser: '',
          FreeUser: 'dsc_free_trial',
          freePass: 'trial_pass_2026',
          usedSlots: 0,
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
      expect(screen.getByText('0 / 20 Slots Used')).toBeTruthy()
      expect(screen.queryByText('Free Panel Not Available')).toBeNull()
      expect(screen.queryByText('Slots Full')).toBeNull()

      const downloadBtn = screen.getByRole('link', { name: /Download Free Panel/i })
      expect(downloadBtn.getAttribute('href')).toBe('https://downloads.dscweb.me/freepanel-setup.zip')

      // Test safe copy buttons
      const copyButtons = screen.getAllByRole('button', { name: 'Copy' })
      fireEvent.click(copyButtons[0])
      await waitFor(() => {
        expect(writeTextSpy).toHaveBeenCalledWith('dsc_free_trial')
      })
    })

    it('renders disabled Download Link Unavailable button when credentials are valid but freeLink is missing or invalid', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          freeUser: 'dsc_free_trial',
          freePass: 'trial_pass_2026',
          usedSlots: 8,
          maxSlots: 20,
          freeLink: '',
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

      expect(screen.getByText('8 / 20 Slots Used')).toBeTruthy()
      expect(screen.queryByRole('link', { name: /Download Free Panel/i })).toBeNull()
      const unavailableBtn = screen.getByRole('button', { name: 'Download Link Unavailable' })
      expect(unavailableBtn.disabled).toBe(true)
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

    it('shows Free Panel Not Available message when API returns HTTP 500 or network error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'))

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

  describe('Owner DB Explicit Column Allowlisting, FreeSettings Separation & Record Safety', () => {
    it('resolves PascalCase/camelCase aliases without duplicate columns and rejects nested objects', () => {
      expect(Object.keys(TABLE_COLUMN_DEFINITIONS)).toEqual([
        'users',
        'settings',
        'freeSettings',
        'freeusers',
        'keys',
        'orders',
        'admins',
        'panelUpdates',
      ])

      const row = {
        username: '',
        Username: 'resolved_user',
        nestedObj: { secret: 'hidden' },
      }
      expect(resolveRecordField(row, ['username', 'Username'])).toBe('resolved_user')
      expect(resolveRecordField(row, ['nestedObj'])).toBeUndefined()
      expect(getDatabaseRecordId({ username: 'no_id_user' })).toBeNull()
      expect(getDatabaseRecordId({ Id: 42, username: 'has_id' })).toBe(42)
    })

    it('renders only allowlisted columns, blocks unknown/sensitive fields, and disables delete when database ID is missing', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const strUrl = String(url)
        if (strUrl.includes('/api/admin/users')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => [
              {
                id: 11,
                Username: 'alpha_player',
                Plan: 'sniper',
                ExpiryDate: '2027-01-01T00:00:00Z',
                HWID: 'HWID-11',
                IsBanned: false,
                MustChangePassword: false,
                PasswordHash: '$2a$11$secretHashValue',
                extraUnknownProp: 'SHOULD_NOT_RENDER_IN_TABLE',
                nestedMetadata: { internal: 'NO_RAW_JSON' },
              },
              {
                // Row missing database ID
                Username: 'missing_id_player',
                Plan: 'Temp',
                IsBanned: false,
                MustChangePassword: false,
              },
            ],
          }
        }
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => [],
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

      await waitFor(() => {
        expect(screen.getByText('alpha_player')).toBeTruthy()
      })

      // Sensitive or unknown properties must not appear in table headers or cells
      expect(screen.queryByText(/PasswordHash/i)).toBeNull()
      expect(screen.queryByText(/\$2a\$11\$secretHashValue/i)).toBeNull()
      expect(screen.queryByText(/extraUnknownProp/i)).toBeNull()
      expect(screen.queryByText(/SHOULD_NOT_RENDER_IN_TABLE/i)).toBeNull()
      expect(screen.queryByText(/NO_RAW_JSON/i)).toBeNull()

      // Missing ID row shows ID Missing badge and disables delete button
      expect(screen.getByText('ID Missing')).toBeTruthy()
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
      expect(deleteButtons[0].disabled).toBe(false)
      expect(deleteButtons[1].disabled).toBe(true)
    })

    it('displays only Free Panel Settings columns in freeSettings view while preserving full settings payload on save', async () => {
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
        if (strUrl.includes('/api/admin/settings/all')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({
              id: 1,
              LatestVersion: '2.4',
              MaintenanceReason: 'Scheduled upgrade',
              IsMaintenanceMode: false,
              StreamerLink: 'https://downloads.dscweb.me/streamer.zip',
              FreeUser: 'free_demo',
              FreePass: 'demo_pass_123',
              FreeValidDays: 7,
              MaxFreeSlots: 25,
              FreeLink: 'https://downloads.dscweb.me/free.zip',
            }),
          }
        }
        if (strUrl.includes('/api/admin/settings/update') && init?.method === 'PUT') {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ message: 'Settings updated.' }),
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

      const tableSelect = screen.getByRole('combobox')
      fireEvent.change(tableSelect, { target: { value: 'freeSettings' } })

      await waitFor(() => {
        expect(screen.getByText('free_demo')).toBeTruthy()
      })

      // In freeSettings table, general settings (Scheduled upgrade / streamer.zip) must not be shown as table cells
      expect(screen.queryByText('Scheduled upgrade')).toBeNull()
      expect(screen.queryByText('https://downloads.dscweb.me/streamer.zip')).toBeNull()
      expect(screen.getByText('Free Username')).toBeTruthy()
      expect(screen.getByText('Maximum Free Slots')).toBeTruthy()

      // Open Edit modal and update maxFreeSlots while preserving general settings
      fireEvent.click(screen.getByRole('button', { name: /Edit \/ Manage/i }))
      const maxSlotsInput = screen.getByDisplayValue('25')
      fireEvent.change(maxSlotsInput, { target: { value: '30' } })
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))

      await waitFor(() => {
        const updateCall = fetchSpy.mock.calls.find(([url]) =>
          String(url).includes('/api/admin/settings/update')
        )
        expect(updateCall).toBeTruthy()
        const sentBody = JSON.parse(updateCall[1].body)
        expect(sentBody.maxFreeSlots).toBe(30)
        expect(sentBody.latestVersion).toBe('2.4')
        expect(sentBody.maintenanceReason).toBe('Scheduled upgrade')
        expect(sentBody.streamerLink).toBe('https://downloads.dscweb.me/streamer.zip')
      })
    })

    it('hides CaptchaToken from Free Users table and modal while silently preserving it alongside EnvName on save', async () => {
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

      // CaptchaToken must be hidden from table columns and cells
      expect(screen.queryByText(/CaptchaToken/i)).toBeNull()
      expect(screen.queryByText('CAPTCHA-VERIFIED-TOKEN-XYZ')).toBeNull()

      // Open Edit modal
      fireEvent.click(screen.getByRole('button', { name: /Edit \/ Manage/i }))

      // Verify EnvName input has its initial value and CaptchaToken is not exposed in modal
      const envInput = screen.getByDisplayValue('DESKTOP-GAMING-PC')
      expect(envInput).toBeTruthy()
      expect(screen.queryByDisplayValue('CAPTCHA-VERIFIED-TOKEN-XYZ')).toBeNull()

      // Save updated EnvName and verify CaptchaToken is preserved silently in PUT body
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
