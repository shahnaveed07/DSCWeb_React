# DSCWeb — Official Brand Identity Correction & Calculator Removal Plan

## 1. Central Content & Portfolio Data (`src/content/siteContent.js`)
- **`homeHighlights`**: Update to reflect DSC's core software studio pillars:
  1. *Android App Development* — Intuitive, high-performance Android applications published on Google Play.
  2. *Game Development* — Engaging games and interactive cognitive challenges built for smooth offline play.
  3. *Custom Website Development* — Responsive websites designed and developed for individuals, businesses, and companies on request.
- **`featuredApps`**: Remove the obsolete `Calculator` entry completely. Retain **QR Scanner | Generator** and **Mind Matrix** with their Google Play links.
- **`servicePillars`**: Replace outdated desktop/security pillars with **Android Application Development**, **Game Development**, and **Custom Website Development**.
- **`productPlans`**: **100% preserved** (all 7 product plans, slugs, pricing, specs, features, and checkout actions remain untouched; update line 289 from `"lead engineer Naveed Mushtaq"` to `"Founder & Lead Developer Naveed Mushtaq"`).
- **`aboutStats`**: Update to:
  - `{ label: 'Founded', value: '2024' }`
  - `{ label: 'Primary Focus', value: 'Android Apps & Games' }`
  - `{ label: 'Founder & Lead Developer', value: 'Naveed Mushtaq' }`
  - `{ label: 'Web Projects', value: 'Available on Request' }`
- **`contactChannels`**: Update Developer Portfolio (`naveedmushtaq.tech`) description to identify **Naveed Mushtaq — Founder & Lead Developer** of Dark Skull Corporation.
- **`privacySections` & `termsSections`**: Update references to identify **Naveed Mushtaq — Founder & Lead Developer** while preserving all accurate legal, licensing, and AdSense disclosures.
- **`footerGroups`**: Update `/pages/apps` link label from `"Apps & Utilities"` to `"Apps & Games"`.

---

## 2. Complete Removal of Calculator (`AppsPage`, `HomePage`, `DownloadsPage`, `index.css`)
- **`src/pages/AppsPage.jsx`**:
  - Remove all Calculator state (`calcDisplay`, `calcHistory`, `calcWaitingForOperand`, `calcPrevValue`, `calcOperation`, `copiedResult`), handlers (`handleCalcDigit`, `handleCalcDecimal`, `handleCalcClear`, `handleCalcBackspace`, `handleCalcOperator`, `handleCalcEqual`, `handleCopyCalc`), and the `#calculator-tool` / `.calc-widget` markup.
  - Showcase **QR Scanner | Generator** and **Mind Matrix** with their Google Play links, plus a custom website & app inquiry callout and the Studio Quality & Privacy Constitution section.
  - Update page title & meta description to focus on Android applications and mobile games developed by Dark Skull Corporation.
- **`src/pages/HomePage.jsx`**:
  - **Hero**:
    - Eyebrow: `DARK SKULL CORPORATION · SOFTWARE STUDIO`
    - Headline: `Building Apps, Games & Digital Experiences.`
    - Description: `Dark Skull Corporation (DSC) is an independent software development studio primarily focused on Android application development and game development. We also offer custom website design and development for individuals, businesses and companies on request.`
    - CTAs: `Explore Our Apps & Games` (`/pages/apps`), `View Our Products` (`/pages/products`), and `Request a Website` (`/pages/contact`).
    - Hero Capability Strip: `01 Android App Development`, `02 Game Development`, `03 Custom Website Development`, `04 Product & Client Portal`.
  - **Featured Showcase**: Remove the Calculator card; showcase **QR Scanner | Generator**, **Mind Matrix**, **Free Panel Build**, and **Custom Website Development** (linking to `/pages/contact`).
  - **Studio Focus Cards (`.disciplines-grid`)**:
    - `01 — Android App Development`: Designing and developing Android applications with intuitive interfaces, useful features and dependable performance.
    - `02 — Game Development`: Creating engaging games and interactive experiences with thoughtful gameplay, polished interfaces and continuous refinement.
    - `03 — Custom Website Development`: Building responsive websites for individuals, startups, businesses and companies on request.
  - **Split Highlights**: Update About highlight to credit **Naveed Mushtaq — Founder & Lead Developer** and the official studio identity.
- **`src/pages/DownloadsPage.jsx`**:
  - Remove the Calculator download card (`Calculator Tool` / `Launch Web Calculator`).
  - Retain **QR Scanner | Generator**, **Mind Matrix**, **Free Panel Build**, and the authenticated Client Portal & installation guide sections.
- **`src/index.css`**:
  - Remove Calculator-exclusive styles (`.calc-widget`, `.calc-header`, `.calc-screen`, `.calc-keypad`, `.calc-key`, `.calc-key-clear`, `.calc-key-equal`, `.calc-key-zero`, `.calc-history`, `.calc-history-item`) after verifying no other components reference them.

---

## 3. Company Profile, Leadership & Inquiry Updates (`AboutPage`, `ContactPage`, `ProductsPage`, `PrivacyPolicyPage`, `TermsPage`, `SiteFooter`)
- **`src/pages/AboutPage.jsx`**:
  - Update SEO title to `'About Dark Skull Corporation | Naveed Mushtaq — Founder & Lead Developer'` and description to the official studio identity.
  - Rewrite introductory copy with the approved company description.
  - Replace `focusAreas` with **Android Application Development**, **Game Development**, and **Custom Website Development**.
  - Replace `engineeringStandards` with **01 User-Centered Development**, **02 Quality & Reliability**, and **03 Continuous Improvement**.
  - Update **Technology Stack & Development Areas** to accurately describe Android application development, game development, and custom website development without fabricating unused technologies.
  - Update the **Founder & Lead Developer** section with the official designation **Naveed Mushtaq — Founder & Lead Developer** and the approved founder statement.
- **`src/pages/ContactPage.jsx`**:
  - Update header and intro copy to welcome Android app development inquiries, game development inquiries, custom website development inquiries, and product/order support inquiries.
  - Add `"Website Design & Development"` (`website`), `"Android App Development"` (`android`), and `"Game Development"` (`game`) to the inquiry category selector while retaining all existing categories (`order`, `support`, `freepanel`, `custom`, `bug`, `general`) and the existing mailto/clipboard workflow.
- **`src/pages/ProductsPage.jsx`**:
  - Preserve 100% of product cards, filters, pricing, and checkout links while updating the page header description so it presents the product catalog accurately without misrepresenting DSC's studio identity.
- **`src/pages/PrivacyPolicyPage.jsx` & `src/pages/TermsPage.jsx`**:
  - Update contact designation to `Founder & Lead Developer: Naveed Mushtaq`.
- **`src/components/layout/SiteFooter.jsx`**:
  - Update footer credit to `Founded & Developed by Naveed Mushtaq — Founder & Lead Developer` (keeping the link to `https://naveedmushtaq.tech/` with accessible text `Naveed Mushtaq` so existing tests and users see both his name and official title).

---

## 4. Global Metadata, Structured Data & Documentation (`index.html`, `metadata.json`, `README.md`)
- **`index.html` & `metadata.json`**:
  - Update `<title>`, `<meta name="description">`, `<meta name="keywords">`, Open Graph, Twitter cards, and Schema.org JSON-LD (`"@type": "Organization"` /软件 development studio founded by `Naveed Mushtaq — Founder & Lead Developer`) to reflect:
    `"Android App Development, Game Development, Custom Website Development, Dark Skull Corporation."`
- **`README.md`**:
  - Update project overview to reflect DSC's official studio identity and Founder & Lead Developer attribution.

---

## 5. Automated Tests & Verification (`src/__tests__/adsense_remediation.test.jsx`)
- Replace the obsolete Calculator test in `src/__tests__/adsense_remediation.test.jsx` with comprehensive tests verifying:
  - `AppsPage` renders **QR Scanner | Generator** and **Mind Matrix** with their Google Play links and contains no Calculator widget.
  - `AboutPage` and `HomePage` identify **Dark Skull Corporation** as an independent software development studio focused on Android Application Development, Game Development, and Custom Website Development, with **Naveed Mushtaq — Founder & Lead Developer**.
  - `ContactPage` includes the **Website Design & Development** inquiry option.
- Run `npm run lint`, `npm run test`, and `npm run build`.
