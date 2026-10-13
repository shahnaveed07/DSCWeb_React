import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenAI, Type } from '@google/genai'
import { CONDENSED_SYSTEM_KNOWLEDGE } from './src/components/chatbot/chatbotKnowledge.js'
import { resolveLocalIntent } from './src/components/chatbot/intentResolver.js'
import { getRoute } from './src/components/chatbot/routeMap.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

app.use(express.json())

// Assistant response schema for structured JSON output
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

// Server-side AI Assistant endpoint
app.post('/api/assistant/chat', async (req, res) => {
  const { message, conversationHistory = [], currentRoute = '/', role = 'Guest' } = req.body || {}
  const query = String(message || '').trim()

  if (!query) {
    return res.status(400).json({
      type: 'clarify',
      message: 'Please provide a message or question.',
      routeKey: null,
      links: [],
    })
  }

  // 1. Check local deterministic intent first for fast navigation response
  const localMatch = resolveLocalIntent(query, { role })
  if (localMatch && localMatch.type === 'navigate') {
    return res.json(localMatch)
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
- Current user role: ${role}
- User currently viewing route: ${currentRoute}
- You must strictly return JSON conforming to the schema.
- If the user explicitly asks to go to or see a page (e.g., "take me to downloads", "open free panel", "products page par le jao"), set type='navigate', specify the correct routeKey, and include an informative message.
- If the user asks about a page or service, set type='answer' and provide relevant clickable links to existing allowlisted routes.
- If a guest asks for user dashboard or change password, mention they need to log in first and link to 'ulogin'.
- If a guest asks for admin dashboard or owner DB, state that administrative permissions are required and link to 'alogin'.
- Keep your tone polite, helpful, technical, and concise. Support English and Hinglish/Urdu transliterations seamlessly.
`.trim()

      const formattedContents = []
      if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory.slice(-6)) {
          if (msg && msg.text) {
            formattedContents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: String(msg.text) }],
            })
          }
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: query }],
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
        // Validate routeKey
        if (parsed.routeKey && !getRoute(parsed.routeKey)) {
          parsed.routeKey = null
        }
        return res.json(parsed)
      }
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to local intent:', apiError?.message)
    }
  }

  // 3. Graceful fallback to grounded local intent matcher
  if (localMatch) {
    return res.json(localMatch)
  }

  return res.json({
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
  })
})

// Development mode with Vite middlewares vs Production static serving
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  })
  app.use(vite.middlewares)
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DSCWeb server listening on http://0.0.0.0:${PORT}`)
})
