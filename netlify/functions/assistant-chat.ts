import {
  checkRateLimit,
  getVerifiedRoleFromAuthHeader,
  handleAssistantChat,
} from '../../server/assistantHandler.js'

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    }
  }

  const clientIp =
    event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'

  if (!checkRateLimit(clientIp, 30, 60000)) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'fallback',
        message: 'Too many requests. Please slow down and try again in a moment.',
        routeKey: null,
        links: [],
      }),
    }
  }

  const authHeader = event.headers.authorization || event.headers.Authorization
  const verifiedRole = getVerifiedRoleFromAuthHeader(authHeader)

  let body = {}
  try {
    body = event.body ? JSON.parse(event.body) : {}
  } catch {
    body = {}
  }

  try {
    const result = await handleAssistantChat(body, verifiedRole)
    return {
      statusCode: result.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.body),
    }
  } catch (error: any) {
    console.error('Netlify function error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'fallback',
        message: 'An unexpected error occurred. Please try again shortly.',
        routeKey: null,
        links: [],
      }),
    }
  }
}
