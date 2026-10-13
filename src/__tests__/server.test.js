import { describe, expect, it } from 'vitest'
import {
  checkRateLimit,
  getVerifiedRoleFromAuthHeader,
  handleAssistantChat,
} from '../../server/assistantHandler'

describe('Server Assistant Handler & Security', () => {
  it('correctly verifies role from valid JWT token header', () => {
    // Valid user token with future expiry
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    const userPayload = Buffer.from(JSON.stringify({ role: 'User', exp: futureExp })).toString('base64url')
    const userHeader = `Bearer header.${userPayload}.signature`
    expect(getVerifiedRoleFromAuthHeader(userHeader)).toBe('User')

    // Valid admin token
    const adminPayload = Buffer.from(JSON.stringify({ role: 'Admin', exp: futureExp })).toString('base64url')
    const adminHeader = `Bearer header.${adminPayload}.signature`
    expect(getVerifiedRoleFromAuthHeader(adminHeader)).toBe('Admin')
  })

  it('defaults to Guest for expired tokens, invalid headers, or missing tokens', () => {
    // Expired token
    const pastExp = Math.floor(Date.now() / 1000) - 3600
    const expiredPayload = Buffer.from(JSON.stringify({ role: 'Admin', exp: pastExp })).toString('base64url')
    const expiredHeader = `Bearer header.${expiredPayload}.signature`
    expect(getVerifiedRoleFromAuthHeader(expiredHeader)).toBe('Guest')

    // Garbage / malformed header
    expect(getVerifiedRoleFromAuthHeader('Bearer invalid-token')).toBe('Guest')
    expect(getVerifiedRoleFromAuthHeader('')).toBe('Guest')
    expect(getVerifiedRoleFromAuthHeader(undefined)).toBe('Guest')
  })

  it('handles assistant queries with empty message gracefully', async () => {
    const res = await handleAssistantChat({ message: '' }, 'Guest')
    expect(res.status).toBe(400)
    expect(res.body.type).toBe('clarify')
  })

  it('resolves deterministic navigation intent accurately', async () => {
    const res = await handleAssistantChat({ message: 'Take me to the products page' }, 'Guest')
    expect(res.status).toBe(200)
    expect(res.body.type).toBe('navigate')
    expect(res.body.routeKey).toBe('products')
  })

  it('protects user dashboard from unauthenticated callers', async () => {
    const res = await handleAssistantChat({ message: 'Open my dashboard' }, 'Guest')
    expect(res.status).toBe(200)
    expect(res.body.type).toBe('navigate')
    expect(res.body.routeKey).toBe('ulogin')
    expect(res.body.message).toContain('protected')
  })

  it('permits authenticated users to be routed to user dashboard', async () => {
    const res = await handleAssistantChat({ message: 'Open my dashboard' }, 'User')
    expect(res.status).toBe(200)
    expect(res.body.type).toBe('navigate')
    expect(res.body.routeKey).toBe('udash')
  })

  it('enforces rate limits per client IP', () => {
    const testIp = 'test-client-ip-rate-check'
    // First 5 requests should pass with limit 5
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(testIp, 5, 10000)).toBe(true)
    }
    // 6th request must be rejected
    expect(checkRateLimit(testIp, 5, 10000)).toBe(false)
  })
})
