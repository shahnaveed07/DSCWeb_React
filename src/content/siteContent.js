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
    title: 'Secure by Design',
    body: 'Enterprise-grade authorization, HWID validation, and private cryptographic licensing keys.',
  },
  {
    eyebrow: 'Performance',
    title: 'Structured Delivery',
    body: 'Zero-latency startup, minimal memory consumption, and clean client-side performance across all tools.',
  },
  {
    eyebrow: 'Operations',
    title: 'Continuous Availability',
    body: 'Real-time telemetry, maintenance awareness, and responsive community support channels.',
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
      'Responsive web applications and portals',
      'Lightweight utilities and mobile tooling',
      'High-performance backend API integration',
    ],
  },
  {
    title: 'Release and Support',
    items: [
      'Operational visibility for maintenance states',
      'Download, licensing, and order workflows',
      'Active developer communication and verification',
    ],
  },
]

export const faqItems = [
  {
    question: 'How do I activate my software panel?',
    answer:
      'Select your desired tier via the Products page or Checkout, submit your payment proof, and upon verification your license key will be issued directly in your Client Portal.',
  },
  {
    question: 'Where can I download verified software builds?',
    answer:
      'All official binaries and packages are available through our Download Center and inside authenticated user dashboards.',
  },
  {
    question: 'How do I get technical assistance?',
    answer:
      'You can join our verified Discord community for live announcements and direct interaction with the team, or contact us via our official support email.',
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
      'Verified payment approval flow',
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
      'Advanced protection layer',
      'Priority 24/7 Discord support access',
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
      'Lightweight memory footprint',
      'Flexible duration-based checkout pricing',
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
      'Direct order approval flow',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=aimassist' },
  },
  {
    label: 'Next Gen',
    title: 'PREMIUM-PANEL',
    price: '$5 base rate',
    slug: 'premium',
    features: [
      'High-tier security defense',
      'Extended multi-month options',
      'Priority fast-track processing',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=premium' },
  },
  {
    label: 'Enterprise',
    title: 'CUSTOMISED-PANEL',
    price: '$10 base rate',
    slug: 'customised',
    features: [
      'Custom branding and packaging',
      'Dedicated private-build orientation',
      'Direct developer consultation',
    ],
    action: { label: 'Buy Now', to: '/pages/checkout?panel=customised' },
  },
]

export const aboutStats = [
  { label: 'Established', value: '2026' },
  { label: 'Platform Focus', value: 'Security & Utilities' },
  { label: 'Support Model', value: 'Community & Direct' },
  { label: 'Organization', value: 'Dark Skull Corporation' },
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
    action: { label: 'View GitHub', href: 'https://github.com/shahnaveed07' },
  },
]

export const privacySections = [
  {
    title: 'Information We Collect',
    description: 'Depending on the service you use, we may collect only necessary technical details:',
    items: [
      'Device model and operating system',
      'Application crash reports',
      'Anonymous usage statistics',
      'Information submitted through contact forms',
      'Account information (where applicable)',
    ],
    note: 'We do not intentionally collect sensitive personal information unless required for a specific feature.',
  },
  {
    title: 'How We Use Information',
    description: 'Your information helps us maintain quality and platform reliability:',
    items: [
      'Improve application performance',
      'Fix bugs and crashes',
      'Maintain security and licensing integrity',
      'Respond to support requests',
      'Develop new features',
      'Enhance overall user experience',
    ],
    note: 'We never sell or rent your personal information.',
  },
  {
    title: 'Android App Permissions',
    description: 'Some applications may request permissions only when required for a specific feature:',
    items: [
      'Camera — QR code scanning workflows',
      'Storage — Save generated files and export data',
      'Notifications — System updates, reminders, and alerts',
    ],
    note: 'Permissions are always requested only when necessary and can be revoked at any time in device settings.',
  },
  {
    title: 'Third-Party Services',
    description: 'Our applications may use trusted third-party services including:',
    items: [
      'Google Play Services',
      'Firebase services (future products)',
      'Google AdMob (supported free apps only)',
      'Analytics services (where explicitly enabled)',
    ],
    note: 'These services operate under their own privacy policies.',
  },
  {
    title: 'Cookies & Local Storage',
    description: 'Our website uses minimal local client storage to:',
    items: [
      'Remember interface preferences (such as Light / Dark theme)',
      'Persist authenticated dashboard sessions',
      'Improve website performance and navigation responsiveness',
    ],
    note: 'You may disable cookies or clear local storage through your browser settings.',
  },
  {
    title: 'Data Security',
    description: 'We implement technical and organizational measures to safeguard user data:',
    items: [
      'Encrypted transport (HTTPS/TLS) across all API communications',
      'Cryptographic HWID validation and hashed authentication tokens',
      'Restricted administrative access with multi-tier authorization controls',
    ],
    note: 'However, no internet service or storage facility can guarantee absolute security.',
  },
  {
    title: "Children's Privacy",
    description: 'Protecting young users across all our platforms:',
    items: [
      'Our products are not intended to knowingly collect personal information from children without parental consent.',
      'If such information is discovered, it will be removed as quickly as reasonably possible.',
    ],
  },
  {
    title: 'Your Rights',
    description: 'Depending on your location and jurisdiction, you have the right to:',
    items: [
      'Access your account information',
      'Correct inaccurate or outdated information',
      'Request deletion of your data and records',
      'Contact us regarding privacy concerns and practices',
    ],
  },
  {
    title: 'Changes to This Policy',
    description: 'We may update this Privacy Policy periodically to reflect improvements or legal requirements:',
    items: [
      'The latest version will always be available on this page with the updated effective date.',
      'Continued use of our products after changes signifies agreement to the updated policy.',
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
