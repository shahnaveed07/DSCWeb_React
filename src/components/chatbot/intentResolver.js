/**
 * Deterministic Intent Resolver and Local FAQ Matcher for DSC AI Assistant.
 * Provides instant, guaranteed navigation and offline FAQ answering
 * for English, Hinglish, and transliterated user queries.
 */

import { evaluateRouteAccess, getRoute, ROUTE_MAP } from './routeMap'

// Common navigation intent verbs and indicators in English and Hinglish
const NAV_TRIGGERS = [
  'take me to',
  'go to',
  'open',
  'show me',
  'navigate to',
  'view',
  'bring me to',
  'visit',
  'switch to',
  'le chalo',
  'dikhao',
  'kholo',
  'chalo',
  'le jao',
  'jao',
  'bhejo',
  'dekhna hai',
]

/**
 * Normalizes input text for keyword searching.
 */
function cleanText(input = '') {
  return String(input || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Scans text to detect if the user's intent is navigational,
 * and if so, matches it to an allowlisted route key.
 */
export function detectNavigationIntent(queryText) {
  const text = cleanText(queryText)
  if (!text) return null

  // Check specific compound patterns first
  if (/(free panel|muft panel|free user|free pass)/.test(text)) {
    return 'freepanel'
  }
  if (/(change.*password|reset.*password|password.*badlo|update.*password)/.test(text)) {
    return 'change'
  }
  if (/(user dashboard|my dashboard|my account|my order|apna dashboard)/.test(text)) {
    return 'udash'
  }
  if (/(admin login|alogin|staff login)/.test(text)) {
    return 'alogin'
  }
  if (/(owner db|owner database|database manager)/.test(text)) {
    return 'ownerdb'
  }
  if (/(generate key|key generator|create key)/.test(text)) {
    return 'generatekey'
  }
  if (/(admin dashboard|admin panel|adash)/.test(text)) {
    return 'adash'
  }
  if (/(user login|ulogin|client login|sign in|signin)/.test(text)) {
    return 'ulogin'
  }
  if (/(privacy policy|privacy|data policy)/.test(text)) {
    return 'privacy'
  }
  if (/(terms of service|terms of use|terms|tos|conditions)/.test(text)) {
    return 'terms'
  }
  if (/(system status|server status|status page|is server down)/.test(text)) {
    return 'status'
  }
  if (/(checkout|purchase page|buy now|kharidna|payment page|how to pay)/.test(text)) {
    return 'checkout'
  }
  if (/(downloads|download center|download panel|install tool|files)/.test(text)) {
    return 'downloads'
  }
  if (/(products|software panels|catalog|packages|tiers|plans list)/.test(text)) {
    return 'products'
  }
  if (/(apps|applications|calculator|qr scanner|mind matrix|puzzle)/.test(text)) {
    return 'apps'
  }
  if (/(contact|support|discord|email|reach out|madad|rabta)/.test(text)) {
    return 'contact'
  }
  if (/(about us|about dsc|who is|developer|founder|naveed)/.test(text)) {
    return 'about'
  }
  if (/(home page|homepage|main page|wapas|shuruat)/.test(text)) {
    return 'home'
  }

  // Check each route's declared keywords
  for (const [routeKey, route] of Object.entries(ROUTE_MAP)) {
    for (const kw of route.keywords) {
      if (text.includes(kw)) {
        return routeKey
      }
    }
  }

  return null
}

/**
 * Checks whether the prompt is explicitly asking to navigate.
 */
function isExplicitNavRequest(text) {
  const cleaned = cleanText(text)
  return NAV_TRIGGERS.some((trigger) => cleaned.includes(trigger))
}

/**
 * High-confidence local FAQ answers for instant response.
 */
const FAQ_PATTERNS = [
  {
    regex: /(what is dsc|who is dsc|about dark skull|kya hai dsc|tell me about dsc)/i,
    response: {
      type: 'answer',
      message:
        'Dark Skull Corporation (DSC) is an independent software studio founded in 2026. We build focused desktop utilities (like Calculator), Android applications (QR Scanner | Generator, Mind Matrix), and verified software panels.',
      links: [
        { label: 'About DSC', routeKey: 'about' },
        { label: 'Explore Apps', routeKey: 'apps' },
      ],
    },
  },
  {
    regex: /(pricing|price list|cost|rates|kitne ka hai|daam kya hai|how much)/i,
    response: {
      type: 'answer',
      message:
        'DSC software panels feature flexible duration multipliers ($1 USD = 90 INR):\n' +
        '• FREE-PANEL: $0 (Shared public slots at /pages/freepanel)\n' +
        '• STREAMER-PANEL: $2 Base Rate ($1 for 1-day trial, $8 for 30 days)\n' +
        '• SPECIAL-PANEL (VIP): $3 Base Rate ($12 for 30 days, HWID lock, 24/7 VIP support)\n' +
        '• SNIPER-PANEL: $1 Base Rate ($4 for 30 days)\n' +
        '• AIM-ASSIST-PANEL: $1 Base Rate ($4 for 30 days)\n' +
        '• Premium & Customised: Starting at $5 and $10 (Coming Soon).',
      links: [
        { label: 'View Products Catalog', routeKey: 'products' },
        { label: 'Go to Checkout', routeKey: 'checkout' },
      ],
    },
  },
  {
    regex: /(how to buy|how to purchase|kaise kharidein|purchase process|order kaise karein|payment method)/i,
    response: {
      type: 'answer',
      message:
        'To purchase a panel:\n' +
        '1. Go to Products or Checkout and select your panel & duration.\n' +
        '2. Scan the dynamic UPI QR code or tap the UPI pay link (naveedmushtaq@ptyes).\n' +
        '3. Take a screenshot of the payment confirmation (UTR number visible, under 5MB).\n' +
        '4. Enter your desired username & password on the Checkout form, upload the proof, and submit.\n' +
        '5. Once verified by an admin, log in to view your license key on your User Dashboard.',
      links: [
        { label: 'Open Checkout', routeKey: 'checkout' },
        { label: 'View Products', routeKey: 'products' },
      ],
    },
  },
  {
    regex: /(free panel pass|free credentials|free username|muft panel|free slot)/i,
    response: {
      type: 'answer',
      message:
        'You can view live credentials for the Free Panel on our Free Panel Portal. It provides active username, password, live slot capacity (20 slots), and a direct package download.',
      links: [
        { label: 'Open Free Panel Portal', routeKey: 'freepanel' },
      ],
    },
  },
  {
    regex: /(discord link|discord server|community server|discord join)/i,
    response: {
      type: 'answer',
      message:
        'Join our official Dark Skull Corporation Discord community for live announcements, update notes, and support assistance: https://discord.gg/XB2Zjmsb7K',
      links: [
        { label: 'Contact & Community', routeKey: 'contact' },
      ],
    },
  },
  {
    regex: /(calculator|hisab kitab)/i,
    response: {
      type: 'answer',
      message:
        'Our Calculator is a fast, lightweight Windows desktop mathematics utility designed for everyday math workflows with zero bloat.',
      links: [
        { label: 'Download Calculator', routeKey: 'downloads' },
        { label: 'View Apps', routeKey: 'apps' },
      ],
    },
  },
  {
    regex: /(qr scanner|qr generator|barcode)/i,
    response: {
      type: 'answer',
      message:
        'Our QR Scanner | Generator is available on the Google Play Store for Android. It supports high-speed camera scanning and offline QR code generation with zero tracking.',
      links: [
        { label: 'Apps Showcase', routeKey: 'apps' },
      ],
    },
  },
]

/**
 * Resolves user query using deterministic local logic.
 * Returns null if the query is not confident enough and should fall back to Gemini.
 */
export function resolveLocalIntent(queryText, session = null) {
  const text = String(queryText || '').trim()
  if (!text) return null

  const targetRouteKey = detectNavigationIntent(text)
  const isNav = isExplicitNavRequest(text)

  // 1. If explicit navigation intent detected
  if (targetRouteKey && (isNav || text.split(/\s+/).length <= 4)) {
    const route = getRoute(targetRouteKey)
    const access = evaluateRouteAccess(targetRouteKey, session)

    if (!access.allowed) {
      return {
        type: 'navigate',
        message: access.message,
        routeKey: access.alternativeRouteKey || 'home',
        links: [
          {
            label: `Go to ${getRoute(access.alternativeRouteKey)?.title || 'Login'}`,
            routeKey: access.alternativeRouteKey || 'home',
          },
        ],
      }
    }

    return {
      type: 'navigate',
      message: `Sure! Taking you to ${route.title}.`,
      routeKey: route.key,
      links: [{ label: `Open ${route.title}`, routeKey: route.key }],
    }
  }

  // 2. Check FAQ patterns
  for (const faq of FAQ_PATTERNS) {
    if (faq.regex.test(text)) {
      return faq.response
    }
  }

  // 3. If there is a route key mentioned casually in question, offer it as a link
  if (targetRouteKey) {
    const route = getRoute(targetRouteKey)
    return {
      type: 'answer',
      message: `You can find information about ${route.title} on its page: ${route.description}`,
      routeKey: null,
      links: [{ label: `Open ${route.title}`, routeKey: route.key }],
    }
  }

  return null
}
