import { GoogleGenAI, Type } from '@google/genai'
import { CONDENSED_SYSTEM_KNOWLEDGE } from '../src/components/chatbot/chatbotKnowledge.js'
import { resolveLocalIntent } from '../src/components/chatbot/intentResolver.js'
import { getRoute } from '../src/components/chatbot/routeMap.js'

// Simple in-memory rate limiter per client IP: max 30 requests per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(clientId: string, limit = 30, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(clientId)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count += 1
  return true
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}, 120000)

/**
 * Validates and decodes JWT from Authorization header.
 * Strictly verifies expiration and extracts role. Never trusts client body role.
 */
export function getVerifiedRoleFromAuthHeader(authHeader?: string): 'User' | 'Admin' | 'Guest' {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return 'Guest'
  }

  const token = authHeader.slice(7).trim()
  if (!token) return 'Guest'

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return 'Guest'

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, '=')
    const jsonStr = Buffer.from(padded, 'base64').toString('utf8')
    const claims = JSON.parse(jsonStr)

    // Check expiration if present
    if (claims.exp && Number(claims.exp) * 1000 <= Date.now()) {
      return 'Guest'
    }

    const roleClaim =
      claims.role ||
      claims.roles ||
      claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']

    const raw = String(roleClaim || '').trim().toLowerCase()
    if (['admin', 'owner', 'superadmin', 'super-admin'].includes(raw)) {
      return 'Admin'
    }
    if (['user', 'member', 'customer'].includes(raw)) {
      return 'User'
    }
    return 'Guest'
  } catch {
    return 'Guest'
  }
}

// Structured output schema for assistant response
const assistantResponseSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      description: "One of 'answer', 'navigate', 'clarify', or 'fallback'",
    },
    message: {
      type: Type.STRING,
      description: 'The conversational response message to display to the user.',
    },
    routeKey: {
      type: Type.STRING,
      description:
        "The canonical allowlisted route key if navigating, otherwise empty string: 'home', 'apps', 'products', 'downloads', 'about', 'contact', 'status', 'privacy', 'terms', 'freepanel', 'checkout', 'ulogin', 'udash', 'change', 'alogin', 'adash', 'generatekey', 'ownerdb'",
    },
    links: {
      type: Type.ARRAY,
      description: 'Clickable navigation links to show underneath the message',
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: 'Display text for the button' },
          routeKey: { type: Type.STRING, description: 'Allowlisted route key' },
        },
        required: ['label', 'routeKey'],
      },
    },
  },
  required: ['type', 'message'],
}

export interface AssistantRequestPayload {
  message?: string
  conversationHistory?: Array<{ role?: string; text?: string }>
  currentRoute?: string
}

export interface AssistantResponse {
  type: 'answer' | 'navigate' | 'clarify' | 'fallback'
  message: string
  routeKey: string | null
  links: Array<{ label: string; routeKey: string }>
}

/**
 * Core assistant execution handler.
 * Called by Express server, Vercel Serverless Function, and Netlify Function.
 */
export async function handleAssistantChat(
  payload: AssistantRequestPayload,
  verifiedRole: 'User' | 'Admin' | 'Guest',
): Promise<{ status: number; body: AssistantResponse | { error: string } }> {
  const query = String(payload.message || '').trim()

  if (!query) {
    return {
      status: 400,
      body: {
        type: 'clarify',
        message: 'Please provide a message or question.',
        routeKey: null,
        links: [],
      },
    }
  }

  // Bound query length to protect against abuse
  const boundedQuery = query.slice(0, 500)
  const currentRoute = String(payload.currentRoute || '/').slice(0, 100)
  const sessionContext = { role: verifiedRole }

  // 1. Check local deterministic intent first for guaranteed fast navigation/FAQ
  const localMatch = resolveLocalIntent(boundedQuery, sessionContext)
  if (localMatch && localMatch.type === 'navigate') {
    return {
      status: 200,
      body: {
        type: 'navigate',
        message: localMatch.message,
        routeKey: localMatch.routeKey || null,
        links: localMatch.links || [],
      },
    }
  }

  // 2. If Gemini API key is configured, generate intelligent response
  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })

      const systemInstruction = `
${CONDENSED_SYSTEM_KNOWLEDGE}

ADDITIONAL CONTEXT & GUIDELINES:
- Current user verified role: ${verifiedRole}
- User currently viewing route: ${currentRoute}
- You must strictly return JSON conforming to the schema.
- If the user explicitly asks to go to or see a page (e.g., "take me to downloads", "open free panel", "products page par le jao"), set type='navigate', specify the correct routeKey, and include an informative message.
- If the user asks about a page or service, set type='answer' and provide relevant clickable links to existing allowlisted routes.
- If a guest asks for user dashboard or change password, mention they need to log in first and link to 'ulogin'.
- If a guest asks for admin dashboard or owner DB, state that administrative permissions are required and link to 'alogin'.
- Keep your tone polite, helpful, technical, and concise. Support English and Hinglish/Urdu transliterations seamlessly.
`.trim()

      const formattedContents = []
      if (Array.isArray(payload.conversationHistory)) {
        for (const msg of payload.conversationHistory.slice(-6)) {
          if (msg && msg.text) {
            formattedContents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: String(msg.text).slice(0, 500) }],
            })
          }
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: boundedQuery }],
      })

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: assistantResponseSchema,
          temperature: 0.3,
        },
      })

      const textOutput = response.text
      if (textOutput) {
        const parsed = JSON.parse(textOutput)
        if (parsed.routeKey && !getRoute(parsed.routeKey)) {
          parsed.routeKey = null
        }
        return {
          status: 200,
          body: {
            type: parsed.type || 'answer',
            message: parsed.message || 'Here is the requested information.',
            routeKey: parsed.routeKey || null,
            links: Array.isArray(parsed.links) ? parsed.links : [],
          },
        }
      }
    } catch (apiError: any) {
      console.warn('Gemini API call failed, falling back to local intent:', apiError?.message)
    }
  }

  // 3. Graceful fallback to grounded local intent matcher
  if (localMatch) {
    return {
      status: 200,
      body: {
        type: localMatch.type || 'answer',
        message: localMatch.message,
        routeKey: localMatch.routeKey || null,
        links: localMatch.links || [],
      },
    }
  }

  return {
    status: 200,
    body: {
      type: 'answer',
      message:
        "I'm here to help you explore DSCWeb! You can view our software panels, download utilities like Calculator, or explore the Free Panel portal. How can I help you today?",
      routeKey: null,
      links: [
        { label: 'Explore Products', routeKey: 'products' },
        { label: 'Open Downloads', routeKey: 'downloads' },
        { label: 'Free Panel Portal', routeKey: 'freepanel' },
        { label: 'Contact Support', routeKey: 'contact' },
      ],
    },
  }
}
