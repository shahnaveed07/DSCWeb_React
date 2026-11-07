# DSCWeb React — Black & Gold Theme Initialization & Visual Remediation Plan

## 1. Root Cause Analysis
1. **Pre-Render Theme Bootstrap (`index.html`)**:
   - Lines 60–69 read legacy `localStorage.getItem('siteTheme')` and fell back to `window.matchMedia('(prefers-color-scheme: dark)')`. Whenever a visitor's OS/browser preferred Light Mode—or had a stale `siteTheme="light"` entry—the app booted into Light Mode (`#f7f7f5` off-white background with `#ffffff` white cards) instead of Black & Gold Dark Mode.
2. **Header Theme State (`src/components/layout/SiteHeader.jsx`)**:
   - Lines 19–24 and 61–69 also fell back to `window.matchMedia('(prefers-color-scheme: dark)')`, persisted to `siteTheme`, and did not update `document.documentElement.style.colorScheme` or `<meta name="theme-color">`.
3. **CSS Token & Button Contrast Issues (`src/index.css`)**:
   - Dark mode background tokens used `#09090b`/`#121216` instead of the true black baseline (`#050505` main background, `#0A0A0A` secondary background, `#080808` header/footer, `#111111` cards, `#171717` elevated cards, `#292929` borders, `#51421D` subtle gold borders).
   - Primary buttons used a dark antique olive-gold (`#9a7b1c`) with white text instead of luminous metallic gold (`#D4AF37` fill, `#F5D76E` hover, `#B8860B` deep gold, `#98730F` active) with high-contrast near-black text (`#080808`).
   - Secondary buttons used generic grey borders instead of a dark charcoal fill (`#111111`) with a muted gold border (`#51421D`) and gold hover emphasis.

---

## 2. Planned Changes

### A. Fix Theme Bootstrap in `index.html`
- Set default attributes on `<html>`: `data-theme="dark"` and `style="color-scheme: dark;"`.
- Set default `<meta name="theme-color" content="#050505" />`.
- Update the inline bootstrap script to:
  - Read **only** `localStorage.getItem('dscThemePreferenceV2')`.
  - Ignore `siteTheme` and never query `window.matchMedia('(prefers-color-scheme: dark)')`.
  - Default unconditionally to `'dark'` unless `dscThemePreferenceV2 === 'light'`.
  - Apply `document.documentElement.setAttribute('data-theme', resolvedTheme)` and `document.documentElement.style.colorScheme = resolvedTheme` before React mounts.
  - Sync `<meta name="theme-color">` (`#050505` for dark, `#FAF8F2` for light).

### B. Fix Theme State & Persistence in `src/components/layout/SiteHeader.jsx`
- Define `export const THEME_STORAGE_KEY = 'dscThemePreferenceV2'`.
- Initialize `theme` state from `document.documentElement.getAttribute('data-theme')` or `localStorage.getItem(THEME_STORAGE_KEY)`, defaulting strictly to `'dark'` if neither is `'light'` or `'dark'`.
- On theme change:
  - Update `document.documentElement.setAttribute('data-theme', theme)`.
  - Update `document.documentElement.style.colorScheme = theme`.
  - Update `<meta name="theme-color">` to `#050505` (dark) or `#FAF8F2` (light).
  - Persist `localStorage.setItem('dscThemePreferenceV2', theme)` when the user toggles the theme.

### C. Enforce True Black & Metallic Gold System in `src/index.css`
- **Dark Mode (`:root`)**:
  - `--bg: #050505` (Main background)
  - `--bg-soft: #0A0A0A` (Secondary background)
  - `--header-bg: #080808` / `--footer-bg: #080808` (Header & footer surfaces)
  - `--surface: #111111` / `--card-bg: #111111` (Card & panel surfaces)
  - `--surface-solid: #141414`
  - `--surface-strong: #171717` / `--surface-elevated: #171717` / `--surface-hover: #171717` (Elevated cards & hover states)
  - `--border: #292929` / `--surface-border: #292929` / `--card-border: #292929` (Standard borders)
  - `--gold-border-subtle: #51421D` / `--card-hover-border: #51421D` (Subtle gold borders)
  - `--text: #F5F5F5` (Main text)
  - `--text-secondary: #A3A3A3` / `--muted: #A3A3A3` / `--text-muted: #A3A3A3` (Secondary text)
  - `--primary: #D4AF37` (Primary metallic gold)
  - `--primary-hover: #F5D76E` (Gold hover)
  - `--primary-strong: #B8860B` (Deep gold)
  - `--primary-active: #98730F` (Active gold)
  - `--primary-text: #080808` (Near-black text on primary gold buttons)
- **Buttons**:
  - `.button-primary, .btn-primary`: Background `#D4AF37`, text `#080808`, border `#D4AF37`, hover background `#F5D76E` with border `#F5D76E`, active background `#98730F`.
  - `.button-secondary, .btn-secondary, .btn-neutral`: Dark charcoal background (`var(--surface)` `#111111`), muted gold border (`var(--gold-border-subtle)` `#51421D`), white text (`var(--text)` `#F5F5F5`), hover background `var(--surface-elevated)` (`#171717`) with `#D4AF37` gold border and `#F5D76E` text emphasis.
- **Light Mode (`:root[data-theme="light"]`)**:
  - Warm off-white background (`#FAF8F2`), secondary background (`#F2EFE7`), white cards (`#FFFFFF`), dark readable typography (`#141414` / `#525252`), muted metallic-gold accents (`#B8860B` / `#98730F`), and high-contrast primary (`#D4AF37` with `#080808` text) and secondary (`#FFFFFF` with `#C8B273` muted gold border) buttons.

### D. Automated Tests & Browser Verification
- Add unit/integration tests in `src/__tests__/components.test.jsx` verifying:
  - Default theme is `'dark'` even when legacy `localStorage.setItem('siteTheme', 'light')` is present.
  - Toggling theme switches `data-theme` and `style.colorScheme` to `'light'` and persists `dscThemePreferenceV2`.
- Run `npm run lint`, `npm run test`, and `npm run build`, and verify the live rendered application.
