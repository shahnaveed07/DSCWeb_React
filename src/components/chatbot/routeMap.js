/**
 * Central Allowlisted Route Map for DSC AI Assistant.
 * Strictly defines valid navigation targets and security constraints.
 * No arbitrary navigation outside this map is permitted.
 */

export const ROUTE_MAP = {
  home: {
    key: 'home',
    path: '/',
    title: 'Home',
    description: 'Dark Skull Corporation homepage with overview, featured projects, and core principles.',
    requiresAuth: null,
    keywords: ['home', 'main', 'start', 'index', 'homepage', 'ghar', 'wapas', 'shuruat'],
  },
  apps: {
    key: 'apps',
    path: '/pages/apps',
    title: 'Applications',
    description: 'Showcase of software applications including Calculator, QR Scanner, Mind Matrix, and upcoming roadmap.',
    requiresAuth: null,
    keywords: ['apps', 'applications', 'software', 'calculator', 'qr scanner', 'mind matrix', 'games', 'puzzle'],
  },
  products: {
    key: 'products',
    path: '/pages/products',
    title: 'Products & Software Panels',
    description: 'Complete catalog of software panels (Free, Streamer, Special VIP, Sniper, Aim Assist, Premium, Customised).',
    requiresAuth: null,
    keywords: ['products', 'panels', 'catalog', 'pricing', 'plans', 'streamer', 'special', 'sniper', 'aimassist', 'rates', 'cheezon', 'daam'],
  },
  downloads: {
    key: 'downloads',
    path: '/pages/downloads',
    title: 'Downloads Center',
    description: 'Direct downloads for verified binaries, utilities, and free panel package archives.',
    requiresAuth: null,
    keywords: ['download', 'downloads', 'installer', 'files', 'package', 'setup', 'apk', 'binary', 'download link'],
  },
  about: {
    key: 'about',
    path: '/pages/about',
    title: 'About DSC',
    description: 'Information about Dark Skull Corporation, mission, engineering principles, and lead developer Naveed Mushtaq.',
    requiresAuth: null,
    keywords: ['about', 'company', 'developer', 'who is', 'studio', 'naveed mushtaq', 'founder', 'history'],
  },
  contact: {
    key: 'contact',
    path: '/pages/contact',
    title: 'Contact & Support',
    description: 'Official communication channels: Email, Discord community server, and GitHub.',
    requiresAuth: null,
    keywords: ['contact', 'support', 'help', 'email', 'discord', 'madad', 'rabta', 'reach out', 'ticket'],
  },
  status: {
    key: 'status',
    path: '/pages/status',
    title: 'System Status',
    description: 'Live system operation status, updates, and maintenance notifications.',
    requiresAuth: null,
    keywords: ['status', 'uptime', 'maintenance', 'server status', 'down', 'live', 'working', 'halaat'],
  },
  privacy: {
    key: 'privacy',
    path: '/pages/privacy-policy',
    title: 'Privacy Policy',
    description: 'Policy governing information collection, device permissions, and data protection.',
    requiresAuth: null,
    keywords: ['privacy', 'policy', 'data', 'terms of privacy', 'security policy', 'rules'],
  },
  terms: {
    key: 'terms',
    path: '/pages/terms',
    title: 'Terms of Service',
    description: 'Terms of use, platform agreements, and software licensing guidelines.',
    requiresAuth: null,
    keywords: ['terms', 'tos', 'conditions', 'license agreement', 'legal'],
  },
  freepanel: {
    key: 'freepanel',
    path: '/pages/freepanel',
    title: 'Free Panel Portal',
    description: 'Live slot tracker, available username and password credentials, and free package download.',
    requiresAuth: null,
    keywords: ['free panel', 'freepanel', 'free user', 'free password', 'free pass', 'slots', 'free access', 'muft panel'],
  },
  checkout: {
    key: 'checkout',
    path: '/pages/checkout',
    title: 'Checkout & Purchase',
    description: 'Order placement with plan duration multiplier, UPI QR payment, and payment screenshot proof upload.',
    requiresAuth: null,
    keywords: ['checkout', 'buy', 'purchase', 'order', 'pay', 'payment', 'upi', 'qr code', 'kharidna', 'bill'],
  },
  ulogin: {
    key: 'ulogin',
    path: '/pages/ulogin',
    title: 'User Login',
    description: 'Client authentication portal for account holders to access their dashboard and licenses.',
    requiresAuth: null,
    keywords: ['login', 'user login', 'sign in', 'account', 'signin', 'dakhil'],
  },
  udash: {
    key: 'udash',
    path: '/pages/udash',
    title: 'User Dashboard',
    description: 'Protected client portal displaying subscription status, issued license key, and secure binary download.',
    requiresAuth: 'User',
    keywords: ['dashboard', 'my account', 'my order', 'key', 'license key', 'my dashboard', 'user dash'],
  },
  change: {
    key: 'change',
    path: '/pages/change',
    title: 'Change Password',
    description: 'Protected security settings page for authenticated users to update their account password.',
    requiresAuth: 'User',
    keywords: ['change password', 'update password', 'reset password', 'password badlo', 'new password'],
  },
  alogin: {
    key: 'alogin',
    path: '/pages/alogin',
    title: 'Admin Login',
    description: 'Restricted administrative entry portal for authorized staff members.',
    requiresAuth: null,
    keywords: ['admin login', 'staff login', 'admin signin', 'manager login'],
  },
  adash: {
    key: 'adash',
    path: '/pages/adash',
    title: 'Admin Dashboard',
    description: 'Protected administrative control panel for reviewing pending orders, user management, and maintenance toggles.',
    requiresAuth: 'Admin',
    keywords: ['admin dashboard', 'admin panel', 'order approvals', 'manage users', 'adash'],
  },
  generatekey: {
    key: 'generatekey',
    path: '/pages/generatekey',
    title: 'Generate License Key',
    description: 'Protected administrative tool to generate valid software license keys for specified plans and days.',
    requiresAuth: 'Admin',
    keywords: ['generate key', 'create key', 'issue key', 'key generator', 'new key'],
  },
  ownerdb: {
    key: 'ownerdb',
    path: '/pages/ownerdb',
    title: 'Owner Database Manager',
    description: 'Protected database management console for verified Owners to inspect and manage all 8 database collections.',
    requiresAuth: 'Owner',
    keywords: ['owner db', 'ownerdb', 'database', 'manage database', 'owner console'],
  },
}

/**
 * Resolves a route key to its route definition.
 */
export function getRoute(routeKey) {
  if (!routeKey) return null
  const normalized = String(routeKey).toLowerCase().trim()
  return ROUTE_MAP[normalized] || null
}

/**
 * Evaluates whether a route can be directly navigated to given the current session,
 * or whether authentication / authorization is required.
 */
export function evaluateRouteAccess(routeKey, session = null) {
  const route = getRoute(routeKey)
  if (!route) {
    return {
      allowed: false,
      reason: 'unknown_route',
      message: 'This destination does not exist on DSCWeb.',
      targetPath: '/',
    }
  }

  // Public route
  if (!route.requiresAuth) {
    return {
      allowed: true,
      route,
      targetPath: route.path,
    }
  }

  // Requires 'User' role
  if (route.requiresAuth === 'User') {
    const isUserOrAdmin = session?.role === 'User' || session?.role === 'Admin'
    if (isUserOrAdmin) {
      return { allowed: true, route, targetPath: route.path }
    }
    return {
      allowed: false,
      reason: 'requires_user_login',
      message: `The ${route.title} is protected for active account holders. Please log in first.`,
      targetPath: '/pages/ulogin',
      alternativeRouteKey: 'ulogin',
    }
  }

  // Requires 'Admin' role
  if (route.requiresAuth === 'Admin') {
    if (session?.role === 'Admin') {
      return { allowed: true, route, targetPath: route.path }
    }
    return {
      allowed: false,
      reason: 'requires_admin_login',
      message: `The ${route.title} is restricted to authorized administrators. Please log in via the Admin Portal.`,
      targetPath: '/pages/alogin',
      alternativeRouteKey: 'alogin',
    }
  }

  // Requires 'Owner' role
  if (route.requiresAuth === 'Owner') {
    if (session?.role === 'Admin' && session?.isOwner) {
      return { allowed: true, route, targetPath: route.path }
    }
    return {
      allowed: false,
      reason: 'requires_owner_privileges',
      message: 'The Owner Database Manager is restricted exclusively to verified studio owners with server-probed privileges.',
      targetPath: session?.role === 'Admin' ? '/pages/adash' : '/pages/alogin',
      alternativeRouteKey: session?.role === 'Admin' ? 'adash' : 'alogin',
    }
  }

  return { allowed: true, route, targetPath: route.path }
}
