/**
 * Centralized contextual navigation logic for DSCWeb_React.
 * Evaluates current route, user role, and owner permissions
 * to return only relevant, purposeful navigation options in structured groups.
 */

function normalizePath(pathname = '') {
  const clean = String(pathname || '').toLowerCase().replace(/\/index\.html$/, '/')
  return clean.endsWith('.html') ? clean.replace(/\.html$/, '') : clean
}

export function getContextualMenu({ pathname = '/', session = null, isOwner = false, onLogout }) {
  const path = normalizePath(pathname)
  const role = session?.role

  // ---------------------------------------------------------------------------
  // 1. ADMIN LOGGED-IN CONTEXT
  // ---------------------------------------------------------------------------
  if (role === 'Admin') {
    const adminSuiteItems = [
      { label: 'Admin Dashboard', to: '/pages/adash', isCurrent: path === '/pages/adash' },
      { label: 'Generate Key', to: '/pages/generatekey', isCurrent: path === '/pages/generatekey' },
    ]

    if (isOwner) {
      adminSuiteItems.push({
        label: 'Owner Workspace',
        to: '/pages/ownerdb',
        isCurrent: path === '/pages/ownerdb',
        badge: 'Owner',
      })
    }

    const operationsItems = [
      { label: 'Panel Downloads', to: '/pages/downloads', isCurrent: path === '/pages/downloads' },
      { label: 'System Status', to: '/pages/status', isCurrent: path === '/pages/status' },
    ]

    // Contextual site links if navigating public pages as admin
    const isPublicPage = !['/pages/adash', '/pages/generatekey', '/pages/ownerdb'].includes(path)
    const groups = [
      { title: 'Admin Controls', items: adminSuiteItems },
      { title: 'System & Downloads', items: operationsItems },
    ]

    if (isPublicPage) {
      groups.push({
        title: 'Public Site',
        items: [
          { label: 'Home', to: '/', isCurrent: path === '/' || path === '' },
          { label: 'Apps', to: '/pages/apps', isCurrent: path === '/pages/apps' },
          { label: 'Products', to: '/pages/products', isCurrent: path === '/pages/products' },
          { label: 'Contact', to: '/pages/contact', isCurrent: path === '/pages/contact' },
        ].filter((i) => !i.isCurrent),
      })
    }

    groups.push({
      title: 'Session',
      items: [
        {
          label: 'Logout',
          isAction: true,
          onClick: onLogout,
          isDestructive: true,
        },
      ],
    })

    return groups
  }

  // ---------------------------------------------------------------------------
  // 2. USER LOGGED-IN CONTEXT
  // ---------------------------------------------------------------------------
  if (role === 'User') {
    const userPortalItems = [
      { label: 'Client Dashboard', to: '/pages/udash', isCurrent: path === '/pages/udash' },
      { label: 'Software Downloads', to: '/pages/downloads', isCurrent: path === '/pages/downloads' },
      { label: 'Products & Renewals', to: '/pages/products', isCurrent: path === '/pages/products' },
      { label: 'Change Password', to: '/pages/change', isCurrent: path === '/pages/change' },
    ]

    const groups = [{ title: 'Client Portal', items: userPortalItems }]

    if (path === '/pages/udash' || path === '/pages/change') {
      groups.push({
        title: 'Explore',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Applications', to: '/pages/apps' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      })
    } else {
      // On public page as logged-in user
      const publicLinks = [
        { label: 'Home', to: '/', isCurrent: path === '/' || path === '' },
        { label: 'Apps', to: '/pages/apps', isCurrent: path === '/pages/apps' },
        { label: 'Contact', to: '/pages/contact', isCurrent: path === '/pages/contact' },
      ].filter((i) => !i.isCurrent)

      if (publicLinks.length > 0) {
        groups.push({ title: 'Navigation', items: publicLinks })
      }
    }

    groups.push({
      title: 'Session',
      items: [
        {
          label: 'Logout',
          isAction: true,
          onClick: onLogout,
          isDestructive: true,
        },
      ],
    })

    return groups
  }

  // ---------------------------------------------------------------------------
  // 3. PUBLIC / GUEST CONTEXT (BY CURRENT PAGE)
  // ---------------------------------------------------------------------------

  // Products Page
  if (path === '/pages/products') {
    return [
      {
        title: 'Catalog & Store',
        items: [
          { label: 'Products Catalog', to: '/pages/products', isCurrent: true },
          { label: 'Checkout & Order', to: '/pages/checkout' },
          { label: 'Free Panel Tier', to: '/pages/freepanel' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Applications', to: '/pages/apps' },
          { label: 'Downloads Center', to: '/pages/downloads' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      },
      {
        title: 'Account',
        items: [{ label: 'Client Login', to: '/pages/ulogin' }],
      },
    ]
  }

  // Checkout Page
  if (path === '/pages/checkout') {
    return [
      {
        title: 'Order Processing',
        items: [
          { label: 'Checkout', to: '/pages/checkout', isCurrent: true },
          { label: 'Products Catalog', to: '/pages/products' },
          { label: 'Free Panel Tier', to: '/pages/freepanel' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Downloads Center', to: '/pages/downloads' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      },
      {
        title: 'Account',
        items: [{ label: 'Client Login', to: '/pages/ulogin' }],
      },
    ]
  }

  // Free Panel Page
  if (path === '/pages/freepanel') {
    return [
      {
        title: 'Free Panel',
        items: [
          { label: 'Free Panel Credentials', to: '/pages/freepanel', isCurrent: true },
          { label: 'Downloads Center', to: '/pages/downloads' },
          { label: 'Products Catalog', to: '/pages/products' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      },
      {
        title: 'Account',
        items: [{ label: 'Client Login', to: '/pages/ulogin' }],
      },
    ]
  }

  // Downloads Page
  if (path === '/pages/downloads') {
    return [
      {
        title: 'Downloads Center',
        items: [
          { label: 'Downloads', to: '/pages/downloads', isCurrent: true },
          { label: 'Free Panel Tier', to: '/pages/freepanel' },
          { label: 'Products Catalog', to: '/pages/products' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Applications', to: '/pages/apps' },
          { label: 'System Status', to: '/pages/status' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      },
      {
        title: 'Account',
        items: [{ label: 'Client Login', to: '/pages/ulogin' }],
      },
    ]
  }

  // Apps Page
  if (path === '/pages/apps') {
    return [
      {
        title: 'Software Suite',
        items: [
          { label: 'Applications', to: '/pages/apps', isCurrent: true },
          { label: 'Downloads Center', to: '/pages/downloads' },
          { label: 'Products Catalog', to: '/pages/products' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'About Studio', to: '/pages/about' },
          { label: 'Contact & Support', to: '/pages/contact' },
          { label: 'System Status', to: '/pages/status' },
        ],
      },
      {
        title: 'Community',
        items: [{ label: 'Discord Server', href: 'https://discord.gg/XB2Zjmsb7K' }],
      },
    ]
  }

  // About Page
  if (path === '/pages/about') {
    return [
      {
        title: 'Company',
        items: [
          { label: 'About Dark Skull', to: '/pages/about', isCurrent: true },
          { label: 'Contact Channels', to: '/pages/contact' },
          { label: 'Discord Server', href: 'https://discord.gg/XB2Zjmsb7K' },
        ],
      },
      {
        title: 'Software',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Applications', to: '/pages/apps' },
          { label: 'Products Catalog', to: '/pages/products' },
          { label: 'Downloads', to: '/pages/downloads' },
        ],
      },
    ]
  }

  // Contact Page
  if (path === '/pages/contact') {
    return [
      {
        title: 'Support & Inquiries',
        items: [
          { label: 'Contact Channels', to: '/pages/contact', isCurrent: true },
          { label: 'Discord Server', href: 'https://discord.gg/XB2Zjmsb7K' },
          { label: 'System Status', to: '/pages/status' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'About Studio', to: '/pages/about' },
          { label: 'Products Catalog', to: '/pages/products' },
        ],
      },
    ]
  }

  // User Login Page
  if (path === '/pages/ulogin') {
    return [
      {
        title: 'Access Portals',
        items: [
          { label: 'Client Login', to: '/pages/ulogin', isCurrent: true },
          { label: 'Admin Portal', to: '/pages/alogin' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Products Catalog', to: '/pages/products' },
          { label: 'Downloads Center', to: '/pages/downloads' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      },
    ]
  }

  // Admin Login Page
  if (path === '/pages/alogin') {
    return [
      {
        title: 'Access Portals',
        items: [
          { label: 'Admin Portal', to: '/pages/alogin', isCurrent: true },
          { label: 'Client Login', to: '/pages/ulogin' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'Downloads Center', to: '/pages/downloads' },
          { label: 'System Status', to: '/pages/status' },
        ],
      },
    ]
  }

  // Legal Pages (Privacy Policy, Terms)
  if (path === '/pages/privacy-policy' || path === '/pages/terms' || path === '/pages/policy') {
    return [
      {
        title: 'Legal & Policies',
        items: [
          { label: 'Privacy Policy', to: '/pages/privacy-policy', isCurrent: path === '/pages/privacy-policy' || path === '/pages/policy' },
          { label: 'Terms of Service', to: '/pages/terms', isCurrent: path === '/pages/terms' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { label: 'Home', to: '/' },
          { label: 'About Studio', to: '/pages/about' },
          { label: 'Contact & Support', to: '/pages/contact' },
        ],
      },
    ]
  }

  // Default / Home Page (`/`)
  return [
    {
      title: 'Navigation',
      items: [
        { label: 'Applications', to: '/pages/apps' },
        { label: 'Products Catalog', to: '/pages/products' },
        { label: 'Downloads Center', to: '/pages/downloads' },
        { label: 'About Studio', to: '/pages/about' },
        { label: 'Contact & Support', to: '/pages/contact' },
        { label: 'System Status', to: '/pages/status' },
      ],
    },
    {
      title: 'Community',
      items: [{ label: 'Discord Server', href: 'https://discord.gg/XB2Zjmsb7K' }],
    },
    {
      title: 'Access Portals',
      items: [
        { label: 'Client Login', to: '/pages/ulogin' },
        { label: 'Admin Portal', to: '/pages/alogin' },
      ],
    },
  ]
}
