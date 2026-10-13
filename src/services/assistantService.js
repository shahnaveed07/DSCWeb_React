/**
 * Client-Side Assistant Service for DSC AI Assistant.
 * Coordinates between server-side Gemini endpoint and local deterministic intent resolution.
 */

import { evaluateRouteAccess, getRoute } from '../components/chatbot/routeMap'
import { resolveLocalIntent } from '../components/chatbot/intentResolver'

/**
 * Validates and sanitizes a response payload from the model or local intent.
 */
export function validateAssistantResponse(payload, session = null) {
  if (!payload || typeof payload !== 'object') {
    return {
      type: 'fallback',
      message: 'I am here to help you navigate and explore DSCWeb. What page or service are you looking for?',
      routeKey: null,
      links: [
        { label: 'Explore Products', routeKey: 'products' },
        { label: 'Open Downloads', routeKey: 'downloads' },
        { label: 'Free Panel', routeKey: 'freepanel' },
      ],
    }
  }

  const validTypes = ['answer', 'navigate', 'clarify', 'fallback']
  const type = validTypes.includes(payload.type) ? payload.type : 'answer'
  let routeKey = payload.routeKey ? String(payload.routeKey).toLowerCase().trim() : null

  // Ensure routeKey exists in allowlisted map
  if (routeKey && !getRoute(routeKey)) {
    routeKey = null
  }

  // Enforce security access check if navigation is requested
  let message = typeof payload.message === 'string' && payload.message.trim()
    ? payload.message.trim()
    : 'Here is what I found.'

  if (type === 'navigate' && routeKey) {
    const access = evaluateRouteAccess(routeKey, session)
    if (!access.allowed) {
      message = access.message
      routeKey = access.alternativeRouteKey || null
    }
  }

  // Sanitize links to allowlisted routes only
  const links = Array.isArray(payload.links)
    ? payload.links
        .filter((l) => l && l.routeKey && getRoute(l.routeKey))
        .map((l) => ({
          label: String(l.label || getRoute(l.routeKey).title),
          routeKey: String(l.routeKey).toLowerCase().trim(),
        }))
        .slice(0, 4)
    : []

  return {
    type,
    message,
    routeKey,
    links,
  }
}

/**
 * Main query dispatcher for the assistant.
 */
export async function sendAssistantMessage({
  message,
  conversationHistory = [],
  currentRoute = '/',
  session = null,
  signal,
}) {
  const trimmed = String(message || '').trim()
  if (!trimmed) {
    return {
      type: 'clarify',
      message: 'Please ask a question or tell me which page you would like to visit.',
      routeKey: null,
      links: [],
    }
  }

  // 1. Check for immediate explicit local navigation or FAQ match
  const localMatch = resolveLocalIntent(trimmed, session)
  if (localMatch && localMatch.type === 'navigate') {
    return validateAssistantResponse(localMatch, session)
  }

  // 2. Attempt server-side Gemini completion
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`
    }

    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers,
      signal,
      body: JSON.stringify({
        message: trimmed,
        conversationHistory: conversationHistory.slice(-8), // Send recent context only
        currentRoute,
        role: session?.role || 'Guest',
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data && (data.type || data.message)) {
        return validateAssistantResponse(data, session)
      }
    }
  } catch (error) {
    // Network failure, aborted, or server not running — fall through to graceful local fallback
    if (error?.name === 'AbortError') {
      throw error
    }
  }

  // 3. Fallback to local deterministic FAQ or friendly guidance
  if (localMatch) {
    return validateAssistantResponse(localMatch, session)
  }

  return {
    type: 'fallback',
    message:
      "I'm here to help you explore DSCWeb! You can check our software panels, download utilities, or view the free panel credentials. Where would you like to go?",
    routeKey: null,
    links: [
      { label: 'Explore Products', routeKey: 'products' },
      { label: 'Open Downloads', routeKey: 'downloads' },
      { label: 'Free Panel Portal', routeKey: 'freepanel' },
      { label: 'Contact Support', routeKey: 'contact' },
    ],
  }
}
