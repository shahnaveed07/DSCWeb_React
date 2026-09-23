export const primaryNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Apps', to: '/pages/apps' },
  { label: 'Products', to: '/pages/products' },
  { label: 'Downloads', to: '/pages/downloads' },
  { label: 'About', to: '/pages/about' },
  { label: 'Contact', to: '/pages/contact' },
  {
    label: 'Discord',
    href: 'https://discord.gg/XB2Zjmsb7K',
  },
]

export const pageLabels = [
  { label: 'Home', paths: ['/', '/index.html'] },
  { label: 'Apps', paths: ['/pages/apps', '/pages/apps.html'] },
  { label: 'Products', paths: ['/pages/products', '/pages/products.html'] },
  { label: 'Downloads', paths: ['/pages/downloads', '/pages/downloads.html'] },
  { label: 'About', paths: ['/pages/about', '/pages/about.html'] },
  { label: 'Contact', paths: ['/pages/contact', '/pages/contact.html'] },
  { label: 'Status', paths: ['/pages/status', '/pages/status.html'] },
  { label: 'Privacy Policy', paths: ['/pages/privacy-policy', '/pages/privacy-policy.html', '/pages/policy.html'] },
  { label: 'Terms', paths: ['/pages/terms', '/pages/terms.html'] },
  { label: 'Login', paths: ['/pages/ulogin', '/pages/Ulogin.html'] },
  { label: 'Admin Login', paths: ['/pages/alogin', '/pages/Alogin.html'] },
  { label: 'Free Panel', paths: ['/pages/freepanel', '/pages/freepanel.html'] },
  { label: 'Checkout', paths: ['/pages/checkout', '/pages/checkout.html'] },
  { label: 'Dashboard', paths: ['/pages/udash', '/pages/Udash.html'] },
  { label: 'Change Password', paths: ['/pages/change', '/pages/change.html'] },
  { label: 'Admin Dashboard', paths: ['/pages/adash', '/pages/Adash.html'] },
  { label: 'Owner Workspace', paths: ['/pages/ownerdb', '/pages/OwnerDB.html'] },
  { label: 'Key Generation', paths: ['/pages/generatekey', '/pages/generateKey.html'] },
]

export const homeHighlights = [
  {
    eyebrow: 'Security',
    title: 'Secure by design',
    body: 'Phase 1 keeps the current backend contract intact while moving the frontend to a cleaner, more maintainable architecture.',
  },
  {
    eyebrow: 'Engineering',
    title: 'Structured delivery',
    body: 'Reusable sections, centralized API handling, and a predictable page model replace the legacy monolithic frontend runtime.',
  },
  {
    eyebrow: 'Operations',
    title: 'Production aware',
    body: 'The rebuild carries forward maintenance states, download gating, role-based access, and explicit loading or failure feedback.',
  },
]

export const featuredApps = [
  {
    type: 'Utility',
    title: 'Calculator',
    description: 'A lightweight desktop utility for fast calculations and day-to-day productivity.',
    primaryAction: { label: 'Go to Downloads', to: '/pages/downloads' },
  },
  {
    type: 'Android Utility',
    title: 'QR Scanner | Generator',
    description: 'High-speed QR scanning and generation shipped through Google Play.',
    primaryAction: {
      label: 'Open Play Store',
      href: 'https://play.google.com/store/apps/details?id=com.dsc.qrscanner',
    },
  },
  {
    type: 'Puzzle Game',
    title: 'Mind Matrix',
    description: 'A game-focused mobile release built around short puzzle sessions and polished interactions.',
    primaryAction: {
      label: 'Open Play Store',
      href: 'https://play.google.com/store/apps/details?id=com.dsc.mindmatrix',
    },
  },
]

export const servicePillars = [
  {
    title: 'Product Design',
    items: [
      'Information architecture and navigation systems',
      'Component-oriented interface design',
      'Careful content hierarchy and readable flows',
    ],
  },
  {
    title: 'Web and App Engineering',
    items: [
      'Responsive website delivery',
      'Lightweight utilities and mobile tooling',
      'API-compatible frontend modernization',
    ],
  },
  {
    title: 'Release and Support',
    items: [
      'Operational visibility for maintenance states',
      'Download, licensing, and order workflows',
      'A maintainable base for later Node and Express migration',
    ],
  },
]

export const faqItems = [
  {
    question: 'What stays the same in Phase 1?',
    answer:
      'The live C# API and TiDB-backed data remain the operational source of truth while the new React frontend upgrades structure, presentation, and maintainability.',
  },
  {
    question: 'Which flows are preserved now?',
    answer:
      'Public marketing pages, free panel status, checkout submission, user authentication, password change, and dashboard order tracking are all included in the Phase 1 scope.',
  },
  {
    question: 'Will the backend change now?',
    answer:
      'No. The Node and Express migration is explicitly deferred. This upgrade is designed to consume the current backend cleanly.',
  },
]

export const productPlans = [
  {
    label: 'Free Tier',
    title: 'FREE-PANEL',
    price: '$0 base rate',
    slug: 'free',
    features: [
      'Limited-slot access',
      'Free credential visibility',
      'Download controlled by current system status',
    ],
    action: { label: 'View Free Panel', to: '/pages/freepanel' },
  },
  {
    label: 'Streaming Edition',
    title: 'STREAMER-PANEL',
    price: '$2 base rate',
    slug: 'streamer',
    features: [
      'OBS-safe usage guidance',
      'Longer purchase durations at checkout',
      'Preserved existing order flow',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=streamer' },
  },
  {
    label: 'VIP Tier',
    title: 'SPECIAL-PANEL',
    price: '$3 base rate',
    slug: 'special',
    featured: true,
    features: [
      'Private-slot orientation',
      'Advanced protection positioning',
      '24/7 support language retained from the legacy catalog',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=special' },
  },
  {
    label: 'Tactical Tier',
    title: 'SNIPER-PANEL',
    price: '$1 base rate',
    slug: 'sniper',
    features: [
      'Fast-switch capabilities',
      'Location analysis tools',
      'Preserved duration-based checkout pricing',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=sniper' },
  },
  {
    label: 'Precision Edition',
    title: 'AIM-ASSIST-PANEL',
    price: '$1 base rate',
    slug: 'aimassist',
    features: [
      'Advanced precision layer',
      'Tracking-oriented positioning',
      'Same approval-based order flow',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=aimassist' },
  },
  {
    label: 'Next Gen',
    title: 'PREMIUM-PANEL',
    price: '$5 base rate',
    slug: 'premium',
    features: [
      'Marked as upcoming in the current system',
      'Priority support positioning',
      'Reserved for later release',
    ],
    action: { label: 'Coming Soon', disabled: true },
  },
  {
    label: 'Enterprise',
    title: 'CUSTOMISED-PANEL',
    price: '$10 base rate',
    slug: 'customised',
    features: [
      'Custom branding and packaging',
      'Private-build positioning',
      'Reserved for direct inquiry',
    ],
    action: { label: 'Coming Soon', disabled: true },
  },
]

export const roadmapItems = [
  {
    title: 'Phase 1',
    body: 'React frontend consumes the existing C# API while preserving current data and operational workflows.',
  },
  {
    title: 'Phase 2',
    body: 'Selected backend responsibilities can move to Node and Express after the frontend contract is stable and verified.',
  },
  {
    title: 'Phase 3',
    body: 'Admin CRUD and deeper internal tooling can be rebuilt on the new frontend once authenticated response contracts are fully captured.',
  },
]

export const aboutStats = [
  { label: 'Architecture', value: 'React + Vite' },
  { label: 'Current API', value: 'C# on Render' },
  { label: 'Data Store', value: 'TiDB retained' },
  { label: 'Brand Goal', value: 'Same DSCWeb, rebuilt properly' },
]

export const contactChannels = [
  {
    label: 'Official Email',
    title: 'darkskullcorporation@gmail.com',
    body: 'Business communication, support follow-up, and general product inquiries.',
    action: { label: 'Send Email', href: 'mailto:darkskullcorporation@gmail.com' },
  },
  {
    label: 'Discord Community',
    title: 'Developer Support',
    body: 'Live announcements, community discussion, and direct support routing.',
    action: { label: 'Join Discord', href: 'https://discord.gg/XB2Zjmsb7K' },
  },
  {
    label: 'GitHub Workspace',
    title: 'Public Code Surface',
    body: 'Repositories, documentation, and shared technical artifacts.',
    action: { label: 'View GitHub', href: 'https://github.com/' },
  },
]

export const privacySections = [
  {
    title: 'Information We Collect',
    items: [
      'Device and operating-system metadata where needed for app support',
      'Crash reports and anonymous usage diagnostics',
      'Contact or account information submitted through supported workflows',
    ],
  },
  {
    title: 'How We Use Information',
    items: [
      'Improve performance and reliability',
      'Respond to support requests',
      'Maintain platform security and service operations',
      'Plan future feature releases',
    ],
  },
  {
    title: 'Third-Party Services',
    items: [
      'Google Play Services',
      'Firebase for future products where enabled',
      'Analytics and delivery tooling only where required',
    ],
  },
  {
    title: 'Your Rights',
    items: [
      'Request access to your stored information',
      'Request correction or deletion where applicable',
      'Reach out through the contact channels for privacy concerns',
    ],
  },
]

export const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Apps', to: '/pages/apps' },
      { label: 'Products', to: '/pages/products' },
      { label: 'Downloads', to: '/pages/downloads' },
      { label: 'About', to: '/pages/about' },
      { label: 'Contact', to: '/pages/contact' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'User Login', to: '/pages/ulogin' },
      { label: 'Admin Login', to: '/pages/alogin' },
      { label: 'Free Panel', to: '/pages/freepanel' },
      { label: 'Status', to: '/pages/status' },
      { label: 'Privacy Policy', to: '/pages/privacy-policy' },
      { label: 'Terms', to: '/pages/terms' },
    ],
  },
]
