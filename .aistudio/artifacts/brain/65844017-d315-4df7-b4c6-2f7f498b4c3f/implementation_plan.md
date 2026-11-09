# DSCWeb — Complete Technical & On-Page SEO, Sitemap & Search Visibility Optimization

This plan establishes a complete, verifiable SEO architecture across all 19 routes of the DSCWeb React application (`https://dscweb.me/`), ensuring accurate representation of **Dark Skull Corporation (DSC)** as an independent software development studio focused on Android Application Development, Game Development, and Custom Website Development, while delivering route-specific static HTML metadata shells for crawlers and preserving 100% of existing product catalogue and platform functionality.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and content decisions incorporate your Phase 1 confirmations:

- **Confirmed Decision 1 — Build-Time Static HTML Route Shells for Crawlers**: During `npm run build`, a lightweight post-build generator will emit route-specific static HTML files (`dist/pages/apps/index.html`, `dist/pages/products/index.html`, etc.) populated with each route's exact `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots">`, Open Graph, Twitter cards, and route-specific Schema.org JSON-LD. This guarantees that non-JS social crawlers (Discord, X/Twitter, LinkedIn, WhatsApp) and search bots receive exact page-level metadata on initial HTTP response on both Netlify and Vercel without requiring SSR.
- **Confirmed Decision 2 — Founder Attribution Preservation**: Your manual edits in the visible UI (`AboutPage`, `SiteFooter`, `HomePage`, `AppsPage`, and `siteContent`) are strictly preserved as-is, while SEO metadata (`<meta name="author">`, About page SEO title/description) and Schema.org JSON-LD (`Organization.founder` and `Person`) use the official designation **Naveed Mushtaq — Founder & Lead Developer**.
- **Confirmed Decision 3 — Square Logo Social Card Handling**: Because the verified existing brand asset (`https://dscweb.me/images/dsclogo.png`) is a `1280×1280` square image, `twitter:card` defaults to `"summary"` rather than `"summary_large_image"` so social previews do not crop the square logo awkwardly, and no non-existent image URLs are invented.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces ad-hoc page title/description updates with a unified SEO metadata system that synchronizes client-side React Router navigation (`usePageMeta`) and build-time static HTML generation from a single source of truth.
- **Target Audience / Persona**: Search engine crawlers (Googlebot, Bingbot), social preview bots (Discord, X, LinkedIn, Facebook), and prospective visitors searching for Android applications, mobile games (`QR Scanner | Generator`, `Mind Matrix`), custom website development services, or DSC software products.
- **Key Value**: Eliminates duplicate/truncated titles (`| DSCWeb` double-branding), removes non-indexable transactional routes (`/pages/checkout`) from `sitemap.xml`, enforces explicit `noindex, nofollow` policies on authentication, checkout, dashboard, and utility routes, and embeds rich Schema.org structured data (`Organization`, `WebSite`, `Person`, `WebPage`, and `SoftwareApplication`).

---

## 2. User Experience, SEO Metadata Matrix & Visual Consistency

- **Visual Identity & Theme Preservation**:
  - Retains the approved **Black & Gold** visual identity (`#050505` dark background, `#D4AF37` metallic gold accents, `dscThemePreferenceV2` persistence) with zero regressions.
  - Preserves your recent visible text adjustments on the About page, Home page, Apps page, Privacy Policy page, and Site Footer.
  - Updates `site.webmanifest` theme/background colors to `#050505` to match the Black & Gold dark theme baseline.

- **Complete Route-by-Route SEO Metadata & Indexing Matrix**:

| Page | Canonical Route | SEO `<title>` | Meta Description (140–160 chars) | Robots Policy | In Sitemap? |
|---|---|---|---|---|---|
| **Home** | `https://dscweb.me/` | `Dark Skull Corporation \| Android Apps & Game Development` | `Dark Skull Corporation is an independent software studio focused on Android applications, game development and custom websites for individuals and businesses.` | `index, follow` | Yes |
| **Apps & Games** | `https://dscweb.me/pages/apps` | `Android Apps & Games \| Dark Skull Corporation` | `Explore Android applications and mobile games developed by Dark Skull Corporation, including QR Scanner & Generator and Mind Matrix on Google Play.` | `index, follow` | Yes |
| **Products** | `https://dscweb.me/pages/products` | `Software Products & Pricing \| Dark Skull Corporation` | `Explore the official Dark Skull Corporation software product catalogue, available plans, product specifications, regional pricing and purchase options.` | `index, follow` | Yes |
| **Downloads** | `https://dscweb.me/pages/downloads` | `Software & Android App Downloads \| DSC` | `Visit the official Dark Skull Corporation download center for available software releases, Android applications, mobile games and public builds.` | `index, follow` | Yes |
| **Free Panel** | `https://dscweb.me/pages/freepanel` | `Free Panel Access & Live Credentials \| DSC` | `Access Dark Skull Corporation's public Free Panel build, check live server availability, and retrieve active community test credentials.` | `index, follow` | Yes |
| **About Studio** | `https://dscweb.me/pages/about` | `About Dark Skull Corporation \| Founder & Lead Developer` | `Learn about Dark Skull Corporation, its Android app and game development focus, custom website services, and founder Naveed Mushtaq.` | `index, follow` | Yes |
| **Contact** | `https://dscweb.me/pages/contact` | `Contact DSC \| Website & Software Development Inquiries` | `Contact Dark Skull Corporation for Android app development, game development, custom website projects, business inquiries and client support.` | `index, follow` | Yes |
| **Privacy Policy** | `https://dscweb.me/pages/privacy-policy` | `Privacy Policy & Cookie Disclosures \| Dark Skull Corporation` | `Read the Dark Skull Corporation Privacy Policy covering data collection, local storage, cookie usage, third-party advertising disclosures and user rights.` | `index, follow` | Yes |
| **Terms of Service** | `https://dscweb.me/pages/terms` | `Terms of Service & Licensing \| Dark Skull Corporation` | `Review the Terms of Service, software licensing rules, payment verification policies and fair use terms for Dark Skull Corporation websites and products.` | `index, follow` | Yes |
| **System Status** | `https://dscweb.me/pages/status` | `System Status & Service Availability \| DSC` | `Check current platform operational status, scheduled maintenance notices and service availability for Dark Skull Corporation web services.` | `index, follow` | Yes |
| **Checkout** | `https://dscweb.me/pages/checkout` | `Order Checkout \| Dark Skull Corporation` | `Complete your Dark Skull Corporation software product order, duration selection and payment verification.` | `noindex, nofollow` | No |
| **User Login** | `https://dscweb.me/pages/ulogin` | `Client Portal Login \| Dark Skull Corporation` | `Sign in to your Dark Skull Corporation client account to view active subscriptions, downloads and account settings.` | `noindex, nofollow` | No |
| **Admin Login** | `https://dscweb.me/pages/alogin` | `Admin Portal Login \| Dark Skull Corporation` | `Administrative authentication portal for authorized Dark Skull Corporation staff.` | `noindex, nofollow` | No |
| **User Dashboard** | `https://dscweb.me/pages/udash` | `Client Dashboard \| Dark Skull Corporation` | `Manage your Dark Skull Corporation client profile, active product licenses and direct downloads.` | `noindex, nofollow` | No |
| **Change Password** | `https://dscweb.me/pages/change` | `Change Account Password \| Dark Skull Corporation` | `Update your Dark Skull Corporation client portal password and security credentials.` | `noindex, nofollow` | No |
| **Admin Dashboard** | `https://dscweb.me/pages/adash` | `Admin Dashboard \| Dark Skull Corporation` | `Administrative control panel for Dark Skull Corporation system status and release management.` | `noindex, nofollow` | No |
| **Owner DB** | `https://dscweb.me/pages/ownerdb` | `Owner Database Manager \| Dark Skull Corporation` | `Owner-level account and database management workspace for Dark Skull Corporation.` | `noindex, nofollow` | No |
| **Generate Key** | `https://dscweb.me/pages/generatekey` | `Generate Access Key \| Dark Skull Corporation` | `Administrative key generation utility for Dark Skull Corporation.` | `noindex, nofollow` | No |
| **Maintenance** | `https://dscweb.me/` | `Scheduled System Maintenance \| Dark Skull Corporation` | `Dark Skull Corporation web services are temporarily undergoing scheduled maintenance. Please check back shortly.` | `noindex, nofollow` | No |
| **Not Found (404)** | `https://dscweb.me/pages/404` | `Page Not Found (404) \| Dark Skull Corporation` | `The requested page could not be found. Return to the Dark Skull Corporation homepage or browse our Android apps, games and products.` | `noindex, nofollow` | No |

---

## 3. Key Product & Technical SEO Decisions

- **Decision 1 — Single-Source SEO Registry + Enhanced `usePageMeta`**:
  - *Chosen Approach*: Centralize all route metadata, Open Graph tags, Twitter Card tags, robots directives, and route-level JSON-LD definitions into a shared SEO configuration module consumed by both `usePageMeta` at runtime and the static prerender script at build time.
  - *Why*: Guarantees zero drift between what Vite builds into static HTML files and what React Router updates during client-side navigation, while preventing stale tags from lingering across route transitions.
- **Decision 2 — Crawlability vs. Indexability Alignment (`robots.txt` + `meta[name="robots"]`)**:
  - *Chosen Approach*: Keep administrative/private workspace paths (`/pages/adash`, `/pages/ownerdb`, `/pages/generatekey`, `/pages/udash`, `/pages/change`, `/pages/alogin`) disallowed in `robots.txt` AND stamped with `noindex, nofollow` in `usePageMeta`. Keep `/pages/ulogin` and `/pages/checkout` crawlable in `robots.txt` while setting `<meta name="robots" content="noindex, nofollow" />` on both pages (and removing `/pages/checkout` from `sitemap.xml`).
  - *Why*: Search engines must be allowed to crawl `/pages/checkout` and `/pages/ulogin` in order to read their `noindex` directives and drop them from search results, whereas blocking them in `robots.txt` would prevent crawlers from seeing `noindex`.
- **Decision 3 — Canonical Route Normalization & Legacy `.html` 301 Redirects**:
  - *Chosen Approach*: Configure explicit 301 permanent redirects in `netlify.toml`, `public/_redirects`, and `vercel.json` for legacy `.html` paths (`/index.html`, `/pages/apps.html`, `/pages/products.html`, `/pages/downloads.html`, `/pages/freepanel.html`, `/pages/about.html`, `/pages/contact.html`, `/pages/privacy-policy.html`, `/pages/policy.html`, `/pages/terms.html`, `/pages/status.html`) to their clean canonical URLs before the SPA fallback rewrite (`200`), while keeping `<Navigate replace />` routes in `App.jsx`.
  - *Why*: Ensures both HTTP-level crawlers and client-side navigations resolve legacy `.html` URLs to a single canonical URL without redirect loops.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & SEO Delivery Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    Central SEO Registry & Schema Builder                  │
│  • Route Metadata Map (title, description, canonical, robots)             │
│  • Social Card Defaults (og:*, twitter:*, site_name, square logo card)    │
│  • JSON-LD Graph Builder (Organization, WebSite, Person, WebPage, Apps)   │
└───────────────────┬───────────────────────────────────┬───────────────────┘
                    │                                   │
                    ▼ (Runtime Navigation)              ▼ (Build-Time Hook)
┌───────────────────────────────────────┐ ┌─────────────────────────────────┐
│       usePageMeta(seoProps) Hook      │ │    Post-Build Static HTML Gen   │
│  • Updates document.title exact match │ │  • Reads dist/index.html        │
│  • Upserts <meta name="description">  │ │  • Emits dist/pages/*/index.html│
│  • Upserts <meta name="robots">       │ │    with route-specific <head>   │
│  • Upserts <link rel="canonical">     │ │    and JSON-LD structured data  │
│  • Upserts og:* & twitter:* meta tags │ │  • Verifies public/sitemap.xml  │
│  • Upserts #dsc-route-jsonld script   │ │    & public/robots.txt          │
└───────────────────┬───────────────────┘ └─────────────────┬───────────────┘
                    │                                       │
                    ▼                                       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                React 19 SPA Pages + Automated SEO Test Suite              │
│  • 10 Indexable Public Pages (H1 verified, unique metadata, JSON-LD)      │
│  • 10 Non-Indexable Auth/Admin/Checkout/System Pages (noindex, nofollow)  │
│  • Automated Vitest SEO Suite verifying XML, JSON-LD, Canonicals & Dist   │
└───────────────────────────────────────────────────────────────────────────┘
```

### Structured Data (Schema.org JSON-LD) Strategy
1. **Base Graph (`index.html` & All Public Pages)**:
   - `Organization` (`https://dscweb.me/#organization`): Official name `Dark Skull Corporation`, alternateName `DSC`, `url: "https://dscweb.me/"`, `logo: "https://dscweb.me/images/dsclogo.png"`, approved description, `founder` referencing `Person` (`Naveed Mushtaq`, `jobTitle: "Founder & Lead Developer"`, `url: "https://naveedmushtaq.tech/"`), `knowsAbout` (`Android Application Development`, `Game Development`, `Custom Website Development`), and `sameAs` links (`https://discord.gg/XB2Zjmsb7K`, `https://github.com/shahnaveed07`, `https://naveedmushtaq.tech/`).
   - `WebSite` (`https://dscweb.me/#website`): Name `Dark Skull Corporation`, alternateName `DSC`, `url: "https://dscweb.me/"`, `publisher` referencing `#organization` (no fake `SearchAction`).
   - `Person` (`https://naveedmushtaq.tech/#person`): `name: "Naveed Mushtaq"`, `jobTitle: "Founder & Lead Developer"`, `worksFor` referencing `#organization`, `url: "https://naveedmushtaq.tech/"`, `sameAs: ["https://github.com/shahnaveed07", "https://naveedmushtaq.tech/"]`.
2. **Route-Specific Structured Data (`#dsc-route-jsonld`)**:
   - Every indexable public page receives a `WebPage` (or `AboutPage` / `ContactPage` / `CollectionPage`) schema node with its exact `name`, `description`, `url`, and `isPartOf: { "@id": "https://dscweb.me/#website" }`.
   - `/pages/apps` additionally includes verified `SoftwareApplication` nodes for **QR Scanner | Generator** (`applicationCategory: "UtilitiesApplication"`, `operatingSystem: "Android"`, `installUrl: "https://play.google.com/store/apps/details?id=com.dsc.qrscanner"`) and **Mind Matrix** (`applicationCategory: "GameApplication"`, `operatingSystem: "Android"`, `installUrl: "https://play.google.com/store/apps/details?id=com.dsc.mindmatrix"`) without unverified ratings, reviews, or prices.

### Interactive Component & Verification Mapping
- **Automated SEO Validation Suite**: Adds a dedicated test suite verifying:
  1. `public/sitemap.xml` XML validity, HTTPS protocol, exact 10 canonical public URLs, zero duplicate URLs, zero `.html` aliases, and zero private/checkout URLs.
  2. `public/robots.txt` allowances, admin/dashboard disallows, and exact `Sitemap: https://dscweb.me/sitemap.xml` reference.
  3. Every public page renders a single meaningful `<h1>`, unique `<title>`, unique `<meta name="description">`, matching `<link rel="canonical">`, `robots="index, follow"`, complete Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`, `og:image`), and complete Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) metadata.
  4. Non-indexable pages (`CheckoutPage`, `UserLoginPage`, `AdminLoginPage`, `UserDashboardPage`, `AdminDashboardPage`, `AdminWorkspacePage`, `ChangePasswordPage`, `GenerateKeyPage`, `MaintenancePage`, `NotFoundPage`) apply `robots="noindex, nofollow"`.
  5. Valid JSON-LD structured data parsing with zero Calculator references and accurate Founder & Lead Developer attribution.
