import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  checkRateLimit,
  getVerifiedRoleFromAuthHeader,
  handleAssistantChat,
} from './server/assistantHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// 1. Body parsing with strict size limits
app.use(express.json({ limit: '1mb' }))

// 2. Chatbot AI API Endpoint
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown'
  if (!checkRateLimit(clientIp, 30, 60000)) {
    return res.status(429).json({
      type: 'fallback',
      message: 'Too many requests. Please slow down and try again in a moment.',
      routeKey: null,
      links: [],
    })
  }

  // Strictly verify identity from Authorization token — do not trust client body role
  const verifiedRole = getVerifiedRoleFromAuthHeader(req.headers.authorization)

  try {
    const result = await handleAssistantChat(req.body, verifiedRole)
    return res.status(result.status).json(result.body)
  } catch (error: any) {
    console.error('Error handling assistant chat:', error)
    return res.status(500).json({
      type: 'fallback',
      message: 'An unexpected error occurred. Please try again shortly.',
      routeKey: null,
      links: [],
    })
  }
})

// 3. API 404 handler: Unmatched /api/* routes must return JSON, never SPA HTML
app.all('/api/{*splat}', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

// 4. Development mode (Vite middlewares) vs Production mode (Static + Express 5 SPA catch-all)
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  })
  app.use(vite.middlewares)
} else {
  // Static files from built dist directory
  app.use(express.static(path.resolve(__dirname, 'dist')))

  // Express 5 SPA Fallback: uses official /{splat} wildcard parameter
  app.get('/{*splat}', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })
}

// 5. Global Express error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DSCWeb server listening on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
