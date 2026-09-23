import { authHeader } from '../utils/auth'
import { normalizeCollection } from '../utils/format'

const DEFAULT_API_BASE_URL = 'https://dscauth.onrender.com'

function getApiBaseUrl() {
  const configured = String(import.meta.env.VITE_API_BASE_URL || '').trim()
  return configured || DEFAULT_API_BASE_URL
}

const API_BASE_URL = getApiBaseUrl()

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = details.status || 0
    this.payload = details.payload
  }
}

function buildUrl(path) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

async function readPayload(response) {
  const contentType = String(response.headers.get('content-type') || '').toLowerCase()
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return {}
    }
  }

  try {
    return await response.text()
  } catch {
    return ''
  }
}

export function extractApiMessage(payload, fallbackMessage) {
  if (typeof payload === 'string' && payload.trim()) return payload.trim()
  if (typeof payload?.error === 'string' && payload.error.trim()) return payload.error.trim()
  if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message.trim()
  if (typeof payload?.title === 'string' && payload.title.trim()) return payload.title.trim()
  return fallbackMessage
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    token,
    headers = {},
    signal,
  } = options

  const mergedHeaders = {
    Accept: 'application/json',
    ...authHeader(token),
    ...headers,
  }

  const requestInit = {
    method,
    headers: mergedHeaders,
    cache: 'no-store',
    signal,
  }

  if (body !== undefined) {
    mergedHeaders['Content-Type'] = 'application/json'
    requestInit.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const response = await fetch(buildUrl(path), requestInit)
  const payload = await readPayload(response)

  if (!response.ok) {
    throw new ApiError(extractApiMessage(payload, 'Request failed.'), {
      status: response.status,
      payload,
    })
  }

  return payload
}

export function isAuthError(error) {
  return error instanceof ApiError && [401, 403].includes(error.status)
}

export function getSystemStatus(signal) {
  return request('/api/admin/system-status', { signal })
}

export function getFreePanelStatus(signal) {
  return request('/api/public/free-panel', { signal })
}

export function loginUser(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: {
      username: String(credentials.username || '').trim().toLowerCase(),
      password: credentials.password,
      HWID: 'WEB-CLIENT',
    },
  })
}

export function loginAdmin(credentials) {
  return request('/api/admin/login', {
    method: 'POST',
    body: {
      username: String(credentials.username || '').trim().toLowerCase(),
      password: credentials.password,
    },
  })
}

export function getCurrentOrder(token, signal) {
  return request('/api/auth/my-order', { token, signal })
}

export function changePassword(token, currentPassword, newPassword) {
  return request('/api/auth/change-password', {
    method: 'POST',
    token,
    body: { currentPassword, newPassword },
  })
}

export function submitCheckout(order) {
  return request('/api/auth/checkout', {
    method: 'POST',
    body: order,
  })
}

export function getSecureDownload(token, plan) {
  return request(`/api/auth/download?plan=${encodeURIComponent(plan)}`, {
    token,
  })
}

export async function getAdminSnapshot(token) {
  const [users, orders, settings, ownerAccess] = await Promise.allSettled([
    request('/api/admin/users', { token }),
    request('/api/admin/orders/pending', { token }),
    request('/api/admin/settings/all', { token }),
    request('/api/admin/owner/probe', { token }),
  ])

  return {
    users,
    orders,
    settings,
    ownerAccess,
  }
}

export function generateAdminKey(token, plan, validDays) {
  return request('/api/admin/generate', {
    method: 'POST',
    token,
    body: { plan, validDays },
  })
}

export function updateAdminUser(token, user) {
  return request('/api/admin/user/update', { method: 'PUT', token, body: user })
}

export function deleteAdminUser(token, id) {
  return request(`/api/admin/user/delete/${encodeURIComponent(id)}`, { method: 'DELETE', token })
}

export function processAdminOrder(token, id, action) {
  return request(`/api/admin/orders/${action}/${encodeURIComponent(id)}`, {
    method: 'POST', token, body: {},
  })
}

export function createAdminAccount(token, username, password) {
  return request('/api/admin/create-admin', { method: 'POST', token, body: { username, password } })
}

export function changeAdminPassword(token, currentPassword, newPassword) {
  return request('/api/admin/change-password', {
    method: 'POST', token, body: { currentPassword, newPassword },
  })
}

export function toggleMaintenance(token, isMaintenanceMode) {
  return request('/api/admin/maintenance/toggle', {
    method: 'POST', token,
    body: { isMaintenanceMode, IsMaintenanceMode: isMaintenanceMode },
  })
}

export async function checkOwnerAccess(token) {
  try {
    await request('/api/admin/owner/probe', { token })
    return true
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) return false
    throw error
  }
}

const ownerTables = {
  users: '/api/admin/users', keys: '/api/admin/keys', admins: '/api/admin/manage/admins',
  orders: '/api/admin/orders/all', settings: '/api/admin/settings/all',
  freeSettings: '/api/admin/settings/all', freeusers: '/api/admin/free-users',
  panelUpdates: '/api/auth/panel-updates',
}

export function getOwnerTable(token, table) {
  return request(ownerTables[table], { token })
}

export function updateOwnerRecord(token, table, record) {
  const configs = {
    users: ['/api/admin/user/update', 'PUT'], keys: ['/api/admin/manage/key', 'PUT'],
    admins: ['/api/admin/manage/admin', 'PUT'], orders: ['/api/admin/orders/update', 'PUT'],
    settings: ['/api/admin/settings/update', 'PUT'], freeSettings: ['/api/admin/settings/update', 'PUT'],
    freeusers: ['/api/admin/manage/free-user/update', 'PUT'],
    panelUpdates: ['/api/auth/panel-updates/save', 'PUT'],
  }
  const [path, method] = configs[table]
  return request(path, { method, token, body: record })
}

export function deleteOwnerRecord(token, table, id) {
  const paths = {
    users: `/api/admin/user/delete/${encodeURIComponent(id)}`,
    keys: `/api/admin/manage/key/delete/${encodeURIComponent(id)}`,
    admins: `/api/admin/manage/admin/delete/${encodeURIComponent(id)}`,
    orders: `/api/admin/orders/delete/${encodeURIComponent(id)}`,
    freeusers: `/api/admin/manage/free-user/delete/${encodeURIComponent(id)}`,
  }
  if (!paths[table]) throw new Error('Delete is unavailable for this table.')
  return request(paths[table], { method: 'DELETE', token })
}

export function mapAdminUsers(payload) {
  return normalizeCollection(payload, ['users', 'Users'])
}

export function mapPendingOrders(payload) {
  return normalizeCollection(payload, ['orders', 'Orders', 'pendingOrders'])
}

export function mapSettingsRecord(payload) {
  if (Array.isArray(payload)) return payload[0] || {}
  if (Array.isArray(payload?.settings)) return payload.settings[0] || {}
  if (Array.isArray(payload?.Settings)) return payload.Settings[0] || {}
  if (payload?.data && typeof payload.data === 'object') return payload.data
  return payload || {}
}

export { API_BASE_URL }
