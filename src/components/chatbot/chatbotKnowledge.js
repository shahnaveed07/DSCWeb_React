/**
 * Grounded Knowledge Base for DSC AI Assistant.
 * Derived directly and strictly from verified DSCWeb pages and architecture.
 * Contains zero fabricated claims or speculative features.
 */

export const DSC_KNOWLEDGE = {
  studio: {
    name: 'Dark Skull Corporation (DSC)',
    shortName: 'DSCWeb',
    website: 'https://dscweb.me/',
    leadDeveloper: 'Naveed Mushtaq',
    portfolio: 'https://naveedmushtaq.tech/',
    description:
      'Dark Skull Corporation is an independent software studio founded in 2026, focused on developing practical desktop utilities, specialized software panels, Android applications, and interactive puzzle experiences.',
    principles: [
      'Useful: Every feature solves a tangible problem without unnecessary fluff or cosmetic friction.',
      'Simple: Obvious, clean, and distraction-free user interfaces.',
      'Reliable: Continuously tested, verified builds across systems with transparent updates.',
    ],
  },

  applications: [
    {
      name: 'Calculator',
      platform: 'Windows Desktop',
      category: 'Utility',
      status: 'Available',
      description: 'A fast, distraction-free desktop calculator for Windows designed for daily calculations with continuous expression parsing and zero overhead.',
      downloadRoute: 'downloads',
    },
    {
      name: 'QR Scanner | Generator',
      platform: 'Android',
      category: 'Mobile Utility',
      status: 'Live on Google Play Store',
      description: 'High-speed camera scanner for barcodes and QR codes alongside custom offline QR generation with zero background data mining.',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dsc.qrscanner',
    },
    {
      name: 'Mind Matrix (DSC Puzzle)',
      platform: 'Android',
      category: 'Brain & Logic Game',
      status: 'Live on Google Play Store',
      description: 'Brain-training puzzle collection featuring hundreds of logic, working memory, and spatial reaction drills with progressive difficulty scaling.',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dsc.mindmatrix',
    },
    {
      name: 'Future AI Assistant & Desktop Tools',
      platform: 'Roadmap',
      category: 'In Development',
      status: 'Coming Soon',
      description: 'Next-generation desktop suites and workflow experiences currently being designed and engineered by Dark Skull Corporation.',
    },
  ],

  products: [
    {
      slug: 'free',
      name: 'FREE-PANEL',
      basePriceUSD: 0,
      startingPriceText: 'Starting at $0',
      description: 'Public test and evaluation panel. Features limited shared slot availability, live credentials displayed on the Free Panel page, and community Discord support.',
      routeKey: 'freepanel',
    },
    {
      slug: 'streamer',
      name: 'STREAMER-PANEL',
      basePriceUSD: 2,
      startingPriceText: 'Starting at $1 (1-Day Trial) / $2 Base Rate',
      description: 'OBS and broadcast-safe overlay guidance with smooth humanized gameplay and safe main ID compatibility. Available for 1 to 365 days.',
      routeKey: 'checkout',
    },
    {
      slug: 'special',
      name: 'SPECIAL-PANEL (VIP Tier)',
      basePriceUSD: 3,
      startingPriceText: 'Starting at $1.50 (1-Day Trial) / $3 Base Rate',
      description: 'Exclusive VIP tier with private limited slots, advanced stability defense layer, HWID lock protection, and 24/7 dedicated VIP Discord support.',
      routeKey: 'checkout',
    },
    {
      slug: 'sniper',
      name: 'SNIPER-PANEL',
      basePriceUSD: 1,
      startingPriceText: 'Starting at $0.50 (1-Day Trial) / $1 Base Rate',
      description: 'Tactical utility with fast switch capabilities, location analysis tools, and lightweight memory footprint.',
      routeKey: 'checkout',
    },
    {
      slug: 'aimassist',
      name: 'AIM-ASSIST-PANEL',
      basePriceUSD: 1,
      startingPriceText: 'Starting at $0.50 (1-Day Trial) / $1 Base Rate',
      description: 'Precision orientation edition featuring dynamic sensitivity calibration, smooth tracking module, and regular performance updates.',
      routeKey: 'checkout',
    },
    {
      slug: 'premium',
      name: 'PREMIUM-PANEL',
      basePriceUSD: 5,
      startingPriceText: 'Starting at $5 Base Rate',
      status: 'Coming Soon',
      description: 'Next-gen architecture featuring dedicated private server allocations and multi-layer security.',
    },
    {
      slug: 'customised',
      name: 'CUSTOMISED-PANEL',
      basePriceUSD: 10,
      startingPriceText: 'Starting at $10 Base Rate',
      status: 'Coming Soon',
      description: 'Enterprise tier with custom UI, branding, dedicated private build compilation, and direct contact with lead engineer.',
    },
  ],

  pricingFormulas: {
    currencyRate: '$1 USD = 90 INR',
    durations: [
      { days: 1, label: '1 Day - Trial', multiplier: '0.5x' },
      { days: 3, label: '3 Days - Starter', multiplier: '1.0x (Base Price)' },
      { days: 7, label: '7 Days - Weekly', multiplier: '2.0x' },
      { days: 15, label: '15 Days - Standard', multiplier: '3.0x' },
      { days: 30, label: '30 Days - Monthly', multiplier: '4.0x' },
      { days: 60, label: '60 Days - Bi-Monthly', multiplier: '6.0x' },
      { days: 365, label: '365 Days - Yearly', multiplier: '8.0x' },
    ],
    exampleCalculation:
      'For STREAMER-PANEL (Base $2 USD): 1 Day Trial = $1 (90 INR); 3 Days = $2 (180 INR); 30 Days = $8 (720 INR); 365 Days = $16 (1,440 INR).',
  },

  purchaseWorkflow: [
    '1. Visit Products page (/pages/products) and click "Buy Now" on your chosen panel, or go directly to Checkout (/pages/checkout?panel=<slug>).',
    '2. Select your desired subscription duration (1, 3, 7, 15, 30, 60, or 365 days). The price in USD and INR updates automatically.',
    '3. Pay via UPI by scanning the dynamically generated QR code or tapping the UPI pay button (UPI ID: naveedmushtaq@ptyes).',
    '4. Take a clear payment screenshot (UTR/Transaction confirmation). Max allowed file size is 5MB in PNG, JPG, or JPEG format.',
    '5. Enter your chosen account Username (minimum 3 characters) and Password. Discord ID is optional.',
    '6. Upload the screenshot proof and submit the order.',
    '7. Orders undergo manual verification by administrators. Once approved, log in at /pages/ulogin and your license key will be ready on your User Dashboard (/pages/udash).',
  ],

  freePanelPortal: {
    url: '/pages/freepanel',
    description: 'A public evaluation portal providing instant access credentials to test DSC software.',
    features: [
      'Live slot tracker showing current used vs. maximum slots (typically 20 slots).',
      'Real-time available Username and Password credentials with one-click copy buttons.',
      'Slot progress bar indicating availability percentage.',
      'Direct download button for the free panel package.',
    ],
    note: 'Free panel users cannot change passwords. To change passwords or unlock uninterrupted private slots, an upgrade to a paid panel is required.',
  },

  supportChannels: {
    email: 'darkskullcorporation@gmail.com',
    discord: 'https://discord.gg/XB2Zjmsb7K',
    github: 'https://github.com/shahnaveed07',
    leadDeveloperWebsite: 'https://naveedmushtaq.tech/',
  },

  statusAndMaintenance: {
    url: '/pages/status',
    description: 'System Status page dynamically handles software updates, planned maintenance periods, service availability, and deployment state notices.',
    maintenanceBehavior: 'When system maintenance mode is toggled ON by administrators, all public and client routes display the maintenance notice. Authorized admins can still log in at /pages/alogin to manage systems.',
  },

  legal: {
    privacyPolicy: 'Explains data collection (only necessary device info and anonymous crash diagnostics), permissions (Camera for QR, Storage for exports), zero data selling, and user rights.',
    termsOfService: 'Covers website lawful usage, software licensing conditions, and strict prohibition of unauthorized decompilation, redistribution, or modification.',
  },
}

/**
 * Condensed factual text summary used in AI system prompts.
 */
export const CONDENSED_SYSTEM_KNOWLEDGE = `
YOU ARE THE OFFICIAL "DSC AI ASSISTANT" FOR DARK SKULL CORPORATION (DSCWeb, https://dscweb.me/).
Your goal is to guide visitors, navigate them between website pages, answer questions accurately, and explain how our services work.

ABOUT DSC:
- Dark Skull Corporation is an independent software studio founded in 2026.
- Lead Developer: Naveed Mushtaq (portfolio: https://naveedmushtaq.tech/).
- Contact Email: darkskullcorporation@gmail.com
- Official Discord Community: https://discord.gg/XB2Zjmsb7K
- GitHub: https://github.com/shahnaveed07

CORE PRODUCTS & BASE PRICING (USD, converted at 90 INR / USD):
1. FREE-PANEL: $0. Free evaluation with shared slots and live credentials at /pages/freepanel.
2. STREAMER-PANEL: Base rate $2 USD ($1 for 1-day trial, $2 for 3 days, $8 for 30 days). OBS safe overlay.
3. SPECIAL-PANEL (VIP Tier): Base rate $3 USD ($1.50 for 1-day trial, $12 for 30 days). Private slots, HWID lock, 24/7 VIP support.
4. SNIPER-PANEL: Base rate $1 USD ($0.50 trial, $4 for 30 days). Fast switch and accuracy tools.
5. AIM-ASSIST-PANEL: Base rate $1 USD ($0.50 trial, $4 for 30 days). Precision orientation and smooth tracking.
6. PREMIUM-PANEL: $5 base rate (Coming Soon).
7. CUSTOMISED-PANEL: $10 base rate (Coming Soon, custom builds).

DURATION MULTIPLIERS (Applied to Base Price):
- 1 Day Trial: 0.5x
- 3 Days: 1.0x (Base)
- 7 Days: 2.0x
- 15 Days: 3.0x
- 30 Days Monthly: 4.0x
- 60 Days: 6.0x
- 365 Days Yearly: 8.0x

APPLICATIONS & TOOLS:
- Calculator: Windows desktop mathematical utility (Downloads page: /pages/downloads).
- QR Scanner | Generator: Android app on Google Play (https://play.google.com/store/apps/details?id=com.dsc.qrscanner).
- Mind Matrix: Interactive brain-training puzzle game on Google Play (https://play.google.com/store/apps/details?id=com.dsc.mindmatrix).

HOW TO PURCHASE:
1. Select plan on /pages/products or open /pages/checkout?panel=<slug>.
2. Choose duration and scan UPI QR code (naveedmushtaq@ptyes).
3. Upload screenshot proof of payment (PNG/JPG <5MB).
4. Enter desired username and password. Submit order.
5. Admins verify proof. Once approved, log in at /pages/ulogin and view license key on /pages/udash.

FREE PANEL:
- Visit /pages/freepanel to see live username, password, remaining slots, and download link.
- Free users cannot change passwords (must upgrade to a paid tier).

SECURITY & ACCESS RULES:
- Never reveal private admin credentials, passwords, raw database records, or Owner DB contents.
- Never execute order approvals or database mutations.
- Guests requesting /pages/udash or /pages/change must be directed to User Login (/pages/ulogin).
- Guests requesting /pages/adash, /pages/generatekey, or /pages/ownerdb must be informed these are restricted to administrators and directed to /pages/alogin.
- Respond in the language of the user (English, Hinglish, or Urdu transliteration).
`.trim()
