import type { Request, Response } from 'express'
import {
  checkRateLimit,
  getVerifiedRoleFromAuthHeader,
  handleAssistantChat,
} from '../../server/assistantHandler.js'

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown'
  if (!checkRateLimit(clientIp, 30, 60000)) {
    return res.status(429).json({
      type: 'fallback',
      message: 'Too many requests. Please slow down and try again in a moment.',
      routeKey: null,
      links: [],
    })
  }

  const verifiedRole = getVerifiedRoleFromAuthHeader(req.headers.authorization)

  try {
    const result = await handleAssistantChat(req.body, verifiedRole)
    return res.status(result.status).json(result.body)
  } catch (error: any) {
    console.error('Vercel serverless function error:', error)
    return res.status(500).json({
      type: 'fallback',
      message: 'An unexpected error occurred. Please try again shortly.',
      routeKey: null,
      links: [],
    })
  }
}
