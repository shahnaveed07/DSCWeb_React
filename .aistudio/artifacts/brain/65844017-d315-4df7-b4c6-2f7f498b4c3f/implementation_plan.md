# DSCWeb React — Black & Gold Design System Override Plan

## 1. Visual Identity & Token Architecture (`src/index.css` & `index.html`)

We will replace all Crimson/Red/Teal brand tokens in `src/index.css` and `index.html` (`theme-color`) with the approved **Black & Gold** visual identity while preserving semantic green (`--success`), amber (`--warning`), and red (`--danger`) status indicators.

### Dark Theme (`:root` — Black-First Visual Hierarchy)
- **Surfaces & Canvas**:
  - `--bg: #09090b` (Deep obsidian black canvas)
  - `--bg-soft: #0e0e11` (Secondary charcoal background)
  - `--surface: #121216` (Primary card & panel surface)
  - `--surface-solid: #16161b`
  - `--surface-strong: #1a1a20` (Elevated table headers, modals, stat cards)
  - `--surface-elevated: #202027` (Dropdowns, hover surfaces)
  - `--footer-bg: #0c0c0f`
  - `--input-bg: #0e0e12`
- **Borders (Restrained Neutral + Subtle Gold Accents)**:
  - `--surface-border` / `--border`: `#24242c` (Restrained charcoal border for standard surfaces)
  - `--surface-border-strong` / `--border-strong`: `#343440`
  - `--card-hover-border`: `rgba(212, 175, 55, 0.42)` (Subtle metallic gold border on interactive card hover)
- **Typography**:
  - `--text: #f8f8fa` (Clean white primary typography)
  - `--text-secondary` / `--muted`: `#a1a1aa` (Muted grey secondary text)
  - `--text-muted`: `#84848f`
- **Brand Accents (Classic Metallic Gold & Champagne Gold)**:
  - `--primary: #d4af37` (Classic Metallic Gold for restrained brand accents, active states, and key highlights)
  - `--primary-hover: #e5c158` (Champagne Gold hover/highlight state)
  - `--primary-strong: #b89225`
  - `--primary-active: #9a7b1c`
  - `--secondary: #e5c158` (Champagne Gold secondary highlight)
  - `--link-color: #e5c158`
  - `--eyebrow-color: #d4af37`
  - `--primary-soft: rgba(212, 175, 55, 0.12)`
  - `--primary-soft-strong: rgba(212, 175, 55, 0.20)`
  - `--primary-soft-border` / `--primary-border`: `rgba(212, 175, 55, 0.32)`
  - `--ring: 0 0 0 2px rgba(212, 175, 55, 0.35)`
- **Primary Button Tokens (White Text on Antique Gold)**:
  - `--button-primary-bg: #9a7b1c` (Rich Antique Gold fill for high-contrast white text legibility)
  - `--button-primary-hover: #b08d24` (Warm Metallic Gold hover)
  - `--button-primary-active: #7d6315`
  - `--primary-text: #ffffff`

### Light Theme (`:root[data-theme="light"]` — Warm Ivory & Antique Gold)
- **Surfaces & Canvas**:
  - `--bg: #f7f7f5` (Clean warm off-white canvas)
  - `--bg-soft: #efefeb`
  - `--surface: #ffffff` (Crisp white cards & panels)
  - `--surface-strong: #fafaf8`
  - `--surface-elevated: #ffffff`
  - `--surface-border` / `--border`: `#e4e4de`
  - `--surface-border-strong` / `--border-strong`: `#cccbc2`
  - `--card-hover-border`: `rgba(154, 123, 28, 0.45)`
- **Typography**:
  - `--text: #121215` (Deep charcoal primary text)
  - `--text-secondary` / `--muted`: `#52525b`
  - `--text-muted`: `#6b6b76`
- **Brand Accents & Primary Buttons**:
  - `--primary: #9a7b1c` (Antique Gold for readable contrast on white surfaces)
  - `--primary-hover: #7d6315`
  - `--primary-strong: #7d6315`
  - `--primary-active: #634e10`
  - `--secondary: #b89225`
  - `--link-color: #9a7b1c`
  - `--eyebrow-color: #9a7b1c`
  - `--button-primary-bg: #9a7b1c`
  - `--button-primary-hover: #7d6315`
  - `--button-primary-active: #634e10`
  - `--primary-text: #ffffff`
  - `--primary-soft: rgba(154, 123, 28, 0.10)`
  - `--primary-soft-strong: rgba(154, 123, 28, 0.16)`
  - `--primary-soft-border` / `--primary-border`: `rgba(154, 123, 28, 0.28)`
  - `--ring: 0 0 0 2px rgba(154, 123, 28, 0.28)`

---

## 2. Component & Page Refinements
1. **Primary Buttons (`.button-primary`, `.btn-primary`)**:
   - Bind background and border to `--button-primary-bg` (`#9a7b1c`) and hover to `--button-primary-hover` (`#b08d24` dark / `#7d6315` light) with crisp `--primary-text: #ffffff` and a subtle metallic gold border highlight (`rgba(229, 193, 88, 0.35)`).
2. **Cards, Panels, Tables, Modals, and Navigation**:
   - Keep default card/panel borders neutral charcoal (`--surface-border`) so gold is used with restraint on active indicators, eyebrows, badges, focus rings, and interactive hover borders (`--card-hover-border`).
3. **HTML Meta Theme Color (`index.html`)**:
   - Update `<meta name="theme-color" content="#09090b" />` to match the Black & Gold dark canvas.
4. **Full Preservation Guarantee**:
   - Zero changes to any API endpoints, authentication flows, Owner DB explicit column definitions, FreePanel credential normalization, Free Panel Settings user sync, or checkout logic.

---

## 3. Verification Plan
- Run the full Vitest suite (`npx vitest run --pool=vmThreads` — 9 test files, 83 tests).
- Run `compile_applet` and `lint_applet` to verify zero build or lint issues.
- Restart the dev server (`restart_dev_server`) and verify both Dark and Light themes.
